"""PyTorch intent classifier — shared core for training and inference.

Text representation (NO external NLP dependencies):
  normalize (strip, collapse whitespace, lowercase)
  → tokenize (Hangul syllable runs + Latin alphanumeric words via stdlib regex)
  → Bag-of-Words counts over a small trained vocabulary

Model (CPU-only, tiny):
  BoW vector → Linear(hidden) → ReLU → Linear(num_labels) → logits
"""
import os
import re
import json
import torch
import torch.nn as nn
import torch.nn.functional as F

# ---------------------------------------------------------------------------
# Paths (all relative to this file so training + FastAPI agree)
# ---------------------------------------------------------------------------
ML_DIR = os.path.dirname(os.path.abspath(__file__))
CHECKPOINT_PATH = os.environ.get(
    "INTENT_CHECKPOINT_PATH", os.path.join(ML_DIR, "intent_checkpoint.pt")
)
DATA_PATH = os.path.join(ML_DIR, "intent_data.json")

# ---------------------------------------------------------------------------
# Text representation
# ---------------------------------------------------------------------------
# Latin words: "Ant", "Design", "MUI", "npm", "shadcn", "daisyUI", "UI" ...
# Hangul: runs of syllable blocks preserve meaningful Korean words ("다음", "보여줘")
_TOKEN_RE = re.compile(r"[A-Za-z][A-Za-z0-9]*|[가-힣]+")


def normalize_text(text: str) -> str:
    """Strip, collapse whitespace, lowercase (Latin only; Hangul has no case)."""
    return " ".join(text.strip().lower().split())


def tokenize(text: str) -> list:
    """Return token list for a raw utterance (normalized internally)."""
    return _TOKEN_RE.findall(normalize_text(text))


def build_vocab(utterances) -> dict:
    """Build {token: index} over all utterances (stable insertion order)."""
    vocab = {}
    for utt in utterances:
        for tok in tokenize(utt):
            if tok not in vocab:
                vocab[tok] = len(vocab)
    return vocab


def text_to_vector(text, vocab: dict) -> torch.Tensor:
    """Bag-of-Words count vector (float tensor, shape [vocab_size])."""
    vec = torch.zeros(len(vocab))
    for tok in tokenize(text):
        idx = vocab.get(tok)
        if idx is not None:
            vec[idx] += 1.0
    return vec


# ---------------------------------------------------------------------------
# Model
# ---------------------------------------------------------------------------
class IntentClassifier(nn.Module):
    """input BoW vector → Linear → ReLU → Linear → intent logits."""

    def __init__(self, vocab_size: int, hidden_dim: int, num_labels: int):
        super().__init__()
        self.fc1 = nn.Linear(vocab_size, hidden_dim)
        self.fc2 = nn.Linear(hidden_dim, num_labels)

    def forward(self, x):
        h = F.relu(self.fc1(x))
        return self.fc2(h)


# ---------------------------------------------------------------------------
# Checkpoint save / load (reproduces preprocessing after restart)
# ---------------------------------------------------------------------------
def save_checkpoint(
    path,
    model,
    vocab: dict,
    labels: list,
    config: dict,
    train_loss=None,
    val_accuracy=None,
    epochs=None,
):
    torch.save(
        {
            "model_state_dict": model.state_dict(),
            "vocab": vocab,
            "labels": labels,
            "config": config,
            "train_loss": train_loss,
            "val_accuracy": val_accuracy,
            "epochs": epochs,
        },
        path,
    )


def load_checkpoint(path):
    """Load checkpoint dict (plain torch.load — CPU only, no CUDA needed)."""
    return torch.load(path, map_location="cpu")


# ---------------------------------------------------------------------------
# Inference (single-load cached)
# ---------------------------------------------------------------------------
_MODEL_CACHE = None  # (checkpoint_mtime, model, labels, vocab, config)


def _ensure_loaded(path):
    """Load checkpoint once; reload only if the file changed on disk.

    Safe because FastAPI workers are long-lived and the checkpoint is written
    by the training script, never mutated during API requests.
    """
    global _MODEL_CACHE
    mtime = os.path.getmtime(path)
    if _MODEL_CACHE is not None and _MODEL_CACHE[0] == mtime:
        return _MODEL_CACHE

    ckpt = load_checkpoint(path)
    labels = list(ckpt["labels"])
    vocab = ckpt["vocab"]
    config = ckpt["config"]
    model = IntentClassifier(len(vocab), config["hidden_dim"], len(labels))
    model.load_state_dict(ckpt["model_state_dict"])
    model.eval()
    _MODEL_CACHE = (mtime, model, labels, vocab, config)
    return _MODEL_CACHE


def predict_intent(text, checkpoint_path=None, threshold=None):
    """Classify one Korean command utterance.

    Returns dict:
      {
        "intent": "NEXT",
        "confidence": 0.94,          # softmax probability
        "below_threshold": False,    # present when threshold is configured
      }
    Raises ValueError on empty text.
    """
    if not text or not text.strip():
        raise ValueError("Text must not be empty")

    path = checkpoint_path or CHECKPOINT_PATH
    if not os.path.exists(path):
        raise FileNotFoundError(f"Intent checkpoint not found: {path}")

    _, model, labels, vocab, _ = _ensure_loaded(path)

    with torch.no_grad():
        logits = model(text_to_vector(text, vocab).unsqueeze(0))
        probs = F.softmax(logits, dim=1)[0]
        conf, idx = torch.max(probs, dim=0)

    result = {
        "intent": labels[int(idx)],
        "confidence": round(float(conf), 4),
    }
    if threshold is not None:
        result["below_threshold"] = float(conf) < threshold
    return result
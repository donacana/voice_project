"""PHASE 10: Train the CPU-only PyTorch intent classifier.

Usage:
    backend\\.venv\\Scripts\\python.exe backend\\train_intent.py

Loads backend/ml/intent_data.json, trains a tiny BoW→Linear→ReLU→Linear
classifier on CPU, reports train loss + validation accuracy + misclassified
examples, and saves intent_checkpoint.pt (state_dict + vocab + labels + config).
"""
import json
import random
import sys
import os

try:
    import torch
    import torch.nn as nn
    from torch.utils.data import TensorDataset, DataLoader
except ImportError:
    print("ERROR: PyTorch not installed. Run: pip install torch --index-url https://download.pytorch.org/whl/cpu")
    sys.exit(1)

from ml.intent_model import (
    DATA_PATH,
    CHECKPOINT_PATH,
    build_vocab,
    text_to_vector,
    IntentClassifier,
    save_checkpoint,
)

RANDOM_SEED = 42
EPOCHS = 60
BATCH_SIZE = 16
LEARNING_RATE = 1e-3
HIDDEN_DIM = 96
VAL_SPLIT = 0.15  # 15% of utterances held out per intent


def load_dataset(path):
    """Return [(label, utterance), ...] from intent_data.json."""
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    samples = []
    for intent in data["intents"]:
        for utt in intent["utterances"]:
            samples.append((intent["label"], utt))
    return samples


def main():
    torch.manual_seed(RANDOM_SEED)
    random.seed(RANDOM_SEED)
    if torch.cuda.is_available():
        print("WARNING: CUDA is available but PHASE 10 is intentionally CPU-only.")
    device = torch.device("cpu")

    samples = load_dataset(DATA_PATH)
    labels = sorted({label for label, _ in samples})
    label_to_idx = {lbl: i for i, lbl in enumerate(labels)}
    print(f"Intents: {len(labels)} -> {labels}")
    print(f"Total utterances: {len(samples)}")

    # Per-intent stratified split (no samples shared between train/val)
    train, val = [], []
    for lbl in labels:
        group = [utt for l2, utt in samples if l2 == lbl]
        random.shuffle(group)
        n_val = max(1, round(len(group) * VAL_SPLIT))
        val.extend((lbl, u) for u in group[:n_val])
        train.extend((lbl, u) for u in group[n_val:])
    print(f"Train: {len(train)}  Validation: {len(val)}")

    vocab = build_vocab([utt for _, utt in samples])
    print(f"Vocabulary size: {len(vocab)}")

    def to_tensors(data):
        xs, ys = [], []
        for lbl, utt in data:
            xs.append(text_to_vector(utt, vocab))
            ys.append(label_to_idx[lbl])
        return torch.stack(xs), torch.tensor(ys)

    X_train, y_train = to_tensors(train)
    X_val, y_val = to_tensors(val)
    loader = DataLoader(TensorDataset(X_train, y_train), batch_size=BATCH_SIZE, shuffle=True)

    model = IntentClassifier(len(vocab), HIDDEN_DIM, len(labels)).to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=LEARNING_RATE)
    criterion = nn.CrossEntropyLoss()

    best_acc, best_state = 0.0, None
    for epoch in range(1, EPOCHS + 1):
        model.train()
        total, correct, loss_sum = 0, 0, 0.0
        for xb, yb in loader:
            optimizer.zero_grad()
            logits = model(xb)
            loss = criterion(logits, yb)
            loss.backward()
            optimizer.step()
            loss_sum += loss.item() * len(xb)
            total += len(yb)
            correct += (logits.argmax(1) == yb).sum().item()
        train_loss = loss_sum / total
        train_acc = correct / total

        model.eval()
        with torch.no_grad():
            val_logits = model(X_val)
            val_preds = val_logits.argmax(1)
        val_acc = (val_preds == y_val).float().mean().item()
        if val_acc > best_acc:
            best_acc, best_state = val_acc, {k: v.clone() for k, v in model.state_dict().items()}

        if epoch % 10 == 0 or epoch == 1:
            print(f"Epoch {epoch:3d} | train_loss {train_loss:.4f} | train_acc {train_acc:.3f} | val_acc {val_acc:.3f}")

    # Restore best validation state before saving
    model.load_state_dict(best_state)

    # Misclassification report (best model)
    model.eval()
    with torch.no_grad():
        val_logits = model(X_val)
        val_preds = val_logits.argmax(1)
    misclassified = []
    for i, (lbl, utt) in enumerate(val):
        if val_preds[i].item() != label_to_idx[lbl]:
            misclassified.append((utt, lbl, labels[val_preds[i].item()]))
    print(f"\nValidation accuracy (best): {best_acc:.3f}  ({int(best_acc * len(val))}/{len(val)})")
    if misclassified:
        print("Misclassified validation examples:")
        for utt, true_lbl, pred_lbl in misclassified:
            print(f"  '{utt}'  true={true_lbl}  pred={pred_lbl}")
    else:
        print("No misclassified validation examples.")

    config = {
        "hidden_dim": HIDDEN_DIM,
        "vocab_size": len(vocab),
        "num_labels": len(labels),
        "seed": RANDOM_SEED,
        "epochs": EPOCHS,
        "val_split": VAL_SPLIT,
    }
    save_checkpoint(
        CHECKPOINT_PATH,
        model,
        vocab,
        labels,
        config,
        train_loss=train_loss,
        val_accuracy=best_acc,
        epochs=EPOCHS,
    )
    size_kb = os.path.getsize(CHECKPOINT_PATH) / 1024
    print(f"\nSaved checkpoint: {CHECKPOINT_PATH} ({size_kb:.1f} KB)")
    print("PHASE 10 TRAINING COMPLETE")


if __name__ == "__main__":
    main()
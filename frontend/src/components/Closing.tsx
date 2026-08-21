interface ClosingProps {
  onRestart: () => void
}

export function Closing({ onRestart }: ClosingProps) {
  return (
    <div className="closing-screen">
      <div className="lecture-header">
        <span className="lecture-kicker">Closing</span>
        <h1>10 Best React UI Libraries for 2026</h1>
        <p className="lecture-subtitle">
          라이브러리 선택은 정답이 아니라 상황에 맞는 선택입니다.
        </p>
      </div>

      <div className="closing-summary">
        <div className="closing-card">
          <h2>핵심 요약</h2>
          <ul>
            <li>완성된 디자인 시스템 → Material UI / Ant Design / Chakra UI</li>
            <li>Tailwind 기반 → shadcn/ui / daisyUI / Headless UI</li>
            <li>직접 디자인 시스템 → React Aria / Radix UI / Base UI</li>
            <li>빠른 개발 → Mantine</li>
          </ul>
        </div>

        <div className="closing-card">
          <h2>기억할 점</h2>
          <ul>
            <li>라이브러리는 도구일 뿐, 문제를 먼저 이해하세요</li>
            <li>접근성은 선택이 아니라 기본입니다</li>
            <li>커스터마이징 자유도와 개발 속도의 균형을 고려하세요</li>
            <li>공식 문서와 커뮤니티 생태계를 확인하세요</li>
          </ul>
        </div>
      </div>

      <div className="closing-actions">
        <button className="action-btn primary" onClick={onRestart}>
          ← 처음부터 다시 보기
        </button>
      </div>
    </div>
  )
}
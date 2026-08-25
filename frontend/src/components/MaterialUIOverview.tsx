import './MaterialUIOverview.css'

interface MaterialUIOverviewProps {
  onBack: () => void
  onNext: () => void
}

export function MaterialUIOverview({ onBack, onNext }: MaterialUIOverviewProps) {
  return (
    <div className="mui-overview">
      <header className="mui-overview-hero">
        <span className="mui-overview-kicker">Design System · Material UI</span>
        <h1>Material UI (MUI)</h1>
        <p>Google Material Design을 React에서 사용할 수 있도록 구현한 UI 컴포넌트 라이브러리</p>
      </header>

      <section className="mui-flow" aria-label="Material Design에서 Material UI로 이어지는 관계">
        <div className="mui-flow-card">
          <span className="mui-flow-label">Design Rule</span>
          <h2>Material Design</h2>
          <p>Google이 만든 UI 디자인 규칙과 원칙</p>
          <ul className="mui-design-rules">
            <li>색상과 글꼴을 일관되게 사용</li>
            <li>여백과 배치 규칙을 통일</li>
            <li>모서리·그림자·높낮이로 요소의 관계 표현</li>
            <li>버튼·입력창 등 UI의 동작과 상태를 일관되게 설계</li>
          </ul>
        </div>

        <div className="mui-flow-arrow" aria-hidden="true">→</div>

        <div className="mui-flow-card mui-flow-card--result">
          <span className="mui-flow-label">React Implementation</span>
          <h2>Material UI (MUI)</h2>
          <p>Material Design을 기반으로 미리 만들어진 React UI 컴포넌트</p>
        </div>
      </section>

      <section className="mui-overview-desc">
        <strong>핵심:</strong>
        <span>
          Material Design이 디자인 규칙이라면, MUI는 그 규칙을 실제 React에서 사용할 수 있도록
          컴포넌트로 구현한 라이브러리입니다.
        </span>
      </section>

      <section className="mui-code">
        <div className="mui-code-label">필요한 UI 컴포넌트를 import해서 바로 사용</div>
        <pre><code>{`import Button from '@mui/material/Button'

<Button variant="contained">
  저장
</Button>`}</code></pre>
      </section>

      <nav className="mui-overview-nav" aria-label="Material UI 설명 화면 이동">
        <button type="button" onClick={onBack}>
          ← Previous
        </button>
        <span>1 · Material UI Concept</span>
        <button type="button" className="mui-overview-next" onClick={onNext}>
          Core / X →
        </button>
      </nav>
    </div>
  )
}

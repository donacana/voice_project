import './TailwindOverview.css'

interface TailwindOverviewProps {
  onBack: () => void
  onNext: () => void
}

const exampleCode = `<div className="bg-white p-6 rounded-2xl shadow-lg">
  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">PRO</span>
  <h3 className="text-xl font-bold text-slate-900">Team workspace</h3>
  <p className="text-slate-500">프로젝트를 한 곳에서 관리하세요.</p>
  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold">
    시작하기
  </button>
</div>`

export function TailwindOverview({ onBack, onNext }: TailwindOverviewProps) {
  return (
    <div className="tailwind-overview">
      <header className="tailwind-overview-hero">
        <span>Tailwind-Based · Foundation</span>
        <h1>Tailwind CSS</h1>
        <p>작은 utility class를 조합해서 하나의 완성된 UI를 만든다</p>
      </header>

      <section className="tailwind-overview-core">
        <strong>색상 + 간격 + 글자 + 모서리 + 그림자를 className 안에서 조립</strong>
        <p><code>bg-blue-500</code> · <code>text-white</code> · <code>px-4</code> · <code>rounded-lg</code></p>
      </section>

      <section className="tailwind-overview-demo" aria-label="Tailwind 코드와 실제 결과">
        <article>
          <span>JSX + Utility Classes</span>
          <h2>왼쪽: 조합 코드</h2>
          <pre><code>{exampleCode}</code></pre>
        </article>

        <div className="tailwind-overview-arrow" aria-hidden="true">→</div>

        <article className="tailwind-overview-result">
          <span>Rendered UI</span>
          <h2>오른쪽: 실제 결과</h2>
          <div className="tailwind-build-preview">
            <div className="tw-workspace-card">
              <span>PRO</span>
              <h3>Team workspace</h3>
              <p>프로젝트를 한 곳에서 관리하세요.</p>
              <button type="button" className="tw-primary-button">시작하기</button>
            </div>
          </div>
        </article>
      </section>

      <section className="tailwind-overview-tradeoffs">
        <article><h3>강점</h3><ul><li>작은 규칙을 빠르게 조합</li><li>코드와 실제 모양의 대응이 직접적</li></ul></article>
        <article><h3>Trade-off</h3><p>UI가 복잡해지면 className이 길어질 수 있습니다.</p></article>
      </section>

      <nav className="tailwind-overview-nav" aria-label="Tailwind 소개 화면 이동">
        <button type="button" onClick={onBack}>← Previous Category</button>
        <span>Tailwind CSS</span>
        <button type="button" className="tailwind-overview-next" onClick={onNext}>daisyUI →</button>
      </nav>
    </div>
  )
}

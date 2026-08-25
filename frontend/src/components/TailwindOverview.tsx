import './TailwindOverview.css'

interface TailwindOverviewProps {
  onBack: () => void
  onNext: () => void
}

export function TailwindOverview({ onBack, onNext }: TailwindOverviewProps) {
  return (
    <div className="tailwind-overview">
      <header className="tailwind-overview-hero">
        <span>Tailwind-Based · Foundation</span>
        <h1>Tailwind CSS</h1>
        <p>작은 유틸리티 클래스를 조합해서 빠르게 스타일링하는 방식</p>
      </header>

      <section className="tailwind-overview-core">
        <strong>작은 클래스를 조합해 바로 UI 만들기</strong>
        <p>
          Tailwind는 CSS 파일을 길게 작성하기보다 className 안에 작은 스타일 클래스를 붙여서
          바로 모양을 만드는 방식입니다.
        </p>
        <p>
          <code>bg-blue-500</code>, <code>text-white</code>, <code>px-4</code> 같은 클래스를 조합합니다.
        </p>
      </section>

      <section className="tailwind-overview-demo" aria-label="Tailwind 코드와 실제 결과">
        <article>
          <span>Code</span>
          <h2>Tailwind 코드</h2>
          <pre><code>{`<button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold">
  저장
</button>`}</code></pre>
        </article>

        <div className="tailwind-overview-arrow" aria-hidden="true">→</div>

        <article className="tailwind-overview-result">
          <span>Preview</span>
          <h2>실제 결과</h2>
          <div className="tailwind-button-preview">
            <button type="button">저장</button>
          </div>
        </article>
      </section>

      <section className="tailwind-overview-tradeoffs">
        <article>
          <h3>장점</h3>
          <ul>
            <li>빠르게 스타일링 가능</li>
            <li>CSS 파일을 자주 오가지 않아도 됨</li>
            <li>조합이 직관적임</li>
          </ul>
        </article>
        <article>
          <h3>한계</h3>
          <p>복잡해질수록 className이 길어질 수 있습니다.</p>
        </article>
      </section>

      <section className="tailwind-overview-bridge">
        <strong>Tailwind는 빠르지만 클래스가 길어질 수 있습니다.</strong>
        <span>그래서 다음의 daisyUI는 자주 쓰는 클래스 조합을 짧은 이름으로 묶어 제공합니다.</span>
      </section>

      <nav className="tailwind-overview-nav" aria-label="Tailwind 소개 화면 이동">
        <button type="button" onClick={onBack}>← Previous</button>
        <span>Tailwind CSS</span>
        <button type="button" className="tailwind-overview-next" onClick={onNext}>daisyUI →</button>
      </nav>
    </div>
  )
}

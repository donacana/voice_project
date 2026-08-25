import './TailwindLibrarySlide.css'

export function DaisyUIDemo() {
  return (
    <div className="tailwind-library-page">
      <header className="tailwind-library-hero">
        <span>Tailwind-Based · Semantic Classes</span>
        <h1>daisyUI</h1>
        <p>Tailwind의 긴 Utility Class 조합을 짧은 Semantic Component Class로 줄여주는 라이브러리</p>
      </header>

      <section className="tailwind-library-core two-part-core">
        <p><strong>Tailwind</strong><span>스타일 속성을 작은 클래스로 직접 조합</span></p>
        <b>→</b>
        <p><strong>daisyUI</strong><span>자주 쓰는 조합을 btn, card, alert 같은 이름으로 제공</span></p>
      </section>

      <section className="tailwind-library-comparison">
        <article>
          <span>Utility Classes</span><h2>Tailwind CSS</h2>
          <pre><code>{`<button className="
  bg-blue-500
  text-white
  px-4 py-2
  rounded-lg font-bold
">
  저장
</button>`}</code></pre>
          <div className="button-preview"><button type="button">저장</button></div>
        </article>
        <div className="comparison-arrow"><small>긴 클래스 조합</small><b>→</b><code>btn btn-primary</code></div>
        <article className="accent-card">
          <span>Semantic Classes</span><h2>daisyUI</h2>
          <pre><code>{`<button className="btn btn-primary">
  저장
</button>`}</code></pre>
          <div className="button-preview"><button type="button">저장</button></div>
        </article>
      </section>

      <div className="class-collapse"><code>bg-blue-500 + text-white + px-4 + py-2 + rounded-lg</code><b>↓</b><code>btn btn-primary</code></div>

      <section className="tailwind-library-tradeoffs">
        <article><h3>장점</h3><ul><li>className이 짧아짐</li><li>버튼·카드·모달을 빠르게 제작</li><li>Tailwind와 함께 사용 가능</li></ul></article>
        <article><h3>한계</h3><ul><li>daisyUI의 클래스 체계를 사용</li><li>독특한 디자인은 추가 Tailwind 수정 필요</li></ul></article>
      </section>

      <footer className="tailwind-library-takeaway">Tailwind의 스타일 조합을 자주 쓰는 UI 이름으로 묶은 것이 <strong>daisyUI</strong></footer>
    </div>
  )
}

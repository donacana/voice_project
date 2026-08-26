const tailwindCode = `<button className="
  bg-blue-500 text-white
  px-4 py-2 rounded-lg
  font-bold shadow-md
">
  저장
</button>`

const daisyCode = `<button className="btn btn-primary">
  저장
</button>`

export function DaisyUIDemo() {
  return (
    <section className="library-demo-slide">
      <header className="library-demo-header">
        <div><span className="demo-eyebrow">Tailwind-Based · Semantic Classes</span><h1>daisyUI</h1></div>
        <p>긴 utility 조합을 <strong>btn · card · alert</strong> 같은 의미 있는 이름으로 줄입니다.</p>
      </header>

      <div className="demo-thesis">코드는 짧아지지만 실제 결과는 거의 같다</div>

      <div className="daisy-comparison-grid">
        <article className="daisy-code-card">
          <div><span className="demo-eyebrow">긴 클래스 조합</span><h2>Tailwind CSS</h2></div>
          <pre className="demo-code"><code>{tailwindCode}</code></pre>
          <div className="daisy-result"><button type="button" className="daisy-visual-button">저장</button></div>
          <p>색상·간격·radius·shadow를 각각 작성</p>
        </article>

        <article className="daisy-code-card">
          <div><span className="demo-eyebrow">짧은 의미 클래스</span><h2>daisyUI</h2></div>
          <pre className="demo-code"><code>{daisyCode}</code></pre>
          <div className="daisy-result"><button type="button" className="daisy-visual-button">저장</button></div>
          <p><code>btn btn-primary</code>가 같은 버튼 규칙을 묶어서 제공</p>
        </article>
      </div>

      <div className="demo-fact-strip">
        <div><strong>Strength</strong>반복되는 Tailwind 조합을 빠르게 축약</div>
        <div><strong>Trade-off</strong>daisyUI의 semantic class와 테마 체계를 학습</div>
      </div>
    </section>
  )
}

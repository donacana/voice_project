import './TailwindLibrarySlide.css'

const behaviorRows = [
  ['Menu', '열기 / 닫기'],
  ['Keyboard', 'Tab / Enter / Escape'],
  ['Focus', '포커스 이동 및 관리'],
  ['Accessibility', 'Screen Reader 대응'],
]

export function HeadlessUIDemo() {
  return (
    <div className="tailwind-library-page">
      <header className="tailwind-library-hero">
        <span>Tailwind-Based · Behavior</span>
        <h1>Headless UI</h1>
        <p>디자인은 내가 만들고, 복잡한 동작과 접근성은 라이브러리가 처리</p>
      </header>

      <section className="tailwind-library-core">
        <p>완성된 색상이나 디자인 대신 Menu · Dialog · Listbox의 <strong>동작과 접근성</strong>을 제공합니다.</p>
      </section>

      <section className="tailwind-library-comparison headless-comparison">
        <article className="accent-card">
          <span>Behavior + Accessibility</span><h2>HEADLESS UI</h2>
          <div className="role-rows">{behaviorRows.map(([label, value]) => <p key={label}><strong>{label}</strong><b>→</b><span>{value}</span></p>)}</div>
        </article>
        <div className="comparison-arrow"><b>+</b></div>
        <article>
          <span>Tailwind / CSS</span><h2>MY DESIGN</h2>
          <div className="design-chips">{['Color', 'Spacing', 'Border', 'Shadow', 'Animation'].map(item => <span key={item}>{item}</span>)}</div>
        </article>
      </section>

      <div className="flow-equation"><strong>Headless UI</strong><b>+</b><strong>Tailwind / CSS</strong><b>↓</b><strong>완성된 나만의 Menu</strong></div>

      <section className="tailwind-library-tradeoffs">
        <article><h3>장점</h3><ul><li>기본 디자인에 묶이지 않음</li><li>키보드 조작과 Focus 처리</li><li>접근성 구현 부담 감소</li></ul></article>
        <article><h3>한계</h3><ul><li>기본 디자인 없음</li><li>스타일은 직접 만들어야 함</li></ul></article>
      </section>

      <footer className="tailwind-library-takeaway">동작은 <strong>Headless UI</strong>, 디자인은 <strong>개발자</strong></footer>
    </div>
  )
}

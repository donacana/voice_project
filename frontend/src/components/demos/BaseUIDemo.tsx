import { Button } from '@base-ui/react/button'

const styles = [
  {
    name: 'Tailwind',
    code: 'bg-blue-600 text-white rounded-lg px-4 py-2',
    className: 'base-tailwind-button',
  },
  {
    name: 'CSS',
    code: '.button { border: 2px solid teal; }',
    className: 'base-css-button',
  },
  {
    name: 'CSS-in-JS',
    code: 'css({ background: "#7c3aed", radius: 999 })',
    className: 'base-css-in-js-button',
  },
]

export function BaseUIDemo() {
  return (
    <section className="library-demo-slide">
      <header className="library-demo-header">
        <div><span className="demo-eyebrow">Unstyled · Styling Freedom</span><h1>Base UI</h1></div>
        <p>기능과 접근성 기반은 같고 Tailwind·CSS·CSS-in-JS 중 원하는 스타일링 방식을 선택합니다.</p>
      </header>

      <div className="base-foundation-strip">
        <div>Structure</div><div>Behavior</div><div>Accessibility</div>
      </div>

      <div className="base-style-grid">
        {styles.map(style => (
          <article key={style.name} className="base-style-card">
            <h2>{style.name}</h2>
            <code>{style.code}</code>
            <div className="base-style-result">
              <Button className={style.className}>같은 Base Button</Button>
            </div>
          </article>
        ))}
      </div>

      <div className="demo-thesis">같은 component behavior → 서로 다른 styling strategy</div>
      <div className="demo-fact-strip">
        <div><strong>Strength</strong>접근성 기반을 유지하면서 스타일 기술을 자유롭게 선택</div>
        <div><strong>Trade-off</strong>완성된 시각 디자인은 직접 설계해야 함</div>
      </div>
    </section>
  )
}

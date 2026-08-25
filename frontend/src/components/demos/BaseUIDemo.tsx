import { Button } from '@base-ui/react/button'
import './TailwindLibrarySlide.css'

export function BaseUIDemo() {
  return (
    <div className="tailwind-library-page">
      <header className="tailwind-library-hero"><span>Unstyled / Primitives · Styling Freedom</span><h1>Base UI</h1><p>기능과 접근성은 제공하고, 스타일은 개발자가 원하는 방식으로 입히는 UI 기반</p></header>
      <section className="tailwind-library-core"><p><strong>하나의 동작 기반</strong> → 여러 스타일링 방식 가능</p></section>

      <section className="tailwind-library-comparison base-comparison">
        <article className="accent-card"><span>Unstyled Foundation</span><h2>BASE UI CORE</h2><div className="foundation-stack"><strong>Structure</strong><strong>Behavior</strong><strong>Accessibility</strong></div><p className="card-caption">컴포넌트의 구조와 동작, 접근성 기반 제공</p></article>
        <div className="comparison-arrow"><b>→</b></div>
        <article><span>Same Button · Different Styles</span><h2>STYLING OPTIONS</h2><div className="styled-button-grid"><div><small>Tailwind</small><Button className="tailwind-example">Tailwind 버튼</Button></div><div><small>CSS</small><Button className="css-example">CSS 버튼</Button></div><div><small>CSS-in-JS</small><Button style={{ background: 'linear-gradient(135deg,#646cff,#38bdf8)', borderRadius: 999, color: 'white' }}>CSS-in-JS 버튼</Button></div></div></article>
      </section>

      <div className="source-statement"><strong>기능은 같고</strong>, 스타일링 방식만 달라진다</div>

      <section className="base-methods"><p><strong>Base UI</strong><span>동작 / 구조 제공</span></p><p><strong>Tailwind</strong><span>유틸리티 스타일링</span></p><p><strong>CSS</strong><span>전통적인 CSS</span></p><p><strong>CSS-in-JS</strong><span>JS 안에서 스타일 관리</span></p></section>

      <section className="tailwind-library-tradeoffs"><article><h3>장점</h3><ul className="four-items"><li>스타일링 기술 선택 자유</li><li>접근성과 기능 기반 제공</li><li>디자인 시스템 실험에 유리</li><li>특정 스타일 체계에 덜 묶임</li></ul></article><article><h3>한계</h3><ul><li>즉시 예쁜 완성 화면은 아님</li><li>스타일을 직접 설계해야 함</li></ul></article></section>

      <footer className="tailwind-library-takeaway">Base UI는 스타일을 강요하지 않고, <strong>기능 기반 위에 원하는 디자인을 입히게 해준다.</strong></footer>
    </div>
  )
}

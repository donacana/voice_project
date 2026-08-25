import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import './TailwindLibrarySlide.css'

const primitives = ['Dialog', 'Dropdown Menu', 'Tooltip', 'Popover', 'Tabs', 'Accordion']

export function RadixUIDemo() {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="tailwind-library-page">
      <header className="tailwind-library-hero"><span>Unstyled / Primitives · Building Blocks</span><h1>Radix UI</h1><p>접근성과 동작이 구현된 작은 UI 부품으로 내 디자인 시스템을 조립하는 방식</p></header>
      <section className="tailwind-library-core"><p>완성품이 아니라, <strong>잘 만들어진 UI 부품 블록</strong>을 제공</p></section>

      <section className="tailwind-library-comparison">
        <article className="accent-card"><span>Accessible Building Blocks</span><h2>RADIX PRIMITIVES</h2><div className="primitive-chips">{primitives.map(item => <span key={item}>{item}</span>)}</div><p className="card-caption">열기/닫기 · Focus · Keyboard · ARIA 동작 포함</p></article>
        <div className="comparison-arrow"><b>+</b></div>
        <article><span>Visual Rules</span><h2>MY DESIGN SYSTEM</h2><div className="design-chips">{['우리 색상', '우리 spacing', '우리 radius', '우리 animation', '우리 layout'].map(item => <span key={item}>{item}</span>)}</div></article>
      </section>

      <div className="flow-equation"><strong>Radix Primitive</strong><b>+</b><strong>My Style</strong><b>↓</b><strong>Custom Dialog / Menu / Tooltip</strong></div>

      <section className="preview-and-tradeoffs">
        <article className="compact-preview"><h3>Dialog Primitive + 우리 스타일</h3><Dialog.Root open={open} onOpenChange={setOpen}><Dialog.Trigger asChild><button className="dialog-trigger">Dialog 열기</button></Dialog.Trigger><div className={`dialog-mock ${open ? 'visible' : ''}`}><strong>회원가입 확인</strong><span>Focus · Escape · ARIA는 Radix가 처리</span><Dialog.Close asChild><button>닫기</button></Dialog.Close></div></Dialog.Root></article>
        <div className="mini-tradeoffs"><article><h3>장점</h3><ul><li>접근성과 동작이 안정적</li><li>디자인 제어권이 큼</li><li>디자인 시스템 구축에 적합</li></ul></article><article><h3>한계</h3><ul><li>기본 완성 디자인 없음</li><li>스타일링 필요</li><li>Primitive 개념이 낯설 수 있음</li></ul></article></div>
      </section>

      <div className="source-statement">LEGO 완성품이 아니라, <strong>고품질 부품을 받아 내 방식으로 조립</strong>하는 라이브러리</div>
      <footer className="tailwind-library-takeaway">Radix UI는 완성된 컴포넌트보다, <strong>조립 가능한 고품질 UI 부품</strong>에 가깝다.</footer>
    </div>
  )
}

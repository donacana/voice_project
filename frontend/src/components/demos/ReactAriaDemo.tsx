import React from 'react'
import { useButton, useFocusRing } from 'react-aria'
import './TailwindLibrarySlide.css'

const ariaFeatures = [['Keyboard', 'Tab / Arrow / Enter / Space'], ['Focus', '포커스 이동 / focus ring'], ['Screen Reader', 'ARIA 속성 / 읽기 지원'], ['Selection', '선택 상태 관리']]
const menuItems = ['메뉴1', '메뉴2', '메뉴3', '메뉴4']

function AriaTab({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: () => void }) {
  const ref = React.useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton({ onPress: onSelect }, ref)
  const { focusProps, isFocusVisible } = useFocusRing()
  return <button ref={ref} {...buttonProps} {...focusProps} className={`${selected ? 'selected' : ''} ${isFocusVisible ? 'focus-visible' : ''}`}>{label}</button>
}

export function ReactAriaDemo() {
  const [selected, setSelected] = React.useState('메뉴1')
  return (
    <div className="tailwind-library-page">
      <header className="tailwind-library-hero"><span>Unstyled / Primitives · Accessibility</span><h1>React Aria</h1><p>내가 원하는 UI를 만들면서 접근성과 상호작용 로직을 제대로 구현하도록 돕는 라이브러리</p></header>
      <section className="tailwind-library-core"><p>디자인은 직접 만들고, <strong>접근성·상호작용 로직</strong>은 React Aria가 지원</p></section>

      <section className="tailwind-library-comparison">
        <article className="accent-card"><span>Interaction Foundation</span><h2>REACT ARIA PROVIDES</h2><div className="role-rows">{ariaFeatures.map(([label, value]) => <p key={label}><strong>{label}</strong><b>→</b><span>{value}</span></p>)}</div></article>
        <div className="comparison-arrow"><b>+</b></div>
        <article><span>Visual Layer</span><h2>MY UI DESIGN</h2><div className="design-chips">{['Tailwind / CSS', 'Color', 'Spacing', 'Border', 'Layout', 'Animation'].map(item => <span key={item}>{item}</span>)}</div></article>
      </section>

      <div className="flow-equation"><strong>React Aria hooks</strong><b>+</b><strong>My Design</strong><b>↓</b><strong>접근성 있는 Menu / Tabs / Button</strong></div>

      <section className="preview-and-tradeoffs">
        <article className="compact-preview"><h3>선택 가능한 Tabs 예시</h3><div className="aria-tabs">{menuItems.map(item => <AriaTab key={item} label={item} selected={selected === item} onSelect={() => setSelected(item)} />)}</div><p>선택됨: <strong>{selected}</strong></p></article>
        <div className="mini-tradeoffs"><article><h3>장점</h3><ul><li>접근성 로직 구현 도움</li><li>키보드·포커스 처리</li><li>디자인 자유도 높음</li></ul></article><article><h3>한계</h3><ul><li>완성 디자인은 직접 제작</li><li>초보자에게 개념이 추상적일 수 있음</li></ul></article></div>
      </section>

      <footer className="tailwind-library-takeaway">React Aria는 UI를 꾸미는 라이브러리가 아니라, <strong>접근성과 상호작용을 정확히 구현하게 돕는 기반</strong>이다.</footer>
    </div>
  )
}

import React from 'react'
import { useButton, useFocusRing } from 'react-aria'

const features = [
  ['Keyboard', 'Tab / Arrow / Enter'],
  ['Focus', '포커스 이동과 ring'],
  ['Screen Reader', 'ARIA 속성과 읽기'],
  ['Selection', '선택 상태 관리'],
]
const menuItems = ['개요', '코드', '접근성', '결과']

function AriaTab({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: () => void }) {
  const ref = React.useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton({ onPress: onSelect }, ref)
  const { focusProps, isFocusVisible } = useFocusRing()
  return (
    <button
      ref={ref}
      {...buttonProps}
      {...focusProps}
      className={`${selected ? 'selected' : ''} ${isFocusVisible ? 'focus-visible' : ''}`}
    >
      {label}
    </button>
  )
}

export function ReactAriaDemo() {
  const [selected, setSelected] = React.useState(menuItems[0])

  return (
    <section className="library-demo-slide">
      <header className="library-demo-header">
        <div><span className="demo-eyebrow">Unstyled · Accessibility Behavior</span><h1>React Aria</h1></div>
        <p>시각 디자인 대신 키보드·포커스·스크린리더·선택 동작의 정확한 기반을 제공합니다.</p>
      </header>

      <div className="aria-feature-grid">
        {features.map(([label, value]) => (
          <div key={label} className="aria-feature-tile"><strong>{label}</strong><span>{value}</span></div>
        ))}
      </div>

      <div className="aria-demo-body">
        <article className="aria-foundation-card">
          <h2>React Aria가 제공</h2>
          <ul className="aria-behavior-list">
            <li><span>useButton</span><strong>Press behavior</strong></li>
            <li><span>useFocusRing</span><strong>Focus visibility</strong></li>
            <li><span>ARIA props</span><strong>Screen reader</strong></li>
          </ul>
        </article>

        <article className="aria-live-card">
          <h2>스타일은 개발자가 선택</h2>
          <div className="aria-live-tabs" role="tablist" aria-label="React Aria tab example">
            {menuItems.map(item => (
              <AriaTab key={item} label={item} selected={selected === item} onSelect={() => setSelected(item)} />
            ))}
          </div>
          <p className="aria-selected-result" aria-live="polite">현재 선택: {selected}</p>
        </article>
      </div>

      <div className="demo-thesis">React Aria behavior + My visual design = 접근성 있는 커스텀 UI</div>
    </section>
  )
}

import { KeyboardEvent, useRef, useState } from 'react'
import './TailwindLibrarySlide.css'

const behaviorRows = [
  ['Menu', '열기 / 닫기'],
  ['Keyboard', 'Tab / Enter / Escape'],
  ['Focus', '포커스 이동 및 관리'],
  ['Accessibility', 'Screen Reader 대응'],
]

const menuItems = ['Profile', 'Settings', 'Sign out']

interface HeadlessUIDemoProps {
  screen?: 1 | 2
}

function HeadlessConcept() {
  return (
    <div className="tailwind-library-page split-library-page headless-concept-page">
      <header className="tailwind-library-hero split-library-hero">
        <span>Tailwind-Based · Behavior</span>
        <h1>Headless UI</h1>
        <p>디자인은 내가 만들고, 복잡한 동작과 접근성은 라이브러리가 처리</p>
      </header>

      <section className="tailwind-library-core split-library-core">
        <p>완성된 색상이나 디자인 대신 Menu · Dialog · Listbox 같은 UI의 <strong>동작과 접근성</strong>을 제공합니다.</p>
      </section>

      <section className="tailwind-library-comparison headless-comparison split-comparison">
        <article className="accent-card">
          <span>Behavior + Accessibility</span>
          <h2>HEADLESS UI</h2>
          <div className="role-rows">
            {behaviorRows.map(([label, value]) => (
              <p key={label}><strong>{label}</strong><b>→</b><span>{value}</span></p>
            ))}
          </div>
        </article>
        <div className="comparison-arrow" aria-hidden="true"><b>+</b></div>
        <article>
          <span>Style</span>
          <h2>MY DESIGN</h2>
          <div className="design-chips">
            {['Color', 'Spacing', 'Border', 'Shadow', 'Animation'].map(item => <span key={item}>{item}</span>)}
          </div>
        </article>
      </section>

      <div className="flow-equation split-equation">
        <strong>Headless UI + Tailwind / CSS</strong>
        <b>=</b>
        <span>동작은 라이브러리, 디자인은 개발자</span>
      </div>
    </div>
  )
}

function HeadlessInteraction() {
  const [isOpen, setIsOpen] = useState(true)
  const [activeItem, setActiveItem] = useState(0)
  const [selection, setSelection] = useState('메뉴가 열려 있습니다')
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])

  const focusItem = (index: number) => {
    const nextIndex = (index + menuItems.length) % menuItems.length
    setActiveItem(nextIndex)
    window.requestAnimationFrame(() => itemRefs.current[nextIndex]?.focus())
  }

  const closeMenu = () => {
    setIsOpen(false)
    setSelection('Escape로 메뉴를 닫았습니다')
    window.requestAnimationFrame(() => triggerRef.current?.focus())
  }

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault()
      closeMenu()
      return
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
        setSelection('키보드로 메뉴를 열었습니다')
        focusItem(event.key === 'ArrowDown' ? 0 : menuItems.length - 1)
        return
      }
      focusItem(activeItem + (event.key === 'ArrowDown' ? 1 : -1))
    }
  }

  return (
    <div className="tailwind-library-page split-library-page headless-interaction-page">
      <header className="tailwind-library-hero split-library-hero">
        <span>Headless UI · Interaction</span>
        <h1>Headless UI</h1>
        <p>보이지 않는 부분을 대신 구현해준다</p>
      </header>

      <section className="headless-interaction-stage" onKeyDown={handleMenuKeyDown}>
        <article className="headless-menu-demo">
          <span className="split-card-eyebrow">Interactive Menu</span>
          <div className="account-menu-shell">
            <h2>계정</h2>
            <p>클릭하거나 방향키와 Escape를 사용해 보세요.</p>
            <button
              ref={triggerRef}
              className="account-menu-trigger"
              type="button"
              aria-haspopup="menu"
              aria-expanded={isOpen}
              onClick={() => {
                setIsOpen(open => !open)
                setSelection(isOpen ? '버튼으로 메뉴를 닫았습니다' : '버튼으로 메뉴를 열었습니다')
              }}
            >
              {isOpen ? '메뉴 닫기' : '메뉴 열기'}
            </button>

            {isOpen && (
              <div className="account-menu-list" role="menu" aria-label="계정 메뉴">
                {menuItems.map((item, index) => (
                  <button
                    key={item}
                    ref={element => { itemRefs.current[index] = element }}
                    type="button"
                    role="menuitem"
                    className={activeItem === index ? 'active' : ''}
                    tabIndex={activeItem === index ? 0 : -1}
                    onFocus={() => setActiveItem(index)}
                    onClick={() => {
                      setSelection(`${item} 항목을 선택했습니다`)
                      setIsOpen(false)
                      window.requestAnimationFrame(() => triggerRef.current?.focus())
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
            <div className="menu-live-status" aria-live="polite">{selection}</div>
          </div>
        </article>

        <div className="headless-responsibility-column">
          <article className="responsibility-card accent-card">
            <h2>HEADLESS UI가 처리</h2>
            <ul>
              <li>메뉴 열기 / 닫기</li>
              <li>Escape로 닫기</li>
              <li>Keyboard navigation</li>
              <li>Focus 관리</li>
              <li>ARIA / 접근성</li>
            </ul>
          </article>
          <article className="responsibility-card">
            <h2>개발자가 처리</h2>
            <ul>
              <li>색상</li>
              <li>크기</li>
              <li>간격</li>
              <li>애니메이션</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="tailwind-library-tradeoffs split-tradeoffs">
        <article><h3>장점</h3><ul><li>디자인에 묶이지 않음</li><li>키보드 / Focus / 접근성 처리</li></ul></article>
        <article><h3>한계</h3><ul><li>기본 디자인 없음</li><li>스타일은 직접 만들어야 함</li></ul></article>
      </section>

      <footer className="tailwind-library-takeaway split-takeaway">
        Headless UI는 모양이 아니라 <strong>UI가 제대로 동작하는 방법</strong>을 제공합니다.
      </footer>
    </div>
  )
}

export function HeadlessUIDemo({ screen = 1 }: HeadlessUIDemoProps) {
  return screen === 1 ? <HeadlessConcept /> : <HeadlessInteraction />
}

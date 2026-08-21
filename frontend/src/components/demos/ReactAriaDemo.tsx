import React from 'react'
import { useButton, useFocusRing } from 'react-aria'

const items = ['메뉴1', '메뉴2', '메뉴3', '메뉴4']

// A focusable menu item. React Aria (useButton + useFocusRing) provides
// button keyboard activation (Enter/Space) and visible focus. Arrow-key
// navigation between items is handled by the parent via onKeyDown.
const MenuItem: React.FC<{
  label: string
  active: boolean
  onSelect: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
}> = ({ label, active, onSelect, onKeyDown }) => {
  const ref = React.useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton({ onPress: onSelect }, ref)
  const { isFocusVisible, focusProps } = useFocusRing()

  return (
    <button
      ref={ref}
      {...buttonProps}
      {...focusProps}
      onKeyDown={onKeyDown}
      className={`w-full text-left px-4 py-2 rounded transition-colors ${
        active
          ? 'bg-blue-600 text-white'
          : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
      } ${isFocusVisible ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900' : ''}`}
    >
      {label}
    </button>
  )
}

export const ReactAriaDemo: React.FC = () => {
  const [selected, setSelected] = React.useState('메뉴1')
  const refs = React.useRef<(HTMLButtonElement | null)[]>([])

  const moveFocus = (dir: 1 | -1) => {
    const current = refs.current.findIndex(ref => ref === document.activeElement)
    const base = current === -1 ? 0 : current
    const next = Math.min(items.length - 1, Math.max(0, base + dir))
    refs.current[next]?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      moveFocus(1)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      moveFocus(-1)
    }
  }

  return (
    <div className="p-6 bg-[#0f1117] min-h-full">
      <h2 className="text-3xl font-bold text-blue-400 mb-2">React Aria</h2>
      <p className="text-gray-400 mb-6">
        내가 원하는 UI를 만들면서 접근성과 상호작용을 제대로 구현
      </p>

      {/* Accessibility layers */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">접근성 계층</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '⌨️', label: 'Keyboard', desc: 'Tab/화살표 이동' },
            { icon: '🎯', label: 'Focus', desc: '포커스 관리' },
            { icon: '🔊', label: 'Screen Reader', desc: 'ARIA 인식' },
            { icon: '✅', label: 'Selection', desc: '선택 상태' },
          ].map(item => (
            <div key={item.label} className="bg-black/40 border border-slate-600 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-blue-400 font-semibold">{item.label}</div>
              <div className="text-gray-400 text-sm">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive menu */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">
          Tab / 화살표 키로 포커스 이동
        </h3>
        <div className="flex flex-col gap-2 max-w-xs">
          {items.map(item => (
            <MenuItem
              key={item}
              label={item}
              active={selected === item}
              onSelect={() => setSelected(item)}
              onKeyDown={handleKeyDown}
            />
          ))}
        </div>
        <p className="text-gray-400 text-sm mt-4">
          Tab으로 진입 → ↑/↓로 항목 이동 → Enter/Space로 선택.
          React Aria(useButton + useFocusRing)가 버튼 활성화와 포커스 표시를,
          화살표 이동 로직은 개발자가 구현합니다.
        </p>
        <div className="text-gray-300 mt-2">
          선택됨: <span className="text-blue-400 font-semibold">{selected}</span>
        </div>
      </div>
    </div>
  )
}
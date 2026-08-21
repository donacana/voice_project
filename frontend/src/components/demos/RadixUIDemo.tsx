import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Label from '@radix-ui/react-label'

// LEGO-block primitives diagram data.
const primitives = ['Dialog', 'Dropdown', 'Tooltip', 'Popover']

export const RadixUIDemo: React.FC = () => {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="p-6 bg-[#0f1117] min-h-full">
      <h2 className="text-3xl font-bold text-blue-400 mb-2">Radix UI</h2>
      <p className="text-gray-400 mb-6">
        접근성까지 구현된 기본 UI 부품(Primitive) → 자체 디자인 시스템
      </p>

      {/* LEGO block concept */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">
          Primitive = 레고 블록
        </h3>
        <div className="flex flex-wrap gap-3 mb-4">
          {primitives.map(p => (
            <div
              key={p}
              className="bg-blue-600/20 border border-blue-500 rounded-lg px-4 py-3 text-blue-300 font-semibold"
            >
              {p}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
          <span>＋</span>
          <span>우리 CSS · 우리 로직</span>
        </div>
        <div className="bg-green-600/20 border border-green-500 rounded-lg px-4 py-3 text-green-300 font-semibold w-fit">
          우리 회사 디자인 시스템
        </div>
        <p className="text-gray-400 text-sm mt-4">
          저수준은 품질이 낮다는 뜻이 아닙니다. 완성된 LEGO 자동차 대신
          바퀴·축·핸들·블록처럼 작은 부품을 제공하고, 부품 안에는 키보드·Focus·Escape·ARIA 같은
          어려운 상호작용이 이미 포함되어 있습니다.
        </p>
      </div>

      {/* Live Dialog primitive with custom styling */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">
          실제 예시: Dialog Primitive + 우리 스타일
        </h3>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Dialog 열기
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/60" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800 border border-slate-600 rounded-lg p-6 w-[90vw] max-w-md">
              <Dialog.Title className="text-lg font-semibold text-blue-400 mb-2">
                회원가입 확인
              </Dialog.Title>
              <Dialog.Description className="text-gray-300 text-sm mb-4">
                Radix Dialog가 열기/닫기, Focus, Escape, ARIA를 처리하고,
                색상·간격·테두리는 우리가 직접 지정했습니다.
              </Dialog.Description>
              <div className="mb-4">
                <Label.Root className="block text-gray-400 text-sm mb-1" htmlFor="name">
                  이름
                </Label.Root>
                <input
                  id="name"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-gray-200"
                  placeholder="이름 입력"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Dialog.Close asChild>
                  <button className="px-4 py-2 bg-slate-700 text-gray-200 rounded hover:bg-slate-600">
                    취소
                  </button>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    확인
                  </button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  )
}
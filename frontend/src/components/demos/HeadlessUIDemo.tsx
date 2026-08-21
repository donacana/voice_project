import React from 'react'
import { Disclosure } from '@headlessui/react'

export const HeadlessUIDemo: React.FC = () => {
  return (
    <div className="p-6 bg-[#0f1117] min-h-full">
      <h2 className="text-3xl font-bold text-blue-400 mb-2">Headless UI</h2>
      <p className="text-gray-400 mb-6">
        기능/접근성은 제공, 디자인은 개발자가 직접
      </p>

      {/* Layer flow */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">역할 분리 흐름</h3>
        <div className="flex flex-col md:flex-row items-stretch gap-4">
          {/* Behavior layer */}
          <div className="flex-1 bg-black/40 border border-blue-500 rounded-lg p-4">
            <div className="text-blue-400 font-semibold mb-2">Headless UI</div>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Menu 열기/닫기</li>
              <li>• 선택 동작</li>
              <li>• 키보드 (Tab/Enter/Escape)</li>
              <li>• Focus 관리</li>
              <li>• 스크린리더 인식</li>
            </ul>
          </div>

          <div className="flex items-center justify-center text-blue-400 text-2xl font-bold">
            ↓
          </div>

          {/* Design layer */}
          <div className="flex-1 bg-black/40 border border-slate-600 rounded-lg p-4">
            <div className="text-gray-300 font-semibold mb-2">내 CSS / Tailwind</div>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• 색상</li>
              <li>• 간격</li>
              <li>• 테두리</li>
              <li>• 애니메이션</li>
            </ul>
          </div>

          <div className="flex items-center justify-center text-blue-400 text-2xl font-bold">
            ↓
          </div>

          {/* Final UI */}
          <div className="flex-1 bg-black/40 border border-green-500 rounded-lg p-4">
            <div className="text-green-400 font-semibold mb-2">내 디자인의 Menu</div>
            <p className="text-gray-400 text-sm">
              동작은 Headless UI가, 디자인은 내가
            </p>
          </div>
        </div>
      </div>

      {/* Live example: Disclosure */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">
          실제 예시: Disclosure (동작은 Headless UI, 디자인은 Tailwind)
        </h3>
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-left">
                {open ? '▼' : '▶'} Expandable Section
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 py-2 bg-slate-800 text-gray-300 mt-2">
                열기/닫기, 키보드, Focus, 접근성은 Headless UI가 처리하고,
                색상·간격·테두리는 Tailwind로 직접 지정했습니다.
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  )
}
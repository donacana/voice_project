import React from 'react'
import { Button } from '@base-ui/react/button'

export const BaseUIDemo: React.FC = () => {
  return (
    <div className="p-6 bg-[#0f1117] min-h-full">
      <h2 className="text-3xl font-bold text-blue-400 mb-2">Base UI</h2>
      <p className="text-gray-400 mb-6">
        기능과 접근성은 제공, 스타일링 기술은 자유롭게 선택
      </p>

      {/* Foundation → styling technologies */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">
          하나의 기반 → 여러 스타일 방식
        </h3>
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Foundation */}
          <div className="bg-blue-600/20 border border-blue-500 rounded-lg px-6 py-4 text-center">
            <div className="text-blue-300 font-semibold">Base UI</div>
            <div className="text-gray-400 text-sm">구조 · 동작 · 접근성</div>
          </div>

          <div className="text-blue-400 text-2xl font-bold">→</div>

          {/* Styling options */}
          <div className="flex flex-wrap gap-3">
            {['Tailwind', 'CSS', 'CSS Modules', 'CSS-in-JS'].map(s => (
              <div
                key={s}
                className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-gray-200 font-semibold"
              >
                {s}
              </div>
            ))}
          </div>
        </div>
        <p className="text-gray-400 text-sm mt-4">
          같은 기능 / 다른 스타일 방식. 어떤 CSS 기술을 사용할지는 개발자가 선택합니다.
        </p>
      </div>

      {/* Same primitive, different styling */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">
          같은 Base UI 버튼, 다른 스타일
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Tailwind style */}
          <div className="bg-black/40 border border-slate-600 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-3">Tailwind</div>
            <Button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Tailwind 버튼
            </Button>
          </div>

          {/* Plain CSS style */}
          <div className="bg-black/40 border border-slate-600 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-3">일반 CSS</div>
            <Button
              type="button"
              style={{
                padding: '8px 16px',
                background: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              CSS 버튼
            </Button>
          </div>

          {/* CSS-in-JS style */}
          <div className="bg-black/40 border border-slate-600 rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-3">CSS-in-JS</div>
            <Button
              type="button"
              style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #646cff, #535bf2)',
                color: 'white',
                border: 'none',
                borderRadius: '9999px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(100,108,255,0.3)',
              }}
            >
              CSS-in-JS 버튼
            </Button>
          </div>
        </div>
        <p className="text-gray-400 text-sm mt-4">
          동작과 접근성은 Base UI가 제공하고, 스타일은 각 방식으로 자유롭게 적용했습니다.
        </p>
      </div>
    </div>
  )
}
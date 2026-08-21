import React from 'react'

export const DaisyUIDemo: React.FC = () => {
  return (
    <div className="p-6 bg-[#0f1117] min-h-full">
      <h2 className="text-3xl font-bold text-blue-400 mb-2">daisyUI</h2>
      <p className="text-gray-400 mb-6">
        Tailwind에서 반복되는 긴 스타일 조합을 짧은 컴포넌트 클래스로 제공
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Tailwind only */}
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-4">Tailwind만 사용</h3>
          <div className="bg-black/40 border border-slate-700 rounded p-4 font-mono text-sm text-gray-300 leading-7">
            <div className="text-gray-500">// 긴 유틸리티 클래스 조합</div>
            <div>{'<button'}</div>
            <div className="pl-4">{'className="'}</div>
            <div className="pl-8">bg-blue-500</div>
            <div className="pl-8">text-white</div>
            <div className="pl-8">px-4</div>
            <div className="pl-8">py-2</div>
            <div className="pl-8">rounded-lg</div>
            <div className="pl-8">font-bold</div>
            <div className="pl-8">shadow-md</div>
            <div className="pl-8">hover:bg-blue-600</div>
            <div className="pl-8">focus:ring-2</div>
            <div className="pl-4">{'"'}</div>
            <div>{'>'}</div>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            복잡해질수록 클래스가 길어진다
          </p>
        </div>

        {/* daisyUI */}
        <div className="bg-slate-900 border border-blue-500 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-4">daisyUI</h3>
          <div className="bg-black/40 border border-blue-500 rounded p-4 font-mono text-sm text-gray-300 leading-7">
            <div className="text-gray-500">// 의미 있는 컴포넌트 클래스</div>
            <div>{'<button'}</div>
            <div className="pl-4">{'className="btn btn-primary"'}</div>
            <div>{'>'}</div>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            자주 쓰는 조합을 btn, card, alert 같은 짧은 이름으로 제공
          </p>
        </div>
      </div>

      {/* Live comparison */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mt-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-4">실제 결과 비교</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex flex-col gap-2">
            <span className="text-gray-500 text-sm">Tailwind 조합</span>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-blue-600 focus:ring-2">
              저장
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-gray-500 text-sm">daisyUI</span>
            <button className="btn btn-primary">저장</button>
          </div>
        </div>
      </div>
    </div>
  )
}
import React from 'react'

export const ShadcnDemo: React.FC = () => {
  return (
    <div className="p-6 bg-[#0f1117] min-h-full">
      <h2 className="text-3xl font-bold text-blue-400 mb-2">shadcn/ui</h2>
      <p className="text-gray-400 mb-6">
        컴포넌트 소스 코드를 내 프로젝트가 직접 소유하는 방식
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Traditional library */}
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-4">일반 라이브러리</h3>
          <div className="bg-black/40 border border-slate-700 rounded p-4 font-mono text-sm text-gray-300 leading-7">
            <div>node_modules</div>
            <div className="pl-4">└─ Library</div>
            <div className="pl-8">└─ Button</div>
            <div className="pl-4 text-gray-500">↓</div>
            <div className="pl-4">import Button</div>
            <div className="pl-4 text-gray-500">↓</div>
            <div className="pl-4 text-gray-400">패키지 안에서 빌려 씀</div>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            기능 변경 시 지원되는 prop/API를 찾아야 함
          </p>
        </div>

        {/* shadcn/ui */}
        <div className="bg-slate-900 border border-blue-500 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-4">shadcn/ui</h3>
          <div className="bg-black/40 border border-blue-500 rounded p-4 font-mono text-sm text-gray-300 leading-7">
            <div>내 프로젝트</div>
            <div className="pl-4">└─ src</div>
            <div className="pl-8">└─ components</div>
            <div className="pl-12">└─ ui</div>
            <div className="pl-16 text-blue-400">└─ button.tsx</div>
            <div className="pl-16 text-gray-500">↑</div>
            <div className="pl-16 text-gray-400">내가 직접 수정</div>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            button.tsx 자체를 열어 구조·스타일·기능을 직접 수정 가능
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mt-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-3">소스 코드 소유의 장점</h3>
        <ul className="text-gray-300 space-y-2">
          <li>• 내부 구조까지 자유롭게 수정 가능</li>
          <li>• 프로젝트 전용 variant 추가 가능</li>
          <li>• 필요 없는 코드 제거 가능</li>
          <li>• 자체 디자인 시스템에 깊게 맞출 수 있음</li>
        </ul>
        <p className="text-gray-400 text-sm mt-4">
          단점: 코드 유지보수 책임도 개발자에게 생긴다.
        </p>
      </div>
    </div>
  )
}
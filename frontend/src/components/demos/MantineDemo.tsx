import React from 'react'

// Mantine v9 requires React 19, but this project uses React 18.
// Per fix.md §14, we replace the live Mantine runtime demo with a
// lecture/example representation and remove the incompatible dependency.
export const MantineDemo: React.FC = () => {
  return (
    <div className="lecture-demo">
      <h2 className="demo-title">Mantine</h2>
      <p className="demo-identity">
        컴포넌트·훅·유틸리티를 모두 갖춘 올인원 React UI 솔루션
      </p>

      <div className="mantine-ecosystem">
        <div className="ecosystem-block">
          <span className="ecosystem-icon">🧩</span>
          <h3>Component</h3>
          <p>Input / Button / Modal</p>
        </div>
        <div className="ecosystem-plus">+</div>
        <div className="ecosystem-block">
          <span className="ecosystem-icon">🪝</span>
          <h3>Hook</h3>
          <p>useForm() / useMediaQuery()</p>
        </div>
        <div className="ecosystem-plus">+</div>
        <div className="ecosystem-block">
          <span className="ecosystem-icon">🧰</span>
          <h3>Utility</h3>
          <p>Notifications / Dates</p>
        </div>
      </div>

      {/* Concrete example: 회원가입 기능 */}
      <div className="demo-example">
        <h3 className="demo-example-title">회원가입 기능 예시</h3>
        <div className="demo-example-flow">
          <div className="example-step">
            <span className="example-step-icon">🧩</span>
            <span className="example-step-label">Component</span>
            <span className="example-step-detail">Input / Button / Modal</span>
          </div>
          <div className="example-step">
            <span className="example-step-icon">🪝</span>
            <span className="example-step-label">Hook</span>
            <span className="example-step-detail">useForm() / useMediaQuery()</span>
          </div>
          <div className="example-step">
            <span className="example-step-icon">🧰</span>
            <span className="example-step-label">Utility</span>
            <span className="example-step-detail">Notification / Dates</span>
          </div>
        </div>
        <div className="example-arrow">↓</div>
        <div className="example-result">Mantine 하나의 생태계</div>
      </div>

      <div className="demo-facts">
        <div className="fact-row">
          <span className="fact-label">Strength</span>
          <span className="fact-value">대형 컴포넌트 컬렉션과 훅·유틸리티 포함</span>
        </div>
        <div className="fact-row">
          <span className="fact-label">Trade-off</span>
          <span className="fact-value">프리미티브부터 직접 만들고 싶다면 과할 수 있음</span>
        </div>
        <div className="fact-row">
          <span className="fact-label">Use case</span>
          <span className="fact-value">생산성이 우선일 때 빠른 앱 개발</span>
        </div>
      </div>

      <div className="demo-note">
        <p>
          Mantine은 컴포넌트 + 훅 + 유틸리티가 하나로 통합된 생태계를 제공합니다.
          여러 라이브러리를 따로 찾아 연결하는 작업을 줄여줍니다.
          이 화면은 강의용 표현이며, 실제 Mantine 컴포넌트는 공식 사이트에서 확인할 수 있습니다.
        </p>
      </div>
    </div>
  )
}
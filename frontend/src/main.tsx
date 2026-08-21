// React 기능을 사용하기 위해 React를 불러옴
// 아래의 React.StrictMode를 사용하기 때문에 필요함
import React from 'react'

// React 화면을 실제 HTML DOM에 연결하기 위한 ReactDOM을 불러옴
// React 18 이후 createRoot() 방식을 사용
import ReactDOM from 'react-dom/client'

// 우리가 만든 최상위 React 컴포넌트 App을 불러옴
// 실제 웹사이트의 주요 화면이 여기서 시작됨
import App from './App.tsx'

// LectureContext에서 LectureProvider를 불러옴
// 여러 컴포넌트가 현재 강의 화면, 선택한 라이브러리 등의 상태를 공유하도록 해줌
import { LectureProvider } from './contexts/LectureContext.tsx'

// 프로젝트 전체에 적용할 기본 CSS 파일을 불러옴
import './index.css'


// index.html 안에 있는 id="root" 요소를 찾아
// 그곳을 React 애플리케이션이 그려질 시작점으로 설정
ReactDOM.createRoot(document.getElementById('root')!).render(

  // 개발 중 React 코드의 잠재적인 문제를 검사해주는 모드
  // 실제 화면을 만드는 컴포넌트라기보다 개발용 검사 기능에 가까움
  <React.StrictMode>

    
    <LectureProvider>


      <App />

    </LectureProvider>

  </React.StrictMode>,
)
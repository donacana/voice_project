import './MUIXDetail.css'

interface MUIXDetailProps {
  onBack: () => void
  onNext: () => void
}

const rows = [
  ['Kim Min', 'Active', '128'],
  ['Lee Soo', 'Pending', '72'],
  ['Park Ji', 'Active', '201'],
]

const gridCapabilities = [
  ['정렬', '이름·가격·날짜 등의 기준으로 데이터 순서를 바꿈'],
  ['검색 / 필터', '원하는 조건의 데이터만 빠르게 찾음'],
  ['페이지 나누기', '많은 데이터를 여러 페이지로 나눠 표시'],
  ['행 선택', '여러 데이터를 선택해 일괄 작업'],
  ['편집', '표 안에서 값을 직접 수정'],
  ['가상화', '데이터가 많아도 필요한 부분 중심으로 렌더링'],
]

export function MUIXDetail({ onBack, onNext }: MUIXDetailProps) {
  return (
    <div className="mui-x-detail">
      <header className="mui-x-detail-hero">
        <span>Material UI · Advanced Components</span>
        <h1>MUI X는 무엇을 제공할까?</h1>
        <p>MUI를 간단하게 보면 두 영역으로 나눌 수 있습니다.</p>
      </header>

      <section className="mui-x-scope-intro">
        <div><strong>Core</strong><span>→ 일반적인 웹 화면을 만드는 기본 UI</span></div>
        <div><strong>MUI X</strong><span>→ 데이터가 많고 업무 기능이 복잡한 화면을 만드는 고급 UI</span></div>
        <p>그중 MUI X를 조금 더 자세히 보겠습니다.</p>
      </section>

      <section className="mui-x-grid-feature">
        <div className="mui-x-table-wrap">
          <div className="mui-x-table-title"><strong>Data Grid</strong><span>대규모 데이터를 다루는 고급 테이블</span></div>
          <table>
            <thead><tr><th>이름</th><th>상태</th><th>주문</th></tr></thead>
            <tbody>{rows.map(row => <tr key={row[0]}>{row.map(cell => <td key={cell}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <div className="mui-x-capabilities">
          <h2>테이블 이상의 기능</h2>
          <div>{gridCapabilities.map(([title, description]) => (
            <span key={title}><strong>{title}</strong><small>→ {description}</small></span>
          ))}</div>
        </div>
      </section>

      <section className="mui-x-tools">
        <article><h3>Date / Time Pickers</h3><p>날짜·시간과 기간 선택</p></article>
        <article><h3>Charts</h3><p>막대·선·원·산점도 등 데이터 시각화</p></article>
        <article><h3>Tree View</h3><p>계층형 데이터 탐색</p></article>
        <article><h3>Scheduler</h3><p>일정과 이벤트를 시간축으로 관리</p></article>
      </section>

      <section className="mui-x-conclusion">MUI X는 관리자 페이지, 대시보드, 데이터 중심 업무 화면에서 특히 유용합니다.</section>

      <nav className="mui-x-nav" aria-label="MUI X 상세 화면 이동">
        <button type="button" onClick={onBack}>← Core / X</button>
        <span>3 · MUI X</span>
        <button type="button" className="mui-x-next" onClick={onNext}>Dashboard →</button>
      </nav>
    </div>
  )
}

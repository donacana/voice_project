import './MUICoreVsX.css'

interface MUICoreVsXProps {
  onBack: () => void
  onNext: () => void
}

const coreAreas = [
  ['입력', 'Button · TextField · Select · Checkbox', '사용자가 값을 입력하거나 선택'],
  ['데이터 표시', 'Table · Chip · Avatar · Tooltip', '정보를 화면에 보여줌'],
  ['피드백', 'Alert · Dialog · Progress · Snackbar', '상태나 결과를 사용자에게 알림'],
  ['화면 구성', 'Card · Paper · Accordion · App Bar', '내용을 묶고 화면 영역을 구성'],
  ['내비게이션', 'Drawer · Menu · Tabs · Pagination', '화면과 메뉴 사이를 이동'],
  ['레이아웃', 'Box · Container · Grid · Stack', '컴포넌트의 위치와 배치를 구성'],
]

const xAreas = [
  ['Data Grid', '대량의 표 데이터를 정렬·검색·필터·편집·페이지 처리'],
  ['Date / Time Pickers', '날짜·시간과 기간을 선택하는 입력 UI'],
  ['Charts', '막대·선·원·산점도 등 데이터를 그래프로 시각화'],
  ['Tree View', '계층형 데이터를 펼치고 접어서 표시'],
  ['Scheduler', '일정과 이벤트를 시간축·리소스 기준으로 표시'],
]

export function MUICoreVsX({ onBack, onNext }: MUICoreVsXProps) {
  return (
    <div className="mui-division">
      <header className="mui-division-hero">
        <span>Material UI · Product Family</span>
        <h1>MUI 생태계는 크게 두 가지로 볼 수 있습니다</h1>
        <p>기본적인 화면을 만드는 Core 영역과, 복잡한 데이터·업무 화면을 위한 MUI X입니다.</p>
      </header>

      <section className="mui-division-cards">
        <article>
          <span>기본적인 웹 UI를 만드는 영역</span>
          <h2>MUI Core</h2>
          <div className="mui-division-rows">
            {coreAreas.map(([title, examples, description]) => (
              <div key={title}>
                <strong>{title}</strong>
                <span>{examples}</span>
                <small>→ {description}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="mui-division-x">
          <span>복잡한 데이터·업무 화면용 고급 컴포넌트</span>
          <h2>MUI X</h2>
          <div className="mui-division-rows mui-division-rows--x">
            {xAreas.map(([title, description]) => (
              <div key={title}>
                <strong>{title}</strong>
                <small>→ {description}</small>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mui-division-summary">
        기본 UI는 <strong>MUI Core</strong><span>·</span>복잡한 데이터 화면은 <strong>MUI X</strong>
      </section>

      <nav className="mui-division-nav" aria-label="MUI Core와 X 화면 이동">
        <button type="button" onClick={onBack}>← 개념</button>
        <span>2 · Core / X</span>
        <button type="button" className="mui-division-next" onClick={onNext}>MUI X →</button>
      </nav>
    </div>
  )
}

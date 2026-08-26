import './MantineDetailSlides.css'

const componentExamples = [
  { name: 'TextInput', label: '이름', purpose: '일반 문자 입력', value: '홍길동' },
  { name: 'TextInput', label: '이메일', purpose: '이메일 입력', value: 'user@example.com' },
  { name: 'PasswordInput', label: '비밀번호', purpose: '표시 / 숨김 포함', value: '••••••••', featured: true, icon: '보기' },
  { name: 'NumberInput', label: '나이', purpose: '숫자 입력', value: '24' },
  { name: 'DatePickerInput', label: '생년월일', purpose: '달력에서 날짜 선택', value: '2000. 01. 15.', featured: true, icon: '달력' },
  { name: 'Select', label: '지역', purpose: '목록 선택', value: '서울', icon: '목록' },
]

const supportingExamples = [
  { code: '<DatePickerInput />', label: '예약 날짜 선택' },
  { code: '<Pagination total={10} />', label: '목록 페이지 이동' },
  { code: '<FileInput />', label: '파일 선택' },
]

export function MantineComponentsExample() {
  return (
    <section className="mantine-detail-slide mantine-components-slide">
      <header className="mantine-detail-header">
        <span>Mantine · Components in Practice</span>
        <h1>이미 목적별 컴포넌트가 준비되어 있다</h1>
        <p>기본 input부터 직접 조립하기보다, 필요한 역할의 컴포넌트를 바로 선택해서 사용</p>
      </header>

      <div className="mantine-component-comparison">
        <article className="mantine-basic-side">
          <span className="mantine-card-kicker">직접 기본 요소로 만든다면</span>
          <h2>HTML input부터 시작</h2>
          <pre><code>{`<input type="text" />
<input type="email" />
<input type="password" />
<input type="number" />`}</code></pre>
          <p>각 입력의 목적, 스타일, 검증, 비밀번호 표시 기능 등을 직접 추가해야 합니다.</p>
          <ul className="mantine-build-checklist">
            <li>일반 텍스트 입력</li>
            <li>이메일 형식 입력</li>
            <li>비밀번호 입력</li>
            <li>숫자 입력</li>
            <li>추가 동작은 직접 구현</li>
          </ul>
        </article>

        <div className="mantine-comparison-arrow" aria-hidden="true"><b>→</b><span>역할 선택</span></div>

        <article className="mantine-ready-side">
          <span className="mantine-card-kicker">Mantine을 사용한다면</span>
          <h2>회원가입에 필요한 입력을 목적별로 선택</h2>
          <div className="mantine-purpose-grid">
            {componentExamples.map((item, index) => (
              <div key={`${item.name}-${index}`} className={`mantine-purpose-item${item.featured ? ' featured' : ''}`}>
                <div className="mantine-purpose-heading">
                  <code>{item.name}</code>
                  <span>{item.purpose}</span>
                </div>
                <div className="mantine-field-mock" aria-label={`${item.label} ${item.purpose}`}>
                  <small>{item.label}</small>
                  <strong>{item.value}</strong>
                  {item.icon && <em>{item.icon}</em>}
                </div>
              </div>
            ))}
          </div>
          <p className="mantine-choice-message">입력마다 필요한 형태를 고르기만 하면 된다</p>
        </article>
      </div>

      <section className="mantine-speed-logic" aria-label="Mantine으로 입력 화면을 빠르게 만드는 이유">
        <div><small>직접 만들면</small><strong>기본 input + 추가 기능 구현</strong></div>
        <b aria-hidden="true">→</b>
        <div><small>Mantine이면</small><strong>목적별 컴포넌트 선택</strong></div>
        <b aria-hidden="true">→</b>
        <div className="result"><small>그래서 빠름</small><strong>입력 UI 설계 시간이 줄어듦</strong></div>
      </section>

      <footer className="mantine-detail-conclusion">
        <strong>화면에서 자주 필요한 UI가 목적별 컴포넌트로 이미 준비되어 있다.</strong>
        <span>회원가입·예약·관리자 화면처럼 반복해서 만드는 UI를 처음부터 구현하는 시간을 줄일 수 있습니다.</span>
      </footer>
    </section>
  )
}

export function MantineWorkflowExample() {
  return (
    <section className="mantine-detail-slide mantine-workflow-slide">
      <header className="mantine-detail-header">
        <span>Mantine · One Connected Ecosystem</span>
        <h1>UI뿐 아니라 자주 쓰는 동작까지 같이 제공한다</h1>
        <p>컴포넌트를 만들고, 움직이고, 결과를 알려주는 기능을 한 생태계에서 연결</p>
      </header>

      <div className="mantine-workflow-grid" aria-label="회원 정보 수정 구현 흐름">
        <article className="mantine-workflow-card">
          <span>01 · Component</span>
          <h2>수정 버튼과 Modal</h2>
          <pre><code>{`<Button>회원 정보 수정</Button>
<Modal>회원 정보 수정 Form</Modal>`}</code></pre>
          <p>Button과 Modal 같은 UI를 사용</p>
        </article>
        <div className="mantine-workflow-arrow" aria-hidden="true">→</div>
        <article className="mantine-workflow-card">
          <span>02 · Hook</span>
          <h2>열기 / 닫기 상태</h2>
          <pre><code>{`const [opened, { open, close }] =
  useDisclosure(false)`}</code></pre>
          <p>Modal의 열기/닫기 상태를 관리</p>
        </article>
        <div className="mantine-workflow-arrow" aria-hidden="true">→</div>
        <article className="mantine-workflow-card">
          <span>03 · Utility</span>
          <h2>저장 완료 알림</h2>
          <pre><code>{`notifications.show({
  title: '저장 완료',
  message: '회원 정보가 저장되었습니다.'
})`}</code></pre>
          <p>저장이 끝나면 알림 표시</p>
        </article>
      </div>

      <div className="mantine-user-flow">
        <span>수정 버튼 클릭</span><b>→</b><span>Modal 열기</span><b>→</b><span>정보 수정</span><b>→</b><span>저장</span><b>→</b><strong>‘저장 완료’ 알림</strong>
      </div>

      <div className="mantine-support-grid" aria-label="Mantine 보조 기능 예시">
        {supportingExamples.map(example => (
          <article key={example.code}>
            <code>{example.code}</code>
            <strong>{example.label}</strong>
          </article>
        ))}
      </div>

      <footer className="mantine-detail-conclusion mantine-workflow-conclusion">
        <strong>Mantine이 빠른 이유는 단순히 컴포넌트 수가 많아서가 아니다.</strong>
        <span>자주 만드는 UI + 상태 관리 + 부가 기능을 이미 준비해 두어 개발자가 기능을 처음부터 다시 만드는 작업을 줄여줍니다.</span>
      </footer>
    </section>
  )
}

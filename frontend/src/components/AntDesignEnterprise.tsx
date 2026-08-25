import './AntDesignEnterprise.css'

interface AntDesignEnterpriseProps {
  onBack: () => void
  onNext: () => void
}

const directWork = [
  ['검색', 'Input UI + CSS 직접 구현'], ['상태 선택', 'Select UI + 상태 직접 구현'],
  ['사용자 목록', 'Table 구조 + 행/열 스타일 구현'], ['입력 검증', 'validation 로직 직접 구현'],
  ['팝업', 'Modal UI + open/close 상태 구현'], ['페이지 이동', 'Pagination UI + 페이지 상태 구현'],
]

const antWork = [
  ['검색', 'Input.Search'], ['상태 선택', 'Select'], ['사용자 목록', 'Table'],
  ['입력 검증', 'Form.Item rules'], ['팝업', 'Modal / Drawer'], ['페이지 이동', 'Pagination'],
]

export function AntDesignEnterprise({ onBack, onNext }: AntDesignEnterpriseProps) {
  return (
    <div className="ant-enterprise">
      <header className="ant-enterprise-hero">
        <span>Ant Design · Enterprise UI</span>
        <h1>왜 Ant Design은 관리자 화면에 강할까?</h1>
        <p>기업 업무에서 반복되는 UI와 동작을 이미 만들어진 컴포넌트로 제공하기 때문입니다.</p>
      </header>

      <section className="ant-enterprise-intro">
        <span>기업용 관리자 화면에는 검색·입력·검증·표·필터·팝업·페이지 이동이 함께 필요합니다.</span>
        <span>Ant Design은 이런 기능을 같은 디자인 시스템 안의 컴포넌트로 제공합니다.</span>
        <strong>그래서 실제 개발이 왜 빨라질까?</strong>
      </section>

      <section className="ant-work-compare">
        <article>
          <h2>직접 구현한다면</h2>
          <div>{directWork.map(([task, work]) => <p key={task}><strong>{task}</strong><span>→ {work}</span></p>)}</div>
          <footer>각 기능의 UI와 동작을 직접 연결해야 함</footer>
        </article>
        <div className="ant-compare-arrow" aria-hidden="true">→</div>
        <article className="ant-work-ready">
          <h2>Ant Design을 사용한다면</h2>
          <div>{antWork.map(([task, component]) => <p key={task}><strong>{task}</strong><span>→ {component}</span></p>)}</div>
          <footer>컴포넌트를 조합해 화면의 기본 골격을 빠르게 구성</footer>
        </article>
      </section>

      <section className="ant-important">
        빠른 이유는 코드를 전혀 작성하지 않아서가 아니라, 반복적으로 만드는 UI와 기본 동작을 처음부터 다시 구현할 필요가 줄어들기 때문입니다.
      </section>

      <section className="ant-concrete-grid">
        <article className="ant-equation">
          <h2>사용자 관리 화면 =</h2>
          <div>{['Input.Search', 'Select', 'Button', 'Table', 'Tag', 'Form', 'Modal', 'Pagination'].map(item => <span key={item}>{item}</span>)}</div>
          <p>이름 검색 → Input.Search · 상태 선택 → Select · 사용자 목록 → Table · 상태 표시 → Tag</p>
          <p>새 사용자 → Form + Modal · 수정/삭제 → Button + Popconfirm · 페이지 이동 → Pagination</p>
          <small>앞에서 본 사용자 관리 화면도 이런 컴포넌트들을 조합해서 구성할 수 있습니다.</small>
        </article>

        <article className="ant-validation">
          <h2>예: 입력 검증도 컴포넌트 안에서</h2>
          <div>
            <pre><code>{`<Form.Item
  name="email"
  rules={[
    { required: true, message: "이메일을 입력하세요" },
    { type: "email", message: "이메일 형식이 아닙니다" }
  ]}
>
  <Input />
</Form.Item>`}</code></pre>
            <ul>
              <li><strong>required</strong> → 필수 입력 검사</li>
              <li><strong>type: "email"</strong> → 이메일 형식 검사</li>
              <li><strong>message</strong> → 오류 메시지</li>
            </ul>
          </div>
        </article>
      </section>

      <nav className="ant-enterprise-nav" aria-label="Ant Design 설명 화면 이동">
        <button type="button" onClick={onBack}>← Demo</button>
        <span>2 · 왜 Ant Design?</span>
        <button type="button" className="ant-enterprise-next" onClick={onNext}>Chakra UI →</button>
      </nav>
    </div>
  )
}

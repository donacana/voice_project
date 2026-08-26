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

      <section className="ant-enterprise-detail-grid" aria-label="관리자 화면 구성과 Form validation 예시">
        <article className="ant-admin-needs-card">
          <span className="ant-detail-label">직접 구현 범위</span>
          <h2>관리자 화면을 직접 만든다면</h2>
          <p>사용자 관리 화면에 필요한 UI와 상태, 동작을 각각 연결해야 합니다.</p>

          <ul className="ant-admin-needs-list">
            {['검색', '상태 선택', '사용자 목록', '입력 검증', '팝업', '페이지 이동'].map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="ant-component-chips" aria-label="Ant Design 관련 컴포넌트">
            {['Input', 'Select', 'Table', 'Form', 'Modal', 'Pagination'].map(item => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </article>

        <article className="ant-form-example-card">
          <span className="ant-detail-label">Ant Design에서는</span>
          <h2>Form.Item 안에 validation 규칙 작성</h2>
          <pre className="ant-form-code"><code>{`<Form.Item
  name="email"
  rules={[
    { required: true, message: "이메일을 입력하세요" },
    { type: "email", message: "이메일 형식이 아닙니다" }
  ]}
>
  <Input />
</Form.Item>`}</code></pre>

          <ul className="ant-validation-rules">
            <li><strong>required</strong><span>필수 입력 검사</span></li>
            <li><strong>type: "email"</strong><span>이메일 형식 검사</span></li>
            <li><strong>message</strong><span>오류 메시지</span></li>
          </ul>
        </article>
      </section>

      <section className="ant-important">
        반복되는 UI와 기본 동작을 컴포넌트로 조합하므로, 관리자 화면을 처음부터 다시 구현하는 범위가 줄어듭니다.
      </section>

      <nav className="ant-enterprise-nav" aria-label="Ant Design 설명 화면 이동">
        <button type="button" onClick={onBack}>← Demo</button>
        <span>2 · 왜 Ant Design?</span>
        <button type="button" className="ant-enterprise-next" onClick={onNext}>Chakra UI →</button>
      </nav>
    </div>
  )
}

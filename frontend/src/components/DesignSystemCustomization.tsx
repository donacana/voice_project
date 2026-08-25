import './DesignSystemCustomization.css'

interface DesignSystemCustomizationProps {
  onBack: () => void
  onNext: () => void
}

const methods = [
  {
    name: 'sx',
    label: '개별 컴포넌트 수정',
    description: '한두 개 컴포넌트의 스타일을 빠르게 바꿀 때 사용합니다.',
    code: `<Button
  sx={{
    backgroundColor: "purple",
    borderRadius: "30px",
    fontSize: "18px"
  }}
>
  로그인
</Button>`,
    conclusion: '빠르지만 여러 곳에서 반복하면 관리가 복잡해질 수 있음',
  },
  {
    name: 'theme',
    label: '프로젝트 전체 규칙 수정',
    description: '같은 컴포넌트의 기본 스타일을 프로젝트 전체에서 통일해서 바꿀 때 사용합니다.',
    code: `const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "30px"
        }
      }
    }
  }
});`,
    conclusion: '일관성은 좋지만 Theme 구조와 override 규칙을 알아야 함',
  },
  {
    name: 'styled',
    label: '재사용할 커스텀 컴포넌트',
    description: 'MUI 컴포넌트를 기반으로 새로운 스타일의 재사용 컴포넌트를 만들 때 사용합니다.',
    code: `const MyButton = styled(Button)({
  backgroundColor: "purple",
  borderRadius: "30px",
  padding: "12px 30px",
  fontWeight: "bold"
});`,
    conclusion: '재사용하기 좋지만 별도의 스타일 컴포넌트 구조가 생김',
  },
]

export function DesignSystemCustomization({ onBack, onNext }: DesignSystemCustomizationProps) {
  return (
    <div className="ds-customization">
      <header className="ds-customization-hero">
        <span>Design Systems · Customization</span>
        <h1>왜 완성형 Design System은 커스터마이징이 더 복잡할까?</h1>
        <p>이미 정해진 디자인 규칙이 있기 때문에, 수정 범위에 따라 적절한 커스터마이징 방식을 선택해야 합니다.</p>
      </header>

      <section className="ds-direct-comparison" aria-label="일반 버튼의 직접 스타일 수정 예시">
        <article>
          <h2>일반적인 버튼</h2>
          <p>직접 만든 컴포넌트라면 필요한 스타일 값을 바로 수정할 수 있습니다.</p>
          <pre><code>{`<button>
  로그인
</button>`}</code></pre>
        </article>

        <div className="ds-direct-connection" aria-hidden="true">
          <span>값만 바꾸면 됨</span>
          <b>→</b>
        </div>

        <article className="ds-direct-comparison-result">
          <h2>값을 직접 수정</h2>
          <p>색상, 둥글기, 글자 크기 같은 값을 원하는 값으로 바꾸면 됩니다.</p>
          <pre><code>{`<button
  style={{
    backgroundColor: "purple",
    borderRadius: "30px",
    fontSize: "18px"
  }}
>
  로그인
</button>`}</code></pre>
        </article>
      </section>

      <div className="ds-customization-bridge">
        하지만 MUI처럼 완성된 디자인 시스템에서는 수정 범위에 따라 sx, theme, styled 같은 방식을 선택해서 사용합니다.
      </div>

      <section className="ds-customization-methods" aria-label="MUI 커스터마이징 방식">
        {methods.map(method => (
          <article key={method.name} className="ds-customization-card">
            <div className="ds-customization-card-title">
              <h2>{method.name}</h2>
              <span>{method.label}</span>
            </div>
            <p>{method.description}</p>
            <pre><code>{method.code}</code></pre>
            <strong>{method.conclusion}</strong>
          </article>
        ))}
      </section>

      <section className="ds-customization-comparison" aria-label="Chakra UI와 MUI 비교">
        <div>
          <span>Chakra UI</span>
          <strong>스타일 값을 props처럼 가까운 곳에서 바로 작성</strong>
          <p>직접적이고 빠른 스타일 수정에 편리</p>
        </div>
        <div>
          <span>MUI</span>
          <strong>수정 범위에 따라 sx / theme / styled 같은 방식을 선택</strong>
          <p>강한 디자인 일관성과 다양한 커스터마이징 체계를 제공</p>
        </div>
      </section>

      <section className="ds-customization-conclusion">
        <strong>완성형 디자인 시스템의 장점은 강한 일관성이고, 그 대가로 커스터마이징 규칙을 익혀야 할 수 있습니다.</strong>
        <small>즉 MUI가 수정하기 어려운 것이 아니라, 수정 방법이 체계화되어 있어 학습해야 할 규칙이 더 많다는 의미입니다.</small>
      </section>

      <nav className="ds-customization-nav" aria-label="커스터마이징 설명 화면 이동">
        <button type="button" onClick={onBack}>← Chakra UI</button>
        <span>Customization</span>
        <button type="button" className="ds-customization-next" onClick={onNext}>비교 정리 →</button>
      </nav>
    </div>
  )
}

import Button from '@mui/material/Button'
import { createTheme, styled, ThemeProvider } from '@mui/material/styles'
import './DesignSystemCustomization.css'

interface DesignSystemCustomizationProps {
  onBack: () => void
  onNext: () => void
}

const demoTheme = createTheme({
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: '30px' } } },
  },
})

const ReusableButton = styled(Button)({
  backgroundColor: '#7c3aed',
  borderRadius: '30px',
  padding: '12px 30px',
})

const methods = [
  {
    name: 'sx',
    label: '한두 컴포넌트 빠른 수정',
    description: '수정할 컴포넌트 가까이에서 바로 스타일을 바꿉니다.',
    code: `<Button sx={{
  bgcolor: "#7c3aed",
  borderRadius: "30px",
  fontSize: "18px"
}}>
  로그인
</Button>`,
    preview: <Button variant="contained" sx={{ bgcolor: '#7c3aed', borderRadius: '30px', fontSize: '18px' }}>로그인</Button>,
  },
  {
    name: 'theme',
    label: '프로젝트 전체 규칙',
    description: '같은 컴포넌트의 기본 규칙을 앱 전체에서 통일합니다.',
    code: `const theme = createTheme({
  components: {
    MuiButton: { styleOverrides: {
      root: { borderRadius: "30px" }
    }}
  }
});`,
    preview: <ThemeProvider theme={demoTheme}><Button variant="contained">모든 버튼</Button></ThemeProvider>,
  },
  {
    name: 'styled',
    label: '재사용 커스텀 컴포넌트',
    description: '새로운 이름의 재사용 컴포넌트를 만들어 반복 사용합니다.',
    code: `const MyButton = styled(Button)({
  backgroundColor: "#7c3aed",
  borderRadius: "30px",
  padding: "12px 30px"
});`,
    preview: <ReusableButton variant="contained">MyButton</ReusableButton>,
  },
]

export function DesignSystemCustomization({ onBack, onNext }: DesignSystemCustomizationProps) {
  return (
    <div className="ds-customization">
      <header className="ds-customization-hero">
        <span>Design Systems · Customization</span>
        <h1>수정 범위에 따라 커스터마이징 방식을 선택한다</h1>
        <p>한 컴포넌트, 프로젝트 전체, 재사용 컴포넌트는 서로 다른 도구가 더 적합합니다.</p>
      </header>

      <section className="ds-direct-comparison" aria-label="일반 버튼의 직접 스타일 수정 예시">
        <article>
          <h2>일반적인 버튼</h2>
          <p>직접 만든 컴포넌트라면 필요한 값을 바로 수정합니다.</p>
          <pre><code>{`<button>
  로그인
</button>`}</code></pre>
        </article>

        <div className="ds-direct-connection" aria-hidden="true"><span>값만 변경</span><b>→</b></div>

        <article className="ds-direct-comparison-result">
          <h2>값을 직접 수정</h2>
          <p>색상·radius·font-size가 즉시 결과에 반영됩니다.</p>
          <pre><code>{`<button style={{
  background: "purple",
  borderRadius: "30px",
  fontSize: "18px"
}}>`}</code></pre>
        </article>
      </section>

      <div className="ds-customization-bridge">
        하지만 MUI처럼 완성된 디자인 시스템에서는 수정 범위에 따라 sx, theme, styled 같은 방식을 선택해서 사용합니다.
      </div>

      <section className="ds-customization-methods" aria-label="MUI 커스터마이징 방식">
        {methods.map(method => (
          <article key={method.name} className="ds-customization-card">
            <div className="ds-customization-card-title"><h2>{method.name}</h2><span>{method.label}</span></div>
            <p>{method.description}</p>
            <pre><code>{method.code}</code></pre>
            <div className="customization-live-preview">{method.preview}</div>
          </article>
        ))}
      </section>

      <nav className="ds-customization-nav" aria-label="커스터마이징 설명 화면 이동">
        <button type="button" onClick={onBack}>← Chakra UI</button>
        <span>Customization</span>
        <button type="button" className="ds-customization-next" onClick={onNext}>비교 정리 →</button>
      </nav>
    </div>
  )
}

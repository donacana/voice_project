import './UILibraryConcept.css'

interface UILibraryConceptProps {
  onBack: () => void
  onNext: () => void
}

const figmaParts = ['Button', 'Card', 'Input', 'Dialog']
const reactParts = ['<Button />', '<Card />', '<TextField />', '<Dialog />']

export function UILibraryConcept({ onBack, onNext }: UILibraryConceptProps) {
  return (
    <div className="ui-concept">
      <header className="ui-concept-hero">
        <span className="ui-concept-kicker">UI Library Basics</span>
        <h1>UI 라이브러리를 이해하는 두 관점</h1>
        <p>디자인 단계의 UI 부품과 개발 단계의 실제 컴포넌트를 연결해서 이해할 수 있습니다.</p>
      </header>

      <section className="ui-concept-flow" aria-label="디자인 단계에서 개발 단계로 이어지는 과정">
        <article className="ui-concept-card">
          <span className="ui-concept-stage">디자인 단계</span>
          <h2>Figma UI Kit</h2>
          <p>화면을 구현하기 전에 버튼, 카드, 입력창 같은 UI 부품을 사용해 디자인을 구성합니다.</p>
          <div className="ui-concept-parts">
            {figmaParts.map(part => <span key={part}>{part}</span>)}
          </div>
          <strong>어떻게 보일지 설계</strong>
        </article>

        <div className="ui-concept-connection" aria-hidden="true">
          <span>디자인</span>
          <b>→</b>
          <span>실제 구현</span>
        </div>

        <article className="ui-concept-card ui-concept-card--implementation">
          <span className="ui-concept-stage">개발 단계</span>
          <h2>React Components</h2>
          <p>실제 웹사이트에서 동작하는 React 컴포넌트를 import해서 화면을 구현합니다.</p>
          <div className="ui-concept-parts ui-concept-parts--code">
            {reactParts.map(part => <code key={part}>{part}</code>)}
          </div>
          <strong>실제로 동작하도록 구현</strong>
        </article>
      </section>

      <section className="ui-concept-message">
        <strong>
          일부 UI 라이브러리는 Figma에서 사용할 디자인 키트와 실제 React 컴포넌트를 함께 제공해
          디자인과 구현의 차이를 줄일 수 있습니다.
        </strong>
        <small>모든 라이브러리가 공식 Figma UI Kit을 제공하는 것은 아닙니다.</small>
      </section>

      <p className="ui-concept-bridge">
        그렇다면 React UI 라이브러리들은 어떤 방식으로 컴포넌트를 제공할까요?
      </p>

      <nav className="ui-concept-nav" aria-label="UI 라이브러리 개념 화면 이동">
        <button type="button" onClick={onBack}>← Previous</button>
        <span>Figma UI Kit → React Components</span>
        <button type="button" className="ui-concept-next" onClick={onNext}>Overview →</button>
      </nav>
    </div>
  )
}

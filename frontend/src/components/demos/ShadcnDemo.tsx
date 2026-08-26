import './TailwindLibrarySlide.css'

interface ShadcnDemoProps {
  screen?: 1 | 2
}

function ShadcnSourceOwnership() {
  return (
    <div className="tailwind-library-page split-library-page shadcn-source-page">
      <header className="tailwind-library-hero split-library-hero">
        <span>Tailwind-Based · Source Ownership</span>
        <h1>shadcn/ui</h1>
        <p>컴포넌트 코드를 프로젝트 안으로 가져와 개발자가 직접 소유하고 수정하는 방식</p>
      </header>

      <section className="tailwind-library-comparison shadcn-comparison split-comparison ownership-comparison">
        <article>
          <span>Package Dependency</span>
          <h2>일반 라이브러리</h2>
          <code className="split-command">npm install</code>
          <pre><code>{`node_modules
└── Library
    └── Button
        ↓
    import Button`}</code></pre>
          <p className="card-caption">라이브러리가 컴포넌트 내부 코드를 관리</p>
        </article>
        <div className="comparison-arrow" aria-hidden="true"><b>VS</b></div>
        <article className="accent-card">
          <span>Source Ownership</span>
          <h2>shadcn/ui</h2>
          <code className="split-command">npx shadcn add button</code>
          <pre><code>{`src
└── components
    └── ui
        └── button.tsx
              ↓
      button.tsx 직접 수정`}</code></pre>
          <p className="card-caption strong-caption">컴포넌트 코드 자체가 내 프로젝트에 들어옴</p>
        </article>
      </section>

      <section className="ownership-conclusion" aria-label="소유권 비교 결론">
        <p><strong>일반 라이브러리</strong><span>라이브러리가 컴포넌트 내부 코드를 관리</span></p>
        <p><strong>shadcn/ui</strong><span>컴포넌트 코드 자체가 내 프로젝트에 들어옴</span></p>
      </section>

      <div className="source-statement split-takeaway">
        코드를 사용하는 것이 아니라 <strong>코드를 가져와 소유한다.</strong>
      </div>
    </div>
  )
}

function ShadcnCustomization() {
  return (
    <div className="tailwind-library-page split-library-page shadcn-customization-page">
      <header className="tailwind-library-hero split-library-hero">
        <span>shadcn/ui · Customization</span>
        <h1>shadcn/ui</h1>
        <p>내 코드가 되었기 때문에 직접 수정할 수 있다</p>
      </header>

      <section className="shadcn-customization-flow" aria-label="shadcn 컴포넌트 수정 흐름">
        <article className="shadcn-source-card">
          <span className="split-card-eyebrow">Source Code</span>
          <h2>button.tsx</h2>
          <pre><code>{`const buttonVariants = cva(
  "inline-flex font-medium",
  {
    variants: { variant, size },
    className
  }
)`}</code></pre>
        </article>

        <div className="customization-arrow" aria-hidden="true">
          <b>→</b>
          <span>직접 수정</span>
        </div>

        <article className="shadcn-result-card accent-card">
          <span className="split-card-eyebrow">My Component</span>
          <h2>내 버튼</h2>
          <div className="owned-button-preview">
            <button type="button">저장</button>
          </div>
          <div className="customization-chips">
            {['border radius', 'padding', 'font', 'color', 'variant'].map(item => <span key={item}>{item}</span>)}
          </div>
        </article>
      </section>

      <section className="tailwind-library-tradeoffs split-tradeoffs">
        <article><h3>장점</h3><ul><li>코드 전체를 직접 수정 가능</li><li>라이브러리 구조에 덜 묶임</li><li>필요한 컴포넌트만 가져옴</li></ul></article>
        <article><h3>Trade-off</h3><ul><li>업데이트를 자동으로 받는 구조와 다름</li><li>가져온 코드는 프로젝트에서 직접 관리</li></ul></article>
      </section>

      <footer className="tailwind-library-takeaway split-takeaway">
        shadcn/ui의 핵심은 <strong>컴포넌트의 소유권이 개발자에게 있다는 것</strong>입니다.
      </footer>
    </div>
  )
}

export function ShadcnDemo({ screen = 1 }: ShadcnDemoProps) {
  return screen === 1 ? <ShadcnSourceOwnership /> : <ShadcnCustomization />
}

import './TailwindLibrarySlide.css'

export function ShadcnDemo() {
  return (
    <div className="tailwind-library-page">
      <header className="tailwind-library-hero">
        <span>Tailwind-Based · Source Ownership</span>
        <h1>shadcn/ui</h1>
        <p>컴포넌트 코드를 프로젝트 안으로 가져와 개발자가 직접 소유하고 수정하는 방식</p>
      </header>

      <section className="tailwind-library-core two-part-core">
        <p><strong>일반 라이브러리</strong><code>npm install</code><span>패키지를 의존해서 사용</span></p>
        <b>VS</b>
        <p><strong>shadcn/ui</strong><code>npx shadcn add button</code><span>실제 button.tsx가 프로젝트에 생성</span></p>
      </section>

      <section className="tailwind-library-comparison shadcn-comparison">
        <article>
          <span>Package Dependency</span><h2>일반 라이브러리</h2>
          <pre><code>{`node_modules
└── Library
    └── Button
        ↓
    import Button
        ↓
      <Button />`}</code></pre>
          <p className="card-caption">컴포넌트 내부 코드는 라이브러리가 관리</p>
        </article>
        <div className="comparison-arrow"><b>VS</b></div>
        <article className="accent-card">
          <span>Source Ownership</span><h2>shadcn/ui</h2>
          <pre><code>{`src
└── components
    └── ui
        └── button.tsx
              ↓
      button.tsx 직접 열기
              ↓
      구조 / 스타일 / 기능 수정`}</code></pre>
          <p className="card-caption strong-caption">컴포넌트 코드의 모든 줄을 내가 직접 수정 가능</p>
        </article>
      </section>

      <div className="source-statement">컴포넌트 코드 자체가 <strong>내 프로젝트</strong>에 들어온다</div>

      <section className="tailwind-library-tradeoffs">
        <article><h3>장점</h3><ul className="four-items"><li>코드 모든 줄 수정 가능</li><li>프로젝트 전용 variant 추가</li><li>필요 없는 코드 삭제</li><li>자체 디자인 시스템에 깊게 맞춤</li></ul></article>
        <article><h3>한계</h3><ul><li>가져온 코드의 유지보수 책임도 개발자에게 있음</li></ul></article>
      </section>

      <footer className="tailwind-library-takeaway">일반 라이브러리는 컴포넌트를 빌려 쓰고, <strong>shadcn/ui는 코드를 가져와 직접 소유한다.</strong></footer>
    </div>
  )
}

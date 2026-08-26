import React from 'react'

const pillars = [
  { title: 'Components', items: ['Button · Modal', 'Table · Form', 'DatePicker · Spotlight'] },
  { title: 'Hooks', items: ['useDisclosure', 'useDebouncedValue', 'useMediaQuery'] },
  { title: 'Utilities', items: ['Notifications', 'Dates', 'Form helpers'] },
]

export const MantineDemo: React.FC = () => (
  <section className="mantine-category-slide">
    <header className="mantine-category-header">
      <span>Fast Development / All-in-One</span>
      <h1>Mantine</h1>
      <p>설치 후 바로 쓸 수 있는 기능이 많은, 하나로 연결된 React UI 생태계</p>
    </header>

    <div className="mantine-pillar-grid">
      {pillars.map((pillar, index) => (
        <article key={pillar.title} className="mantine-pillar">
          <span className="mantine-pillar-number">0{index + 1}</span>
          <h2>{pillar.title}</h2>
          <ul>{pillar.items.map(item => <li key={item}>{item}</li>)}</ul>
        </article>
      ))}
    </div>

    <div className="mantine-takeaway">
      컴포넌트 + Hooks + Utilities를 한 생태계에서 제공 → 기능을 따로 조합하는 시간을 줄여 빠른 개발에 유리
    </div>
  </section>
)

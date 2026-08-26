import { CategoryKey, LibraryKey } from '../contexts/LectureContext'
import { categories, getCategoryLibraries, LibraryMeta } from '../data/libraryData'

interface CategoryLectureProps {
  category: CategoryKey
  onLibrarySelect: (key: LibraryKey) => void
  onOpenOfficialSite: (url: string) => void
}

export function CategoryLecture({ category, onLibrarySelect, onOpenOfficialSite }: CategoryLectureProps) {
  const cat = categories.find(c => c.key === category)
  const libs = getCategoryLibraries(category)
  const isDesignSystemsSummary = category === 'design-systems'
  const isTailwindSummary = category === 'tailwind-based'
  const isUnstyledSummary = category === 'unstyled-primitives'
  const isCategorySummary = isDesignSystemsSummary || isTailwindSummary || isUnstyledSummary

  if (!cat) return null

  return (
    <div className="category-lecture">
      <div className="lecture-header">
        <span className="lecture-kicker">Category Lecture</span>
        <h1>
          {isDesignSystemsSummary
            ? 'Design Systems 한눈에 비교'
            : isTailwindSummary
              ? 'Tailwind-Based 한눈에 비교'
              : isUnstyledSummary
                ? 'Unstyled / Primitives 한눈에 비교'
                : cat.name}
        </h1>
        <p className="lecture-subtitle">
          {isDesignSystemsSummary
            ? '세 라이브러리의 특징과 적합한 사용처를 한 화면에서 비교합니다.'
            : isTailwindSummary
              ? '세 라이브러리의 Tailwind 활용 방식과 개발자 제어 수준을 비교합니다.'
              : isUnstyledSummary
                ? '세 라이브러리의 접근성, 프리미티브 구성 방식, 스타일 제어 수준을 비교합니다.'
                : cat.why}
        </p>
      </div>

      <div className="category-comparison-grid">
        {libs.map((lib: LibraryMeta) => (
          <div key={lib.key} className="library-comparison-card">
            <div className="comparison-card-header">
              <h2>{lib.name}</h2>
              <p className="comparison-identity">{lib.identity}</p>
            </div>

            <div className="comparison-teaching">
              <h3>{isCategorySummary ? '핵심 특징' : lib.teaching.title}</h3>
              <ul>
                {lib.teaching.points.slice(0, 3).map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
              {!isCategorySummary && (
                <div className="comparison-example">
                  <span className="example-label">Example</span>
                  <p>{lib.teaching.example}</p>
                </div>
              )}
            </div>

            <div className="comparison-facts">
              <div className="fact-row">
                <span className="fact-label">{isDesignSystemsSummary ? '강점' : 'Strength'}</span>
                <span className="fact-value">{lib.strength}</span>
              </div>
              <div className="fact-row">
                <span className="fact-label">Trade-off</span>
                <span className="fact-value">{lib.tradeoff}</span>
              </div>
              <div className="fact-row">
                <span className="fact-label">Use Case</span>
                <span className="fact-value">{lib.useCase}</span>
              </div>
            </div>

            {!isCategorySummary && (
              <div className="comparison-actions">
                <button
                  className="action-btn primary"
                  onClick={() => onLibrarySelect(lib.key)}
                >
                  Details
                </button>
                <button
                  className="action-btn"
                  onClick={() => onOpenOfficialSite(lib.officialSite)}
                >
                  Official Site ↗
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

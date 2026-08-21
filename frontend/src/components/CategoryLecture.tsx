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

  if (!cat) return null

  return (
    <div className="category-lecture">
      <div className="lecture-header">
        <span className="lecture-kicker">Category Lecture</span>
        <h1>{cat.name}</h1>
        <p className="lecture-subtitle">{cat.why}</p>
      </div>

      <div className="category-comparison-grid">
        {libs.map((lib: LibraryMeta) => (
          <div key={lib.key} className="library-comparison-card">
            <div className="comparison-card-header">
              <h2>{lib.name}</h2>
              <p className="comparison-identity">{lib.identity}</p>
            </div>

            <div className="comparison-teaching">
              <h3>{lib.teaching.title}</h3>
              <ul>
                {lib.teaching.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
              <div className="comparison-example">
                <span className="example-label">Example</span>
                <p>{lib.teaching.example}</p>
              </div>
            </div>

            <div className="comparison-facts">
              <div className="fact-row">
                <span className="fact-label">Strength</span>
                <span className="fact-value">{lib.strength}</span>
              </div>
              <div className="fact-row">
                <span className="fact-label">Trade-off</span>
                <span className="fact-value">{lib.tradeoff}</span>
              </div>
              <div className="fact-row">
                <span className="fact-label">Use case</span>
                <span className="fact-value">{lib.useCase}</span>
              </div>
            </div>

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
          </div>
        ))}
      </div>
    </div>
  )
}
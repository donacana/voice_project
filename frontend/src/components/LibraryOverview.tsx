import { LibraryKey } from '../contexts/LectureContext'
import { categories, CategoryKey } from '../data/libraryData'

interface LibraryOverviewProps {
  onLibrarySelect: (key: LibraryKey) => void
  onCategorySelect: (category: CategoryKey) => void
}

export function LibraryOverview({ onLibrarySelect, onCategorySelect }: LibraryOverviewProps) {
  return (
    <div className="library-overview">
      <div className="lecture-header">
        <span className="lecture-kicker">10 Libraries · 4 Categories</span>
        <h1>Best React UI Libraries in 2026</h1>
        <p className="lecture-subtitle">
          React UI 라이브러리 선택이 중요한 이유와 4가지 카테고리로 나눈 비교 강의입니다.
          음성 또는 버튼으로 강의를 탐색하세요.
        </p>
      </div>

      <div className="category-overview-grid">
        {categories.map(cat => (
          <div key={cat.key} className="category-overview-card">
            <div className="category-overview-header">
              <h2>{cat.name}</h2>
              <p className="category-why">{cat.why}</p>
            </div>
            <div className="category-overview-libraries">
              {cat.libraries.map(key => (
                <button
                  key={key}
                  className="category-library-chip"
                  onClick={() => onLibrarySelect(key)}
                >
                  {key === 'material-ui' && 'Material UI'}
                  {key === 'ant-design' && 'Ant Design'}
                  {key === 'chakra-ui' && 'Chakra UI'}
                  {key === 'shadcn' && 'shadcn/ui'}
                  {key === 'daisyui' && 'daisyUI'}
                  {key === 'headless-ui' && 'Headless UI'}
                  {key === 'react-aria' && 'React Aria'}
                  {key === 'radix-ui' && 'Radix UI'}
                  {key === 'base-ui' && 'Base UI'}
                  {key === 'mantine' && 'Mantine'}
                </button>
              ))}
            </div>
            <button
              className="category-lecture-btn"
              onClick={() => onCategorySelect(cat.key)}
            >
              {cat.name} 강의 보기 →
            </button>
          </div>
        ))}
      </div>

      <div className="overview-info">
        <p className="info-text">
          각 카테고리 강의에서 라이브러리를 비교하고, 각 라이브러리의 상세 화면에서
          고유한 특징을 확인할 수 있습니다.
        </p>
      </div>
    </div>
  )
}
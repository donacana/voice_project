import { LibraryKey } from '../contexts/LectureContext'

interface DecisionGuideProps {
  onLibrarySelect: (key: LibraryKey) => void
}

const branches = [
  {
    question: '완성된 디자인 시스템이 필요한가?',
    answer: 'Material UI / Ant Design / Chakra UI',
    distinctions: [
      { label: '엔터프라이즈·데이터 중심', value: 'Ant Design', key: 'ant-design' as LibraryKey },
      { label: 'Material Design 생태계', value: 'Material UI', key: 'material-ui' as LibraryKey },
      { label: '개발자 친화적 커스터마이징', value: 'Chakra UI', key: 'chakra-ui' as LibraryKey },
    ],
  },
  {
    question: 'Tailwind를 사용하는가?',
    answer: 'shadcn/ui / daisyUI / Headless UI',
    distinctions: [
      { label: '코드 소유권', value: 'shadcn/ui', key: 'shadcn' as LibraryKey },
      { label: '간단한 Tailwind 클래스', value: 'daisyUI', key: 'daisyui' as LibraryKey },
      { label: 'Headless Tailwind 컴포넌트', value: 'Headless UI', key: 'headless-ui' as LibraryKey },
    ],
  },
  {
    question: '직접 디자인 시스템을 만드는가?',
    answer: 'React Aria / Radix UI / Base UI',
    distinctions: [
      { label: '접근성 동작', value: 'React Aria', key: 'react-aria' as LibraryKey },
      { label: '접근성 프리미티브', value: 'Radix UI / Base UI', key: 'radix-ui' as LibraryKey },
    ],
  },
  {
    question: '빠른 개발 / 올인원이 필요한가?',
    answer: 'Mantine',
    distinctions: [
      { label: '올인원 생산성', value: 'Mantine', key: 'mantine' as LibraryKey },
    ],
  },
]

export function DecisionGuide({ onLibrarySelect }: DecisionGuideProps) {
  return (
    <div className="decision-guide">
      <div className="lecture-header">
        <span className="lecture-kicker">Final Decision Guide</span>
        <h1>어떤 라이브러리를 선택할까?</h1>
        <p className="lecture-subtitle">
          상황에 맞는 라이브러리를 빠르게 선택하는 최종 가이드
        </p>
      </div>

      <div className="decision-branches">
        {branches.map((branch, i) => (
          <div key={i} className="decision-branch">
            <div className="decision-question">
              <span className="branch-number">{i + 1}</span>
              <h2>{branch.question}</h2>
              <p className="branch-answer">→ {branch.answer}</p>
            </div>
            <div className="branch-distinctions">
              {branch.distinctions.map((d, j) => (
                <button
                  key={j}
                  className="distinction-chip"
                  onClick={() => onLibrarySelect(d.key)}
                >
                  <span className="distinction-label">{d.label}</span>
                  <span className="distinction-value">{d.value}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
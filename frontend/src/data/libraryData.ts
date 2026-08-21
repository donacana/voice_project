import { LibraryKey } from '../contexts/LectureContext'

export type CategoryKey =
  | 'design-systems'
  | 'tailwind-based'
  | 'unstyled-primitives'
  | 'fast-development'

export interface CategoryInfo {
  key: CategoryKey
  name: string
  why: string
  libraries: LibraryKey[]
}

export interface LibraryMeta {
  key: LibraryKey
  name: string
  category: CategoryKey
  identity: string
  strength: string
  tradeoff: string
  useCase: string
  officialSite: string
  teaching: {
    title: string
    points: string[]
    example: string
  }
}

export const categories: CategoryInfo[] = [
  {
    key: 'design-systems',
    name: 'Design Systems',
    why: '완성된 디자인 언어와 컴포넌트 생태계를 제공해 빠르게 일관된 UI를 만든다.',
    libraries: ['material-ui', 'ant-design', 'chakra-ui'],
  },
  {
    key: 'tailwind-based',
    name: 'Tailwind-Based',
    why: 'Tailwind CSS 워크플로우 위에서 스타일링과 컴포넌트를 제공한다.',
    libraries: ['shadcn', 'daisyui', 'headless-ui'],
  },
  {
    key: 'unstyled-primitives',
    name: 'Unstyled / Primitives',
    why: '스타일 없이 동작과 접근성만 제공해 직접 디자인 시스템을 만들 수 있다.',
    libraries: ['react-aria', 'radix-ui', 'base-ui'],
  },
  {
    key: 'fast-development',
    name: 'Fast Development / All-in-One',
    why: '컴포넌트·훅·유틸리티를 한 번에 제공해 생산성을 극대화한다.',
    libraries: ['mantine'],
  },
]

export const libraryMeta: Record<LibraryKey, LibraryMeta> = {
  'material-ui': {
    key: 'material-ui',
    name: 'Material UI',
    category: 'design-systems',
    identity: 'Google Material Design 기반의 대형 컴포넌트 생태계',
    strength: '방대한 컴포넌트와 강력한 테마 시스템으로 빠른 개발',
    tradeoff: 'Material 고유의 시각 언어가 커스터마이징의 제약이 될 수 있음',
    useCase: 'Material Design을 따르는 프로덕션 앱',
    officialSite: 'https://mui.com/material-ui/',
    teaching: {
      title: 'Material Design 언어와 테마',
      points: [
        'Google Material Design 기반',
        '대규모 프로덕션 컴포넌트 생태계',
        '강력한 테마 시스템',
        '빠른 개발에 유리',
      ],
      example: 'Material 스타일의 카드·버튼·내비게이션 예시',
    },
  },
  'ant-design': {
    key: 'ant-design',
    name: 'Ant Design',
    category: 'design-systems',
    identity: '엔터프라이즈·관리자 UI에 특화된 시스템',
    strength: '테이블·폼·필터 등 비즈니스 UI 패턴이 강력',
    tradeoff: '엔터프라이즈 스타일이 강해 일반 앱에는 무거울 수 있음',
    useCase: '관리자 페이지·대시보드·데이터 중심 앱',
    officialSite: 'https://ant.design/',
    teaching: {
      title: '엔터프라이즈 관리자 UI',
      points: [
        '데이터 테이블·상태 배지·필터',
        '비즈니스 폼 패턴',
        '강한 TypeScript 생태계',
        '대시보드에 최적화',
      ],
      example: '데이터 테이블·상태 배지·필터가 있는 관리자 화면 예시',
    },
  },
  'chakra-ui': {
    key: 'chakra-ui',
    name: 'Chakra UI',
    category: 'design-systems',
    identity: '개발자 경험과 접근성에 집중한 컴포저블 시스템',
    strength: '컴포저블 컴포넌트와 쉬운 커스터마이징',
    tradeoff: '완전한 디자인 언어보다는 유연한 기반에 가까움',
    useCase: '커스텀 디자인 시스템을 빠르게 만들 때',
    officialSite: 'https://chakra-ui.com/',
    teaching: {
      title: '개발자 경험과 쉬운 커스터마이징',
      points: [
        '접근성 기반 컴포넌트',
        '컴포저블 구조',
        '편리한 스타일링',
        '커스텀 디자인 시스템 구축에 유리',
      ],
      example: '간단한 컴포넌트를 빠르게 커스터마이징하는 예시',
    },
  },
  shadcn: {
    key: 'shadcn',
    name: 'shadcn/ui',
    category: 'tailwind-based',
    identity: '컴포넌트 소스가 프로젝트 안에 존재하는 코드 소유 방식',
    strength: '컴포넌트 코드를 직접 소유·수정 가능',
    tradeoff: '패키지가 아니라 복사·붙여넣기 방식이라 관리가 필요',
    useCase: 'Tailwind와 함께 높은 커스터마이징 자유도가 필요할 때',
    officialSite: 'https://ui.shadcn.com/',
    teaching: {
      title: '코드 소유권(Code Ownership)',
      points: [
        '전통 라이브러리: import from dependency',
        'shadcn/ui: 소스가 프로젝트 안에 존재',
        '직접 편집 가능',
        'Tailwind CSS와 함께 사용',
      ],
      example: '전통 import 방식 vs 프로젝트 내 소스 소유 방식 비교',
    },
  },
  daisyui: {
    key: 'daisyui',
    name: 'daisyUI',
    category: 'tailwind-based',
    identity: 'Tailwind 위에 컴포넌트 클래스를 제공',
    strength: '긴 유틸리티 클래스를 짧은 컴포넌트 클래스로 축약',
    tradeoff: 'Tailwind에 의존하며 커스터마이징은 클래스 기반',
    useCase: 'Tailwind 워크플로우를 유지하며 빠르게 스타일링할 때',
    officialSite: 'https://daisyui.com/',
    teaching: {
      title: 'Tailwind 클래스 축약',
      points: [
        'Tailwind만: 긴 유틸리티 클래스 문자열',
        'daisyUI: class="btn btn-primary"',
        '테마 지원',
        'Tailwind 워크플로우 유지',
      ],
      example: '긴 Tailwind 클래스 vs 짧은 daisyUI 클래스 비교',
    },
  },
  'headless-ui': {
    key: 'headless-ui',
    name: 'Headless UI',
    category: 'tailwind-based',
    identity: '스타일 없는 접근성 컴포넌트',
    strength: '동작과 상호작용만 제공, 스타일은 개발자가 제어',
    tradeoff: '스타일을 직접 모두 만들어야 함',
    useCase: 'Tailwind와 함께 커스텀 UI를 만들 때',
    officialSite: 'https://headlessui.com/',
    teaching: {
      title: 'Headless의 의미',
      points: [
        '스타일 없는 컴포넌트',
        '동작·상호작용 제공',
        '개발자가 스타일 제어',
        'Tailwind와 자연스럽게 결합',
      ],
      example: '스타일 없는 컴포넌트 → 개발자 스타일링 → 최종 커스텀 UI',
    },
  },
  'react-aria': {
    key: 'react-aria',
    name: 'React Aria',
    category: 'unstyled-primitives',
    identity: '접근성 우선의 훅 기반 라이브러리',
    strength: '키보드 내비게이션·포커스·스크린리더 지원',
    tradeoff: '시각 디자인은 전혀 제공하지 않음',
    useCase: '접근성 높은 커스텀 컴포넌트를 만들 때',
    officialSite: 'https://react-spectrum.adobe.com/react-aria/',
    teaching: {
      title: '접근성 우선 동작',
      points: [
        '키보드 내비게이션',
        '포커스 관리',
        '스크린리더 지원',
        '동작·접근성에 집중',
      ],
      example: 'Tab/화살표 키로 포커스가 올바르게 이동하는 예시',
    },
  },
  'radix-ui': {
    key: 'radix-ui',
    name: 'Radix UI',
    category: 'unstyled-primitives',
    identity: '저수준 접근성 UI 프리미티브',
    strength: 'Dialog·Popover·Dropdown 등 접근성 프리미티브',
    tradeoff: '스타일이 없어 직접 디자인해야 함',
    useCase: '커스텀 디자인 시스템의 기반으로 사용할 때',
    officialSite: 'https://www.radix-ui.com/',
    teaching: {
      title: '프리미티브 → 디자인 시스템',
      points: [
        'Dialog·Popover·Dropdown 등',
        '스타일 없음',
        '완전한 스타일 제어',
        '커스텀 디자인 시스템 기반',
      ],
      example: 'Radix 프리미티브 → 커스텀 스타일링 → 디자인 시스템 컴포넌트',
    },
  },
  'base-ui': {
    key: 'base-ui',
    name: 'Base UI',
    category: 'unstyled-primitives',
    identity: '유연한 컴포지션의 스타일 없는 프리미티브',
    strength: '다양한 스타일링 방식과 함께 동작',
    tradeoff: '시각 디자인이 없어 직접 구성해야 함',
    useCase: '강한 동작은 필요하되 디자인은 직접 하고 싶을 때',
    officialSite: 'https://base-ui.com/',
    teaching: {
      title: '같은 프리미티브, 다른 스타일',
      points: [
        '스타일 없는 컴포넌트',
        '유연한 컴포지션',
        '접근성 기반',
        '다양한 스타일링 방식 지원',
      ],
      example: '같은 프리미티브를 두 가지 다른 스타일로 보여주는 예시',
    },
  },
  mantine: {
    key: 'mantine',
    name: 'Mantine',
    category: 'fast-development',
    identity: '컴포넌트·훅·유틸리티를 모두 갖춘 올인원',
    strength: '대형 컴포넌트 컬렉션과 훅·유틸리티 포함',
    tradeoff: '프리미티브부터 직접 만들고 싶다면 과할 수 있음',
    useCase: '생산성이 우선일 때 빠른 앱 개발',
    officialSite: 'https://mantine.dev/',
    teaching: {
      title: '올인원 생태계',
      points: [
        '대형 컴포넌트 컬렉션',
        '훅 포함',
        '유용한 유틸리티',
        '빠른 앱 개발',
      ],
      example: 'Component + Hook + Utility가 하나로 통합된 예시',
    },
  },
}

export function getCategoryLibraries(category: CategoryKey): LibraryMeta[] {
  const cat = categories.find(c => c.key === category)
  if (!cat) return []
  return cat.libraries.map(key => libraryMeta[key])
}

export function getLibraryCategory(key: LibraryKey): CategoryKey {
  return libraryMeta[key].category
}
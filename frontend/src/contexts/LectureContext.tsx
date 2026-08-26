import { createContext, useContext, useState, ReactNode } from 'react'

export type ContentType = 'introduction' | 'features_use_case' | 'comparison' | 'install' | 'example'
export type LectureScreen =
  | 'intro'
  | 'ui-library-concept'
  | 'library-overview'
  | 'material-ui-overview'
  | 'mui-core-vs-x'
  | 'mui-x-detail'
  | 'ant-design-enterprise'
  | 'design-system-customization'
  | 'tailwind-overview'
  | 'headless-ui-interaction'
  | 'shadcn-customization'
  | 'mantine-components'
  | 'mantine-workflow'
  | 'category-lecture'
  | 'library-demo'
  | 'lecture-content'
  | 'decision-guide'
  | 'closing'
export type LibraryKey =
  | 'material-ui'
  | 'ant-design'
  | 'chakra-ui'
  | 'shadcn'
  | 'daisyui'
  | 'headless-ui'
  | 'react-aria'
  | 'radix-ui'
  | 'base-ui'
  | 'mantine'
export type CategoryKey =
  | 'design-systems'
  | 'tailwind-based'
  | 'unstyled-primitives'
  | 'fast-development'

interface LectureContextType {
  currentLibrary: LibraryKey
  setCurrentLibrary: (library: LibraryKey) => void
  currentContentType: ContentType
  setCurrentContentType: (type: ContentType) => void
  currentScreen: LectureScreen
  setCurrentScreen: (screen: LectureScreen) => void
  currentCategory: CategoryKey
  setCurrentCategory: (category: CategoryKey) => void
  previousLibrary: LibraryKey | null
  setPreviousLibrary: (library: LibraryKey | null) => void
  previousScreen: LectureScreen | null
  setPreviousScreen: (screen: LectureScreen | null) => void
}

const LectureContext = createContext<LectureContextType | undefined>(undefined)

export function LectureProvider({ children }: { children: ReactNode }) {
  const [currentLibrary, setCurrentLibrary] = useState<LibraryKey>('material-ui')
  const [currentContentType, setCurrentContentType] = useState<ContentType>('introduction')
  const [currentScreen, setCurrentScreen] = useState<LectureScreen>('intro')
  const [currentCategory, setCurrentCategory] = useState<CategoryKey>('design-systems')
  const [previousLibrary, setPreviousLibrary] = useState<LibraryKey | null>(null)
  const [previousScreen, setPreviousScreen] = useState<LectureScreen | null>(null)

  return (
    <LectureContext.Provider
      value={{
        currentLibrary,
        setCurrentLibrary,
        currentContentType,
        setCurrentContentType,
        currentScreen,
        setCurrentScreen,
        currentCategory,
        setCurrentCategory,
        previousLibrary,
        setPreviousLibrary,
        previousScreen,
        setPreviousScreen
      }}
    >
      {children}
    </LectureContext.Provider>
  )
}

export function useLecture() {
  const context = useContext(LectureContext)
  if (!context) {
    throw new Error('useLecture must be used within LectureProvider')
  }
  return context
}

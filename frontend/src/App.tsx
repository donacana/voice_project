import { useEffect, useRef, useState } from 'react'
import { MaterialUIDemo } from './components/demos/MaterialUIDemo'
import { AntDesignDemo } from './components/demos/AntDesignDemo'
import { ChakraUIDemo } from './components/demos/ChakraUIDemo'
import { ShadcnDemo } from './components/demos/ShadcnDemo'
import { DaisyUIDemo } from './components/demos/DaisyUIDemo'
import { HeadlessUIDemo } from './components/demos/HeadlessUIDemo'
import { ReactAriaDemo } from './components/demos/ReactAriaDemo'
import { RadixUIDemo } from './components/demos/RadixUIDemo'
import { BaseUIDemo } from './components/demos/BaseUIDemo'
import { MantineDemo } from './components/demos/MantineDemo'
import { MantineComponentsExample, MantineWorkflowExample } from './components/demos/MantineDetailSlides'
import { MainLayout } from './components/MainLayout'
import { IntroScreen } from './components/IntroScreen'
import { UILibraryConcept } from './components/UILibraryConcept'
import { LibraryOverview } from './components/LibraryOverview'
import { MaterialUIOverview } from './components/MaterialUIOverview'
import { MUICoreVsX } from './components/MUICoreVsX'
import { MUIXDetail } from './components/MUIXDetail'
import { AntDesignEnterprise } from './components/AntDesignEnterprise'
import { DesignSystemCustomization } from './components/DesignSystemCustomization'
import { TailwindOverview } from './components/TailwindOverview'
import { CategoryLecture } from './components/CategoryLecture'
import { DecisionGuide } from './components/DecisionGuide'
import { Closing } from './components/Closing'
import { LectureContentPanel } from './components/LectureContentPanel'
import { getLectureContent } from './data/lectureData'
import { useLecture, LectureScreen, LibraryKey, ContentType, CategoryKey } from './contexts/LectureContext'
import { categories, libraryMeta } from './data/libraryData'
import { checkHealth } from './services/api'
import { CommandReceiver, CommandAction, RemoteStatus } from './services/voice'
import './App.css'
import './components/PresentationSlides.css'
import './components/demos/DemoSlides.css'

const libraries: { key: LibraryKey; name: string }[] = [
  { key: 'material-ui', name: 'Material UI' },
  { key: 'ant-design', name: 'Ant Design' },
  { key: 'chakra-ui', name: 'Chakra UI' },
  { key: 'shadcn', name: 'shadcn/ui' },
  { key: 'daisyui', name: 'daisyUI' },
  { key: 'headless-ui', name: 'Headless UI' },
  { key: 'react-aria', name: 'React Aria' },
  { key: 'radix-ui', name: 'Radix UI' },
  { key: 'base-ui', name: 'Base UI' },
  { key: 'mantine', name: 'Mantine' }
]

const demoComponents: Record<LibraryKey, React.FC> = {
  'material-ui': MaterialUIDemo,
  'ant-design': AntDesignDemo,
  'chakra-ui': ChakraUIDemo,
  'shadcn': ShadcnDemo,
  'daisyui': DaisyUIDemo,
  'headless-ui': HeadlessUIDemo,
  'react-aria': ReactAriaDemo,
  'radix-ui': RadixUIDemo,
  'base-ui': BaseUIDemo,
  'mantine': MantineDemo
}

function App() {
  const {
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
  } = useLecture()
  const [remoteStatus, setRemoteStatus] = useState<RemoteStatus>('offline')
  const [backendStatus, setBackendStatus] = useState<string>('')

  // PHASE 14: synchronous mirror of navigation state so rapid voice commands
  // always read the freshest library/screen (PHASE 12 race protection).
  const navRef = useRef({
    currentLibrary,
    currentScreen,
    currentContentType,
    currentCategory,
    previousLibrary: previousLibrary as LibraryKey | null,
    previousScreen: null as LectureScreen | null,
  })
  const commandRef = useRef<CommandReceiver | null>(null)
  const presentationContentRef = useRef<HTMLDivElement | null>(null)
  const hasPresentationMountedRef = useRef(false)

  useEffect(() => {
    navRef.current = {
      currentLibrary,
      currentScreen,
      currentContentType,
      currentCategory,
      previousLibrary,
      previousScreen,
    }
    // Keep the CommandReceiver context in sync with navigation state.
    // Do NOT reconnect the WebSocket on navigation - only update context.
    commandRef.current?.updateContext({
      current_library: currentLibrary,
      previous_library: previousLibrary,
      current_screen: currentScreen,
      current_content_type: currentContentType,
    })
  }, [currentLibrary, currentScreen, currentContentType, currentCategory, previousLibrary, previousScreen])

  useEffect(() => {
    checkHealth()
      .then(() => setBackendStatus('Backend: OK'))
      .catch(() => setBackendStatus('Backend: Offline'))
  }, [])

  // Scroll only when the actual presentation location changes. Demo-local
  // interactions do not update these values, so they never trigger scrolling.
  useEffect(() => {
    if (!hasPresentationMountedRef.current) {
      hasPresentationMountedRef.current = true
      return
    }

    const frame = window.requestAnimationFrame(() => {
      presentationContentRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [currentScreen, currentLibrary, currentCategory, currentContentType])

  const navigate = (screen: LectureScreen, library: LibraryKey) => {
    const prev = navRef.current

    setPreviousScreen(prev.currentScreen)
    setPreviousLibrary(prev.currentLibrary)

    prev.previousScreen = prev.currentScreen
    prev.previousLibrary = prev.currentLibrary

    if (library !== prev.currentLibrary) {
      setCurrentLibrary(library)
      setCurrentContentType('introduction')
      prev.currentLibrary = library
      prev.currentContentType = 'introduction'
    }

    setCurrentScreen(screen)
    prev.currentScreen = screen
  }

  const handleLibrarySelect = (key: LibraryKey) => navigate('library-demo', key)

  // The presentation overview introduces Material UI before showing its demo.
  // Other library selections keep their existing direct-to-demo behavior.
  const handleOverviewLibrarySelect = (key: LibraryKey) => {
    if (key === 'material-ui') {
      navigate('material-ui-overview', key)
      return
    }
    handleLibrarySelect(key)
  }

  const handleCategorySelect = (category: CategoryKey) => {
    setCurrentCategory(category)
    const firstLib = categories.find(c => c.key === category)?.libraries[0]
    if (firstLib) {
      navigate(
        category === 'design-systems'
          ? 'material-ui-overview'
          : category === 'tailwind-based'
            ? 'tailwind-overview'
            : category === 'unstyled-primitives'
              ? 'library-demo'
              : 'library-demo',
        firstLib
      )
    }
  }

  const showDesignSystemsSummary = () => {
    setCurrentCategory('design-systems')
    navigate('category-lecture', 'chakra-ui')
  }

  const showTailwindSummary = () => {
    setCurrentCategory('tailwind-based')
    navigate('category-lecture', 'shadcn')
  }

  const showUnstyledSummary = () => {
    setCurrentCategory('unstyled-primitives')
    navigate('category-lecture', 'base-ui')
  }

  const handleNextCategory = () => {
    const idx = categories.findIndex(c => c.key === navRef.current.currentCategory)
    if (idx < categories.length - 1) {
      handleCategorySelect(categories[idx + 1].key)
    } else {
      navigate('decision-guide', navRef.current.currentLibrary)
    }
  }

  const handlePrevCategory = () => {
    const idx = categories.findIndex(c => c.key === navRef.current.currentCategory)
    if (idx > 0) {
      handleCategorySelect(categories[idx - 1].key)
    }
  }

  const handleNextLibrary = () => {
    if (navRef.current.currentLibrary === 'mantine') {
      if (navRef.current.currentScreen === 'library-demo') {
        navigate('mantine-components', 'mantine')
      } else if (navRef.current.currentScreen === 'mantine-components') {
        navigate('mantine-workflow', 'mantine')
      } else {
        navigate('decision-guide', 'mantine')
      }
      return
    }
    if (
      navRef.current.currentLibrary === 'ant-design'
      && (navRef.current.currentScreen === 'library-demo'
        || navRef.current.currentScreen === 'lecture-content')
    ) {
      navigate('ant-design-enterprise', 'ant-design')
      return
    }
    if (
      navRef.current.currentLibrary === 'chakra-ui'
      && (navRef.current.currentScreen === 'library-demo'
        || navRef.current.currentScreen === 'lecture-content')
    ) {
      navigate('design-system-customization', 'chakra-ui')
      return
    }
    if (navRef.current.currentLibrary === 'headless-ui') {
      if (navRef.current.currentScreen === 'library-demo') {
        navigate('headless-ui-interaction', 'headless-ui')
      } else {
        handleLibrarySelect('shadcn')
      }
      return
    }
    if (
      navRef.current.currentLibrary === 'shadcn'
    ) {
      if (navRef.current.currentScreen === 'library-demo') {
        navigate('shadcn-customization', 'shadcn')
      } else {
        showTailwindSummary()
      }
      return
    }
    if (
      navRef.current.currentLibrary === 'base-ui'
      && (navRef.current.currentScreen === 'library-demo'
        || navRef.current.currentScreen === 'lecture-content')
    ) {
      showUnstyledSummary()
      return
    }
    const currentIndex = libraries.findIndex(lib => lib.key === navRef.current.currentLibrary)
    if (currentIndex < libraries.length - 1) {
      handleLibrarySelect(libraries[currentIndex + 1].key)
    }
  }

  const handlePrevLibrary = () => {
    if (navRef.current.currentLibrary === 'mantine') {
      if (navRef.current.currentScreen === 'mantine-workflow') {
        navigate('mantine-components', 'mantine')
      } else if (navRef.current.currentScreen === 'mantine-components') {
        navigate('library-demo', 'mantine')
      } else {
        showUnstyledSummary()
      }
      return
    }
    if (navRef.current.currentLibrary === 'chakra-ui') {
      navigate('ant-design-enterprise', 'ant-design')
      return
    }
    if (navRef.current.currentLibrary === 'daisyui') {
      navigate('tailwind-overview', 'daisyui')
      return
    }
    if (
      navRef.current.currentLibrary === 'headless-ui'
      && navRef.current.currentScreen === 'headless-ui-interaction'
    ) {
      navigate('library-demo', 'headless-ui')
      return
    }
    if (navRef.current.currentLibrary === 'shadcn') {
      if (navRef.current.currentScreen === 'shadcn-customization') {
        navigate('library-demo', 'shadcn')
      } else {
        navigate('headless-ui-interaction', 'headless-ui')
      }
      return
    }
    const currentIndex = libraries.findIndex(lib => lib.key === navRef.current.currentLibrary)
    if (currentIndex > 0) {
      handleLibrarySelect(libraries[currentIndex - 1].key)
    }
  }

  const handleDemoPrevious = () => {
    if (navRef.current.currentLibrary === 'material-ui') {
      navigate('mui-x-detail', 'material-ui')
      return
    }
    handlePrevLibrary()
  }

  const handlePresentationPrevious = () => {
    if (
      navRef.current.currentScreen === 'category-lecture'
      && navRef.current.currentCategory === 'tailwind-based'
    ) {
      navigate('shadcn-customization', 'shadcn')
      return
    }
    handlePrevCategory()
  }

  const handleDecisionGuidePrevious = () => {
    navigate('mantine-workflow', 'mantine')
  }

  const openOfficialSite = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleOpenCurrentOfficialSite = () => {
    const meta = libraryMeta[navRef.current.currentLibrary]
    if (meta) openOfficialSite(meta.officialSite)
  }

  // PHASE 14: normalized backend action -> existing React navigation functions.
  const handleVoiceAction = (action: CommandAction, _text: string, _intent: string) => {
    const nav = navRef.current
    switch (action.action) {
      case 'NEXT':
        if (nav.currentScreen === 'intro') {
          navigate('ui-library-concept', nav.currentLibrary)
        } else if (nav.currentScreen === 'ui-library-concept') {
          navigate('library-overview', nav.currentLibrary)
        } else if (nav.currentScreen === 'library-overview') {
          navigate('material-ui-overview', 'material-ui')
        } else if (nav.currentScreen === 'material-ui-overview') {
          navigate('mui-core-vs-x', 'material-ui')
        } else if (nav.currentScreen === 'mui-core-vs-x') {
          navigate('mui-x-detail', 'material-ui')
        } else if (nav.currentScreen === 'mui-x-detail') {
          navigate('library-demo', 'material-ui')
        } else if (nav.currentScreen === 'ant-design-enterprise') {
          navigate('library-demo', 'chakra-ui')
        } else if (nav.currentScreen === 'design-system-customization') {
          showDesignSystemsSummary()
        } else if (nav.currentScreen === 'decision-guide') {
          navigate('closing', nav.currentLibrary)
        } else if (nav.currentScreen === 'tailwind-overview') {
          navigate('library-demo', 'daisyui')
        } else if (nav.currentScreen === 'category-lecture') {
          handleNextCategory()
        } else {
          handleNextLibrary()
        }
        break
      case 'PREVIOUS':
        if (nav.currentScreen === 'library-overview') {
          navigate('ui-library-concept', nav.currentLibrary)
        } else if (nav.currentScreen === 'ui-library-concept') {
          navigate('intro', nav.currentLibrary)
        } else if (nav.currentScreen === 'material-ui-overview') {
          navigate('library-overview', 'material-ui')
        } else if (nav.currentScreen === 'mui-core-vs-x') {
          navigate('material-ui-overview', 'material-ui')
        } else if (nav.currentScreen === 'mui-x-detail') {
          navigate('mui-core-vs-x', 'material-ui')
        } else if (nav.currentScreen === 'ant-design-enterprise') {
          navigate('library-demo', 'ant-design')
        } else if (
          nav.currentScreen === 'library-demo'
          && nav.currentLibrary === 'material-ui'
        ) {
          navigate('mui-x-detail', 'material-ui')
        } else if (
          nav.currentScreen === 'category-lecture'
        ) {
          handlePresentationPrevious()
        } else if (nav.currentScreen === 'design-system-customization') {
          navigate('library-demo', 'chakra-ui')
        } else if (nav.currentScreen === 'decision-guide') {
          handleDecisionGuidePrevious()
        } else if (nav.currentScreen === 'closing') {
          navigate('decision-guide', nav.currentLibrary)
        } else if (nav.currentScreen === 'tailwind-overview') {
          showDesignSystemsSummary()
        } else {
          handlePrevLibrary()
        }
        break
      case 'HOME':
        navigate('intro', nav.currentLibrary)
        break
      case 'OVERVIEW':
        navigate('library-overview', nav.currentLibrary)
        break
      case 'NEXT_CATEGORY':
        handleNextCategory()
        break
      case 'PREV_CATEGORY':
        handlePrevCategory()
        break
      case 'SHOW_MUI_OVERVIEW':
        navigate('material-ui-overview', 'material-ui')
        break
      case 'SHOW_DEMO':
        navigate('library-demo', nav.currentLibrary)
        break
      case 'SHOW_LECTURE':
        navigate('lecture-content', nav.currentLibrary)
        if (action.content_type) setCurrentContentType(action.content_type as ContentType)
        break
      case 'SHOW_INSTALL':
        navigate('lecture-content', nav.currentLibrary)
        setCurrentContentType('install')
        break
      case 'SELECT_LIBRARY':
        if (action.library_key) {
          navigate(
            (action.screen as LectureScreen) ?? 'library-demo',
            action.library_key as LibraryKey
          )
          if (action.content_type) setCurrentContentType(action.content_type as ContentType)
        }
        break
      case 'SEARCH_RESULT':
        if (action.library_key) {
          navigate('lecture-content', action.library_key as LibraryKey)
          if (action.content_type) setCurrentContentType(action.content_type as ContentType)
        }
        break
      case 'OPEN_OFFICIAL_SITE':
        if (action.library_key) {
          const meta = libraryMeta[action.library_key as LibraryKey]
          if (meta) openOfficialSite(meta.officialSite)
        } else {
          handleOpenCurrentOfficialSite()
        }
        break
      case 'DECISION_GUIDE':
        navigate('decision-guide', nav.currentLibrary)
        break
      case 'CLOSING':
        navigate('closing', nav.currentLibrary)
        break
      default:
        break
    }
  }

  // Connect the React lecture client to the FastAPI command WebSocket.
  useEffect(() => {
    if (!commandRef.current) {
      commandRef.current = new CommandReceiver(
        {
          onAction: handleVoiceAction,
          onRemoteStatus: setRemoteStatus,
          onError: (msg) => console.error('Command error:', msg),
        },
        {
          current_library: navRef.current.currentLibrary,
          previous_library: navRef.current.previousLibrary,
          current_screen: navRef.current.currentScreen,
          current_content_type: navRef.current.currentContentType,
        }
      )
    }
    commandRef.current.connect()
    return () => {
      commandRef.current?.close()
      commandRef.current = null
    }
  }, [])

  const DemoComponent = demoComponents[currentLibrary]
  const libraryName = libraries.find(lib => lib.key === currentLibrary)?.name || 'Unknown'
  const lectureContent = getLectureContent(currentLibrary, currentContentType)
  const showDesignSystemsSteps = (
    currentScreen === 'material-ui-overview'
    || currentScreen === 'mui-core-vs-x'
    || currentScreen === 'mui-x-detail'
    || currentScreen === 'ant-design-enterprise'
    || currentScreen === 'design-system-customization'
    || currentScreen === 'library-demo'
    || currentScreen === 'lecture-content'
    || (currentScreen === 'category-lecture' && currentCategory === 'design-systems')
  ) && ['material-ui', 'ant-design', 'chakra-ui'].includes(currentLibrary)
  const designSystemsStep = currentScreen === 'category-lecture'
    ? 'summary'
    : currentScreen === 'design-system-customization'
      ? 'customization'
      : currentLibrary
  const showTailwindSteps = (
    currentScreen === 'tailwind-overview'
    || currentScreen === 'headless-ui-interaction'
    || currentScreen === 'shadcn-customization'
    || currentScreen === 'library-demo'
    || currentScreen === 'lecture-content'
    || (currentScreen === 'category-lecture' && currentCategory === 'tailwind-based')
  ) && ['daisyui', 'headless-ui', 'shadcn'].includes(currentLibrary)
  const tailwindStep = currentScreen === 'category-lecture'
    ? 'summary'
    : currentScreen === 'tailwind-overview'
      ? 'tailwind'
      : currentLibrary
  const showUnstyledSteps = (
    currentScreen === 'library-demo'
    || currentScreen === 'lecture-content'
    || (currentScreen === 'category-lecture' && currentCategory === 'unstyled-primitives')
  ) && ['react-aria', 'radix-ui', 'base-ui'].includes(currentLibrary)
  const unstyledStep = currentScreen === 'category-lecture'
    ? 'summary'
      : currentLibrary
  const showMuiInternalSteps = currentLibrary === 'material-ui' && (
    currentScreen === 'material-ui-overview'
    || currentScreen === 'mui-core-vs-x'
    || currentScreen === 'mui-x-detail'
    || currentScreen === 'library-demo'
  )
  const muiInternalStep = currentScreen === 'library-demo' ? 'demo' : currentScreen
  const showAntInternalSteps = (
    (currentScreen === 'library-demo' && currentLibrary === 'ant-design')
    || currentScreen === 'ant-design-enterprise'
  )
  const currentCategoryIndex = categories.findIndex(category => category.key === currentCategory)
  const isFirstCategory = currentCategoryIndex <= 0
  const isLastCategory = currentCategoryIndex === categories.length - 1
  const demoLocationLabel = currentScreen === 'mantine-components'
    ? 'Mantine 2 / 3 · Components'
    : currentScreen === 'mantine-workflow'
      ? 'Mantine 3 / 3 · Workflow'
      : currentLibrary === 'mantine'
        ? 'Fast Development / All-in-One · Mantine'
        : currentScreen === 'headless-ui-interaction'
      ? 'Headless UI 2 / 2'
      : currentScreen === 'shadcn-customization'
        ? 'shadcn/ui 2 / 2'
        : currentScreen === 'library-demo' && currentLibrary === 'headless-ui'
          ? 'Headless UI 1 / 2'
          : currentScreen === 'library-demo' && currentLibrary === 'shadcn'
            ? 'shadcn/ui 1 / 2'
            : libraryName
  const isSplitTailwindPresentation = (
    currentScreen === 'headless-ui-interaction'
    || currentScreen === 'shadcn-customization'
    || (currentScreen === 'library-demo' && ['headless-ui', 'shadcn'].includes(currentLibrary))
  )
  const isMantineDetailPresentation = currentScreen === 'mantine-components'
    || currentScreen === 'mantine-workflow'
  const isDemoPresentation = currentScreen === 'library-demo'
    || currentScreen === 'headless-ui-interaction'
    || currentScreen === 'shadcn-customization'
    || isMantineDetailPresentation
  const demoPreviousLabel = currentScreen === 'mantine-components'
    ? '← Mantine 개요'
    : currentScreen === 'mantine-workflow'
      ? '← Mantine 실제 예시 1'
      : currentScreen === 'headless-ui-interaction'
        ? '← Headless UI 1 / 2'
        : currentScreen === 'shadcn-customization'
          ? '← shadcn/ui 1 / 2'
          : '← Previous'
  const demoNextLabel = currentScreen === 'mantine-components'
    ? '실제 예시 2 →'
    : currentScreen === 'mantine-workflow'
      ? 'Decision Guide →'
      : currentScreen === 'headless-ui-interaction'
        ? 'shadcn/ui →'
        : currentScreen === 'shadcn-customization'
          ? '비교 정리 →'
          : currentLibrary === 'mantine'
            ? '실제 예시 1 →'
            : 'Next →'

  return (
    <MainLayout
      _title="React UI Voice Lecture"
      backendStatus={backendStatus}
      remoteStatus={remoteStatus}
    >
      <div ref={presentationContentRef} className="presentation-content">
      {showDesignSystemsSteps && (
        <nav className="design-systems-steps" aria-label="Design Systems presentation steps">
          <button
            className={designSystemsStep === 'material-ui' ? 'active' : ''}
            onClick={() => navigate('material-ui-overview', 'material-ui')}
          >
            Material UI
          </button>
          <button
            className={designSystemsStep === 'ant-design' ? 'active' : ''}
            onClick={() => navigate('library-demo', 'ant-design')}
          >
            Ant Design
          </button>
          <button
            className={designSystemsStep === 'chakra-ui' ? 'active' : ''}
            onClick={() => navigate('library-demo', 'chakra-ui')}
          >
            Chakra UI
          </button>
          <button
            className={designSystemsStep === 'customization' ? 'active' : ''}
            onClick={() => navigate('design-system-customization', 'chakra-ui')}
          >
            커스터마이징
          </button>
          <button
            className={designSystemsStep === 'summary' ? 'active' : ''}
            onClick={showDesignSystemsSummary}
          >
            비교 정리
          </button>
        </nav>
      )}

      {showMuiInternalSteps && (
        <div className="mui-internal-steps" aria-label="Material UI 내부 진행 단계">
          <span className={muiInternalStep === 'material-ui-overview' ? 'active' : ''}>1. 개념</span>
          <span className={muiInternalStep === 'mui-core-vs-x' ? 'active' : ''}>2. Core / X</span>
          <span className={muiInternalStep === 'mui-x-detail' ? 'active' : ''}>3. MUI X</span>
          <span className={muiInternalStep === 'demo' ? 'active' : ''}>4. Demo</span>
        </div>
      )}

      {showAntInternalSteps && (
        <div className="mui-internal-steps" aria-label="Ant Design 내부 진행 단계">
          <span className={currentScreen === 'library-demo' ? 'active' : ''}>1. Demo</span>
          <span className={currentScreen === 'ant-design-enterprise' ? 'active' : ''}>2. 왜 Ant Design?</span>
        </div>
      )}

      {showTailwindSteps && (
        <nav className="design-systems-steps" aria-label="Tailwind-Based presentation steps">
          <button
            className={tailwindStep === 'tailwind' ? 'active' : ''}
            onClick={() => navigate('tailwind-overview', 'daisyui')}
          >
            Tailwind
          </button>
          <button
            className={tailwindStep === 'daisyui' ? 'active' : ''}
            onClick={() => navigate('library-demo', 'daisyui')}
          >
            daisyUI
          </button>
          <button
            className={tailwindStep === 'headless-ui' ? 'active' : ''}
            onClick={() => navigate('library-demo', 'headless-ui')}
          >
            Headless UI
          </button>
          <button
            className={tailwindStep === 'shadcn' ? 'active' : ''}
            onClick={() => navigate('library-demo', 'shadcn')}
          >
            shadcn/ui
          </button>
          <button
            className={tailwindStep === 'summary' ? 'active' : ''}
            onClick={showTailwindSummary}
          >
            비교 정리
          </button>
        </nav>
      )}

      {showUnstyledSteps && (
        <nav className="design-systems-steps" aria-label="Unstyled and Primitives presentation steps">
          <button
            className={unstyledStep === 'react-aria' ? 'active' : ''}
            onClick={() => navigate('library-demo', 'react-aria')}
          >
            React Aria
          </button>
          <button
            className={unstyledStep === 'radix-ui' ? 'active' : ''}
            onClick={() => navigate('library-demo', 'radix-ui')}
          >
            Radix UI
          </button>
          <button
            className={unstyledStep === 'base-ui' ? 'active' : ''}
            onClick={() => navigate('library-demo', 'base-ui')}
          >
            Base UI
          </button>
          <button
            className={unstyledStep === 'summary' ? 'active' : ''}
            onClick={showUnstyledSummary}
          >
            비교 정리
          </button>
        </nav>
      )}

      {currentScreen === 'intro' && (
        <IntroScreen
          onStartClick={() =>
            navigate('ui-library-concept', currentLibrary)
          }
        />
      )}

      {currentScreen === 'ui-library-concept' && (
        <UILibraryConcept
          onBack={() => navigate('intro', currentLibrary)}
          onNext={() => navigate('library-overview', currentLibrary)}
        />
      )}

      {currentScreen === 'library-overview' && (
        <LibraryOverview
          onLibrarySelect={handleOverviewLibrarySelect}
          onCategorySelect={handleCategorySelect}
        />
      )}

      {currentScreen === 'material-ui-overview' && (
        <MaterialUIOverview
          onBack={() => navigate('library-overview', 'material-ui')}
          onNext={() => navigate('mui-core-vs-x', 'material-ui')}
        />
      )}

      {currentScreen === 'mui-core-vs-x' && (
        <MUICoreVsX
          onBack={() => navigate('material-ui-overview', 'material-ui')}
          onNext={() => navigate('mui-x-detail', 'material-ui')}
        />
      )}

      {currentScreen === 'mui-x-detail' && (
        <MUIXDetail
          onBack={() => navigate('mui-core-vs-x', 'material-ui')}
          onNext={() => navigate('library-demo', 'material-ui')}
        />
      )}

      {currentScreen === 'ant-design-enterprise' && (
        <AntDesignEnterprise
          onBack={() => navigate('library-demo', 'ant-design')}
          onNext={() => navigate('library-demo', 'chakra-ui')}
        />
      )}

      {currentScreen === 'design-system-customization' && (
        <DesignSystemCustomization
          onBack={() => navigate('library-demo', 'chakra-ui')}
          onNext={showDesignSystemsSummary}
        />
      )}

      {currentScreen === 'tailwind-overview' && (
        <TailwindOverview
          onBack={showDesignSystemsSummary}
          onNext={() => navigate('library-demo', 'daisyui')}
        />
      )}

      {currentScreen === 'category-lecture' && (
        <div className="category-lecture-screen">
          <CategoryLecture
            category={currentCategory}
            onLibrarySelect={handleLibrarySelect}
            onOpenOfficialSite={openOfficialSite}
          />

          <div className="lecture-navigation">
            <button
              onClick={handlePresentationPrevious}
              disabled={isFirstCategory}
            >
              {currentCategory === 'tailwind-based' ? '← shadcn/ui 2 / 2' : '← Previous Category'}
            </button>

            <button
              onClick={() => navigate('library-overview', currentLibrary)}
            >
              Overview
            </button>

            <button
              onClick={isLastCategory
                ? () => navigate('decision-guide', currentLibrary)
                : handleNextCategory}
            >
              {isLastCategory ? 'Decision Guide →' : 'Next Category →'}
            </button>
          </div>
        </div>
      )}

      {currentScreen === 'decision-guide' && (
        <div className="decision-guide-screen">
          <DecisionGuide onLibrarySelect={handleLibrarySelect} />

          <div className="lecture-navigation">
            <button
              onClick={handleDecisionGuidePrevious}
            >
              ← Mantine 실제 예시 2
            </button>
            <button
              onClick={() => navigate('closing', currentLibrary)}
            >
              Closing →
            </button>
          </div>
        </div>
      )}

      {currentScreen === 'closing' && (
        <div className="closing-screen">
          <Closing
            onRestart={() => navigate('intro', currentLibrary)}
          />
        </div>
      )}

      {isDemoPresentation && (
        <div className={`demo-screen${isSplitTailwindPresentation ? ' split-demo-screen' : ''}${isMantineDetailPresentation ? ' mantine-detail-demo-screen' : ''}`}>
          <div className="demo-container">
            <div className="demo-main">
              {currentScreen === 'headless-ui-interaction'
                ? <HeadlessUIDemo screen={2} />
                : currentScreen === 'shadcn-customization'
                  ? <ShadcnDemo screen={2} />
                  : currentScreen === 'mantine-components'
                    ? <MantineComponentsExample />
                    : currentScreen === 'mantine-workflow'
                      ? <MantineWorkflowExample />
                      : <DemoComponent />}
            </div>
          </div>

          <div className="demo-controls">
            <button
              onClick={handleDemoPrevious}
            >
              {demoPreviousLabel}
            </button>

            <span className="demo-info">
              {demoLocationLabel}
            </span>

            <button
              onClick={handleNextLibrary}
            >
              {demoNextLabel}
            </button>
          </div>

          {!isSplitTailwindPresentation && <div className="demo-actions">
            <button
              onClick={() => navigate('library-overview', currentLibrary)}
            >
              Overview
            </button>

            <button
              onClick={() => navigate('lecture-content', currentLibrary)}
            >
              View Lecture
            </button>

            <button
              onClick={handleOpenCurrentOfficialSite}
            >
              Official Site ↗
            </button>

          </div>}
        </div>
      )}

      {currentScreen === 'lecture-content' && (
        <div className="lecture-screen">
          <LectureContentPanel
            content={lectureContent}
            libraryName={libraryName}
            contentType={currentContentType}
            onContentTypeChange={setCurrentContentType}
          />

          <div className="lecture-navigation">
            <button
              onClick={handlePrevLibrary}
              disabled={currentLibrary === 'material-ui'}
            >
              ← Previous Library
            </button>

            <button
              onClick={handleNextLibrary}
            >
              {currentLibrary === 'mantine' ? 'Decision Guide →' : 'Next Library →'}
            </button>
          </div>

          <div className="lecture-actions">
            <button
              onClick={() => navigate('library-demo', currentLibrary)}
            >
              ← View Demo
            </button>

            <button
              onClick={() => navigate('library-overview', currentLibrary)}
            >
              Overview
            </button>

            <button
              onClick={handleOpenCurrentOfficialSite}
            >
              Official Site ↗
            </button>

            <button
              onClick={() => navigate('intro', currentLibrary)}
            >
              Home
            </button>
          </div>
        </div>
      )}
      </div>
    </MainLayout>
  )
}

export default App

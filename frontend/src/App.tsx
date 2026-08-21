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
import { MainLayout } from './components/MainLayout'
import { IntroScreen } from './components/IntroScreen'
import { LibraryOverview } from './components/LibraryOverview'
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

  const handleCategorySelect = (category: CategoryKey) => {
    setCurrentCategory(category)
    const firstLib = categories.find(c => c.key === category)?.libraries[0]
    if (firstLib) {
      navigate('category-lecture', firstLib)
    }
  }

  const handleNextCategory = () => {
    const idx = categories.findIndex(c => c.key === navRef.current.currentCategory)
    if (idx < categories.length - 1) {
      handleCategorySelect(categories[idx + 1].key)
    }
  }

  const handlePrevCategory = () => {
    const idx = categories.findIndex(c => c.key === navRef.current.currentCategory)
    if (idx > 0) {
      handleCategorySelect(categories[idx - 1].key)
    }
  }

  const handleNextLibrary = () => {
    const currentIndex = libraries.findIndex(lib => lib.key === navRef.current.currentLibrary)
    if (currentIndex < libraries.length - 1) {
      handleLibrarySelect(libraries[currentIndex + 1].key)
    }
  }

  const handlePrevLibrary = () => {
    const currentIndex = libraries.findIndex(lib => lib.key === navRef.current.currentLibrary)
    if (currentIndex > 0) {
      handleLibrarySelect(libraries[currentIndex - 1].key)
    }
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
        handleNextLibrary()
        break
      case 'PREVIOUS':
        handlePrevLibrary()
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

  return (
    <MainLayout
      _title="React UI Voice Lecture"
      backendStatus={backendStatus}
      remoteStatus={remoteStatus}
    >
      {currentScreen === 'intro' && (
        <IntroScreen
          onStartClick={() =>
            navigate('library-overview', currentLibrary)
          }
        />
      )}

      {currentScreen === 'library-overview' && (
        <LibraryOverview
          onLibrarySelect={handleLibrarySelect}
          onCategorySelect={handleCategorySelect}
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
              onClick={handlePrevCategory}
              disabled={currentCategory === 'design-systems'}
            >
              ← Previous Category
            </button>

            <button
              onClick={() => navigate('library-overview', currentLibrary)}
            >
              Overview
            </button>

            <button
              onClick={handleNextCategory}
              disabled={currentCategory === 'fast-development'}
            >
              Next Category →
            </button>
          </div>

          <div className="lecture-actions">
            <button
              onClick={() => navigate('decision-guide', currentLibrary)}
            >
              Decision Guide →
            </button>
            <button
              onClick={() => navigate('intro', currentLibrary)}
            >
              Home
            </button>
          </div>
        </div>
      )}

      {currentScreen === 'decision-guide' && (
        <div className="decision-guide-screen">
          <DecisionGuide onLibrarySelect={handleLibrarySelect} />

          <div className="lecture-navigation">
            <button
              onClick={() => navigate('library-overview', currentLibrary)}
            >
              ← Overview
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

      {currentScreen === 'library-demo' && (
        <div className="demo-screen">
          <div className="demo-container">
            <div className="demo-main">
              <DemoComponent />
            </div>
          </div>

          <div className="demo-controls">
            <button
              onClick={handlePrevLibrary}
              disabled={currentLibrary === 'material-ui'}
            >
              ← Previous
            </button>

            <span className="demo-info">
              {libraryName}
            </span>

            <button
              onClick={handleNextLibrary}
              disabled={currentLibrary === 'mantine'}
            >
              Next →
            </button>
          </div>

          <div className="demo-actions">
            <button
              onClick={() => navigate('library-overview', currentLibrary)}
            >
              ← Back to Overview
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

            <button
              onClick={() => navigate('intro', currentLibrary)}
            >
              Home
            </button>
          </div>
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
              disabled={currentLibrary === 'mantine'}
            >
              Next Library →
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
    </MainLayout>
  )
}

export default App
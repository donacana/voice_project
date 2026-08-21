import React from 'react'
import './IntroScreen.css'

interface IntroScreenProps {
  onStartClick?: () => void
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStartClick }) => {
  return (
    <div className="intro-screen">
      <div className="intro-content">
        <section className="intro-hero">
          <h2>Welcome to React UI Comparison</h2>
          <p>
            Discover 10 different approaches to building React user interfaces.
            Each library represents a unique philosophy and set of capabilities.
          </p>
        </section>

        <section className="intro-libraries">
          <h3>Libraries You'll Explore</h3>
          <div className="library-grid">
            <div className="library-card">
              <h4>Design Systems</h4>
              <ul>
                <li>Material UI</li>
                <li>Ant Design</li>
                <li>Chakra UI</li>
              </ul>
            </div>
            <div className="library-card">
              <h4>Tailwind-Based</h4>
              <ul>
                <li>shadcn/ui</li>
                <li>daisyUI</li>
                <li>Headless UI</li>
              </ul>
            </div>
            <div className="library-card">
              <h4>Headless / Primitives</h4>
              <ul>
                <li>React Aria</li>
                <li>Radix UI</li>
                <li>Base UI</li>
              </ul>
            </div>
            <div className="library-card">
              <h4>All-in-One</h4>
              <ul>
                <li>Mantine</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="intro-features">
          <h3>What You Can Do</h3>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">🎤</span>
              <div>
                <strong>Voice Control</strong>
                <p>Use voice commands to navigate the presentation</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📚</span>
              <div>
                <strong>Interactive Demos</strong>
                <p>See each library in action with real components</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔍</span>
              <div>
                <strong>Search & Compare</strong>
                <p>Find libraries by use case or characteristics</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📖</span>
              <div>
                <strong>Learn Details</strong>
                <p>Installation, features, and advantages explained</p>
              </div>
            </div>
          </div>
        </section>

        <section className="intro-cta">
          <button className="start-button" onClick={onStartClick}>
            Start Exploring →
          </button>
          <p className="cta-hint">
            Or use voice commands: "Next screen" or "Open Material UI"
          </p>
        </section>
      </div>
    </div>
  )
}

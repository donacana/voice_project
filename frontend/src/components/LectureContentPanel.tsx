import { LectureContent, ContentType } from '../data/lectureData'

interface LectureContentPanelProps {
  content?: LectureContent
  libraryName: string
  contentType: ContentType
  onContentTypeChange?: (type: ContentType) => void
}

const contentTypeLabels: Record<ContentType, string> = {
  introduction: 'Introduction',
  features_use_case: 'Features & Use Case',
  comparison: 'Comparison',
  install: 'Installation',
  example: 'Example'
}

export function LectureContentPanel({
  content,
  libraryName,
  contentType,
  onContentTypeChange
}: LectureContentPanelProps) {
  return (
    <div className="lecture-content-panel">
      <div className="lecture-header">
        <div className="lecture-library-badge">
          <span className="library-name">{libraryName}</span>
        </div>
        <h2 className="lecture-title">{content?.title || 'No content available'}</h2>
      </div>

      <div className="lecture-content-body">
        {content ? (
          <>
            <div className="lecture-text">
              <p>{content.text}</p>
            </div>
            {content.codeExample && (
              <div className="lecture-code-block">
                <pre>
                  <code>{content.codeExample}</code>
                </pre>
              </div>
            )}
          </>
        ) : (
          <div className="lecture-empty">
            <p>Select a content type to view lecture material.</p>
          </div>
        )}
      </div>

      {onContentTypeChange && (
        <div className="lecture-content-types">
          <p className="content-type-label">Content Types:</p>
          <div className="content-type-buttons">
            {(Object.keys(contentTypeLabels) as ContentType[]).map(type => (
              <button
                key={type}
                className={`content-type-button ${contentType === type ? 'active' : ''}`}
                onClick={() => onContentTypeChange(type)}
              >
                {contentTypeLabels[type]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

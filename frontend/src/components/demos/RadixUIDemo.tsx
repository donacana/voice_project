import * as Dialog from '@radix-ui/react-dialog'

export function RadixUIDemo() {
  return (
    <section className="library-demo-slide">
      <header className="library-demo-header">
        <div><span className="demo-eyebrow">Primitives · Accessible Building Blocks</span><h1>Radix UI</h1></div>
        <p>Radix가 Dialog의 동작과 접근성을 제공하고, 최종 디자인은 개발자가 입힙니다.</p>
      </header>

      <div className="radix-flow-grid">
        <article className="radix-stage">
          <h2>1. Primitive</h2>
          <p>기능만 확인하는 기본 상태</p>
          <div className="radix-basic-preview"><button type="button">Open dialog</button></div>
        </article>

        <div className="radix-flow-arrow" aria-hidden="true">→</div>

        <article className="radix-stage">
          <h2>2. Custom styled</h2>
          <p>동일한 Dialog primitive에 우리 디자인 적용</p>
          <div className="radix-styled-dialog">
            <strong>프로젝트 초대</strong>
            <p>Focus trap · Escape · ARIA는 Radix가 처리합니다.</p>
            <Dialog.Root>
              <Dialog.Trigger asChild><button className="radix-dialog-trigger">실제 Dialog 열기</button></Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="radix-overlay" />
                <Dialog.Content className="radix-dialog-content">
                  <Dialog.Title>프로젝트 초대</Dialog.Title>
                  <Dialog.Description>접근성 동작 위에 개발자가 원하는 디자인을 적용했습니다.</Dialog.Description>
                  <Dialog.Close asChild><button className="radix-dialog-close">확인</button></Dialog.Close>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </article>
      </div>

      <div className="radix-behavior-strip">
        {['Focus trap', 'Escape close', 'ARIA labeling', 'Keyboard navigation'].map(item => <span key={item}>{item}</span>)}
      </div>

      <div className="demo-thesis">Primitive = behavior / accessibility · Design System = color / spacing / motion</div>
    </section>
  )
}

# FINAL LIBRARY PRESENTATION REDESIGN

## 목적

현재 프론트엔드의 10개 라이브러리 상세 화면을 모두 같은 `Input / Select / Button` 데모로 보여주는 방식에서 벗어나,
**각 라이브러리의 핵심 특징과 선택 이유가 가장 잘 보이는 방식으로 개별 구성**한다.

핵심 원칙:

- 모든 라이브러리에 같은 UI 데모를 반복하지 않는다.
- 어떤 라이브러리는 실제 화면을 보여주고, 어떤 라이브러리는 코드 비교를 보여주고,
  어떤 라이브러리는 구조/동작/접근성 개념을 보여준다.
- 발표자가 설명하는 내용과 화면이 즉시 연결되어야 한다.
- 기존 PHASE 14 음성/STT/RAG/백엔드 구조는 유지한다.
- PHASE 15는 아직 시작하지 않는다.
- 기존 4개 카테고리와 10개 라이브러리 구성은 변경하지 않는다.

---

# 1. Design Systems

## 1-1. Material UI

### 핵심
**완성된 디자인 시스템과 컴포넌트를 빠르게 가져다 쓰는 라이브러리**

React 컴포넌트는 쉽게 말해:
> 화면의 한 부분을 기능까지 묶어서 재사용할 수 있게 만든 부품

Material UI는 Button, Card, AppBar, Dialog 같은 부품뿐 아니라
Material Design 기반의 기본 디자인 규칙까지 함께 제공한다.

### 왜 쓰나
- 디자인이 적용된 완성형 컴포넌트가 많다.
- 여러 컴포넌트를 조합해 빠르게 완성된 앱 화면을 만들기 좋다.
- 디자인 일관성을 확보하기 쉽다.

### 발표 화면
**실제 완성형 앱 화면을 크게 보여준다.**

```text
┌──────────────────────────────┐
│ Dashboard                    │
├──────────────────────────────┤
│ Revenue        Users         │
│ ₩1,240,000     1,280         │
│                              │
│ [ Card ]     [ Card ]        │
│                    (+)       │
└──────────────────────────────┘
```

옆에는 짧은 구조 코드만 표시:

```jsx
<AppBar />
<Card />
<Button />
```

### 발표 멘트
> Material UI는 이미 디자인된 컴포넌트가 많이 준비되어 있기 때문에
> 몇 개의 컴포넌트를 조합하는 것만으로도 완성된 화면을 빠르게 만들 수 있습니다.

---

## 1-2. Ant Design

### 핵심
**기업용 관리자 페이지와 업무 시스템에서 반복적으로 필요한 UI가 많이 준비된 라이브러리**

“복잡한 화면에 좋다”는 것은 업무 로직 자체를 대신 처리한다는 뜻이 아니다.

관리자 화면에서 자주 필요한:
- Table
- Form
- Filter
- Search
- Pagination
- DatePicker
- Tabs
- Steps
- Status UI

같은 업무용 UI가 풍부하다는 의미다.

### 왜 쓰나
기업용 관리자 페이지에서 반복되는 회원 목록, 검색, 필터, 페이지 이동,
폼, 검증, 상태 표시 등을 빠르게 구성하기 좋다.

### 발표 화면
**관리자 Dashboard를 실제로 보여준다.**

```text
사용자 관리

[검색_________] [상태 ▼]

이름      상태       주문
Kim       Active     128
Lee       Pending     72
Park      Active     201

          < 1 2 3 4 >
```

### 발표 멘트
> Ant Design은 Table, Form, Filter, Pagination처럼
> 기업용 관리자 화면에서 반복적으로 필요한 UI가 풍부해서
> 데이터가 많고 업무 흐름이 복잡한 화면을 만들기 좋습니다.

---

## 1-3. Chakra UI

### 핵심
**React 컴포넌트가 있는 자리에서 스타일도 직관적으로 수정하기 편한 라이브러리**

일반적인 방식:

```jsx
<button className="save-button">저장</button>
```

```css
.save-button {
  background: blue;
  border-radius: 12px;
}
```

Chakra 스타일:

```jsx
<Button
  bg="blue.500"
  borderRadius="xl"
  p="4"
>
  저장
</Button>
```

### 왜 쓰나
- JSX와 CSS 파일을 계속 오가는 작업을 줄일 수 있다.
- 컴포넌트와 스타일을 가까운 곳에서 관리하기 쉽다.
- 빠른 커스터마이징에 유리하다.

### 발표 화면
**코드와 결과를 나란히 보여준다.**

```text
코드                              결과

bg="blue.500"                     기본 카드
rounded="xl"            →          ↓
shadow="lg"                       파란색 + 둥글게 + 그림자
```

### 발표 멘트
> Chakra UI는 컴포넌트에 스타일 값을 props처럼 바로 작성할 수 있어서
> React 코드를 보면서 디자인도 빠르게 수정하기 편합니다.

---

# 2. Tailwind-Based

## 2-1. shadcn/ui

### 핵심
**편하게 만들어진 UI 컴포넌트를 가져오되, 그 소스 코드 자체까지 내 프로젝트가 소유하는 방식**

일반 라이브러리:

```text
node_modules
└─ Library
   └─ Button

내 프로젝트
→ Button을 import해서 사용
```

shadcn/ui:

```text
내 프로젝트
└─ src
   └─ components
      └─ ui
         └─ button.tsx
```

### 왜 중요한가
일반 라이브러리에서는 기능 변경 시 지원되는 prop/API를 찾아야 하지만,
shadcn에서는 `button.tsx` 자체를 열어 구조, 스타일, 기능을 직접 수정할 수 있다.

### 장점
- 내부 구조까지 자유롭게 수정 가능
- 프로젝트 전용 variant 추가 가능
- 필요 없는 코드 제거 가능
- 자체 디자인 시스템에 깊게 맞출 수 있음

### 단점
- 코드 유지보수 책임도 개발자에게 생긴다.

### 발표 화면
**UI보다 폴더 구조 비교**

```text
일반 라이브러리

node_modules
   ↓
Button
   ↓
import


shadcn/ui

src/components/ui/button.tsx
             ↑
        내가 직접 수정
```

### 발표 멘트
> shadcn은 완성된 컴포넌트를 패키지 안에서 빌려 쓰는 방식보다,
> 실제 컴포넌트 코드를 프로젝트로 가져와서 개발자가 직접 수정할 수 있다는 것이 가장 큰 특징입니다.

---

## 2-2. daisyUI

### Tailwind 먼저 설명
Tailwind는 미리 만들어진 작은 CSS utility class들을
HTML/JSX의 `className`에서 조립하는 방식이다.

```jsx
<button className="bg-blue-500 px-4 py-2 rounded-lg">
```

장점:
- CSS 파일을 자주 오갈 필요가 줄어든다.
- HTML/JSX 안에서 바로 스타일을 조립할 수 있다.

단점:
복잡해질수록 클래스가 길어진다.

```jsx
className="
  bg-blue-500
  text-white
  px-4
  py-2
  rounded-lg
  font-bold
  shadow-md
  hover:bg-blue-600
  focus:ring-2
"
```

### daisyUI 핵심
**Tailwind에서 반복되는 긴 스타일 조합을
`btn`, `card`, `alert` 같은 의미 있는 컴포넌트 클래스 이름으로 미리 제공한다.**

```jsx
<button className="btn btn-primary">
```

### 발표 화면
**긴 Tailwind 코드와 짧은 daisyUI 코드를 비교**

```text
Tailwind

bg-blue-500 text-white px-4 py-2
rounded-lg font-bold hover:bg-blue-600 ...

                ↓

daisyUI

btn btn-primary
```

### 발표 멘트
> Tailwind는 작은 스타일 클래스들을 조립해서 빠르게 스타일링할 수 있지만,
> 복잡해지면 클래스가 길어집니다.
> daisyUI는 자주 사용하는 조합을 btn이나 card 같은 짧은 이름으로 제공합니다.

---

## 2-3. Headless UI

### 핵심
**디자인은 없지만 UI 동작과 접근성이 구현된 컴포넌트를 제공하는 라이브러리**

접근성이란:
> 마우스만이 아니라 다른 방법으로도 같은 기능을 사용할 수 있게 하는 것

예:
- 마우스 클릭
- Tab 이동
- Enter 선택
- 방향키 이동
- Escape 닫기
- Focus 관리
- 스크린리더 인식

대표 UI:
- Menu
- Listbox
- Combobox
- Dialog
- Popover
- Tabs
- Disclosure
- Switch

### 발표 화면

```text
Headless UI

Menu 기능
열기/닫기
선택
키보드
Focus
접근성
      ↓
내 CSS / Tailwind
      ↓
내 디자인의 Menu
```

### 발표 멘트
> Headless UI는 Menu나 Dialog 같은 UI의 동작과 접근성은 이미 만들어주고,
> 실제 디자인은 개발자가 원하는 대로 만드는 방식입니다.

---

# 3. Unstyled / Primitives

## 3-1. React Aria

### 핵심
**내가 원하는 UI를 만들면서 키보드, Focus, 스크린리더 같은 접근성과 사용자 상호작용을 제대로 구현하도록 도와주는 라이브러리**

접근성 비유:

```text
일반 건물
= 계단만 있음

접근성을 고려한 건물
= 계단
+ 경사로
+ 엘리베이터
+ 점자
+ 안내 표지
```

### Headless UI와 비교

```text
Headless UI
= 접근성까지 구현된 Menu/Dialog 같은 UI 부품을 가져와서 디자인

React Aria
= 내가 원하는 UI를 만들면서
  접근성/상호작용을 제대로 구현하도록 더 깊게 도움
```

### 발표 화면

```text
내가 만든 UI
     +
React Aria
     ↓

Keyboard
Focus
Screen Reader
Selection
```

또는:

```text
Tab
 ↓
[Button Focus]

Arrow ↓
 ↓
메뉴1
메뉴2 ← Focus
메뉴3
```

### 발표 멘트
> React Aria는 내가 원하는 UI를 만들면서
> 키보드, Focus, 스크린리더 같은 접근성과 상호작용을
> 제대로 구현하도록 도와주는 라이브러리입니다.

---

## 3-2. Radix UI

### 핵심
**접근성까지 구현된 기본 UI 부품, 즉 Primitive를 제공하는 라이브러리**

Primitive는:
> 레고 블록처럼 완성품보다 작은 기본 UI 부품

저수준은 품질이 낮다는 뜻이 아니다.

```text
고수준
= 완성된 LEGO 자동차

저수준 Primitive
= 바퀴
+ 축
+ 핸들
+ 블록
```

대표 부품:
- Dialog
- Popover
- Dropdown
- Tabs
- Tooltip
- Checkbox
- Switch

부품 내부에는:
- 키보드 동작
- Focus
- Escape
- ARIA
- 열기/닫기

같은 어려운 상호작용이 포함되어 있다.

### 발표 화면

```text
Radix Primitive

Dialog
Dropdown
Tooltip
Popover

       +

우리 CSS
우리 로직

       ↓

우리 회사 디자인 시스템
```

### 발표 멘트
> Radix UI는 접근성까지 처리된 작은 UI 기본 부품들을 제공합니다.
> 이 부품들을 조립하고 스타일을 입혀서
> 자체 디자인 시스템을 만들기 좋습니다.

---

## 3-3. Base UI

### 핵심
**기능과 접근성은 제공하면서 스타일링 기술에 대한 제약을 최소화하는 라이브러리**

Base UI는:
- UI 구조
- 동작
- 접근성

을 제공하면서 스타일은:
- Tailwind
- CSS Modules
- 일반 CSS
- CSS-in-JS

중 원하는 방식을 선택할 수 있게 한다.

### 언제 좋은가
> 기능은 필요한데 CSS 방식까지 라이브러리가 정해주는 것은 싫을 때

또는:
> CSS를 깊게 꾸미고 싶고 스타일링 기술의 제약을 적게 받고 싶을 때

### 발표 화면

```text
             Base UI
                │
       ┌────────┼────────┐
       ↓        ↓        ↓
   Tailwind   CSS      CSS-in-JS

   같은 기능 / 다른 스타일 방식
```

### 발표 멘트
> Base UI는 기능과 접근성은 제공하지만
> 어떤 CSS 기술을 사용할지는 최대한 개발자에게 맡겨서
> 스타일링 방식에 대한 제약이 적습니다.

---

# 4. Fast Development / All-in-One

## 4-1. Mantine

### 핵심
**UI 컴포넌트뿐 아니라 Hook과 주변 기능까지 한 생태계에서 많이 제공해서 빠르게 개발하는 라이브러리**

예를 들어 회원가입 기능에서 필요한:
- Button / Input
- Form 상태 관리
- Validation
- 알림
- 날짜
- 반응형 처리

등을 여러 라이브러리로 나누지 않고 Mantine 생태계 안에서 많이 해결할 수 있다.

```text
Component
Button
Input
Modal

        +

Hook
useForm()
useMediaQuery()

        +

Utility
Notifications
Dates
```

### 왜 빠른가
추가 라이브러리를 검색, 설치, 문서 확인, 서로 연결하는 작업을 줄일 수 있기 때문이다.

### 발표 화면

```text
회원가입 기능

Component
Input / Button / Modal
        +
Hook
useForm()
useMediaQuery()
        +
Utility
Notification / Dates

        ↓

Mantine 하나의 생태계
```

### 발표 멘트
> Mantine은 단순 UI 컴포넌트뿐 아니라
> Form Hook, 반응형 Hook, 알림, 날짜 기능 같은 주변 도구까지 함께 제공해서
> 여러 라이브러리를 따로 찾아 연결하는 작업을 줄일 수 있습니다.

---

# 5. 발표 진행 구조

## Design Systems
```text
Material UI = 완성형 디자인 시스템
Ant Design  = 기업/관리자 업무 UI
Chakra UI   = 빠른 스타일 커스터마이징
```

상세:
- MUI → 완성된 앱 화면
- Ant Design → 관리자 Dashboard
- Chakra → 코드 변경 → 디자인 변경

## Tailwind-Based
```text
shadcn/ui   = 소스 코드 소유
daisyUI     = 긴 Tailwind class를 짧게
Headless UI = 기능/접근성은 제공, 디자인은 직접
```

상세:
- shadcn → 폴더 구조
- daisyUI → 코드 길이 비교
- Headless → 동작/접근성/디자인 역할 분리

## Unstyled / Primitives

카테고리 시작 문구:
> 이 그룹은 완성된 디자인보다 직접 UI를 만들 때 필요한 기반을 제공하는 라이브러리입니다.

```text
React Aria = 접근성과 사용자 상호작용
Radix UI   = 접근성 있는 기본 UI 레고 블록
Base UI    = 스타일 기술 선택 자유
```

상세:
- React Aria → Keyboard / Focus / Screen Reader
- Radix → Primitive → 자체 디자인 시스템
- Base UI → 하나의 기반 → Tailwind / CSS / CSS-in-JS

## Mantine
```text
Component
+
Hook
+
Utility
```

핵심:
> 여러 라이브러리를 따로 찾아 연결하는 작업을 줄여주는 All-in-One 생태계

---

# 6. Decision Guide

```text
빠르게 완성된 디자인이 필요?
→ Material UI

관리자/기업 시스템?
→ Ant Design

React에서 스타일을 빠르게 수정?
→ Chakra UI

컴포넌트 소스 코드를 직접 소유?
→ shadcn/ui

Tailwind 코드가 너무 길다?
→ daisyUI

기능은 필요하고 디자인은 직접?
→ Headless UI

접근성이 특히 중요?
→ React Aria

자체 디자인 시스템을 만들고 싶다?
→ Radix UI

CSS 기술을 자유롭게 선택하고 싶다?
→ Base UI

여러 기능을 한 번에 빠르게?
→ Mantine
```

마무리:
> 어떤 라이브러리가 무조건 가장 좋은 것이 아니라,
> 개발 상황과 목적에 따라 적합한 라이브러리가 달라집니다.

---

# 7. 구현 원칙

- 기존 4개 카테고리 이름 유지
- 기존 10개 라이브러리 유지
- 모든 라이브러리에 같은 Input / Select / Button 데모를 반복하지 않음
- 상세 화면 중앙 영역을 라이브러리별 고유 teaching example로 교체
- 기존 Strength / Trade-off / Use Case 유지 가능
- 텍스트보다 시각적 예시가 중심
- 공식 사이트 새 탭 기능 유지
- 기존 Push-to-Talk, 음성 명령, STT, Vector RAG, LLM fallback 유지
- 기존 PHASE 14 navigation/action 구조 유지
- PHASE 15 시작 금지
- Backend/PostgreSQL/Docker 변경 금지
- React 18 유지
- Mantine runtime dependency 다시 추가 금지
- 최종 수정 후 `npm run build` 성공
- 브라우저 콘솔에 새 runtime error가 없어야 함

---

# 8. 완료 기준

1. Material UI → 완성형 Material 앱 예시
2. Ant Design → 관리자/데이터 업무 화면
3. Chakra UI → 스타일 코드와 결과 변화 비교
4. shadcn/ui → 패키지 import와 소스 코드 소유 차이
5. daisyUI → Tailwind 긴 클래스와 `btn btn-primary` 비교
6. Headless UI → 기능/접근성과 디자인의 역할 분리
7. React Aria → Keyboard/Focus/Screen Reader 접근성
8. Radix UI → Primitive를 레고 블록처럼 설명
9. Base UI → 여러 CSS 스타일링 방식과 결합되는 구조
10. Mantine → Component + Hook + Utility 생태계
11. 기존 음성 명령과 공식 사이트 기능 유지
12. `npm run build` 성공
13. PHASE 15는 시작하지 않음

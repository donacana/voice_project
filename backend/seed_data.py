"""
PHASE 7 seed script.

Populates ui_libraries + lecture_contents with the 10 approved React UI libraries.
Does NOT touch the embeddings table (must remain empty until PHASE 8).

Idempotent: for each seeded library, existing lecture content is removed and
re-inserted, so re-running produces the same final state with no duplicates.
Refuses to run if any lecture content is already referenced by an embedding
(data-loss guard: PHASE 8 may have populated embeddings by then).
"""
import sys
from app.db import SessionLocal, init_db, UILibrary, LectureContent, Embedding

# ---------------------------------------------------------------------------
# SEED DATA (human-review friendly: library -> typed content chunks)
# ---------------------------------------------------------------------------

SEED_LIBRARIES = [
    {
        "name": "Material UI",
        "slug": "material-ui",
        "category": "Design System",
        "description": "Google Material Design 기반의 대표 React UI 컴포넌트 라이브러리",
        "contents": [
            {
                "content_type": "introduction",
                "title": "Material UI 소개",
                "content": "Material UI는 Google의 Material Design 언어를 React 컴포넌트로 구현한 가장 널리 쓰이는 React UI 라이브러리다. 일관된 Material Design 기반 UI를 빠르게 구축하기 위한 목적을 가지며, 완성된 디자인이 적용된 컴포넌트를 별도 스타일링 없이 바로 사용할 수 있게 한다.",
            },
            {
                "content_type": "features_use_case",
                "title": "Material UI 특징과 활용",
                "content": "Button, Table, DataGrid, AppBar, Drawer, Dialog 등 폭넓은 컴포넌트를 제공하고, Emotion 기반 스타일링과 테마 시스템으로 색상·간격·타이포그래피를 전역 관리할 수 있다. 관리자 대시보드, 기업용 내부 도구, 데스크톱형 관리 콘솔처럼 견고하고 일관된 Material Design 화면을 빠르게 만들어야 하는 프로젝트에 적합하다.",
            },
            {
                "content_type": "comparison",
                "title": "Material UI 비교 관점",
                "content": "완성된 디자인이 포함된 Design System이므로, 스타일이 없는 프리미티브 기반 라이브러리(Radix UI, Base UI)와 달리 기본 UI가 완성된 상태로 제공된다. 커스터마이징은 가능하지만 기본 방향은 Material Design 규칙을 따르는 것이다. Tailwind 기반 접근법보다 스타일 제어 자유도는 낮지만, 일관된 디자인을 가장 빠르게 얻을 수 있는 것이 핵심 트레이드오프다.",
            },
            {
                "content_type": "install",
                "title": "Material UI 설치",
                "content": "npm install @mui/material @emotion/react @emotion/styled  — Material UI는 Emotion을 스타일링 엔진으로 사용하므로 위 세 패키지를 함께 설치해야 정상 동작한다.",
            },
            {
                "content_type": "example",
                "title": "Material UI 사용 예시",
                "content": "import Button from '@mui/material/Button' 후 <Button variant=\"contained\" color=\"primary\"> 형태로 테마 기반 컴포넌트를 바로 렌더링한다. ThemeProvider로 전역 색상과 타이포그래피를 설정하고, sx prop으로 컴포넌트 단위 스타일을 추가할 수 있다.",
            },
        ],
    },
    {
        "name": "Ant Design",
        "slug": "ant-design",
        "category": "Design System",
        "description": "엔터프라이즈 데이터 중심 화면에 강점을 가진 기업용 디자인 시스템 React UI 라이브러리",
        "contents": [
            {
                "content_type": "introduction",
                "title": "Ant Design 소개",
                "content": "Ant Design은 기업용 애플리케이션 UI를 위한 디자인 시스템 기반 React UI 라이브러리다. 데이터 중심의 업무 화면을 효율적으로 구축하려는 목적을 가지며, Table·Form·데이터 시각화처럼 정보 밀도가 높은 엔터프라이즈 인터페이스에 강점을 보인다.",
            },
            {
                "content_type": "features_use_case",
                "title": "Ant Design 특징과 활용",
                "content": "Table, Form, DatePicker, Select, Modal 등 데이터 처리에 특화된 컴포넌트가 강력하다. 기업용 관리자 페이지, 대시보드, 데이터 분석 화면, 업무용 백오피스, 복잡한 Form 중심 인터페이스에 적합하다. 기업 제품 생태계에서 널리 사용되어 문서와 커뮤니티 자료가 풍부하다.",
            },
            {
                "content_type": "comparison",
                "title": "Ant Design 비교 관점",
                "content": "Material UI가 Google Material Design을 따른다면 Ant Design은 엔터프라이즈 업무 효율을 중심으로 한 자체 디자인 원칙을 따른다. 테이블·폼 위주의 데이터 밀도 높은 화면에서 강점을 보이고, 완성형 디자인을 제공하므로 헤드리스 계열(Radix, Base UI)보다 커스터마이징 자유도는 낮지만 바로 사용 가능한 기업용 UI를 얻는 데 유리하다.",
            },
            {
                "content_type": "install",
                "title": "Ant Design 설치",
                "content": "npm install antd  — antd 단일 패키지로 설치된다. 별도의 스타일링 엔진 설치가 필수로 요구되지 않는다.",
            },
            {
                "content_type": "example",
                "title": "Ant Design 사용 예시",
                "content": "import { Table, Form } from 'antd' 후 <Table columns={columns} dataSource={data} />처럼 데이터를 props로 넘겨 테이블을 렌더링한다. ConfigProvider로 전역 언어와 테마를 설정할 수 있고, Form과 Table의 연동이 강력하다.",
            },
        ],
    },
    {
        "name": "Chakra UI",
        "slug": "chakra-ui",
        "category": "Design System",
        "description": "접근성과 커스터마이징을 기본으로 갖춘 토큰 기반 React 디자인 시스템",
        "contents": [
            {
                "content_type": "introduction",
                "title": "Chakra UI 소개",
                "content": "Chakra UI는 접근성과 커스터마이징을 기본으로 갖춘 React 디자인 시스템 라이브러리다. 개발자가 직관적인 API로 일관된 UI를 빠르게 구축하도록 돕는 목적을 가지며, Emotion 기반 스타일링과 디자인 토큰 시스템을 사용한다.",
            },
            {
                "content_type": "features_use_case",
                "title": "Chakra UI 특징과 활용",
                "content": "colorScheme, size, variant 같은 직관적인 props로 스타일을 조정하고, 다크 모드와 테마 토큰을 기본 지원한다. 스타트업 프로덕트, 대시보드, 폼 중심 앱, 빠른 프로토타이핑부터 운영 서비스까지 폭넓게 유용하며, 접근성(a11y)을 처음부터 고려한 컴포넌트를 제공한다.",
            },
            {
                "content_type": "comparison",
                "title": "Chakra UI 비교 관점",
                "content": "완성된 단일 디자인보다는 '커스터마이징하기 쉬운 토큰 기반 디자인 시스템'에 가깝다. Material UI가 Material Design의 고정된 룩을 준다면, Chakra는 테마 토큰을 개발자가 직접 정의하는 자유도를 준다. Tailwind 접근법과 비교하면 유틸리티 클래스 대신 컴포넌트 props로 스타일을 지정하는 방식이다. v3부터 더 가벼워진 구조로 제공된다.",
            },
            {
                "content_type": "install",
                "title": "Chakra UI 설치",
                "content": "npm install @chakra-ui/react  — Chakra UI v3는 단일 @chakra-ui/react 패키지로 설치하며 앱 루트에서 <ChakraProvider>로 감싸 사용한다. 구버전 조합(@chakra-ui/react@1/2, @chakra-ui/icons 등)은 현재 버전에서 사용하지 않는다.",
            },
            {
                "content_type": "example",
                "title": "Chakra UI 사용 예시",
                "content": "<Button colorScheme=\"blue\" size=\"md\">처럼 props로 색상과 크기를 지정하고, <Box p={4}> 같은 컴포넌트로 레이아웃을 구성한다. 전역 테마는 extendTheme로 확장해 ChakraProvider theme prop에 전달한다.",
            },
        ],
    },
    {
        "name": "shadcn/ui",
        "slug": "shadcn-ui",
        "category": "Tailwind / Flexible",
        "description": "소스 코드를 프로젝트에 복사해 완전히 소유·수정하는 Tailwind 기반 React 컴포넌트 모음",
        "contents": [
            {
                "content_type": "introduction",
                "title": "shadcn/ui 소개",
                "content": "shadcn/ui는 '복사해서 사용하는(copy-paste)' 방식의 React 컴포넌트 모음이다. 일반 라이브러리 패키지가 아니라 컴포넌트 소스 코드를 프로젝트에 직접 복사하여 완전히 소유하고 수정하는 접근법을 제시하며, Tailwind CSS 기반 위에 구축되어 완전한 커스터마이징을 목표로 한다.",
            },
            {
                "content_type": "features_use_case",
                "title": "shadcn/ui 특징과 활용",
                "content": "설치한 컴포넌트는 프로젝트 소스 코드 안에 존재하므로 스타일 변경이 자유롭고, 사용하지 않는 컴포넌트 코드가 번들에 남지 않는다. React + Tailwind CSS 기반 프로젝트, 디자인 시스템을 직접 제어하고 싶은 팀, 검증된 컴포넌트 기본기를 가지면서도 완전한 제어를 원하는 프로젝트에 적합하다. class-variance-authority(cva) 기반 variant 설계를 사용한다.",
            },
            {
                "content_type": "comparison",
                "title": "shadcn/ui 비교 관점",
                "content": "기존 라이브러리 설치 방식과 근본적으로 다르다. Material UI·Ant Design이 패키지로 설치되는 완성형 UI라면, shadcn/ui는 소스를 복사해 프로젝트가 컴포넌트의 소유주가 되는 방식이다. Tailwind 유틸리티 클래스로 스타일이 표현되므로 디자인 자유도가 매우 높다. daisyUI가 Tailwind 클래스 플러그인이라면 shadcn/ui는 복사-소유 방식이라는 차이가 있다.",
            },
            {
                "content_type": "install",
                "title": "shadcn/ui 설치",
                "content": "사전 요구사항은 React + Tailwind CSS 프로젝트다. npx shadcn@latest init 으로 초기화한 뒤, 필요한 컴포넌트만 npx shadcn@latest add button 처럼 CLI로 추가한다. 일반적인 prebuilt 패키지 설치가 아니라는 점이 핵심이다.",
            },
            {
                "content_type": "example",
                "title": "shadcn/ui 사용 예시",
                "content": "npx shadcn@latest add button 을 실행하면 components/ui/button.tsx가 프로젝트에 생성된다. 생성된 파일을 직접 수정해 스타일과 동작을 완전히 제어할 수 있고, Tailwind 유틸리티 클래스로 재스타일링한다.",
            },
        ],
    },
    {
        "name": "daisyUI",
        "slug": "daisyui",
        "category": "Tailwind / Flexible",
        "description": "Tailwind CSS용 클래스 기반 컴포넌트 플러그인으로, className만으로 완성된 디자인을 적용",
        "contents": [
            {
                "content_type": "introduction",
                "title": "daisyUI 소개",
                "content": "daisyUI는 Tailwind CSS를 위한 '클래스 기반 컴포넌트' 플러그인이다. React 전용이 아니라 Tailwind를 사용하는 모든 HTML/프레임워크에서 className만으로 완성된 디자인의 컴포넌트를 사용할 수 있게 하는 목적을 가진다.",
            },
            {
                "content_type": "features_use_case",
                "title": "daisyUI 특징과 활용",
                "content": "btn btn-primary, card, navbar 같은 단순한 클래스 이름으로 버튼·카드·모달·폼을 스타일링하고, 내장 테마 시스템으로 다크 모드를 쉽게 전환할 수 있다. Tailwind 기반 프로젝트, 마크업 중심의 빠른 프로토타이핑, 정적 사이트나 HTML 템플릿, React를 포함한 모든 프레임워크 조합에서 유용하다.",
            },
            {
                "content_type": "comparison",
                "title": "daisyUI 비교 관점",
                "content": "컴포넌트 코드(JSX)를 제공하지 않고 CSS 클래스만 제공하므로 React 라이브러리가 아니다. Material UI·Ant Design처럼 컴포넌트를 import하는 방식이 아니라 Tailwind의 utility 클래스를 확장한 '컴포넌트 클래스'를 쓰는 방식이다. shadcn/ui가 소스 복사 방식이라면 daisyUI는 플러그인 설치만으로 어떤 마크업에서든 클래스 스타일을 쓸 수 있다.",
            },
            {
                "content_type": "install",
                "title": "daisyUI 설치",
                "content": "npm install -D daisyui 로 설치한 뒤, Tailwind CSS v4에서는 CSS 파일에 @plugin \"daisyui\"; 한 줄을 추가해 활성화한다. (이 프로젝트는 Tailwind CSS v4를 사용 중)",
            },
            {
                "content_type": "example",
                "title": "daisyUI 사용 예시",
                "content": "<button className=\"btn btn-primary\">저장</button>처럼 className만으로 스타일이 적용된다. 최상위 요소에 data-theme=\"dark\" 속성을 주어 테마를 전환하고, 필요한 컴포넌트 클래스를 Tailwind 유틸리티 클래스와 조합해 쓴다.",
            },
        ],
    },
    {
        "name": "Headless UI",
        "slug": "headless-ui",
        "category": "Tailwind / Flexible",
        "description": "Tailwind CSS 개발사가 만든, 접근성 로직만 제공하고 스타일은 개발자가 입히는 헤드리스 컴포넌트",
        "contents": [
            {
                "content_type": "introduction",
                "title": "Headless UI 소개",
                "content": "Headless UI는 Tailwind CSS 개발사가 만든 '스타일 없는(unstyled)' React 및 Vue용 컴포넌트 키트다. 접근성과 키보드 인터랙션을 처리하는 로직만 제공하고, 시각 스타일은 전적으로 개발자가 Tailwind로 입히는 구조를 목표로 한다.",
            },
            {
                "content_type": "features_use_case",
                "title": "Headless UI 특징과 활용",
                "content": "Dialog, Popover, Menu, Listbox, Combobox, Transition 등 '동작은 어렵고 스타일은 유연하게' 해야 하는 컴포넌트를 제공한다. Tailwind CSS를 이미 쓰는 프로젝트, 접근성을 보장하면서도 완전히 자유로운 비주얼을 원하는 프로젝트, 헤드리스 로직만 필요한 커스텀 UI에 적합하다.",
            },
            {
                "content_type": "comparison",
                "title": "Headless UI 비교 관점",
                "content": "Radix UI나 Base UI처럼 헤드리스라서 스타일이 없다는 점은 같지만, Tailwind CSS 개발사의 생태계에 속해 Tailwind 사용자에게 자연스럽게 어울린다. React Aria가 더 포괄적인 접근성·국제화 라이브러리라면, Headless UI는 핵심 컴포넌트의 인터랙션 로직에 집중한다. 완성된 디자인을 제공하는 Material UI·Ant Design과는 반대 방향의 접근법이다.",
            },
            {
                "content_type": "install",
                "title": "Headless UI 설치",
                "content": "npm install @headlessui/react  — React 전용 패키지다. Tailwind CSS와 함께 사용하도록 설계되었지만 Tailwind 자체가 필수는 아니다.",
            },
            {
                "content_type": "example",
                "title": "Headless UI 사용 예시",
                "content": "<Menu> 안에 <Menu.Button>과 <Menu.Items>를 구성해 메뉴를 만들고, <Menu.Items>의 className에 Tailwind 클래스를 직접 넣어 스타일링한다. 내부적으로 포커스 관리와 키보드 동작이 처리된다.",
            },
        ],
    },
    {
        "name": "React Aria",
        "slug": "react-aria",
        "category": "Unstyled / Primitive",
        "description": "Adobe가 만든 접근성·국제화 우선의 헤드리스 React 훅/컴포넌트 라이브러리",
        "contents": [
            {
                "content_type": "introduction",
                "title": "React Aria 소개",
                "content": "React Aria는 Adobe가 만든 '접근성 우선' React 훅·컴포넌트 라이브러리다. 화면 낭독기 호환성, 키보드 내비게이션, 포커스 관리, 국제화 처리까지 월드클래스 접근성 로직을 제공하고, 시각 디자인은 완전히 자유로운 헤드리스 방식을 목표로 한다.",
            },
            {
                "content_type": "features_use_case",
                "title": "React Aria 특징과 활용",
                "content": "useButton, useSelect, useDatePicker 같은 훅 세트와 react-aria-components의 커스터마이징 가능한 컴포넌트를 제공한다. 접근성 인증이 중요한 금융·정부·교육·글로벌 서비스, 국제화(i18n) 요구가 큰 화면, 완전한 디자인 제어가 필요한 디자인 시스템 구축 프로젝트에 적합하다.",
            },
            {
                "content_type": "comparison",
                "title": "React Aria 비교 관점",
                "content": "Radix UI·Base UI와 함께 대표적인 헤드리스 라이브러리지만, 접근성과 국제화 로직의 깊이에서 가장 강하다. Headless UI가 Tailwind 생태계에 속한다면 React Aria는 Adobe의 React Spectrum 생태계에 속한다. 스타일이 전혀 없어 비주얼 완성이 개발자 몫이며, 훅 기반 방식이라 마크업 구조도 직접 설계해야 한다.",
            },
            {
                "content_type": "install",
                "title": "React Aria 설치",
                "content": "npm install react-aria  — 통합 패키지로 설치하거나 @react-aria/button처럼 개별 패키지로 설치할 수 있다. UI 프레임워크가 아닌 접근성 로직 라이브러리임을 참고한다.",
            },
            {
                "content_type": "example",
                "title": "React Aria 사용 예시",
                "content": "useButton 훅에 ref를 전달해 접근성 속성(props)을 받아 버튼에 적용한다. react-aria-components를 사용하면 <Button>, <Select> 같은 스타일 없는 컴포넌트 구조를 제공받아 그 위에만 CSS나 Tailwind로 스타일을 입힌다.",
            },
        ],
    },
    {
        "name": "Radix UI",
        "slug": "radix-ui",
        "category": "Unstyled / Primitive",
        "description": "프리미티브별로 분리된 @radix-ui/react-* 패키지로 제공되는 접근성 내장 헤드리스 컴포넌트",
        "contents": [
            {
                "content_type": "introduction",
                "title": "Radix UI 소개",
                "content": "Radix UI는 '접근 가능한(headless) React 프리미티브' 라이브러리다. 하나의 큰 패키지가 아니라 Dialog, Select, Tooltip 같은 프리미티브별로 분리된 @radix-ui/react-* 패키지 모음으로 제공되며, 스타일 없는 상태에서 개발자가 완전한 제어를 하는 것을 목표로 한다.",
            },
            {
                "content_type": "features_use_case",
                "title": "Radix UI 특징과 활용",
                "content": "Dialog, Dropdown Menu, Select, Tabs, Tooltip, Toast 등 복잡한 인터랙션과 접근성 요구를 가진 프리미티브를 제공한다. 스타일을 완전히 자유롭게 입혀야 하는 디자인 시스템, Tailwind 등을 함께 쓰는 프로젝트, 정교한 컴포넌트를 직접 조립하는 개발 방식에 적합하다.",
            },
            {
                "content_type": "comparison",
                "title": "Radix UI 비교 관점",
                "content": "재사용 가능한 프리미티브를 조립해 컴포넌트를 만드는 방식으로, 완성 디자인을 주는 Material UI·Ant Design과 정반대다. Base UI와 비슷한 헤드리스 지향이지만, Radix는 프리미티브별 패키지 분리가 특징이고 접근성 로직이 내장되어 있다. shadcn/ui가 스타일을 얹은 Radix 기반 컴포넌트를 제공하는 것도 특징이다.",
            },
            {
                "content_type": "install",
                "title": "Radix UI 설치",
                "content": "npm install @radix-ui/react-dialog 처럼 필요한 프리미티브만 개별 패키지로 설치한다. 전체를 한 번에 설치하는 단일 패키지는 없다.",
            },
            {
                "content_type": "example",
                "title": "Radix UI 사용 예시",
                "content": "<Dialog.Root> 안에 <Dialog.Trigger>, <Dialog.Portal>, <Dialog.Content>를 조합해 모달을 만든다. 각 파트는 스타일이 없으므로 className이나 스타일 프레임워크로 직접 꾸민다.",
            },
        ],
    },
    {
        "name": "Base UI",
        "slug": "base-ui",
        "category": "Unstyled / Primitive",
        "description": "MUI 팀이 만든 헤드리스 React 컴포넌트 라이브러리, 현재 패키지명은 @base-ui/react",
        "contents": [
            {
                "content_type": "introduction",
                "title": "Base UI 소개",
                "content": "Base UI는 MUI(과거 Material-UI) 팀이 만든 '스타일 없는(headless)' React 컴포넌트 라이브러리다. Material UI의 스타일을 빼고 접근성과 동작 로직만 제공하며, 개발자가 시각 디자인을 완전히 제어할 수 있게 하는 목적을 가진다. 현재 공식 패키지명은 @base-ui/react다.",
            },
            {
                "content_type": "features_use_case",
                "title": "Base UI 특징과 활용",
                "content": "useButton, useSwitch 같은 훅과 Button, Select, Menu, NumberField 등 스타일 없는 컴포넌트를 제공한다. MUI 팀의 경험이 반영된 프리미티브가 필요하면서도 디자인을 자유롭게 제어하고 싶은 팀, Tailwind 등 다른 스타일 도구와 조합하는 프로젝트, 자체 디자인 시스템을 구축하는 곳에 적합하다.",
            },
            {
                "content_type": "comparison",
                "title": "Base UI 비교 관점",
                "content": "Material UI가 스타일이 포함된 완성형이라면, Base UI는 같은 조직이 만든 스타일 없는 프리미티브다. Radix UI처럼 프리미티브별로 분리된 것이 아니라 단일 @base-ui/react 패키지로 제공되는 점이 다르다. @mui/base는 구버전이며 현재는 @base-ui/react가 정식 대체 패키지다.",
            },
            {
                "content_type": "install",
                "title": "Base UI 설치",
                "content": "npm install @base-ui/react  — 현재 공식 패키지다. 과거 MUI가 제공하던 @mui/base 패키지는 사용하지 않는다.",
            },
            {
                "content_type": "example",
                "title": "Base UI 사용 예시",
                "content": "<Button> 컴포넌트 또는 useButton 훅을 사용해 접근성 로직만 받고, className이나 스타일 라이브러리로 비주얼을 직접 만든다. Material UI처럼 테마가 강제되지 않고, 스타일 없는 상태가 기본이다.",
            },
        ],
    },
    {
        "name": "Mantine",
        "slug": "mantine",
        "category": "All-in-One",
        "description": "100개 이상의 컴포넌트와 Hooks를 하나의 생태계로 제공하는 올인원 React UI 라이브러리",
        "contents": [
            {
                "content_type": "introduction",
                "title": "Mantine 소개",
                "content": "Mantine은 '올인원(all-in-one)' React 컴포넌트 라이브러리다. 100개 이상의 컴포넌트와 Hooks를 하나의 생태계로 제공하여, 프리미티브를 일일이 조립하지 않아도 완성된 UI와 기능을 함께 사용할 수 있게 하는 목적을 가진다.",
            },
            {
                "content_type": "features_use_case",
                "title": "Mantine 특징과 활용",
                "content": "Button, Modal, Table, Notification, Carousel, Timeline 등 방대한 컴포넌트와 useDisclosure, useForm 같은 생산성 훅스를 함께 제공한다. 스타트업 MVP, 관리자 대시보드, 데이터 밀도가 높은 내부 도구, 전체 UI 스택을 하나의 라이브러리로 빠르게 구성하려는 프로젝트에 적합하다.",
            },
            {
                "content_type": "comparison",
                "title": "Mantine 비교 관점",
                "content": "Material UI·Ant Design과 같은 완성형 Design System 계열이면서도, 컴포넌트 수와 훅스 생태계가 매우 넓어 '올인원'에 가깝다. 헤드리스 계열(Headless UI, Radix UI)이 로직만 제공한다면 Mantine은 완성된 비주얼과 로직을 함께 제공한다. Ant Design이 엔터프라이즈 데이터 화면에 강하다면, Mantine은 관리·대시보드·일반 앱 화면 전반에 균형 잡힌 선택지다.",
            },
            {
                "content_type": "install",
                "title": "Mantine 설치",
                "content": "npm install @mantine/core @mantine/hooks  — 두 패키지를 함께 설치하고 앱 루트에서 <MantineProvider>로 감싸 사용한다.",
            },
            {
                "content_type": "example",
                "title": "Mantine 사용 예시",
                "content": "<Button variant=\"filled\">처럼 props 기반으로 스타일을 지정하고, useDisclosure() 훅스로 모달 열림 상태를 간단히 관리한다. 전역 테마는 createTheme으로 만들어 MantineProvider에 전달할 수 있다.",
            },
        ],
    },
]

REQUIRED_TYPES = ["introduction", "features_use_case", "comparison", "install", "example"]


def verify_content(contents):
    """Ensure every library has all 5 required content types exactly once."""
    types = [c["content_type"] for c in contents]
    missing = [t for t in REQUIRED_TYPES if t not in types]
    if missing:
        raise ValueError(f"Missing content types: {missing}")
    dupes = {t for t in types if types.count(t) > 1}
    if dupes:
        raise ValueError(f"Duplicate content types: {dupes}")
    if len(contents) != len(REQUIRED_TYPES):
        raise ValueError(f"Expected {len(REQUIRED_TYPES)} chunks, got {len(contents)}")


def main():
    # --- data-loss guard: never delete lecture content that has embeddings ---
    db = SessionLocal()
    try:
        emb_count = db.query(Embedding).count()
    finally:
        db.close()
    if emb_count > 0:
        print(f"ABORTED: embeddings table has {emb_count} rows.")
        print("PHASE 7 seeding deletes/replaces lecture content; refusing to run while embeddings exist.")
        print("Run PHASE 8 embedding jobs instead, or clear embeddings intentionally first.")
        sys.exit(1)

    # --- validate seed data structure before touching the DB ---
    slugs = [lib["slug"] for lib in SEED_LIBRARIES]
    if len(slugs) != len(set(slugs)):
        raise ValueError("Duplicate library slug in seed data")
    for lib in SEED_LIBRARIES:
        verify_content(lib["contents"])

    init_db()  # idempotent: ensures tables + pgvector extension exist
    db = SessionLocal()
    try:
        print(f"=== Seeding {len(SEED_LIBRARIES)} libraries ===")

        for lib in SEED_LIBRARIES:
            # Idempotency: remove existing rows for this slug, then re-insert.
            existing = db.query(UILibrary).filter_by(slug=lib["slug"]).first()
            if existing:
                db.query(LectureContent).filter_by(library_id=existing.id).delete()
                db.delete(existing)
                db.commit()
                print(f"  Replaced existing: {lib['name']}")

            record = UILibrary(
                name=lib["name"],
                slug=lib["slug"],
                category=lib["category"],
                description=lib["description"],
            )
            db.add(record)
            db.flush()  # get record.id

            for i, chunk in enumerate(lib["contents"], start=1):
                db.add(
                    LectureContent(
                        library_id=record.id,
                        title=chunk["title"],
                        content=chunk["content"],
                        content_type=chunk["content_type"],
                        display_order=i,
                    )
                )
            db.commit()
            print(f"  Inserted: {lib['name']} ({len(lib['contents'])} chunks)")

        # --- summary ---
        print("\n=== Summary ===")
        print("Count per library:")
        rows = (
            db.query(UILibrary.name, LectureContent.content_type)
            .join(LectureContent, LectureContent.library_id == UILibrary.id)
            .all()
        )
        per_lib = {}
        per_type = {}
        for name, ctype in rows:
            per_lib[name] = per_lib.get(name, 0) + 1
            per_type[ctype] = per_type.get(ctype, 0) + 1
        for name in [l["name"] for l in SEED_LIBRARIES]:
            print(f"  {name}: {per_lib.get(name, 0)}")
        print("Count per content_type:")
        for ctype in REQUIRED_TYPES:
            print(f"  {ctype}: {per_type.get(ctype, 0)}")

        lib_count = db.query(UILibrary).count()
        content_count = db.query(LectureContent).count()
        emb_count = db.query(Embedding).count()

        assert lib_count == 10, f"Expected 10 libraries, got {lib_count}"
        assert 40 <= content_count <= 50, f"Expected 40-50 contents, got {content_count}"
        assert emb_count == 0, f"embeddings must stay 0, got {emb_count}"
        assert len(db.query(UILibrary).all()) == len(
            {l.slug for l in db.query(UILibrary).all()}
        ), "Duplicate slug detected"
        print(f"\nOK: {lib_count} libraries, {content_count} lecture contents, {emb_count} embeddings")
        print("PHASE 7 SEED COMPLETE")
    finally:
        db.close()


if __name__ == "__main__":
    main()
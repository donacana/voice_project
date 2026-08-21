import { ContentType, LibraryKey } from '../contexts/LectureContext'

export type { ContentType }

export interface LectureContent {
  id: string
  libraryKey: LibraryKey
  type: ContentType
  title: string
  text: string
  codeExample?: string
}

// Minimal local sample data for PHASE 4 UI testing only
// Real lecture data will come from PostgreSQL in later phases
export const sampleLectureData: LectureContent[] = [
  {
    id: 'mui-intro',
    libraryKey: 'material-ui',
    type: 'introduction',
    title: 'Material UI Introduction',
    text: 'Material UI is a React component library built to implement Google\'s Material Design. It provides a comprehensive suite of customizable components that follow Material Design principles.'
  },
  {
    id: 'mui-features',
    libraryKey: 'material-ui',
    type: 'features_use_case',
    title: 'Material UI Features',
    text: 'Material UI offers extensive customization through theming, comprehensive component library, and strong TypeScript support. Best used for enterprise applications requiring Material Design compliance.',
    codeExample: `import { Button, TextField } from '@mui/material';\n\nfunction MyComponent() {\n  return (\n    <>\n      <TextField label="Name" />\n      <Button variant="contained">Submit</Button>\n    </>\n  );\n}`
  },
  {
    id: 'ant-intro',
    libraryKey: 'ant-design',
    type: 'introduction',
    title: 'Ant Design Introduction',
    text: 'Ant Design is an enterprise-grade UI library for React. It\'s particularly strong for business applications and dashboards with a focus on consistency and accessibility.'
  },
  {
    id: 'chakra-intro',
    libraryKey: 'chakra-ui',
    type: 'introduction',
    title: 'Chakra UI Introduction',
    text: 'Chakra UI is an accessible React component library with a focus on developer experience. It provides simple, composable components built with React and styled with emotion.'
  },
  {
    id: 'shadcn-intro',
    libraryKey: 'shadcn',
    type: 'introduction',
    title: 'shadcn/ui Introduction',
    text: 'shadcn/ui is a collection of accessible, customizable React components built on Radix UI and Tailwind CSS. You copy and paste component code into your project.'
  },
  {
    id: 'radix-intro',
    libraryKey: 'radix-ui',
    type: 'introduction',
    title: 'Radix UI Introduction',
    text: 'Radix UI is a low-level, unstyled component library focused on providing accessible primitives for building design systems.'
  },
  {
    id: 'react-aria-intro',
    libraryKey: 'react-aria',
    type: 'introduction',
    title: 'React Aria Introduction',
    text: 'React Aria is a library of React hooks that provides accessible behavior and interactions for building UI components.'
  },
  {
    id: 'base-ui-intro',
    libraryKey: 'base-ui',
    type: 'introduction',
    title: 'Base UI Introduction',
    text: 'Base UI is an unstyled, accessible React component library providing the foundation for building design systems.'
  },
  {
    id: 'daisyui-intro',
    libraryKey: 'daisyui',
    type: 'introduction',
    title: 'daisyUI Introduction',
    text: 'daisyUI is a Tailwind CSS component library that adds pre-made components to Tailwind CSS, making development faster and easier.'
  },
  {
    id: 'headless-intro',
    libraryKey: 'headless-ui',
    type: 'introduction',
    title: 'Headless UI Introduction',
    text: 'Headless UI is a completely unstyled, accessible component library for React, built by Tailwind Labs. It pairs perfectly with Tailwind CSS.'
  },
  {
    id: 'mantine-intro',
    libraryKey: 'mantine',
    type: 'introduction',
    title: 'Mantine Introduction',
    text: 'Mantine is a React components library with 100+ hooks and components. It provides a complete design system with a strong focus on developer experience.'
  }
]

export function getLectureContent(libraryKey: LibraryKey, contentType: ContentType): LectureContent | undefined {
  return sampleLectureData.find(item => item.libraryKey === libraryKey && item.type === contentType)
}

export function getLibraryContentTypes(libraryKey: LibraryKey): ContentType[] {
  const types = sampleLectureData
    .filter(item => item.libraryKey === libraryKey)
    .map(item => item.type)
  return [...new Set(types)] as ContentType[]
}

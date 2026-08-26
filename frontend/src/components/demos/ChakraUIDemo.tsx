import React from 'react'
import {
  Badge,
  Box,
  Button,
  ChakraProvider,
  defaultSystem,
  Heading,
  Text,
} from '@chakra-ui/react'

const examples = [
  {
    label: '기본 버튼',
    code: `<Button variant="outline" color="#1a202c">
  저장
</Button>`,
    result: <Button variant="outline" color="#1a202c">저장</Button>,
  },
  {
    label: '스타일 적용 버튼',
    code: `<Button
  colorPalette="teal"
  color="white"
  size="lg"
  borderRadius="xl"
>
  저장
</Button>`,
    result: <Button colorPalette="teal" color="white" size="lg" borderRadius="xl">저장</Button>,
  },
]

export const ChakraUIDemo: React.FC = () => (
  <ChakraProvider value={defaultSystem}>
    <Box className="chakra-demo-surface" p={{ base: 4, md: 6 }} bg="#f7fafc" color="#1a202c">
      <Badge colorPalette="teal" variant="subtle" mb={2}>Props-based styling</Badge>
      <Heading as="h2" size="3xl" color="#1a202c" letterSpacing="tight">
        Chakra UI
      </Heading>
      <Text mt={2} mb={5} color="#4a5568" fontWeight="600">
        컴포넌트에 스타일 값을 props처럼 바로 작성하고 결과를 즉시 확인합니다.
      </Text>

      <div className="chakra-demo-grid">
        {examples.map(example => (
          <article key={example.label} className="chakra-demo-card">
            <div>
              <Badge colorPalette={example.label === '기본 버튼' ? 'gray' : 'teal'} mb={2}>
                {example.label}
              </Badge>
              <pre className="chakra-demo-code"><code>{example.code}</code></pre>
            </div>
            <div className="chakra-demo-result">{example.result}</div>
          </article>
        ))}
      </div>

      <Text mt={5} p={3} borderRadius="lg" bg="#e6fffa" color="#234e52" fontWeight="700">
        기본 → neutral / 적용 → teal + large + rounded. 코드의 props가 실제 버튼 차이로 그대로 드러납니다.
      </Text>
    </Box>
  </ChakraProvider>
)

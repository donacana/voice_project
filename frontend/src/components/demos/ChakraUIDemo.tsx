import React from 'react'
import {
  Box,
  Button,
  ChakraProvider,
  defaultSystem,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react'

// Code snippets shown side-by-side with the visual result.
const codeSnippets = [
  {
    label: '기본 버튼',
    code: `<Button>
  저장
</Button>`,
    render: <Button>저장</Button>,
  },
  {
    label: '스타일 적용 버튼',
    code: `<Button
  bg="blue.500"
  borderRadius="xl"
  p="4"
  color="white"
>
  저장
</Button>`,
    render: (
      <Button bg="blue.500" borderRadius="xl" p="4" color="white">
        저장
      </Button>
    ),
  },
]

export const ChakraUIDemo: React.FC = () => {
  return (
    <ChakraProvider value={defaultSystem}>
      <Box p={6} bg="#0f1117" minHeight="100%">
        <Heading as="h2" size="xl" mb={2} color="#646cff">
          Chakra UI
        </Heading>
        <Text color="#9ca3af" mb={6}>
          컴포넌트에 스타일 값을 props처럼 바로 작성 → 코드와 결과가 나란히
        </Text>

        <VStack gap={6} align="stretch">
          {codeSnippets.map((snippet, i) => (
            <Box
              key={i}
              bg="rgba(40, 40, 50, 0.8)"
              border="1px solid #444"
              borderRadius="md"
              p={4}
            >
              <HStack gap={4} align="stretch" flexWrap="wrap">
                {/* Code side */}
                <Box flex="1" minW="260px">
                  <Badge colorPalette="blue" mb={2}>{snippet.label}</Badge>
                  <Box
                    as="pre"
                    bg="rgba(0,0,0,0.4)"
                    border="1px solid #444"
                    borderRadius="md"
                    p={3}
                    color="#10b981"
                    fontFamily="Courier New, monospace"
                    fontSize="0.8rem"
                    lineHeight="1.7"
                    overflowX="auto"
                  >
                    {snippet.code}
                  </Box>
                </Box>

                {/* Result side */}
                <Box flex="1" minW="200px" display="flex" alignItems="center" justifyContent="center">
                  {snippet.render}
                </Box>
              </HStack>
            </Box>
          ))}

          <Box bg="rgba(40, 40, 50, 0.8)" border="1px solid #444" borderRadius="md" p={4}>
            <Text color="#9ca3af" fontSize="0.95rem" lineHeight="1.6">
              Chakra UI는 JSX와 CSS 파일을 오가는 작업을 줄이고,
              컴포넌트와 스타일을 가까운 곳에서 관리할 수 있게 해줍니다.
            </Text>
          </Box>
        </VStack>
      </Box>
    </ChakraProvider>
  )
}
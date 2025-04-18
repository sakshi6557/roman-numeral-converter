import { useState } from 'react';
import {
  TextField,
  Button,
  Text,
  View,
  Flex,
  Switch,
  Heading,
  Content,
  Header,
} from '@adobe/react-spectrum';
import axios from 'axios';

interface RomanNumeralConverterProps {
  isDark: boolean;
  onThemeChange: (isDark: boolean) => void;
}

interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  statusText: string;
  requestId: string;
}

export function RomanNumeralConverter({ isDark, onThemeChange }: RomanNumeralConverterProps) {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/romannumeral?query=${input}`);
      setOutput(response.data.output);
      setError(null);
    } catch (err: any) {
      const errorResponse = err.response?.data as ErrorResponse;
      setError(errorResponse?.message || 'An unexpected error occurred');
      setOutput(null);
    }
  };

  return (
    <View 
      height="100vh" 
      width="100vw" 
      UNSAFE_style={{ 
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}
    >
      <Flex 
        direction="column" 
        height="100%"
        width="100%"
      >
        <Header>
          <Flex 
            direction="row" 
            justifyContent="end"
            alignItems="center"
            width="100%"
            height="size-600"
            UNSAFE_style={{ paddingRight: 'var(--spectrum-global-dimension-size-600)' }}
          >
            <Flex 
              direction="row" 
              gap="size-100" 
              alignItems="center"
            >
              <Text>{isDark ? 'Dark Mode' : 'Light Mode'}</Text>
              <Switch
                isSelected={isDark}
                onChange={onThemeChange}
              />
            </Flex>
          </Flex>
        </Header>
        <Content>
          <Flex 
            direction="column" 
            alignItems="center" 
            justifyContent="center"
            height="100%"
            gap="size-400"
          >
            <Heading level={1} alignSelf="center">Roman Numeral Converter</Heading>
            <TextField
              label="Enter a number (1–3999)"
              value={input}
              onChange={setInput}
              width="size-3600"
              validationState={error ? "invalid" : undefined}
              errorMessage={error}
            />
            <Button 
              variant="cta" 
              onPress={handleConvert}
              isDisabled={!input}
            >
              Convert to roman numeral
            </Button>
            {output && (
              <View 
                padding="size-200"
                borderRadius="regular"
                backgroundColor="gray-100"
              >
                <Text>
                  <strong>Roman Numeral : </strong>
                  {output}
                </Text>
              </View>
            )}
          </Flex>
        </Content>
      </Flex>
    </View>
  );
} 
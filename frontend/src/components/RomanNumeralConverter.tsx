import { useState, useEffect } from 'react';
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

/**
 * Interface for the RomanNumeralConverter component props
 */
interface RomanNumeralConverterProps {
  isDark: boolean;
  onThemeChange: (isDark: boolean) => void;
}

/**
 * Interface for error responses from the API
 */
interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  statusText: string;
  requestId: string;
}

/**
 * RomanNumeralConverter Component
 * 
 * A React component that converts numbers to Roman numerals using Adobe React Spectrum components.
 * Features:
 * - Light/dark mode support
 * - Input validation
 * - Error handling
 * - Performance metrics
 * 
 * @param {RomanNumeralConverterProps} props - Component props
 * @returns {JSX.Element} The rendered component
 */
export function RomanNumeralConverter({ isDark, onThemeChange }: RomanNumeralConverterProps) {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Log component mount and theme changes
  useEffect(() => {
    console.log(`[RomanNumeralConverter] Component mounted in ${isDark ? 'dark' : 'light'} mode`);
    return () => {
      console.log('[RomanNumeralConverter] Component unmounted');
    };
  }, [isDark]);

  /**
   * Handles the conversion of a number to Roman numeral
   * Logs performance metrics and errors
   */
  const handleConvert = async () => {
    const startTime = performance.now();
    try {
      console.log(`[RomanNumeralConverter] Converting number: ${input}`);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await axios.get(`${apiUrl}/romannumeral?query=${input}`);
      
      const endTime = performance.now();
      const conversionDuration = endTime - startTime;
      
      // Enhanced logging with metrics
      console.log(`[RomanNumeralConverter] Conversion successful: ${input} -> ${response.data.output}`, {
        duration: `${conversionDuration.toFixed(2)}ms`,
        timestamp: new Date().toISOString(),
        input,
        output: response.data.output
      });
      
      setOutput(response.data.output);
      setError(null);
    } catch (err: any) {
      const errorResponse = err.response?.data as ErrorResponse;
      const errorMessage = errorResponse?.message || 'An unexpected error occurred';
      
      console.error(`[RomanNumeralConverter] Conversion error: ${errorMessage}`, {
        input,
        statusCode: err.response?.status,
        requestId: errorResponse?.requestId,
        timestamp: new Date().toISOString()
      });
      
      setError(errorMessage);
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
                aria-label="Toggle dark mode"
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
              aria-label="Number input"
            />
            <Button 
              variant="cta" 
              onPress={handleConvert}
              isDisabled={!input}
              aria-label="Convert number to roman numeral"
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
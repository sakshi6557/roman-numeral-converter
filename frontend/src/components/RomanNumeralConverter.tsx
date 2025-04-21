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
import axios, { AxiosError } from 'axios';

/**
 * Props interface for the RomanNumeralConverter component
 * @interface RomanNumeralConverterProps
 * @property {boolean} isDark - Current theme state (dark/light)
 * @property {(isDark: boolean) => void} onThemeChange - Callback function to toggle theme
 */
interface RomanNumeralConverterProps {
  isDark: boolean;
  onThemeChange: (isDark: boolean) => void;
}

/**
 * Interface for successful API response
 * @interface SuccessResponse
 * @property {string} input - Input number
 * @property {string} output - Roman numeral result
 * @property {number} statusCode - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {string} requestId - Unique request identifier
 * @property {string} duration - Request duration in milliseconds
 */
interface SuccessResponse {
  input: string;
  output: string;
  statusCode: number;
  statusText: string;
  requestId: string;
  duration: string;
}

/**
 * Interface for error API response
 * @interface ErrorResponse
 * @property {string} error - Error type identifier
 * @property {string} message - Human-readable error message
 * @property {number} statusCode - HTTP status code
 * @property {string} statusText - HTTP status text
 * @property {string} requestId - Unique request identifier
 * @property {string} [duration] - Request duration in milliseconds
 * @property {string} [input] - Input value that caused the error
 */
interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  statusText: string;
  requestId: string;
  duration?: string;
  input?: string;
}

/**
 * Validates if the input string represents a valid number between 1 and 3999
 * @param {string} value - The input string to validate
 * @returns {boolean} True if the input is valid, false otherwise
 * 
 * @example
 * // returns true
 * isValidInput('42');
 * 
 * @example
 * // returns false
 * isValidInput('4000');
 * 
 * @example
 * // returns false
 * isValidInput('invalid');
 */
const isValidInput = (value: string): boolean => {
  const num = parseInt(value);
  return !isNaN(num) && num >= 1 && num <= 3999;
};

/**
 * RomanNumeralConverter Component
 * 
 * A React component that converts numbers to Roman numerals using Adobe's React Spectrum components.
 * Features:
 * - Light/dark mode support
 * - Input validation
 * - Error handling
 * - Performance metrics
 * - Accessibility support
 * 
 * @component
 * @param {RomanNumeralConverterProps} props - Component props
 * @returns {JSX.Element} The rendered component
 * 
 * @example
 * <RomanNumeralConverter
 *   isDark={false}
 *   onThemeChange={(isDark) => console.log(`Theme changed to ${isDark ? 'dark' : 'light'}`)}
 * />
 */
export function RomanNumeralConverter({ isDark, onThemeChange }: RomanNumeralConverterProps): JSX.Element {
  // State management
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Effect hook to log component lifecycle events
   * Logs when the component mounts and unmounts, including the current theme
   * 
   * @effect
   * @param {boolean} isDark - Current theme state
   * @returns {() => void} Cleanup function
   */
  useEffect((): (() => void) => {
    console.log(`[RomanNumeralConverter] Component mounted in ${isDark ? 'dark' : 'light'} mode`);
    return (): void => {
      console.log('[RomanNumeralConverter] Component unmounted');
    };
  }, [isDark]);

  /**
   * Handles the conversion of a number to Roman numeral
   * - Validates input
   * - Makes API request
   * - Handles errors
   * - Logs performance metrics
   * 
   * @async
   * @function handleConvert
   * @returns {Promise<void>}
   * 
   * @throws {Error} If the API request fails
   */
  const handleConvert = async (): Promise<void> => {
    // Clear previous state
    setError(null);
    setOutput(null);

    // Validate input
    if (!isValidInput(input)) {
      const errorMessage = 'Invalid input. Please enter a number between 1 and 3999';
      setError(errorMessage);
      console.error('[RomanNumeralConverter] Input validation failed', {
        input,
        timestamp: new Date().toISOString()
      });
      return;
    }

    const startTime = performance.now();
    try {
      // Log conversion attempt
      console.log(`[RomanNumeralConverter] Converting number: ${input}`);
      
      // Make API request
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await axios.get<SuccessResponse>(`${apiUrl}/romannumeral?query=${input}`);
      
      // Calculate and log performance metrics
      const endTime = performance.now();
      const conversionDuration = endTime - startTime;
      
      console.log(`[RomanNumeralConverter] Conversion successful: ${input} -> ${response.data.output}`, {
        duration: `${conversionDuration.toFixed(2)}ms`,
        timestamp: new Date().toISOString(),
        input,
        output: response.data.output
      });
      
      setOutput(response.data.output);
    } catch (err: unknown) {
      // Handle and log errors
      const axiosError = err as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || 'An unexpected error occurred';
      setError(errorMessage);
      
      console.error(`[RomanNumeralConverter] Conversion error: ${errorMessage}`, {
        input,
        statusCode: axiosError.response?.status,
        timestamp: new Date().toISOString()
      });
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
        {/* Header with theme toggle */}
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

        {/* Main content */}
        <Content>
          <Flex 
            direction="column" 
            alignItems="center" 
            justifyContent="center"
            height="100%"
            gap="size-400"
          >
            <Heading level={1} alignSelf="center">Roman Numeral Converter</Heading>
            
            {/* Input field */}
            <TextField
              label="Enter a number (1–3999)"
              value={input}
              onChange={setInput}
              width="size-3600"
              validationState={error ? "invalid" : undefined}
              errorMessage={error}
              aria-label="Number input"
            />
            
            {/* Convert button */}
            <Button 
              variant="cta" 
              onPress={handleConvert}
              isDisabled={!input}
              aria-label="Convert number to roman numeral"
            >
              Convert to roman numeral
            </Button>
            
            {/* Output display */}
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
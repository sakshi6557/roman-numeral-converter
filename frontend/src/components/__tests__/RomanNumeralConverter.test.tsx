import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import axios from 'axios';
import { RomanNumeralConverter } from '../RomanNumeralConverter';

/**
 * Mock response type for successful API calls
 * @interface MockSuccessResponse
 * @property {string} output - Roman numeral result
 */
interface MockSuccessResponse {
  output: string;
}

/**
 * Mock error response type for failed API calls
 * @interface MockErrorResponse
 * @property {number} [status] - HTTP status code
 * @property {string} message - Error message
 */
interface MockErrorResponse {
  status?: number;
  message: string;
}

// Mock axios and console
vi.mock('axios');
const consoleSpy = vi.spyOn(console, 'log');
const consoleErrorSpy = vi.spyOn(console, 'error');

/**
 * Test suite for RomanNumeralConverter component
 * 
 * Tests include:
 * - Basic rendering
 * - Theme toggling
 * - Input validation
 * - API integration
 * - Error handling
 * - Component lifecycle
 * - Accessibility
 */
describe('RomanNumeralConverter', () => {
  /**
   * Mock props for the component
   * @type {Object}
   * @property {boolean} isDark - Initial theme state
   * @property {Function} onThemeChange - Theme change handler
   */
  const mockProps = {
    isDark: false,
    onThemeChange: vi.fn(),
  };

  /**
   * Reset all mocks before each test
   * @function
   */
  beforeEach(() => {
    vi.clearAllMocks();
    (axios.get as unknown as ReturnType<typeof vi.fn>).mockReset();
    consoleSpy.mockClear();
    consoleErrorSpy.mockClear();
  });

  /**
   * Basic rendering tests
   * Verifies that all required elements are present
   */
  it('renders the converter component with all required elements', () => {
    render(<RomanNumeralConverter {...mockProps} />);
    expect(screen.getByText('Roman Numeral Converter')).toBeInTheDocument();
    expect(screen.getByLabelText('Enter a number (1–3999)')).toBeInTheDocument();
    expect(screen.getByText('Convert to roman numeral')).toBeInTheDocument();
    expect(screen.getByText('Light Mode')).toBeInTheDocument();
  });

  /**
   * Theme toggle tests
   * Verifies theme switching functionality
   */
  it('toggles between light and dark mode', () => {
    const { rerender } = render(<RomanNumeralConverter {...mockProps} />);
    const switchElement = screen.getByRole('switch');
    
    fireEvent.click(switchElement);
    expect(mockProps.onThemeChange).toHaveBeenCalledWith(true);
    
    rerender(<RomanNumeralConverter {...mockProps} isDark={true} />);
    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
  });

  /**
   * Input validation tests
   * Verifies handling of various input scenarios
   */
  it('validates input and handles errors', async () => {
    render(<RomanNumeralConverter {...mockProps} />);
    const input = screen.getByLabelText('Enter a number (1–3999)');
    const convertButton = screen.getByText('Convert to roman numeral');
    
    // Test invalid inputs
    const invalidInputs = [
      { value: '0', message: 'Invalid input. Please enter a number between 1 and 3999' },
      { value: '4000', message: 'Invalid input. Please enter a number between 1 and 3999' },
      { value: 'invalid', message: 'Invalid input. Please enter a number between 1 and 3999' }
    ];

    for (const { value, message } of invalidInputs) {
      fireEvent.change(input, { target: { value } });
      fireEvent.click(convertButton);
      
      await waitFor(() => {
        expect(screen.getByText(message)).toBeInTheDocument();
      });
      
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          '[RomanNumeralConverter] Input validation failed',
          expect.objectContaining({
            input: value,
            timestamp: expect.any(String)
          })
        );
      });
    }

    // Test valid input
    fireEvent.change(input, { target: { value: '10' } });
    expect(convertButton).not.toBeDisabled();
  });

  /**
   * API integration tests
   * Verifies successful API calls and logging
   */
  it('handles successful conversion and logs metrics', async () => {
    const mockResponse: { data: MockSuccessResponse } = { data: { output: 'X' } };
    (axios.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockResponse);

    render(<RomanNumeralConverter {...mockProps} />);
    
    const input = screen.getByLabelText('Enter a number (1–3999)');
    fireEvent.change(input, { target: { value: '10' } });
    
    const convertButton = screen.getByText('Convert to roman numeral');
    fireEvent.click(convertButton);

    await waitFor(() => {
      expect(screen.getByText('X')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        '[RomanNumeralConverter] Converting number: 10'
      );
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/\[RomanNumeralConverter\] Conversion successful: 10 -> X/),
        expect.objectContaining({
          duration: expect.stringMatching(/\d+\.\d+ms/),
          timestamp: expect.any(String),
          input: '10',
          output: 'X'
        })
      );
    });
  });

  /**
   * Error handling tests
   * Verifies handling of various error scenarios
   */
  it('handles API errors and logs them', async () => {
    const errorScenarios: MockErrorResponse[] = [
      { status: 400, message: 'Invalid input' },
      { status: 500, message: 'Server error' },
      { message: 'Network error' }
    ];

    for (const scenario of errorScenarios) {
      (axios.get as unknown as ReturnType<typeof vi.fn>).mockRejectedValue({
        response: { status: scenario.status, data: { message: scenario.message } }
      });

      render(<RomanNumeralConverter {...mockProps} />);
      
      const input = screen.getByLabelText('Enter a number (1–3999)');
      fireEvent.change(input, { target: { value: '10' } });
      
      const convertButton = screen.getByText('Convert to roman numeral');
      fireEvent.click(convertButton);

      await waitFor(() => {
        expect(screen.getByText(scenario.message)).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          expect.stringMatching(/\[RomanNumeralConverter\] Conversion error/),
          expect.objectContaining({
            input: '10',
            timestamp: expect.any(String)
          })
        );
      });
      cleanup();
    }
  });

  /**
   * Component lifecycle tests
   * Verifies logging of mount/unmount events
   */
  it('logs component lifecycle events', () => {
    const { unmount } = render(<RomanNumeralConverter {...mockProps} />);
    expect(consoleSpy).toHaveBeenCalledWith('[RomanNumeralConverter] Component mounted in light mode');
    
    unmount();
    expect(consoleSpy).toHaveBeenCalledWith('[RomanNumeralConverter] Component unmounted');
  });

  /**
   * Accessibility tests
   * Verifies proper ARIA attributes
   */
  it('maintains proper accessibility attributes', () => {
    render(<RomanNumeralConverter {...mockProps} />);
    
    expect(screen.getByLabelText('Enter a number (1–3999)')).toHaveAttribute('aria-label', 'Number input');
    expect(screen.getByRole('switch')).toHaveAttribute('aria-label', 'Toggle dark mode');
    // expect(screen.getByRole('button', { name: 'Convert to roman numeral' })).toHaveAttribute('aria-label', 'Convert number to roman numeral');
  });
}); 
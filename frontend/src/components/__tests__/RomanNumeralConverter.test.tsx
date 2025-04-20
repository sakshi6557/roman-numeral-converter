import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import axios from 'axios';
import { RomanNumeralConverter } from '../RomanNumeralConverter';

// Mock axios and console
vi.mock('axios');
const consoleSpy = vi.spyOn(console, 'log');
const consoleErrorSpy = vi.spyOn(console, 'error');

describe('RomanNumeralConverter', () => {
  const mockProps = {
    isDark: false,
    onThemeChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (axios.get as any).mockReset();
    consoleSpy.mockClear();
    consoleErrorSpy.mockClear();
  });

  // Basic Rendering Tests
  it('renders the converter component with all required elements', () => {
    render(<RomanNumeralConverter {...mockProps} />);
    expect(screen.getByText('Roman Numeral Converter')).toBeInTheDocument();
    expect(screen.getByLabelText('Enter a number (1–3999)')).toBeInTheDocument();
    expect(screen.getByText('Convert to roman numeral')).toBeInTheDocument();
    expect(screen.getByText('Light Mode')).toBeInTheDocument();
  });

  // Theme Tests
  it('toggles between light and dark mode', () => {
    const { rerender } = render(<RomanNumeralConverter {...mockProps} />);
    const switchElement = screen.getByRole('switch');
    
    fireEvent.click(switchElement);
    expect(mockProps.onThemeChange).toHaveBeenCalledWith(true);
    
    rerender(<RomanNumeralConverter {...mockProps} isDark={true} />);
    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
  });

  // Input Validation Tests
  it('validates input range (1-3999)', async () => {
  // Error Handling and Logging Tests
    const errorScenarios = [
      {
        error: { response: { status: 400, data: { message: 'Number must be between 1 and 3999.' } } },
        input: '0',
        expectedMessage: 'Number must be between 1 and 3999.'
      },
      {
        error: { response: { status: 400, data: { message: 'Number must be between 1 and 3999.' } } },
        input: '4000',
        expectedMessage: 'Number must be between 1 and 3999.'
      },
      {
        error: { response: { status: 400, data: { message: 'Please provide a whole number (no decimals).' } } },
        input: '1.5',
        expectedMessage: 'Please provide a whole number (no decimals).'
      }
    ];

    for (const scenario of errorScenarios) {
      (axios.get as any).mockRejectedValue(scenario.error);
      render(<RomanNumeralConverter {...mockProps} />);
      
      const input = screen.getByLabelText('Enter a number (1–3999)');
      fireEvent.change(input, { target: { value: scenario.input } });
      
      const convertButton = screen.getByText('Convert to roman numeral');
      fireEvent.click(convertButton);

      await waitFor(() => {
        expect(screen.getByText(scenario.expectedMessage)).toBeInTheDocument();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          expect.stringMatching(/\[RomanNumeralConverter\] Conversion error/),
          expect.objectContaining({
            input: scenario.input,
            timestamp: expect.any(String)
          })
        );
      });
      cleanup();
    }
  });


  // API Integration and Logging Tests
  it('handles successful conversion and logs metrics', async () => {
    const mockResponse = { data: { output: 'X' } };
    (axios.get as any).mockResolvedValue(mockResponse);

    render(<RomanNumeralConverter {...mockProps} />);
    
    const input = screen.getByLabelText('Enter a number (1–3999)');
    fireEvent.change(input, { target: { value: '10' } });
    
    const convertButton = screen.getByText('Convert to roman numeral');
    fireEvent.click(convertButton);

    await waitFor(() => {
      expect(screen.getByText('X')).toBeInTheDocument();
      expect(consoleSpy).toHaveBeenCalledWith(
        '[RomanNumeralConverter] Converting number: 10'
      );
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

  // Error Handling and Logging Tests
  it('handles various error scenarios and logs errors', async () => {
    const errorScenarios = [
      {
        error: { response: { status: 400, data: { message: 'Invalid input' } } },
        input: 'invalid',
        expectedMessage: 'Invalid input'
      },
      {
        error: { response: { status: 500, data: { message: 'Server error' } } },
        input: '10',
        expectedMessage: 'Server error'
      },
      {
        error: { message: 'Network error' },
        input: '10',
        expectedMessage: 'An unexpected error occurred'
      }
    ];

    for (const scenario of errorScenarios) {
      (axios.get as any).mockRejectedValue(scenario.error);
      render(<RomanNumeralConverter {...mockProps} />);
      
      const input = screen.getByLabelText('Enter a number (1–3999)');
      fireEvent.change(input, { target: { value: scenario.input } });
      
      const convertButton = screen.getByText('Convert to roman numeral');
      fireEvent.click(convertButton);

      await waitFor(() => {
        expect(screen.getByText(scenario.expectedMessage)).toBeInTheDocument();
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          expect.stringMatching(/\[RomanNumeralConverter\] Conversion error/),
          expect.objectContaining({
            input: scenario.input,
            timestamp: expect.any(String)
          })
        );
      });
      cleanup();
    }
  });

  // Component Lifecycle Tests
  it('logs component lifecycle events', () => {
    const { unmount } = render(<RomanNumeralConverter {...mockProps} />);
    expect(consoleSpy).toHaveBeenCalledWith('[RomanNumeralConverter] Component mounted in light mode');
    
    unmount();
    expect(consoleSpy).toHaveBeenCalledWith('[RomanNumeralConverter] Component unmounted');
  });

  // Accessibility Tests
  it('maintains proper accessibility attributes', () => {
    render(<RomanNumeralConverter {...mockProps} />);
    
    expect(screen.getByLabelText('Enter a number (1–3999)')).toHaveAttribute('aria-label', 'Number input');
    expect(screen.getByRole('switch')).toHaveAttribute('aria-label', 'Toggle dark mode');
    expect(screen.getByText('Convert to roman numeral')).toBeInTheDocument();
  });
}); 
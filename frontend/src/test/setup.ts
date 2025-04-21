import '@testing-library/jest-dom';
import { expect, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

// Mock CSS imports
vi.mock('@react-spectrum/theme-dark', () => ({
  default: {}
}));
vi.mock('@react-spectrum/theme-light', () => ({
  default: {}
}));

// Mock CSS files
vi.mock('*.css', () => ({}));

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// Mock console methods
vi.spyOn(console, 'log').mockImplementation(() => {});
vi.spyOn(console, 'error').mockImplementation(() => {}); 
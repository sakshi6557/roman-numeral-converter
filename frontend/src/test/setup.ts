import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
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

// Cleanup after each test
afterEach(() => {
  cleanup();
}); 
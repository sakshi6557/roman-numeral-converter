import '@testing-library/jest-dom';
import { expect} from 'vitest';
import { vi } from 'vitest';


// Extend expect with custom matchers
expect.extend({
  toBeInTheDocument: (received) => {
    const pass = document.body.contains(received);
    return {
      pass,
      message: () => `expected ${received} to be in the document`,
    };
  },
});

// Mock console methods
vi.spyOn(console, 'log').mockImplementation(() => {});
vi.spyOn(console, 'error').mockImplementation(() => {}); 
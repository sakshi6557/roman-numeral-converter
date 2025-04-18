// client/src/App.tsx

import { useState, useEffect } from 'react';
import {
  Provider,
  defaultTheme,
} from '@adobe/react-spectrum';
import { RomanNumeralConverter } from './components/RomanNumeralConverter';

function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <Provider theme={defaultTheme} colorScheme={isDark ? 'dark' : 'light'}>
      <RomanNumeralConverter 
        isDark={isDark} 
        onThemeChange={setIsDark} 
      />
    </Provider>
  );
}

export default App;

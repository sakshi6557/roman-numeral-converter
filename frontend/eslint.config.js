import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import testingLibraryPlugin from 'eslint-plugin-testing-library'
import vitestPlugin from 'eslint-plugin-vitest'
import globals from 'globals'
import { readFileSync } from 'fs'
import { join } from 'path'

// Read .gitignore file
export default [
  {
    ignores: ['dist/**', '**/*.d.ts']
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
        JSX: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
      'testing-library': testingLibraryPlugin,
      'vitest': vitestPlugin
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...testingLibraryPlugin.configs.react.rules,
      ...vitestPlugin.configs.recommended.rules,
      
      // Custom rules
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-prototype-builtins': 'off',
      'no-empty': 'off',
      'no-cond-assign': 'off',
      'no-func-assign': 'off',
      'no-fallthrough': 'off',
      'no-control-regex': 'off',
      'no-useless-escape': 'off',
      'valid-typeof': 'off',
      'getter-return': 'off',
      'no-undef': 'off'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  {
    files: ['**/*.test.{ts,tsx}'],
    rules: {
      'testing-library/no-node-access': 'off',
      'testing-library/no-container': 'off',
      'testing-library/no-render-in-setup': 'off',
      'testing-library/no-manual-cleanup': 'off',
      'testing-library/no-wait-for-multiple-assertions': 'off',
      'testing-library/render-result-naming-convention': 'off'
    }
  }
]

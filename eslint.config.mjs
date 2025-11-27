// @ts-check

import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import eslint from '@eslint/js'

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    rules:
    {
      'no-trailing-spaces': ['error', { skipBlankLines: false, ignoreComments: true }],
    }
  }
)

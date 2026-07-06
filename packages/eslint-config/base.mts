import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default defineConfig(
    globalIgnores(['dist/**', 'coverage/**', 'reports/**']),
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        extends: [js.configs.recommended, tseslint.configs.recommendedTypeChecked, tseslint.configs.stylisticTypeChecked, prettier],
    },
    {
        files: ['**/*.spec.ts'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
        },
    },
    {
        files: ['**/*.{js,mjs,cjs}', 'eslint.config.{ts,mts,cts}'],
        extends: [tseslint.configs.disableTypeChecked],
    },
);

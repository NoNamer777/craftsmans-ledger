import { defineConfig } from 'eslint/config';
import base from './base.mts';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

export default defineConfig(base, {
    files: ['*.mts'],
    languageOptions: {
        parserOptions: {
            projectService: true,
            tsconfigRootDir: dirname(fileURLToPath(import.meta.url)),
        },
    },
});

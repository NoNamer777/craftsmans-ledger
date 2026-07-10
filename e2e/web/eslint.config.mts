import base from '@craftsmans-ledger/eslint-config/base';
import { defineConfig } from 'eslint/config';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

export default defineConfig(base, {
    files: ['**/*.ts'],
    languageOptions: {
        parserOptions: {
            projectService: true,
            tsconfigRootDir: dirname(fileURLToPath(import.meta.url)),
        },
    },
});

import angular from '@craftsmans-ledger/eslint-config/angular';
import { defineConfig } from 'eslint/config';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

export default defineConfig(angular, {
    files: ['**/*.ts'],
    languageOptions: {
        parserOptions: {
            projectService: true,
            tsconfigRootDir: dirname(fileURLToPath(import.meta.url)),
        },
    },
});

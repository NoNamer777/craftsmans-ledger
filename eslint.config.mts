import base from '@craftsmans-ledger/eslint-config/base';
import { defineConfig, globalIgnores } from 'eslint/config';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

export default defineConfig(
    globalIgnores(['apps/**', 'libs/**', 'packages/**']),
    {
        files: ['*.js', '*.mjs', '*.cjs', '*.ts', '*.mts'],
        extends: [base],
    },
    {
        files: ['*.ts', '*.mts'],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: dirname(fileURLToPath(import.meta.url)),
            },
        },
    },
);

import base from '@craftsmans-ledger/eslint-config/base';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig(
    globalIgnores(['apps/**', 'libs/**', 'packages/**']),
    {
        files: ['*.js', '*.mjs', '*.cjs', '*.ts'],
        extends: [base],
    },
);

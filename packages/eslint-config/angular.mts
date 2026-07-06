import angular from 'angular-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import base from './base.mts';

const { processInlineTemplates } = angular;

const tsConfig = processInlineTemplates
    ? {
          files: ['**/*.ts'],
          extends: [angular.configs.tsRecommended],
          processor: processInlineTemplates,
      }
    : {
          files: ['**/*.ts'],
          extends: [angular.configs.tsRecommended],
      };

export default defineConfig(
    base,
    globalIgnores(['.angular/**']),
    tsConfig,
    {
        files: ['**/*.html'],
        extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    },
);

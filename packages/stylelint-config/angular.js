import base from './base.js';

export default {
    ...base,
    rules: {
        ...base.rules,
        'scss/at-rule-no-unknown': [
            true,
            {
                ignoreAtRules: ['theme', 'utility', 'variant', 'apply', 'plugin', 'source'],
            },
        ],
    },
};

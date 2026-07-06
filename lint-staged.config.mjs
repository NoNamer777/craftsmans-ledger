export default {
    '*': 'prettier -w',
    '*.{ts,js,mjs,cjs}': 'eslint --fix',
    '*.scss': 'stylelint --fix',
};

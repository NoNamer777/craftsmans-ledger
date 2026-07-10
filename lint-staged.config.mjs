export default {
    '*.{ts,js,mjs,cjs,mts,cts}': ['eslint --fix', 'prettier -w'],
    '*.scss': ['stylelint --fix', 'prettier -w'],
    '*.md': 'markdownlint-cli2 --fix',
    '!(*.{ts,js,mjs,cjs,mts,cts,scss,md})': 'prettier -w',
};

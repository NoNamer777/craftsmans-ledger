export default {
    '*.{ts,js,mjs,cjs,mts,cts}': ['eslint --fix', 'prettier -w'],
    '*.scss': ['stylelint --fix', 'prettier -w'],
    '!(*.{ts,js,mjs,cjs,mts,cts,scss})': 'prettier -w',
};

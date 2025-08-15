const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');
const { swcDefaultsFactory } = require('@nestjs/cli/lib/compiler/defaults/swc-defaults');

const runsInProductionMode = process.env['NODE_ENV'] === 'production';

module.exports = {
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'swc-loader',
                    options: swcDefaultsFactory().swcOptions,
                },
            },
        ],
    },
    output: {
        path: join(__dirname, '../../dist/apps/api'),
    },
    plugins: [
        new NxAppWebpackPlugin({
            assets: ['./src/assets'],
            compiler: 'tsc',
            generatePackageJson: runsInProductionMode,
            main: './src/main.ts',
            optimization: runsInProductionMode,
            outputHashing: 'none',
            sourceMap: false,
            target: 'node',
            tsConfig: './tsconfig.app.json',
        }),
    ],
};

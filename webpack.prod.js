const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserWPPlugin = require("terser-webpack-plugin"); //минимизирует js файлы.

module.exports = merge(common, {
    mode: 'production',

    optimization: {
        minimizer: [
            new CssMinimizerPlugin({
                test: /\.css$/,
            }),

            new TerserWPPlugin()
        ],
    },
})

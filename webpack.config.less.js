/** 
 * Used to compile all less file to single dica.css
 * Generated main.js will be removed after compiling
 */
const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');

const config = {
    resolve: {
        extensions: ['*', '.js', '.jsx'],
        alias: {
            Src: path.join(__dirname, './src')
        },
        modules: ['node_modules'],
        fallback: {
            crypto: require.resolve("crypto-browserify"),
            constants: require.resolve("constants-browserify"),
            stream: require.resolve("stream-browserify"),
            buffer: require.resolve("buffer/"),
            https: require.resolve("https-browserify"),
            http: require.resolve("stream-http"),
            assert: require.resolve("assert/")
        }
    },
    entry: [
        path.resolve(__dirname, './src/index.js'),
    ],
    mode: 'development',
    target: 'web',
    output: {
        path: path.resolve(__dirname, 'lib')
    },
    plugins: [
        new MiniCssExtractPlugin(
            {
                filename: "dica.css",
            },
        ),
        new RemovePlugin({
            after: {
                root: '.',
                include: [
                    './lib/main.js',
                    './es/main.js'
                ]
            }
        }),

        new webpack.IgnorePlugin({ resourceRegExp: /(\.txt$)/ })
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader'
                }]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader'
                    }
                ],
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader', // translates CSS into CommonJS
                    {
                        loader: 'less-loader', // compiles Less to CSS
                        options: {
                            sourceMap: false,
                            lessOptions: {
                                javascriptEnabled: true
                            }
                        }
                    }]
            }
        ]
    }
};

module.exports = [
    config, // output to lib
    { // output to es
        ...config, output: {
            path: path.resolve(__dirname, 'es')
        }
    }];
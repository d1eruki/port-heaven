const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    entry: './src/js/scripts.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'scripts.js',
        publicPath: '/',
        clean: true,
    },
    mode: 'production',
    devServer: process.env.NODE_ENV === 'development' ? {
        static: path.join(__dirname, 'dist'),
        port: 8080,
        open: true,
    } : {},
    resolve: {
        alias: {
            vue: 'vue/dist/vue.esm-bundler.js'
        },
        extensions: ['.js', '.vue', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/images/[name][ext]',
                },
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.scss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require('autoprefixer'),
                                    require('tailwindcss'),
                                ],
                            },
                        },
                    },
                    'sass-loader'
                ],
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                ],
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            filename: 'index.html',
            inject: true,
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.css',
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/assets/images', to: 'assets/images' },
            ],
        }),
    ],
};

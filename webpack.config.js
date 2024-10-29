const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader'); // Импортируем из vue-loader

module.exports = {
    entry: './src/js/scripts.js', // Входной файл (твой основной файл JS)
    output: {
        path: path.resolve(__dirname, 'dist'), // Папка для выхода, например, "dist"
        filename: 'scripts.js', // Имя выходного файла
        //publicPath: '/', // этот путь будет добавлен к каждому ресурсу
        clean: true, // очищает выходную папку перед сборкой
    },
    mode: 'production', // Используем "production" для минификации кода
    devServer: {
        static: path.join(__dirname, 'dist'), // Корневая папка для сервера
        port: 8080, // Порт для сервера
        open: false, // Открывает браузер при запуске
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.esm-bundler.js' // использование полной версии Vue
        },
        extensions: ['.js', '.vue', '.json'], // разрешаемые расширения файлов
    },
    module: {
        rules: [
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
                test: /\.scss$/i, // обработка SCSS файлов
                use: [
                    MiniCssExtractPlugin.loader, // Извлечение CSS в отдельный файл
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require('autoprefixer'), // Используйте autoprefixer
                                    require('tailwindcss'),
                                ],
                            },
                        },
                    },
                    'sass-loader' // компилирует Sass в CSS
                ],
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader, // Извлечение CSS в отдельный файл
                    'css-loader',
                    'postcss-loader',
                ],
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: 'src/index.html', // исходный HTML
            filename: 'index.html',
            inject: true, // Вставляет скрипты и стили автоматически
        }),
        new MiniCssExtractPlugin({ // Настройка плагина
            filename: 'styles.css', // Имя выходного CSS файла
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/assets/images', to: 'assets/images' }, // Копирование изображений из src в dist
            ],
        }),
    ],
};

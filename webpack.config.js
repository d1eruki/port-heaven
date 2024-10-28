const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/js/scripts.js', // Входной файл (твой основной файл JS)
    output: {
        path: path.resolve(__dirname, 'dist'), // Папка для выхода, например, "dist"
        filename: 'scripts.js', // Имя выходного файла
        //publicPath: '/', // этот путь будет добавлен к каждому ресурсу
        clean: true, // очищает выходную папку перед сборкой
    },
    module: {
        rules: [
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
    mode: 'production', // Используем "production" для минификации кода
    devServer: {
        static: path.join(__dirname, 'dist'), // Корневая папка для сервера
        port: 8080, // Порт для сервера
        open: false, // Открывает браузер при запуске
    }
};

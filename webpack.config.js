const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: '/src/js/scripts.js', // Входной файл (твой основной файл JS)
    output: {
        path: path.resolve(__dirname, 'docs'), // Папка для выхода, например, "docs"
        filename: 'src/js/scripts.js', // Имя выходного файла
        publicPath: '/', // этот путь будет добавлен к каждому ресурсу
        clean: true, // очищает выходную папку перед сборкой
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg|ico)$/i, // изображения
                type: 'asset/resource', // автоматически копирует в выходную папку и генерирует путь
                generator: {
                    filename: 'assets/images/[name][ext]', // настройка папки для изображений
                },
            },
            {
                test: /\.css$/i,
                exclude: /exclude-this-file\.css$/, // Укажите файл или паттерн, который нужно исключить
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html', // исходный HTML
            filename: 'index.html',
            inject: false, // Вставляет скрипты и стили автоматически
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/assets', to: 'src/assets' }, // Копирование изображений
            ],
        }),
    ],
    mode: 'production' // Используем "production" для минификации кода
};

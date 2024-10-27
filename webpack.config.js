const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/scripts/scripts.js', // Входной файл (твой основной файл JS)
    output: {
        filename: 'scripts.js', // Имя выходного файла
        path: path.resolve(__dirname, 'docs'), // Папка для выхода, например, "dist"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html', // путь к шаблону index.html
            filename: 'index.html', // выходное имя файла
        }),
    ],
    mode: 'production' // Используем "production" для минификации кода
};

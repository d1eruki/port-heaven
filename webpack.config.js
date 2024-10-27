const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/scripts/scripts.js', // Входной файл (твой основной файл JS)
    output: {
        filename: 'scripts.js', // Имя выходного файла
        path: path.resolve(__dirname, 'docs'), // Папка для выхода, например, "dist"
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src'), // копируем всю папку src
                    to: path.resolve(__dirname, 'docs'), // в папку docs
                    globOptions: {
                        ignore: ['**/*.js', '**/*.scss'], // исключаем index.html и js (если они собираются)
                    },
                },
            ],
        }),
    ],
    mode: 'production' // Используем "production" для минификации кода
};

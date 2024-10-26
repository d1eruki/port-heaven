const fs = require('fs');
const path = require('path');

// Путь к файлу package.json
const packageJsonPath = path.join(__dirname, 'package.json');

// Чтение файла package.json
fs.readFile(packageJsonPath, 'utf-8', (err, data) => {
    if (err) {
        console.error('Ошибка при чтении package.json:', err);
        return;
    }

    try {
        const packageJson = JSON.parse(data);

        // Комментарии к зависимостям
        const devDependenciesComments = {
            "autoprefixer": "Добавляет вендорные префиксы к CSS для лучшей совместимости с браузерами.",
            "npm-run-all": "Позволяет запускать несколько npm-скриптов параллельно или последовательно.",
            "postcss": "Постобработка CSS, позволяет использовать плагины для обработки стилей.",
            "sass": "Препроцессор для компиляции SCSS в CSS.",
            "tailwindcss": "CSS-фреймворк для создания пользовательских интерфейсов с помощью утилитарных классов."
        };

        const dependenciesComments = {
            "postcss-cli": "CLI-интерфейс для PostCSS, позволяет использовать его в командной строке."
        };

        // Генерация содержимого для README.md
        const readmeContent = `# ${packageJson.name}\n\n` +
            `## Версия\n` +
            `${packageJson.version}\n\n` +
            `## Описание\n` +
            `${packageJson.description || 'Нет описания.'}\n\n` +
            `## Ключевые слова\n` +
            `${packageJson.keywords && packageJson.keywords.length ? packageJson.keywords.join(', ') : 'Нет ключевых слов.'}\n\n` +
            `## Автор\n` +
            `${packageJson.author || 'Нет информации об авторе.'}\n\n` +
            `## Лицензия\n` +
            `${packageJson.license || 'Нет информации о лицензии.'}\n\n` +
            `## Скрипты\n` +
            '### Доступные команды\n' +
            Object.keys(packageJson.scripts).map(script => `- **${script}**: ${packageJson.scripts[script]}`).join('\n') + '\n\n' +
            `## Зависимости\n` +
            '### devDependencies\n' +
            Object.entries(packageJson.devDependencies).map(([key, value]) =>
                `- ${key}: ${value} - ${devDependenciesComments[key] || 'Нет комментария.'}`).join('\n') + '\n\n' +
            '### dependencies\n' +
            Object.entries(packageJson.dependencies).map(([key, value]) =>
                `- ${key}: ${value} - ${dependenciesComments[key] || 'Нет комментария.'}`).join('\n') + '\n';

        // Запись содержимого в README.md
        fs.writeFile(path.join(__dirname, 'README.md'), readmeContent, (err) => {
            if (err) {
                console.error('Ошибка при записи README.md:', err);
            } else {
                console.log('README.md успешно сгенерирован!');
            }
        });
    } catch (parseError) {
        console.error('Ошибка при парсинге package.json:', parseError);
    }
});

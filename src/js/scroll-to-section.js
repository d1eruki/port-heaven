document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Отменяем стандартное поведение

        const targetId = this.getAttribute('href'); // Получаем ID цели
        const targetElement = document.querySelector(targetId); // Находим элемент
        const headerHeight = document.querySelector('header').offsetHeight; // Высота хэдера

        if (targetElement) {
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset; // Позиция элемента
            window.scrollTo({
                top: targetPosition - headerHeight - headerHeight, // Дважды вычитаем высоту хэдера: для перекрытия и отступа
                behavior: 'smooth' // Плавная прокрутка
            });
        }
    });
});

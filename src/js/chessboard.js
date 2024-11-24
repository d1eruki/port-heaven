export const generateChessboard = () => {
    const chess = document.querySelector('.chess');
    let htmlContent = '';
    let currentColor = 'white';

    for (let i = 0; i < 324; i++) {
        if (i > 0 && i % 18 === 0) {
            htmlContent += `<div class="${currentColor}"></div>`;
        } else {
            currentColor = (currentColor === 'white') ? 'black' : 'white';
            htmlContent += `<div class="${currentColor}"></div>`;
        }
    }

    chess.innerHTML = htmlContent;
};

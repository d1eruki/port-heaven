import VanillaTilt from 'vanilla-tilt';

document.addEventListener('DOMContentLoaded', () => {
    const pok = document.querySelector(".pok");
    if (pok) {
        VanillaTilt.init(pok, {
            speed: 1000,
            easing: "cubic-bezier(0.23, 1, 0.32, 1)",
            transition: true,
            glare: true,
            "max-glare": 0.35
        });

        pok.addEventListener('mouseleave', () => {
            pok.style.transition = 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
            pok.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
        });
    }
});

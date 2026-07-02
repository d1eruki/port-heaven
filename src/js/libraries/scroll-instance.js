let activeLenis = null;

export const setActiveLenis = (lenis) => {
  activeLenis = lenis || null;
};

export const getActiveLenis = () => activeLenis;

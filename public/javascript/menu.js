let ham = document.querySelector('.hamburger');
let ham2 = document.querySelector('.hamburger2');
const shade = document.querySelector('.app__blackout');
const page = document.querySelector('.app__wrapper');
const nav = document.querySelector('.app__nav ');
ham.addEventListener('click', () => {
    shade.style.display = 'block';
    page.style.overflow = 'hidden';
    nav.style.transform = 'translateX(0%)';
});
ham2.addEventListener('click', () => {
    shade.style.display = 'none';
    page.style.overflow = 'inherit';
    nav.style.transform = 'translateX(-100%)';
});


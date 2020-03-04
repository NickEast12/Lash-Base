let ham = document.querySelector('.menu__button');
let ham2 = document.querySelector('.cancel__menu');
const shade = document.querySelector('.app__blackout');
const page = document.querySelector('.app__wrapper');
const nav = document.querySelector('.app__nav ');
const searchBocBtn = document.querySelector('.search--active');
const searchBlock = document.querySelector('.header__search');
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
searchBocBtn.addEventListener('click', () => {
    if (searchBlock.style.display === 'block') {
        searchBlock.style.display = 'none'
    } else {
        searchBlock.style.display = 'block';
    }

});


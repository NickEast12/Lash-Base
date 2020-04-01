import autocomplete from "./modules/autocomplete";
import typeAhead from "./modules/typeAhead";
import menu from "./modules/menu";
import makeMap from './modules/map';
import favAjax from './modules/favourites';
import booking from './modules/bookingPop';

const address = document.querySelector("#address");
const latInput = document.querySelector("#lat");
const lngInput = document.querySelector("#lng");

const map = document.querySelector('#map');

// let ham = document.querySelector('.menu__button');
// let ham2 = document.querySelector('.hamburger2');
// const shade = document.querySelector('.app__blackout');
// const page = document.querySelector('.app__wrapper');
// const nav = document.querySelector('.app__nav ');
// const searchBocBtn = document.querySelector('.search--active');
// const searchBlock = document.querySelector('.header__search');

const searchBox = document.querySelector('.header__search');

autocomplete(address, latInput, lngInput);

typeAhead(searchBox);

makeMap(map);

const heartForm = document.querySelector('.favourites__form');
let checkForm = () => {
    if (!heartForm) {
        return;
    } else {
        heartForm.addEventListener('submit', favAjax);
    }
}

checkForm();

booking();

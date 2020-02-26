import autocomplete from "./modules/autocomplete";

const address = document.querySelector("#address");
const latInput = document.querySelector("#lat");
const lngInput = document.querySelector("#lng");

autocomplete(address, latInput, lngInput);

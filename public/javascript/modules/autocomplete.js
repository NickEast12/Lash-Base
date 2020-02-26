function autocomplete(input, latInput, lngInput) {
  if (!input) return; //? don't run if there is no imput

  const dropdown = new google.maps.places.Autocomplete(input);

  dropdown.addListener("place_changed", () => {
    const place = dropdown.getPlace();
    console.log(place);
    latInput.value = place.geometry.location.lat();
    lngInput.value = place.geometry.location.lng();
  });
}

export default autocomplete;

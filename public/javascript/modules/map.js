import axios from 'axios';
const input = document.querySelector('.autocomplete__input');

const mapOptions = {
    center: { lat: 51.3889, lng: 0.1403 },
    zoom: 9,
    styles: [
        {
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f5f5f5"
                }
            ]
        },
        {
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#f49fe3"
                }
            ]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#f5f5f5"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#f49fe3"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#eeeeee"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#f49fe3"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#e5e5e5"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#9e9e9e"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#f49fe3"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dadada"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#616161"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#f49fe3"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#e5e5e5"
                }
            ]
        },
        {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#eeeeee"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#9e9e9e"
                }
            ]
        }
    ]
};

function loadPlaces(map, lat = 51.3614, lng = 0.1940) {
    axios.get(`/api/nearby/?lat=${lat}&lng=${lng}`)
        .then(res => {
            const places = res.data;
            if (!places.length) {
                console.log('no places found');
                alert('no places found');
                input.placeholder = "No stores found";
                return;
            };

            const bounds = new google.maps.LatLngBounds();

            const infoWindow = new google.maps.InfoWindow();

            const markers = places.map(place => {
                const [placeLng, placeLat] = place.location.coordinates
                const position = { lat: placeLat, lng: placeLng };
                bounds.extend(position);
                const marker = new google.maps.Marker({
                    map: map,
                    position: position, //? only neeed to do once 
                    icon: '/images/location-pin.png'
                });
                marker.place = place;
                return marker;
            });

            markers.forEach(marker => marker.addListener('click', function () {
                const html = `
                    <div class="popup">
                        <a href="/app/explore/${this.place.slug}">
                            <img src="/uploads/${this.place.photo || 'salon.jpeg'}" alt="store image">
                            <h4>${this.place.name}</h4> 
                            <p>${this.place.location.address}<p>
                        </a>
                    </div>
                `
                infoWindow.setContent(html);
                infoWindow.open(map, this)

                console.log(this.place);
            }));



            map.setCenter(bounds.getCenter());
            map.fitBounds(bounds);
        })
        .catch(console.error)
}

function makeMap(mapDiv) {
    if (!mapDiv) return;
    const map = new google.maps.Map(mapDiv, mapOptions);
    loadPlaces(map)
    const input = document.querySelector('.autocomplete__input');
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        console.log(place);
        loadPlaces(map, place.geometry.location.lat(), place.geometry.location.lng());
    });

}


export default makeMap;
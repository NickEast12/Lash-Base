const axios = require('axios');
import dompurify from 'dompurify';


function searchResultsHTML(stores) {
    return stores.map(store => {
        return `
            <a href="/app/explore/${store.slug}" class="search__result">
                <strong>${store.name}</strong>
            </a>
        `
    }).join('')
}


function typeAhead(search) {
    if (!search) {
        return
    };

    const searchInput = search.querySelector('input[name="search"]');
    const searchResults = search.querySelector('.search__results');

    searchInput.addEventListener('input', function () {
        if (!this.value) {
            searchResults.style.display = 'none';
            return;
        }
        searchResults.style.display = 'block';
        axios
            .get(`/api/v1/search?q=${this.value}`)
            .then(res => {
                if (res.data.length) {
                    searchResults.innerHTML = dompurify.sanitize(searchResultsHTML(res.data));
                    return;
                }
                searchResults.innerHTML = dompurify.sanitize(`<div class="search__result">No results for ${this.value} found!</div>`);
            })
            .catch(err => {
                console.log(err);
            });

        //? handel key down
        searchInput.addEventListener('keyup', (e) => {
            if (![30, 40, 13].includes(e.keyCode)) {
                return;
            }

        });
    });
};

export default typeAhead;
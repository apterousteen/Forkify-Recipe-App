class SearchView {
    _parentElement = document.querySelector('.search');
    _searchButton = document.querySelector('.search__btn');

    getQuery() {
        return this._parentElement.querySelector('.search__field').value.trim();
    };

    // Publisher в pub-sub
    addHandlerSearch(handler) {
        this._parentElement.addEventListener('submit', (e) => {
            e.preventDefault();
            handler();
        });
        this._searchButton.addEventListener('click', (e) => {
            e.preventDefault();
            handler();
        });
    }
}

export default new SearchView();
import icons from 'url:../../img/icons.svg';
import View from "./View";
class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    _generateMarkup() {
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        const currentPage = this._data.currPage;

        // Page 1, there are no other pages
        if (numPages <= 1)
            return '';

        // Page 1, there are other pages
        if (currentPage === 1 && numPages > 1)
            return this._generateMarkupPaginationButton('next', currentPage);

        // Last page
        if (currentPage === numPages && numPages > 1)
            return this._generateMarkupPaginationButton('prev', currentPage);

        // Some page between 1st and last
        return this._generateMarkupPaginationButton('both', currentPage);
    }

    _generateMarkupPaginationButton(buttonType, currPage) {
        if (buttonType === 'prev')
            return `
            <button data-gotopage="${currPage - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${currPage - 1}</span>
            </button>`;

        if (buttonType === 'next')
            return `
            <button data-gotopage="${currPage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${currPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>`;

        if (buttonType === 'both')
            return `
            <button data-gotopage="${currPage - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${currPage - 1}</span>
            </button>
            <button data-gotopage="${currPage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${currPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>`;
    };

    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', (e) =>{
            e.preventDefault();

            const btn = e.target.closest('.btn--inline');

            if (!btn) return;

            const goToPage = +btn.dataset.gotopage;
            handler(goToPage);
        });
    };
}

export default new PaginationView();
import icons from 'url:../../img/icons.svg';
import View from "./View";

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _overlayElement = document.querySelector('.overlay');
    _modalElement = document.querySelector('.add-recipe-window');
    _btnOpenModal = document.querySelector('.nav__btn--add-recipe');
    _btnCloseModal = document.querySelector('.btn--close-modal');
    _errorMessage = `Wrong ingredient format!<br>Format: Quantity,Unit,Description`;
    _successMessage = `Your recipe<br>was successfully uploaded!`;

    constructor() {
        super();
        this._addHandlerOpenModal();
        this._addHandlerCloseModal();
    }

    _generateMarkup() {
    }

    _toggleModal() {
        this._overlayElement.classList.toggle('hidden');
        this._modalElement.classList.toggle('hidden');
    }

    renderValidation(errArr) {
        const inputElements = this._parentElement.querySelectorAll('input');
        inputElements.forEach(el => el.classList.remove('input__error'));

        if (errArr) {
            const errorElements = errArr.map(errField => this._parentElement.querySelector(`input[name="${errField}"]`));
            errorElements.forEach(el => el.classList.add('input__error'));
        }
    }

    renderErrorMessage(message = this._errorMessage) {
        this._parentElement.querySelector('.message')?.remove();
        const errorMarkup = `
            <div class="message error"
            style="bottom: -1rem; right: 2rem; position: absolute;">
                <div>
                    <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>`
        this._parentElement.insertAdjacentHTML('beforeend', errorMarkup);
    };

    renderSuccessMessage(message = this._successMessage) {
        this._parentElement.querySelector('.message')?.remove();
        const successMarkup = `
            <div class="message"
            style="bottom: -1rem; right: 2rem; position: absolute;">
                <div>
                    <svg>
                        <use href="${icons}#icon-smile"</use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>`
        this._parentElement.insertAdjacentHTML('beforeend', successMarkup);
    };

    _addHandlerOpenModal() {
        this._btnOpenModal.addEventListener('click', () => {
            this._toggleModal();
        });
    }

    _addHandlerCloseModal() {
        this._btnCloseModal.addEventListener('click', this._toggleModal.bind(this));
        this._overlayElement.addEventListener('click', this._toggleModal.bind(this));
    }

    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function (e) {
            e.preventDefault();

            const dataArr = new FormData(this).entries();
            const dataObj = Object.fromEntries(dataArr);
            handler(dataObj);
        });
    }
}

export default new AddRecipeView();
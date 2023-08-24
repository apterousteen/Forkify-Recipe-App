import icons from 'url:../../img/icons.svg';

export default class View {
    _data;

    _clearView() {
        this._parentElement.innerHTML = '';
    }

    // метод позволяет выборочно рендерить новое содержимое
    update(data) {
        this._data = data;
        const newMarkup = this._generateMarkup();

        // Range(диапазон) интерфейс предоставляет фрагмент документа
        // который может содержать узлы и части текстовых узлов данного документа.
        // Range.createContextualFragment() method returns a DocumentFragment
        // They exist in memory and you can construct them as usual, basically creating a micro virtual dom.
        const newDOM = document.createRange().createContextualFragment(newMarkup);

        // собираем все элементы из "виртуального" и настоящего DOM в массив
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        const curElements = Array.from(this._parentElement.querySelectorAll('*'));

        // Node.isEqualNode() проверяет, равны ли два узла.
        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];

            // Updates ONLY TEXT
            // Если ноды разные, то меняем текстовое содержимое
            // Свойство Node.nodeValue возвращает или устанавливает значение текущего узла.
            // nodeValue != null, только если содержимое текст, у нас собраны атомарные элементы,
            // так что текст может быть только первой нодой
            if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
                curEl.textContent = newEl.textContent;
            }

            // Updates ATTRIBUTES
            // Если ноды разные, то создаем массив новых атрибутов и копируем каждый атрибут в старый html
            if (!newEl.isEqualNode(curEl)) {
                Array.from(newEl.attributes).forEach(attr =>
                    curEl.setAttribute(attr.name, attr.value));
            }
        });
    };

    render(data) {
        // no data or data is an array and has 0 results
        if (!data || Array.isArray(data) && data.length === 0)
            return this.renderErrorMessage();

        this._data = data;
        const markup = this._generateMarkup();
        this._clearView();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    };

    renderSpinner() {
        const spinnerMarkup = `
        <div class="spinner">
            <svg>
                <use href="${icons}#icon-loader"></use>
            </svg>
        </div>`
        this._clearView();
        this._parentElement.insertAdjacentHTML('afterbegin', spinnerMarkup);
    };

    renderErrorMessage(message = this._errorMessage) {
        const errorMarkup = `
            <div class="error">
                <div>
                    <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>`
        this._clearView();
        this._parentElement.insertAdjacentHTML('afterbegin', errorMarkup);
    };
};
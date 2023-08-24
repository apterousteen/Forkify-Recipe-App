import icons from 'url:../../img/icons.svg';
import View from "./View";
import PreviewView from "./previewView";

class BookmarksView extends PreviewView {
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = `No bookmarks yet. Find a nice recipe and bookmark it :)`;

    _generateMarkup() {
        return this._data.map(bookmark => this._generateMarkupPreview(bookmark)).join('');
    }

    addHandlerRender(handler) {
        window.addEventListener('load', handler);
    }
}

export default new BookmarksView();
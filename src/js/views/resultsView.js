import icons from 'url:../../img/icons.svg';
import PreviewView from "./previewView";

class ResultsView extends PreviewView {
    _parentElement = document.querySelector('.results');
    _resultsNumberElement = document.querySelector('.results-number');
    _errorMessage = `We couldn't find recipes for your query. Please, try again! ;)`;

    _generateMarkup() {
        return this._data.map(recipeResult => this._generateMarkupPreview(recipeResult)).join('');
    }

    renderResultsNumber(allData) {
        this._resultsNumberElement.innerHTML = `${allData.length} ${allData.length !== 1 ? 'recipes' : 'recipe'}`
    };

    clearResultsNumber(){
        this._resultsNumberElement.innerHTML = '';
    }
}

export default new ResultsView();
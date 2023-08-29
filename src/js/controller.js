import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import recipeView from './views/recipeView';
import searchView from "./views/searchView";
import resultsView from "./views/resultsView";
import paginationView from "./views/paginationView";
import bookmarksView from "./views/bookmarksView";
import addRecipeView from "./views/addRecipeView";

/**
 * Updates sidebar with search results and bookmarks list.
 * Renders the recipe from the URL hash or the state.
 * @returns {Promise<void>}
 */
const controlRecipes = async () => {
    try {
        // Getting hash from address bar
        const id = window.location.hash.slice(1);
        if (!id) return;

        recipeView.renderSpinner();

        // 0) Update search results view to mark selected search result
        const numPages = Math.ceil(model.state.search.results.length / model.state.search.results.resultsPerPage);
        if (model.state.search.currPage === numPages)
            resultsView.render(model.getSearchResultPage())
        else
            resultsView.update(model.getSearchResultPage());

        // 1) Update bookmarks view
        bookmarksView.update(model.state.bookmarks);

        // 2) Fetching data from API and waiting for state to be changed
        await model.loadRecipe(id);

        // 3) Rendering recipe
        recipeView.render(model.state.recipe);

        // 4) Scroll to recipe on mobiles
        let isMobile = window.matchMedia('only screen and (max-width: 61.25em)').matches;
        if (isMobile) {
            recipeView._parentElement.scrollIntoView(true);
        }
    } catch (err) {
        console.error(`from controller: ${err}`);
        // Rendering ui
        recipeView.renderErrorMessage();
    }
};

const controlSearchResults = async () => {
    try {
        resultsView.clearResultsNumber();
        // получаем поисковую строку
        const query = searchView.getQuery();
        if (!query)
            return resultsView.renderErrorMessage(`Query can't be empty!`);

        resultsView.renderSpinner();
        await model.loadSearchResults(query);
        resultsView.renderResultsNumber(model.state.search.results);

        // render results and pagination buttons
        resultsView.render(model.getSearchResultPage());
        paginationView.render(model.state.search);
    } catch (err) {
        console.error(`from controller: ${err}`);
        resultsView.renderErrorMessage();
    }
};

const controlPagination = (goToPage) => {
    // render NEW results and pagination buttons
    resultsView.render(model.getSearchResultPage(goToPage));
    paginationView.render(model.state.search);
};

const controlServings = (newServings) => {
    // Update recipe servings (in state - model)
    model.updateServings(newServings);

    // Selectively render new recipe (only text)
    recipeView.update(model.state.recipe);
};

const controlBookmarks = () => {
    if (model.state.recipe.bookmarked)
        model.deleteBookmark(model.state.recipe.id)
    else
        model.addBookmark(model.state.recipe);

    // mark as bookmarked
    recipeView.update(model.state.recipe);

    // add to bookmarks list
    bookmarksView.render(model.state.bookmarks);
};

const controlLocalBookmarksRender = () => {
    bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async (newRecipe) => {
    try {
        await model.uploadRecipe(newRecipe);
        addRecipeView.renderValidation();
        addRecipeView.renderSuccessMessage();

        recipeView.render(model.state.recipe);

        // Change ID (hash) in URL
        window.history.pushState(null, '', `#${model.state.recipe.id}`);

        bookmarksView.render(model.state.bookmarks);

    } catch (err) {
        console.log(err);
        addRecipeView.renderErrorMessage();
        addRecipeView.renderValidation(err);
    }
}

const init = () => {
    bookmarksView.addHandlerRender(controlLocalBookmarksRender);
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerBookmark(controlBookmarks);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
    addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
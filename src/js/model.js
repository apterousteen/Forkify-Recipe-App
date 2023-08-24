import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {API_URL, API_KEY, RESULTS_PER_PAGE, TIMEOUT_SEC} from "./config";
import {getJSON, sendJSON} from "./helpers";

/**
 * Contains data that is currently worked with
 * @type {{bookmarks: object[], search: {currPage: number, resultsPerPage: number, query: string, results: object[]}, recipe: {}}}
 */
export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        currPage: 1,
        resultsPerPage: RESULTS_PER_PAGE,
    },
    bookmarks: [],
};

const createRecipeObject = (data) => {
    const {recipe} = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        bookmarked: state.bookmarks.some(bookmark => bookmark.id === recipe.id),
        ...(recipe.key && {key: recipe.key}),
    }
};

/**
 * Fetches recipe data from https://forkify-api.herokuapp.com/v2.
 * Changes state object
 * @param {number} id - id of a loaded recipe
 * @returns {Promise<void>}
 */
export const loadRecipe = async (id) => {
    try {
        // json from API
        const data = await getJSON(`${API_URL}${id}?key=${API_KEY}`);

        // processing and storing data
        state.recipe = createRecipeObject(data);
    } catch (err) {
        console.error(`from model loadRecipe: ${err}`);
        throw err;
    }
};

/**
 * Fetches all recipes for a specific query.
 * Pushes an array of recipe objects to state.
 * @param {string} query - query from user input
 * @returns {Promise<void>}
 */
export const loadSearchResults = async (query) => {
    try {
        state.search.query = query;
        state.search.currPage = 1;

        const data = await getJSON(`${API_URL}?search=${query}&key=${API_KEY}`);

        state.search.results = data.data.recipes.map(recipe => ({
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            image: recipe.image_url,
            ...(recipe.key && {key: recipe.key}),
        }));
    } catch (err) {
        console.error(`from model loadSearchResults: ${err}`);
        throw err;
    }
};

/**
 * @param {number} [page] - page number that needs to be loaded
 * @returns {Object[]} - array of recipe objects from a specific page
 */
export const getSearchResultPage = (page = state.search.currPage) => {
    state.search.currPage = page;

    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;

    return state.search.results.slice(start, end);
};

/**
 * Changes amount of ingredients (in the state) for a new number of servings
 * @param {number} newServings - new number of servings
 */
export const updateServings = (newServings) => {
    state.recipe.ingredients.forEach(ingredient =>
        ingredient.quantity = ingredient.quantity / state.recipe.servings * newServings);

    state.recipe.servings = newServings;
};

/**
 * Saves bookmarks from the state in local storage
 */
const storeBookmarks = () => {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

/**
 * Pushes the recipe to the bookmark array in the state. Updates the bookmarks in local storage.
 * @param {object} recipe
 */
export const addBookmark = (recipe) => {
    // Add bookmark
    state.bookmarks.push(recipe);

    // Mark current recipe as bookmarked
    if (recipe.id === state.recipe.id)
        state.recipe.bookmarked = true;

    // Store bookmarks
    storeBookmarks();
};

/**
 * Removes the recipe from the bookmark array in the state. Updates the bookmarks in local storage.
 * @param {number}  id
 */
export const deleteBookmark = (id) => {
    // Delete bookmark
    const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
    state.bookmarks.splice(index, 1);

    // Mark current recipe as NOT bookmarked
    if (id === state.recipe.id)
        state.recipe.bookmarked = false;

    // Store bookmarks
    storeBookmarks();
};

const clearBookmarks = () => {
    localStorage.clear();
};

/**
 * Reformats user input and uploads a new recipe to the server using POST request.
 * @param {FormData} newRecipe - data from user input
 * @returns {Promise<void>}
 */
export const uploadRecipe = async (newRecipe) => {
    try {
        let errorFields = [];

        // reformat ingredients
        const newRecipeIngredients = Object.entries(newRecipe)
            .filter(entry => entry[0].startsWith('ing') && entry[1] !== '')
            .flatMap((ing) => {
                const ingArr = ing[1]
                    .split(',')
                    .map(i => i.trim());

                if (ingArr.length !== 3) {
                    errorFields.push(ing[0]);
                    return [];
                }

                const [quantity, unit, description] = ingArr;
                return {
                    quantity: quantity ? +quantity : null,
                    unit,
                    description
                };
            });

        if (errorFields.length) {
            throw errorFields;
        }

        // create new recipe object
        const recipe = {
            title: newRecipe.title,
            publisher: newRecipe.publisher,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            servings: +newRecipe.servings,
            cooking_time: +newRecipe.cookingTime,
            ingredients: newRecipeIngredients,
        };

        const data = await sendJSON(`${API_URL}?key=${API_KEY}`, recipe);
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe);
    } catch (err) {
        throw err;
    }
};

/**
 * Invokes as the Model module is loaded. Updates the bookmarks in local storage and parses the existing bookmarks to the state.
 */
const init = async () => {
    const storage = localStorage.getItem('bookmarks');
    if (storage)
        state.bookmarks = JSON.parse(storage);
};

init();

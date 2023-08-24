import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { TIMEOUT_SEC } from "./config";

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};

/**
 * Makes a GET request with and returns JSON from the response.
 * @param {string} url - url for the request
 */
const getJSON = async (url) => {
    try {
        const fetchPromise = fetch(url);
        const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
        const data = await res.json();

        if (!res.ok)
            throw new Error(`${data.message}\nstatus code: ${res.status}`);

        return data;
    } catch (err) {
        throw err;
    }
};

/**
 * Makes a POST request with a new recipe and returns JSON from the response.
 * @param {string} url - url for the request
 * @param {object} uploadData - new recipe object
 */
const sendJSON = async (url, uploadData) => {
    try {
        const fetchPromise = fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(uploadData),
        });
        const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
        const data = await res.json();

        if (!res.ok)
            throw new Error(`${data.message}\nstatus code: ${res.status}`);

        return data;
    } catch (err) {
        throw err;
    }
};

export { getJSON, sendJSON };
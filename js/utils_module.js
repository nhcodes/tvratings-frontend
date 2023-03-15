function getJson(url, callback) {
    let options = {
        credentials: "include"
    };
    fetchJsonResponse(url, options, callback)
}

function postJson(url, jsonBody, callback) {
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(jsonBody),
    };
    fetchJsonResponse(url, options, callback);
}

async function fetchJsonResponseAsync(url, options) {
    let response = await fetch(url, options)
    let status = response.status
    let json = await response.json();
    return [status, json];
}

function fetchJsonResponse(url, options, callback) {
    fetchJsonResponseAsync(url, options)
        .then(([status, json]) => {
            callback(status, json);
        })
        .catch(error => {
            console.log(error);
            callback(undefined, {"error": error.message}); //todo status code
        });
}

let timeout;

function debounce(callback, wait) {
    clearTimeout(timeout);
    timeout = setTimeout(callback, wait);
}

function kNumber(number) {
    return Math.round(number / 1000) + "k";
}

function removeNullValuesFromObject(object) {
    let newObject = {};
    Object.entries(object).forEach(([k, v]) => {
        if (v !== null) {
            newObject[k] = v;
        }
    });
    return newObject;
}

function setCookie(key, value) {
    document.cookie = key + "=" + value;
}

function getCookie(key, defaultValue) {
    for (let cookie of document.cookie.split("; ")) {
        let data = cookie.split("=", 2);
        if (data[0] === key) {
            return data[1];
        }
    }
    return defaultValue;
}
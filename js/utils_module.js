function getJson(url, callback) {
    const options = {
        credentials: "include"
    };
    fetchJsonResponse(url, options, callback)
}

function postJson(url, jsonBody, callback) {
    const options = {
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
    const response = await fetch(url, options)
    const status = response.status
    const json = await response.json();
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

function debounce(callback, time) {
    clearTimeout(timeout);
    if (time <= 0) {
        callback();
        return;
    }
    timeout = setTimeout(callback, time);
}

function kNumber(number) {
    return Math.round(number / 1000) + "k";
}

function removeNullValuesFromObject(object) {
    const newObject = {};
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
    for (const cookie of document.cookie.split("; ")) {
        const data = cookie.split("=", 2);
        if (data[0] === key) {
            return data[1];
        }
    }
    return defaultValue;
}
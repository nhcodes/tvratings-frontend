function getJson(url, callback) {
    let options = {
        credentials: "include"
    };
    fetchJsonResponse(url, options)
        .then(response => {
            callback(true, response);
        })
        .catch(error => {
            console.log(error);
            callback(false, error.message);
        });
}

function postJson(url, data, callback) {
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    };
    fetchJsonResponse(url, options)
        .then(response => {
            callback(true, response);
        })
        .catch(error => {
            console.log(error);
            callback(false, error.message);
        });
}

async function fetchJsonResponse(url, options) {
    let response = await fetch(url, options)
    if (!response.ok) {
        let status = response.status + " " + response.statusText + ": ";
        let errorMessage = await response.text();
        throw new Error(status + errorMessage);
    }
    return await response.json();
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
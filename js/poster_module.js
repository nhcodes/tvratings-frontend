/*
imdb has a search api which uses jsonp
i'm taking advantage of this to load tv poster urls, which are not included in the default datasets
jsonp defines a callback function to be invoked when the content is read
for example a query of "hello" (https://sg.media-imdb.com/suggests/titles/h/hello.json) returns the following:
imdb$hello({ this contains the search results in standard json format })
the "imdb$hello" part is the callback function
now you might think "i could just fetch the jsonp data and remove the callback function prefix",
but that does not work since the url does not have cors enabled
*/
function getPosterFromImdb(query, callback) {

    let imageUrl = null;

    let callbackFunctionName = "imdb$" + query;

    window[callbackFunctionName] = function (results) {

        delete window[callbackFunctionName] //todo fix error

        results = results["d"];
        if (results === undefined) {
            callback(imageUrl);
            return;
        }

        for (let result of results) {

            let id = result["id"];
            if (id !== query) {
                continue
            }

            let image = result["i"];
            if (image !== undefined) {
                imageUrl = image[0];
            }

        }

        callback(imageUrl);
    }

    let url = "https://sg.media-imdb.com/suggests/titles/" + query.charAt(0) + "/" + query + ".json";

    let script = document.createElement("script");
    script.src = url;
    document.body.append(script);
    script.remove();
}
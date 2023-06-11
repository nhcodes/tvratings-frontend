//html

function getShowPageHtml(show, episodes) {

    const showId = show["showId"];
    const title = show["title"];
    const escapedTitle = title.replace(/['"]/g, " "); //todo
    const startYear = show["startYear"] || "";
    const endYear = show["endYear"] || "";
    const years = startYear + " - " + endYear;
    //const duration = show["duration"] || "";
    let genres = show["genres"] || "";
    genres = genres.replace(/,/g, ", ").toLowerCase();
    const rating = show["rating"].toFixed(1);
    const votes = show["votes"];
    const episodeCount = episodes.length;

    return `
        <div class="row my-5 mx-1">
            <div class="col-auto shadow-sm rounded-4 mx-auto py-2 px-1 text-center bg-body-tertiary bg-opacity-75">
                    
                <div class="d-flex flex-column">
                    <h2 class="m-0">${title}</h2>
                    <span>${years}</span>
                    <span>${genres}</span>
                </div>
                       
                <div class="table-responsive my-3">
                    <table id="TABLE_HEATMAP" class="table table-borderless w-auto mx-auto my-0 align-middle">
                    
                        <tr>
                            <th rowspan="999" style="width: 1px;"><small>s e a s o n s</small></th>
                            <th colspan="999"><small>e p i s o d e s</small></th>
                        </tr>
                        
                        ${getHeatmapHtml(episodes)}
                        
                    </table>
                </div>
                
                <div class="d-flex flex-row">
                    <div class="col-4">
                        <h5 class="m-0">${episodeCount}</h5>
                        <span>episodes</span>
                    </div>
                    <div class="col-4">
                        <h5 class="m-0">${votes}</h5>
                        <span>votes</span>
                    </div>
                    <div class="col-4">
                        <h5 class="m-0">${rating}</h5>
                        <span>rating</span>
                    </div>
                </div>
                
                <hr class="mx-4">
                
                <div class="d-flex flex-row justify-content-evenly align-items-center">
                    <button class="btn btn-link text-decoration-none"
                     onclick="onClickFollow('${showId}')">follow</button>
                    <button class="btn btn-link text-decoration-none"
                     onclick="onClickViewOn('${showId}', '${escapedTitle}')">view on</button>
                    <button class="btn btn-link text-decoration-none"
                     onclick="onClickFitScreen()">fit screen</button>
                </div>
                        
            </div>
        </div>
    `;
}

function getShowLinksHtml(showId, title) {
    const encodedTitle = encodeURIComponent(title);
    const sites = [
        {
            "url": `https://imdb.com/title/${showId}`,
            "image": "img/imdb.png",
            "name": "IMDb",
            "description": "more information and ratings"
        },
        {
            "url": `https://rottentomatoes.com/search?search=${encodedTitle}`,
            "image": "img/rottentomatoes.png",
            "name": "Rotten Tomatoes",
            "description": "more information and ratings"
        },
        {
            "url": `https://www.youtube.com/results?search_query=${encodedTitle}`,
            "image": "img/youtube.png",
            "name": "YouTube",
            "description": "trailers and video clips"
        },
        {
            "url": `https://justwatch.com/us/search?q=${encodedTitle}`,
            "image": "img/justwatch.png",
            "name": "JustWatch",
            "description": "find streaming services"
        },
        {
            "url": `https://cse.google.com/cse?cx=85e5c34b68dd64114&q=${encodedTitle}`,
            "image": "img/google.png",
            "name": "Google Custom Search",
            "description": "find streaming services"
        },
    ];
    return `
        <div class="list-group list-group-flush">
            ${loop(sites, (site) => `
                <a class="list-group-item list-group-item-action d-flex flex-row" href="${site.url}" target="_blank">
                    <img class="rounded-circle m-auto" src="${site.image}" alt="favicon" style="width: 32px; height: 32px">
                    <div class="d-flex flex-column flex-fill ms-3">
                        <span>${site.name}</span>
                        <small>${site.description}</small>
                    </div>
                </a>
            `)}
        </div>
    `;
}

function getCellHtml(episodeId, title, season, episode, rating, votes, year, duration, hasBorder) {
    const ratingString = rating === undefined ? "/" : rating.toFixed(1);
    const popoverTitle = `season ${season} episode ${episode}`;
    const popoverContent = getPopoverHtml(episodeId, title, ratingString, votes, year, duration);
    const cellColor = getCellColor(rating);
    return `
        <td tabindex="0" role="button" class="fixed-size-cell" style="background-color: ${cellColor}; ${hasBorder ? "border: 2px solid black;" : ""}"
            data-bs-trigger="focus" data-bs-toggle="popover" data-bs-placement="bottom" data-bs-html="true"
             data-bs-content="${popoverContent}" title="${popoverTitle}">
            <span style="color: black">${ratingString}</span>
        </td>
    `;
}

function getPopoverHtml(episodeId, title, rating, votes, year, duration) {
    title = title.replace(/"/g, "&quot;"); // popover html can't contain any ", escape
    return `
        <div class='d-flex flex-column'>
            <span>title: <b>${title}</b></span>
            <span>rating: <b>${rating}</b></span>
            <span>votes: <b>${votes || 0}</b></span>
            <span>year: <b>${year || ""}</b></span>
            <span>duration: <b>${duration || ""}</b></span>
            <br>
            <a href='https://imdb.com/title/${episodeId}' target='_blank' class='text-decoration-none'>
                <small>show on imdb.com</small>
            </a>
        </div>
    `;
}

function getCellColor(r) {
    //no rating -> gray
    if (r === undefined) return "#424242";
    //3->0 10->120
    const h = Math.round(r <= 3 ? 0 : 17.143 * r - 51.429);
    //2->30 4->50 8->50 10->30
    const l = Math.round(r <= 2 ? 30 : -5 / 3 * r ** 2 + 20 * r - 10 / 3);
    return "hsl(" + h + ",100%," + l + "%)";
}

function getHeatmapHtml(episodes) {
    const [minSeasonNumber, maxSeasonNumber, minEpisodeNumber, maxEpisodeNumber, minRatingEpisodeId, maxRatingEpisodeId] =
        calculateStats(episodes);

    //generate 2d array with empty cells

    const rowCount = maxSeasonNumber - minSeasonNumber + 1;
    const columnCount = maxEpisodeNumber - minEpisodeNumber + 1;

    const rowArray = [];
    for (let rowIndex = 0; rowIndex <= rowCount; rowIndex++) {
        const columnArray = [];
        for (let columnIndex = 0; columnIndex <= columnCount; columnIndex++) {
            columnArray[columnIndex] = `<td></td>`;
        }
        rowArray[rowIndex] = columnArray;
    }
    const tableArray = rowArray;

    //set season and episode number cells

    for (let season = minSeasonNumber; season <= maxSeasonNumber; season++) {
        const rowIndex = season - minSeasonNumber + 1
        tableArray[rowIndex][0] = `<td class="fixed-size-cell">${season}</td>`;
    }

    for (let episode = minEpisodeNumber; episode <= maxEpisodeNumber; episode++) {
        const cellIndex = episode - minEpisodeNumber + 1
        tableArray[0][cellIndex] = `<td class="fixed-size-cell">${episode}</td>`;
    }

    //set episode cells

    for (const episode of episodes) {

        const seasonNumber = episode["season"];
        const episodeNumber = episode["episode"];

        const episodeId = episode["episodeId"];
        const episodeTitle = episode["title"];
        const rating = episode["rating"];
        const votes = episode["votes"];
        const year = episode["startYear"];
        const duration = episode["duration"];

        const hasBorder = episodeId === minRatingEpisodeId || episodeId === maxRatingEpisodeId;

        const cellHtml = getCellHtml(episodeId, episodeTitle, seasonNumber, episodeNumber, rating, votes, year, duration, hasBorder);

        const rowIndex = seasonNumber - minSeasonNumber + 1;
        const cellIndex = episodeNumber - minEpisodeNumber + 1;
        tableArray[rowIndex][cellIndex] = cellHtml;

    }

    //generate html table from array

    let html = "";
    for (let rowIndex = 0; rowIndex <= rowCount; rowIndex++) {
        html += "<tr>";
        for (let columnIndex = 0; columnIndex <= columnCount; columnIndex++) {
            html += tableArray[rowIndex][columnIndex];
        }
        html += "</tr>";
    }
    return html;
}

//js

function loadShowModule(showId, contentElement) {

    const url = API_URL + "show?showId=" + showId;

    showLoader(contentElement, "", true);

    getJson(url, (status, response) => {

        if (status !== 200) {
            showLoader(contentElement, "error: " + response["error"].toLowerCase(), false);
            return;
        }

        hideLoader();

        //startYear, endYear, duration, genres can be null
        const show = response["show"];

        //startYear, duration, votes, rating can be null
        const episodes = response["episodes"];

        const title = show["title"];

        //set title & description
        document.title = `${title} - tvratin.gs`;
        const description = `find the top rated episodes from the tv show '${title.replace(/['"]/g, " ")}' using our episode rating heatmaps.`;
        document.querySelector("meta[name='description']").setAttribute("content", description);

        //include title in url
        const url = new URL(window.location.href);
        url.searchParams.set("title", title.replace(/\W/g, "-"));
        window.history.replaceState(null, null, url);

        const showPageHtml = getShowPageHtml(show, episodes);
        const showPageElement = parseElement(showPageHtml);

        getPosterFromImdb(showId, image => {

            if (image === null) {
                return;
            }

            const style = showPageElement.parentElement.style;
            style.backgroundImage = "url('" + image + "')";
            style.backgroundSize = "contain"; //cover

        });

        //enable popovers
        showPageElement.querySelectorAll("[data-bs-toggle='popover']").forEach(element => {
            new bootstrap.Popover(element);
        });

        contentElement.append(showPageElement);

    });

}

function calculateStats(episodes) {
    let minSeasonNumber = Number.POSITIVE_INFINITY;
    let maxSeasonNumber = Number.NEGATIVE_INFINITY;

    let minEpisodeNumber = Number.POSITIVE_INFINITY;
    let maxEpisodeNumber = Number.NEGATIVE_INFINITY;

    let minRatingEpisode = undefined;
    let maxRatingEpisode = undefined;

    for (const episode of episodes) {
        const seasonNumber = episode["season"];
        const episodeNumber = episode["episode"];
        const rating = episode["rating"];
        const votes = episode["votes"];

        if (seasonNumber < minSeasonNumber) {
            minSeasonNumber = seasonNumber;
        }
        if (seasonNumber > maxSeasonNumber) {
            maxSeasonNumber = seasonNumber;
        }

        if (episodeNumber < minEpisodeNumber) {
            minEpisodeNumber = episodeNumber;
        }
        if (episodeNumber > maxEpisodeNumber) {
            maxEpisodeNumber = episodeNumber;
        }

        if (rating === undefined) continue;

        if (minRatingEpisode === undefined ||
            rating < minRatingEpisode["rating"] ||
            (rating === minRatingEpisode["rating"] && votes > minRatingEpisode["votes"])) {
            minRatingEpisode = episode;
        }
        if (maxRatingEpisode === undefined ||
            rating > maxRatingEpisode["rating"] ||
            (rating === maxRatingEpisode["rating"] && votes > maxRatingEpisode["votes"])) {
            maxRatingEpisode = episode;
        }

    }

    //todo https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
    const minRatingEpisodeId = minRatingEpisode !== undefined ? minRatingEpisode["episodeId"] : undefined;
    const maxRatingEpisodeId = maxRatingEpisode !== undefined ? maxRatingEpisode["episodeId"] : undefined;
    return [minSeasonNumber, maxSeasonNumber, minEpisodeNumber, maxEpisodeNumber, minRatingEpisodeId, maxRatingEpisodeId]
}

//listeners

function onClickFollow(showId) {
    follow(showId, true);
}

function onClickViewOn(showId, title) {
    showDialog("view on", getShowLinksHtml(showId, title));
}

const defaultViewportContent = "width=device-width, initial-scale=1";

let fitScreen = false;

function onClickFitScreen() {
    /*const viewportMeta = document.querySelector("meta[name='viewport']");
    if (viewportMeta.content === defaultViewportContent) {
        const tableWidth = document.querySelector("#TABLE_HEATMAP").clientWidth + 48;
        viewportMeta.content = `width=${tableWidth}`;
    } else {
        viewportMeta.content = defaultViewportContent;
    }*/
    let heatmapElement = document.querySelector("#TABLE_HEATMAP");
    fitScreen = !fitScreen;
    let resizeFactor = fitScreen ? (window.innerWidth / (heatmapElement.clientWidth + 24)) : 1;
    heatmapElement.style.transform = `scale(${resizeFactor})`;
    heatmapElement.parentElement.classList.toggle("table-responsive");
    heatmapElement.style.transformOrigin = "left";
}
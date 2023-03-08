//html

function getShowTableHtml(showTitleHtml, showStatsHtml, showButtonsHtml, tableRowsHtml) {
    return `
        <div class="row my-5 mx-1">
            <div class="col-auto shadow-sm rounded-4 mx-auto py-2 px-1 text-center bg-body-tertiary bg-opacity-75">
                    
                <!-- getShowTitleHtml --->
                ${showTitleHtml}
                       
                <div class="table-responsive my-3">
                    <table id="TABLE_RATINGS" class="table table-borderless w-auto mx-auto my-0 align-middle">
                    
                        <tr>
                            <th rowspan="999" style="width: 1px;"><span class="small">s e a s o n s</span></th>
                            <th colspan="999"><span class="small">e p i s o d e s</span></th>
                        </tr>
                        
                        <!-- getTableRowsHtml --->
                        ${tableRowsHtml}
                        
                    </table>
                </div>
                
                <!-- getShowStatsHtml --->
                ${showStatsHtml}
                
                <hr class="mx-4">
                
                <!-- getShowButtonsHtml --->
                ${showButtonsHtml}
                        
            </div>
        </div>
    `;
}

function getShowTitleHtml(showId, title, years, genres) {
    return `
        <div class="d-flex flex-column">
            <span class="h2 m-0">${title}</span>
            <span>${years}</span>
            <span>${genres}</span>
        </div>
    `;
}

function getShowStatsHtml(rating, votes, episodeCount) {
    return `
        <div class="d-flex flex-row">
            <div class="col-4">
                <p class="h5 m-0">${episodeCount}</p>
                <span>episodes</span>
            </div>
            <div class="col-4">
                <p class="h5 m-0">${votes}</p>
                <span>votes</span>
            </div>
            <div class="col-4">
                <p class="h5 m-0">${rating.toFixed(1)}</p>
                <span>rating</span>
            </div>
        </div>
    `;
}

function getShowButtonsHtml(showId, title) {
    title = title.replace(/['"]/g, " "); //escape ' and " todo
    return `
        <div class="d-flex flex-row justify-content-evenly align-items-center">
            <button class="btn btn-link text-decoration-none"
             onclick="onClickFollow('${showId}')">follow</button>
            <button class="btn btn-link text-decoration-none"
             onclick="onClickViewOn('${showId}', '${title}')">view on</button>
        </div>
    `;
}

function onClickFollow(showId) {
    loadProfileModule(showId);
}

function onClickViewOn(showId, title) {
    showDialog(getShowLinksHtml(showId, title));
}

function getShowLinksHtml(showId, title) {
    let encodedTitle = encodeURIComponent(title);
    return `
        <div class="d-flex flex-column">
            <span class="text-center my-2">view on</span>
            <div class="list-group list-group-flush">
                <a class="list-group-item list-group-item-action d-flex flex-row" href="https://imdb.com/title/${showId}" target="_blank">
                    <img class="rounded-circle m-auto" src="img/imdb.png" alt="favicon" style="width: 32px; height: 32px">
                    <div class="d-flex flex-column flex-fill ms-3">
                        <span>IMDb</span>
                        <span class="small">information and ratings</span>
                    </div>
                </a>
                <a class="list-group-item list-group-item-action d-flex flex-row" href="https://rottentomatoes.com/search?search=${encodedTitle}" target="_blank">
                    <img class="rounded-circle m-auto" src="img/rt.png" alt="favicon" style="width: 32px; height: 32px">
                    <div class="d-flex flex-column flex-fill ms-3">
                        <span>Rotten Tomatoes</span>
                        <span class="small">information and ratings</span>
                    </div>
                </a>
                <a class="list-group-item list-group-item-action d-flex flex-row" href="https://www.youtube.com/results?search_query=${encodedTitle}" target="_blank">
                    <img class="rounded-circle m-auto" src="img/yt.png" alt="favicon" style="width: 32px; height: 32px">
                    <div class="d-flex flex-column flex-fill ms-3">
                        <span>YouTube</span>
                        <span class="small">trailers and other video clips</span>
                    </div>
                </a>
                <a class="list-group-item list-group-item-action d-flex flex-row" href="https://justwatch.com/us/search?q=${encodedTitle}" target="_blank">
                    <img class="rounded-circle m-auto" src="img/jw.png" alt="favicon" style="width: 32px; height: 32px">
                    <div class="d-flex flex-column flex-fill ms-3">
                        <span>JustWatch</span>
                        <span class="small">streaming services</span>
                    </div>
                </a>
                <a class="list-group-item list-group-item-action d-flex flex-row" href="https://cse.google.com/cse?cx=85e5c34b68dd64114&q=${encodedTitle}" target="_blank">
                    <img class="rounded-circle m-auto" src="img/g.png" alt="favicon" style="width: 32px; height: 32px">
                    <div class="d-flex flex-column flex-fill ms-3">
                        <span>Google Custom Search</span>
                        <span class="small">streaming services</span>
                    </div>
                </a>
            </div>
        </div>
    `;
}

function getCellHtml(episodeId, title, season, episode, rating, votes, year, duration, hasBorder) {
    let ratingString = rating === undefined ? "/" : rating.toFixed(1);
    let popoverTitle = `season ${season} episode ${episode}`;
    let popoverContent = getPopoverHtml(episodeId, title, ratingString, votes, year, duration);
    let cellColor = getCellColor(rating);
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
                <span class='small'>show on imdb.com</span>
            </a>
        </div>
    `;
}

function getCellColor(r) {
    //no rating -> gray
    if (r === undefined) return "#424242";
    //3->0 10->120
    let h = Math.round(r <= 3 ? 0 : 17.143 * r - 51.429);
    //2->30 4->50 8->50 10->30
    let l = Math.round(r <= 2 ? 30 : -5 / 3 * r ** 2 + 20 * r - 10 / 3);
    return "hsl(" + h + ",100%," + l + "%)";
}

function getTableRowsHtml(episodes, stats) {
    let [minSeasonNumber, maxSeasonNumber, minEpisodeNumber, maxEpisodeNumber, minRating, maxRating] = stats;

    //generate 2d array with empty cells

    let rowCount = maxSeasonNumber - minSeasonNumber + 1;
    let columnCount = maxEpisodeNumber - minEpisodeNumber + 1;

    let rowArray = [];
    for (let rowIndex = 0; rowIndex <= rowCount; rowIndex++) {
        let columnArray = [];
        for (let columnIndex = 0; columnIndex <= columnCount; columnIndex++) {
            columnArray[columnIndex] = `<td></td>`;
        }
        rowArray[rowIndex] = columnArray;
    }
    let tableArray = rowArray;

    //set season and episode number cells

    for (let season = minSeasonNumber; season <= maxSeasonNumber; season++) {
        let rowIndex = season - minSeasonNumber + 1
        tableArray[rowIndex][0] = `<td class="fixed-size-cell">${season}</td>`;
    }

    for (let episode = minEpisodeNumber; episode <= maxEpisodeNumber; episode++) {
        let cellIndex = episode - minEpisodeNumber + 1
        tableArray[0][cellIndex] = `<td class="fixed-size-cell">${episode}</td>`;
    }

    //set episode cells

    for (let episode of episodes) {

        let seasonNumber = episode["season"];
        let episodeNumber = episode["episode"];

        let episodeId = episode["episodeId"];
        let episodeTitle = episode["title"];
        let rating = episode["rating"];
        let votes = episode["votes"];
        let year = episode["startYear"];
        let duration = episode["duration"];

        let hasBorder = rating === minRating || rating === maxRating;

        let cellHtml = getCellHtml(episodeId, episodeTitle, seasonNumber, episodeNumber, rating, votes, year, duration, hasBorder);

        let rowIndex = seasonNumber - minSeasonNumber + 1;
        let cellIndex = episodeNumber - minEpisodeNumber + 1;
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

    let url = API_URL + "show?showId=" + showId;

    showLoader(contentElement, "", true);

    getJson(url, (success, response) => {

        if (!success) {
            showLoader(contentElement, "error: " + response.toLowerCase(), false);
            return;
        }

        hideLoader();

        //startYear, endYear, duration, genres can be null
        let show = response["show"];

        //startYear, duration, votes, rating can be null
        let episodes = response["episodes"];

        let title = show["title"];
        let startYear = show["startYear"] || "";
        let endYear = show["endYear"] || "";
        let duration = show["duration"] || "";
        let genres = show["genres"] || "";
        let rating = show["rating"];
        let votes = show["votes"];

        genres = genres.replace(/,/g, ", ");

        document.title = title + " | " + document.title;
        let description = "episode rating heatmap for " + title.replace(/['"]/g, " ");
        document.querySelector("meta[name='description']").setAttribute("content", description);

        let url = new URL(window.location.href);
        url.searchParams.set("title", title.replace(/\W/g, "-"));
        window.history.replaceState(null, null, url);

        let titleHtml = getShowTitleHtml(
            showId,
            title,
            startYear + " - " + endYear,
            genres,
        );

        let statsHtml = getShowStatsHtml(
            rating,
            votes,
            episodes.length
        );

        let buttonsHtml = getShowButtonsHtml(
            showId,
            title
        );

        let stats = calculateStats(episodes);
        let tableRowsHtml = getTableRowsHtml(episodes, stats);

        let tableHtml = getShowTableHtml(titleHtml, statsHtml, buttonsHtml, tableRowsHtml);
        let tableElement = getElementFromHtmlString(tableHtml);

        getPosterFromImdb(showId, image => {

            if (image === null) {
                return;
            }

            let style = tableElement.parentElement.style;
            style.backgroundImage = "url('" + image + "')";
            style.backgroundSize = "contain"; //cover

        });

        //enable popovers
        tableElement.querySelectorAll("[data-bs-toggle='popover']").forEach(element => {
            new bootstrap.Popover(element);
        });

        contentElement.append(tableElement);

    });

}

function calculateStats(episodes) {
    let minSeasonNumber = Number.POSITIVE_INFINITY;
    let maxSeasonNumber = Number.NEGATIVE_INFINITY;

    let minEpisodeNumber = Number.POSITIVE_INFINITY;
    let maxEpisodeNumber = Number.NEGATIVE_INFINITY;

    let minRating = Number.POSITIVE_INFINITY;
    let maxRating = Number.NEGATIVE_INFINITY;

    for (let episode of episodes) {
        let seasonNumber = episode["season"];
        let episodeNumber = episode["episode"];
        let rating = episode["rating"];

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

        if (rating < minRating) {
            minRating = rating;
        }
        if (rating > maxRating) {
            maxRating = rating;
        }

    }
    return [minSeasonNumber, maxSeasonNumber, minEpisodeNumber, maxEpisodeNumber, minRating, maxRating]
}
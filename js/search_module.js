//html

function getSearchPageHtml(searchTableHtml, searchFiltersHtml) {
    return `
        <div class="row my-3 mx-1">
        
            <div class="col-12 col-sm-10 col-md-7 col-xl-7 col-xxl-6 mx-auto p-0">
                <!-- getSearchTableHtml --->
                ${searchTableHtml}
            </div>
        
            <div class="col-12 col-sm-10 col-md-5 col-xl-4 col-xxl-2 mx-auto p-0">
                <!-- getSearchFiltersHtml --->
                ${searchFiltersHtml}
            </div>
        
        </div>
    `
}


function getSearchTableHtml() {
    return `
        <div class="d-flex flex-column shadow-sm rounded-4 m-2 bg-body-tertiary">
        
            <ul class="nav nav-pills nav-justified m-2 text-nowrap">
                <li class="nav-item">
                    <button class="nav-link active" onclick="onChangeType(this, 'shows')">top shows</button>
                </li>
                <li class="nav-item">
                    <button class="nav-link" onclick="onChangeType(this, 'episodes')">top episodes</button>
                </li>
            </ul>
                
            <div id="TABLE_SEARCH_CARD" class="table-responsive text-nowrap" style="min-height: 100px">
                <table class="table table-hover m-0">
                    <thead id="TABLE_SEARCH_HEAD">
                        <!-- getSearchTableHeadHtml -->
                    </thead>
                    <tbody id="TABLE_SEARCH_BODY">
                        <!-- getSearchTableBodyHtml -->
                    </tbody>
                </table>
            </div>
            
            <div class="d-flex flex-row align-items-center justify-content-between">
            
                <button class="btn btn-primary btn-sm mx-3 my-2" onclick="onChangePage(this, -1)">
                    <span class="bi bi-chevron-double-left"></span>
                </button>
                
                <span id="TEXT_PAGE_NUMBER"></span>
                
                <button class="btn btn-primary btn-sm mx-3 my-2" onclick="onChangePage(this, +1)">
                    <span class="bi bi-chevron-double-right"></span>
                </button>
                
            </div>
            
        </div>
    `;
}

function getSearchTableHeadHtml(compact) {
    return compact ? `
        <tr>
            <th>title</th>
            <th class="text-end">votes</th>
            <th class="text-end">rating</th>
        </tr>
    `
        : `
        <tr>
            <th>title</th>
            <th class="text-end">votes</th>
            <th class="text-center">rating</th>
            <th class="text-center">year</th>
            <th class="text-end">duration</th>
            <th class="text-center">genres</th>
        </tr>
    `
}

function getSearchTableBodyHtml(shows, compact) {
    let html = "";
    for (let show of shows) {
        let rowHtml = compact ? getCompactSearchTableRowHtml(show) : getFullSearchTableRowHtml(show);
        html += rowHtml;
    }
    return html;
}

function getCompactSearchTableRowHtml(show) {
    //class="text-nowrap text-truncate"
    return `
        <tr onclick="onClickShow('${show['showId']}')" style="cursor: pointer">
            <td class="">${show["title"]}</td>
            <td class="text-end">${kNumber(show["votes"])}</td>
            <td class="text-end">${show["rating"].toFixed(1)}</td>
        </tr>
    `;
}

//startYear, endYear, duration, genres can be null

function getFullSearchTableRowHtml(show) {
    let genres = show["genres"] || "";
    genres = genres.replace(/,/g, ", ");
    return `
        <tr onclick="onClickShow('${show['showId']}')" style="cursor: pointer">
            <td class="">${show["title"]}</td>
            <td class="text-end">${kNumber(show["votes"])}</td>
            <td class="text-center">${show["rating"].toFixed(1)}</td>
            <td class="text-center">${show["startYear"] || ""} - ${show["endYear"] || ""}</td>
            <td class="text-end">${show["duration"] || ""}</td>
            <td class="text-center">${genres}</td>
        </tr>
    `;
}

function getSearchFiltersHtml(genreButtonsHtml) {
    return `
        <div class="d-flex flex-column shadow-sm rounded-4 m-2 bg-body-tertiary">
        
            <span class="text-center m-2">filters</span>
        
            <div class="d-flex flex-column p-1">
            
                 <!--
                 <div class="form-floating m-1">
                     <select class="form-select" onchange="onFilter('type', this.value)">
                         <option value="shows" selected>shows</option>
                         <option value="episodes">episodes</option>
                     </select>
                     <label>type</label>
                </div>-->
            
                <div class="form-floating m-1">
                    <input class="form-control" placeholder="search for title" type="text"
                        onchange="onFilter('titleSearch', this.value)">
                    <label>search for title</label>
                </div>
                
                <div class="d-flex flex-row">
            
                    <div class="form-floating m-1 w-100">
                        <input class="form-control" placeholder="min votes" type="number"
                            onchange="onFilter('minVotes', this.value)">
                        <label>min votes</label>
                    </div>
                
                    <div class="form-floating m-1 w-100">
                        <input class="form-control" placeholder="max votes" type="number"
                            onchange="onFilter('maxVotes', this.value)">
                        <label>max votes</label>
                    </div>
                
                </div>
                
                <div class="d-flex flex-row">
            
                    <div class="form-floating m-1 w-100">
                        <input class="form-control" placeholder="min rating" type="number"
                            onchange="onFilter('minRating', this.value)">
                        <label>min rating</label>
                    </div>
                
                    <div class="form-floating m-1 w-100">
                        <input class="form-control" placeholder="max rating" type="number"
                            onchange="onFilter('maxRating', this.value)">
                        <label>max rating</label>
                    </div>
                
                </div>
                
                <div class="d-flex flex-row">
            
                    <div class="form-floating m-1 w-100">
                        <input class="form-control" placeholder="min year" type="number"
                            onchange="onFilter('minYear', this.value)">
                        <label>min year</label>
                    </div>
                
                    <div class="form-floating m-1 w-100">
                        <input class="form-control" placeholder="max year" type="number"
                            onchange="onFilter('maxYear', this.value)">
                        <label>max year</label>
                    </div>
                
                </div>
                
                <div class="d-flex flex-row">
            
                    <div class="form-floating m-1 w-100">
                        <input class="form-control" placeholder="min duration" type="number"
                            onchange="onFilter('minDuration', this.value)">
                        <label>min duration</label>
                    </div>
                
                    <div class="form-floating m-1 w-100">
                        <input class="form-control" placeholder="max duration" type="number"
                            onchange="onFilter('maxDuration', this.value)">
                        <label>max duration</label>
                    </div>
                
                </div>
                
                <div class="d-flex flex-row">
                
                     <div class="form-floating m-1 w-100">
                         <select class="form-select" onchange="onFilter('sortColumn', this.value)">
                             <option value="votes" selected>votes</option>
                             <option value="rating">rating</option>
                             <option value="title">title</option>
                             <option value="year">year</option>
                         </select>
                         <label>sort by</label>
                    </div>
                
                     <div class="form-floating m-1 w-100">
                         <select class="form-select" onchange="onFilter('sortOrder', this.value)">
                             <option value="desc" selected>descending</option>
                             <option value="asc">ascending</option>
                         </select>
                         <label>sort order</label>
                    </div>
                
                </div>
                
                 <div class="form-floating m-1">
                     <select class="form-select" onchange="onChangeView(this.value)">
                         <option value="compact" selected>compact</option>
                         <option value="detailed">detailed</option>
                     </select>
                     <label>table view</label>
                </div>
                
                <div class="accordion m-1" id="ACCORDION_GENRES">
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#COLLAPSE_GENRES">
                                select genres
                            </button>
                        </h2>
                        <div id="COLLAPSE_GENRES" class="accordion-collapse collapse" data-bs-parent="#ACCORDION_GENRES">
                            <div class="accordion-body">
                            
                                <div class="d-flex flex-row flex-wrap justify-content-center">
                                    <!-- getGenreButtonsHtml --->
                                    ${genreButtonsHtml}
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            
            </div>
            
        </div>
    `;
}

function getGenreButtonsHtml(genres) {
    let html = "";
    for (let genre of genres) {
        html += `
            <button class="btn btn-outline-primary btn-sm m-1" data-bs-toggle="button" onclick="onFilterGenres(this)">${genre}</button>
        `;
    }
    return html;
}

//js

const parameters = {
    "type": "shows", //shows episodes
    "titleSearch": null,
    "minVotes": null,
    "maxVotes": null,
    "minRating": null,
    "maxRating": null,
    "minYear": null,
    "maxYear": null,
    "minDuration": null,
    "maxDuration": null,
    "genres": null,
    "sortColumn": "votes", //title year rating votes
    "sortOrder": "desc", //asc desc
    "pageNumber": 0,
    "pageLimit": 10,
}

let compactView = true;

let searchTableCardElement;
let searchTableHeadElement;
let searchTableBodyElement;

let pageNumberTextElement;

function loadSearchModule(contentElement) {

    let tableHtml = getSearchTableHtml();

    let allGenres = getAllGenres();
    let genreButtonsHtml = getGenreButtonsHtml(allGenres);

    let filtersHtml = getSearchFiltersHtml(genreButtonsHtml);

    let pageHtml = getSearchPageHtml(tableHtml, filtersHtml);
    let pageElement = getElementFromHtmlString(pageHtml);

    searchTableCardElement = pageElement.querySelector("#TABLE_SEARCH_CARD");
    searchTableHeadElement = pageElement.querySelector("#TABLE_SEARCH_HEAD");
    searchTableBodyElement = pageElement.querySelector("#TABLE_SEARCH_BODY");
    pageNumberTextElement = pageElement.querySelector("#TEXT_PAGE_NUMBER");

    updateSearchTable();

    contentElement.append(pageElement);
}

function updateSearchTable() {

    let filteredParameters = removeNullValuesFromObject(parameters);
    let queryString = new URLSearchParams(filteredParameters).toString();

    let url = API_URL + "search?" + queryString;
    console.log(url);

    showLoader(searchTableCardElement, "", true);

    getJson(url, (success, response) => {

        if (!success) {
            showLoader(searchTableCardElement, "error: " + response.toLowerCase(), false);
            return;
        }

        hideLoader();

        let showsJson = response;

        searchTableHeadElement.innerHTML = getSearchTableHeadHtml(compactView);
        pageNumberTextElement.innerText = "page " + (parameters.pageNumber + 1);

        if (showsJson.length === 0) {
            searchTableBodyElement.innerHTML = "";
            return;
        }

        searchTableBodyElement.innerHTML = getSearchTableBodyHtml(showsJson, compactView);

    });
}

// listeners

function onFilter(key, value) {
    if (value === "") value = null;
    console.log(key + " -> " + value);
    parameters[key] = value;
    parameters.pageNumber = 0;
    updateSearchTable();
}

function onChangeType(element, newType) {
    let tab = new bootstrap.Tab(element);
    tab.show();

    parameters.type = newType;
    parameters.pageNumber = 0;
    updateSearchTable();
}

function onFilterGenres(element) {
    let selectedButtons = element.parentElement.parentElement.querySelectorAll(".active");
    let selectedGenres = Array.from(selectedButtons).map(e => e.innerText);
    if (selectedGenres.length === 0) selectedGenres = null;
    parameters.genres = selectedGenres;
    parameters.pageNumber = 0;
    updateSearchTable();
}

function onChangeView(view) {
    compactView = view !== "detailed";
    updateSearchTable();
}

function onChangePage(element, count) {
    if (parameters.pageNumber + count < 0) return;
    parameters.pageNumber += count;
    updateSearchTable();
}

function onClickShow(showId) {
    window.open(`?showId=${showId}`);
}

function getAllGenres() {
    return ["Action", "Adult", "Adventure", "Animation", "Biography", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "Film-Noir", "Game-Show", "History", "Horror", "Music", "Musical", "Mystery", "News", "Reality-TV", "Romance", "Sci-Fi", "Short", "Sport", "Talk-Show", "Thriller", "War", "Western"]
        .map(g => g.toLowerCase());
}
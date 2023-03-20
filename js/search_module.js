//html

function getSearchPageHtml() {
    return `
        <div class="row my-3 mx-1">
        
            <div class="col-12 col-sm-10 col-md-7 col-xl-7 col-xxl-6 mx-auto p-0">
                ${getSearchTableHtml()}
            </div>
        
            <div class="col-12 col-sm-10 col-md-5 col-xl-4 col-xxl-2 mx-auto p-0">
                ${getSearchFiltersHtml()}
            </div>
        
        </div>
    `
}


function getSearchTableHtml() {
    return `
        <div class="d-flex flex-column shadow-sm rounded-4 m-2 bg-body-tertiary">
        
            <ul class="nav nav-pills nav-justified m-2 text-nowrap" role="tablist">
                <li class="nav-item">
                    <button class="nav-link active" onclick="onChangeType(this, 'shows')" role="tab">top shows</button>
                </li>
                <li class="nav-item">
                    <button class="nav-link" onclick="onChangeType(this, 'episodes')" role="tab">top episodes</button>
                </li>
            </ul>
                
            <div id="TABLE_SEARCH_CONTENT" class="table-responsive text-nowrap" style="min-height: 200px">
                <!-- getSearchTableContentHtml -->
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

//startYear, endYear, duration, genres can be null

function getSearchTableContentHtml(shows, compact) {
    return `
        ${conditional(shows.length !== 0, `

            <table class="table table-hover m-0">
            
                <thead>
                    <tr>
                        <th>title</th>
                        <th class="text-end">votes</th>
                        <th class="text-end">rating</th>
                        ${conditional(!compact, `
                            <th class="text-center">year</th>
                            <th class="text-end">duration</th>
                            <th class="text-center">genres</th>
                        `)}
                    </tr>
                </thead>
                
                <tbody>
                    ${loop(shows, (show) => `
                        <tr>
                            <td>
                                <a href="?showId=${show['showId']}" target='_blank' class="d-block text-reset text-decoration-none">${show["title"]}</a>
                            </td>
                            <td class="text-end">${kNumber(show["votes"])}</td>
                            <td class="text-end">${show["rating"].toFixed(1)}</td>
                            ${conditional(!compact, `
                                <td class="text-center">${show["startYear"] || ""} - ${show["endYear"] || ""}</td>
                                <td class="text-end">${show["duration"] || ""}</td>
                                <td class="text-center">${(show["genres"] || "").replace(/,/g, ", ")}</td>
                            `)}
                        </tr>
                    `)}
                </tbody>
                
            </table>
            
        `, `

            <p class="fs-3 m-3 text-center">no shows found</p>
            
        `)}
    `;
}

function getSearchFiltersHtml() {
    return `
        <div class="d-flex flex-column shadow-sm rounded-4 m-2 bg-body-tertiary">
        
            <h6 class="text-body text-center m-2">filters</h6>
        
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
                        oninput="onFilter('titleSearch', this.value)">
                    <label>search for title</label>
                </div>
                
                <div class="d-flex flex-row">
            
                    <div class="form-floating m-1 w-100">
                        <input class="form-control" placeholder="min votes" type="number" min="0"
                            oninput="onFilter('minVotes', this.value)">
                        <label>min votes</label>
                    </div>
                
                    <div class="form-floating m-1 w-100">
                        <input class="form-control" placeholder="max votes" type="number" min="0"
                            oninput="onFilter('maxVotes', this.value)">
                        <label>max votes</label>
                    </div>
                
                </div>
                
                <div class="d-flex flex-row">
            
                    <div class="form-floating m-1 w-100">
                        <input class="form-control" placeholder="min rating" type="number" min="0" max="10"
                            oninput="onFilter('minRating', this.value)">
                        <label>min rating</label>
                    </div>
                
                    <div class="form-floating m-1 w-100">
                        <input class="form-control" placeholder="max rating" type="number" min="0" max="10"
                            oninput="onFilter('maxRating', this.value)">
                        <label>max rating</label>
                    </div>
                
                </div>
                
                <div class="d-flex flex-row">
            
                    <div class="form-floating m-1 w-100">
                        <input class="form-control" placeholder="min year" type="number" min="1900" max="2100"
                            oninput="onFilter('minYear', this.value)">
                        <label>min year</label>
                    </div>
                
                    <div class="form-floating m-1 w-100">
                        <input class="form-control" placeholder="max year" type="number" min="1900" max="2100"
                            oninput="onFilter('maxYear', this.value)">
                        <label>max year</label>
                    </div>
                
                </div>
                
                <div class="d-flex flex-row">
            
                    <div class="form-floating m-1 w-100">
                        <input class="form-control" placeholder="min duration" type="number" min="0"
                            oninput="onFilter('minDuration', this.value)">
                        <label>min duration</label>
                    </div>
                
                    <div class="form-floating m-1 w-100">
                        <input class="form-control" placeholder="max duration" type="number" min="0"
                            oninput="onFilter('maxDuration', this.value)">
                        <label>max duration</label>
                    </div>
                
                </div>
                
                <div class="d-flex flex-row">
                
                     <div class="form-floating m-1 w-100">
                         <select class="form-select" onchange="onFilter('sortColumn', this.value)">
                             <option value="votes" selected>votes</option>
                             <option value="rating">rating</option>
                             <option value="title">title</option>
                             <option value="startYear">year</option>
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
                
                <!-- todo form-select w-auto p-2 hacky -->
                <div class="form-select w-auto p-2 m-1" data-bs-toggle="collapse" data-bs-target="#COLLAPSE_GENRES">select genres</div>
                
                <div id="COLLAPSE_GENRES" class="collapse">
                    <div class="d-flex flex-row flex-wrap justify-content-center">
                            ${loop(getAllGenres(), (genre) => `
                                <button class="btn btn-outline-primary btn-sm m-1" data-bs-toggle="button" onclick="onFilterGenres(this)">${genre}</button>
                            `)}
                    </div>
                </div>
            
            </div>
            
        </div>
    `;
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

let searchTableContentElement;

let pageNumberTextElement;

function loadSearchModule(contentElement) {

    let pageHtml = getSearchPageHtml();
    let pageElement = parseElement(pageHtml);

    searchTableContentElement = pageElement.querySelector("#TABLE_SEARCH_CONTENT");
    pageNumberTextElement = pageElement.querySelector("#TEXT_PAGE_NUMBER");

    updateSearchTable();

    contentElement.append(pageElement);
}

function updateSearchTable() {

    let filteredParameters = removeNullValuesFromObject(parameters);
    let queryString = new URLSearchParams(filteredParameters).toString();

    let url = API_URL + "search?" + queryString;
    console.log(url);

    showLoader(searchTableContentElement, "", true);

    getJson(url, (status, response) => {

        if (status !== 200) {
            showLoader(searchTableContentElement, "error: " + response["error"].toLowerCase(), false);
            return;
        }

        hideLoader();

        let showsJson = response;
        searchTableContentElement.innerHTML = getSearchTableContentHtml(showsJson, compactView);
        pageNumberTextElement.innerText = "page " + (parameters.pageNumber + 1);

    });
}

function getAllGenres() {
    return ["Action", "Adult", "Adventure", "Animation", "Biography", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "Film-Noir", "Game-Show", "History", "Horror", "Music", "Musical", "Mystery", "News", "Reality-TV", "Romance", "Sci-Fi", "Short", "Sport", "Talk-Show", "Thriller", "War", "Western"]
        .map(g => g.toLowerCase());
}

// listeners

function onFilter(key, value) {

    if (value === "") value = null;
    parameters[key] = value;
    console.log(key + " -> " + value);

    debounce(() => {

        parameters.pageNumber = 0;
        updateSearchTable();

    }, 1000);
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
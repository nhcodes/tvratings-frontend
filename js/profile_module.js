//html

function getFollowListHtml(shows) {
    return `
        ${conditional(shows.length > 0, `

            <div class="list-group list-group-flush">
                ${loop(shows, (show) => `
                    <a class="list-group-item list-group-item-action d-flex flex-row align-items-center" href="?showId=${show["showId"]}" target="_blank">
                        <span class="flex-fill">${show["title"]}</span>
                        <button class="btn btn-link link-secondary" onclick="follow('${show["showId"]}', false);return false">
                            <span class="bi bi-x"></span>
                        </button>
                    </a>
                `)}
            </div>
            
        `, `

            <p class="mx-auto my-5">no followed shows</p>
            
        `)}
    `;
}

//js

function showFollowListDialog(shows) {

    if(shows !== undefined) {
        const followListHtml = getFollowListHtml(shows);
        showDialog("followed shows", followListHtml);
        return;
    }

    const url = API_URL + "followlist";
    getJson(url, (status, response) => {

        if (status === 200) {
            const shows = response;
            showFollowListDialog(shows);
        } else if (status === 401) {
            showLoginDialog(() => showFollowListDialog());
        } else {
            showLoader(document.body, "error: " + response["error"].toLowerCase(), false);
        }

    });
}

function follow(showId, doFollow) {
    const url = API_URL + "follow?showId=" + showId + "&follow=" + doFollow;
    getJson(url, (status, response) => {

        if (status === 200) {
            const shows = response;
            showFollowListDialog(shows);
        } else if (status === 401) {
            showLoginDialog(() => follow(showId, doFollow));
        } else {
            showLoader(document.body, "error: " + response["error"].toLowerCase(), false);
        }

    });
}
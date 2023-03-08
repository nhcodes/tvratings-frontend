//html

function getProfileLoginHtml() {
    return `
        <div class="d-flex flex-column mx-auto">
        
            <span class="text-center my-2">log in</span>
            
            <div class="mb-3">
                <span class="form-label">email address</span>
                <input id="INPUT_PROFILE_EMAIL" type="email" class="form-control" placeholder="email@example.com">
                <span id="INPUT_PROFILE_EMAIL_FEEDBACK"></span>
            </div>
            
            <div class="mb-3 d-none">
                <span class="form-label">verification code</span>
                <input id="INPUT_PROFILE_CODE" type="text" class="form-control" placeholder="ABC123">
                <span id="INPUT_PROFILE_CODE_FEEDBACK"></span>
            </div>
            
            <button id="BUTTON_PROFILE_SUBMIT" class="btn btn-primary m-3">next</button>
            
        </div>
    `;
}

function getProfilePageHtml() {
    return `
        <div class="d-flex flex-column">
        
            <span class="text-center my-2">profile</span>
            
            <span class="ms-2">followed shows:</span>
            
            <div id="LIST_FOLLOWS" class="list-group list-group-flush overflow-y-auto" style="max-height: 300px">
                <!-- getFollowsListHtml -->
            </div>
            
        </div>
    `;
}

function getFollowsListHtml(shows) {
    let html = "";
    for (let show of shows) {
        html += getFollowsListRowHtml(show);

    }
    return html;
}

function getFollowsListRowHtml(show) {
    return `
        <a class="list-group-item list-group-item-action d-flex flex-row align-items-center" href="?showId=${show["showId"]}" target="_blank">
            <span class="flex-fill">${show["title"]}</span>
            <button class="btn btn-link link-secondary" onclick="unfollow('${show["showId"]}');return false">
                <span class="bi bi-x"></span>
            </button>
        </a>
    `;
}

//js

function loadProfileModule(showId) {
    let url = API_URL + "follow?showId=" + showId + "&follow=true";

    getJson(url, (success, response) => {

        if (!success) {//todo
            showLoader(document.body, "error: " + response.toLowerCase(), false);
            return;
        }

        if (!Array.isArray(response)) {
            loadProfileLoginModule(showId);
        } else {
            loadProfilePageModule(response);
        }

    });
}

function loadProfilePageModule(shows) {
    let profilePageHtml = getProfilePageHtml();
    let dialogElement = showDialog(profilePageHtml);

    let followsList = dialogElement.querySelector("#LIST_FOLLOWS");
    followsList.innerHTML = getFollowsListHtml(shows);
}

const emailRegex = new RegExp("\\S+@\\S+\\.\\S+");
const codeRegex = new RegExp("\\w{6}");

function loadProfileLoginModule(showId) {
    let profileLoginHtml = getProfileLoginHtml();
    let dialogElement = showDialog(profileLoginHtml);

    let emailInput = dialogElement.querySelector("#INPUT_PROFILE_EMAIL");
    let emailInputFeedback = dialogElement.querySelector("#INPUT_PROFILE_EMAIL_FEEDBACK");

    let codeInput = dialogElement.querySelector("#INPUT_PROFILE_CODE");
    let codeInputFeedback = dialogElement.querySelector("#INPUT_PROFILE_CODE_FEEDBACK");

    let submitButton = dialogElement.querySelector("#BUTTON_PROFILE_SUBMIT");

    submitButton.onclick = () => {

        let email = emailInput.value;
        let isEmailValid = emailRegex.test(email);
        if (!isEmailValid) {
            validateInput(emailInput, emailInputFeedback, false, "please enter a valid email");
            return;
        }

        if (codeInput.parentElement.classList.contains("d-none")) {

            login(email, null, (success, response) => {

                if (!success) {
                    validateInput(emailInput, emailInputFeedback, false, response);
                    return;
                }

                validateInput(emailInput, emailInputFeedback, true, "a verification code has been sent to your email");
                codeInput.parentElement.classList.remove("d-none");
                submitButton.innerText = "sign in";

            });

        } else {

            let code = codeInput.value;
            let isCodeValid = codeRegex.test(code);
            if (!isCodeValid) {
                validateInput(codeInput, codeInputFeedback, false, "please enter a valid confirmation code");
                return;
            }

            login(email, code, (success, response) => {

                if (!success) {
                    validateInput(codeInput, codeInputFeedback, false, response);
                    return;
                }

                loadProfileModule(showId);

            });

        }

    };

}

function validateInput(inputElement, feedbackElement, isValid, feedback) {
    if (!isValid) {
        inputElement.classList.add("is-invalid");
        inputElement.classList.remove("is-valid");
        feedbackElement.classList.add("invalid-feedback");
        feedbackElement.classList.remove("valid-feedback");
        feedbackElement.innerText = feedback;
    } else {
        inputElement.classList.add("is-valid");
        inputElement.classList.remove("is-invalid");
        feedbackElement.classList.add("valid-feedback");
        feedbackElement.classList.remove("invalid-feedback");
        feedbackElement.innerText = feedback;
    }
}

function login(email, code, callback) {
    let data = {
        "email": email,
        "code": code
    }
    let url = API_URL + "login";
    postJson(url, data, callback);
}

function unfollow(showId) {
    let url = API_URL + "follow?showId=" + showId + "&follow=false";

    getJson(url, (success, response) => {

        if (!success) {//todo
            showLoader(document.body, "error: " + response.toLowerCase(), false);
            return;
        }

        if (!Array.isArray(response)) {
            loadProfileLoginModule(showId);
        } else {
            loadProfilePageModule(response);
        }

    });
}
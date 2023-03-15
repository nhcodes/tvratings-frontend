//html

function getLoginHtml() {
    return `
        <div class="d-flex flex-column mx-auto">
        
            <span class="text-center my-2">log in:</span>
            
            <div class="mb-3">
                <label class="form-label">email address</label>
                <input id="INPUT_LOGIN_EMAIL" type="email" class="form-control" placeholder="email@example.com">
            </div>
            
            <div class="mb-3 d-none">
                <label class="form-label">verification code</label>
                <input id="INPUT_LOGIN_CODE" type="text" class="form-control" placeholder="ABC123">
            </div>
            
            <div class="d-flex justify-content-center mb-3">
                <div id="INPUT_LOGIN_RECAPTCHA"></div>
            </div>
            
            <small id="TEXT_LOGIN_ERROR"></small>
            
            <button id="BUTTON_LOGIN_SUBMIT" class="btn btn-primary mb-3">next</button>
            
        </div>
    `;
}

function getFollowListHtml(shows) {
    return `
        <div class="d-flex flex-column">
        
            <span class="text-center my-2">followed shows:</span>
            
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
            
        </div>
    `;
}

//js

const emailRegex = new RegExp("\\S+@\\S+\\.\\S+");
const codeRegex = new RegExp("\\w{6}");

function showLogin(showId) {
    let loginHtml = getLoginHtml();
    let dialogElement = showDialog(loginHtml);

    let emailInput = dialogElement.querySelector("#INPUT_LOGIN_EMAIL");
    let codeInput = dialogElement.querySelector("#INPUT_LOGIN_CODE");
    let recaptchaInput = dialogElement.querySelector("#INPUT_LOGIN_RECAPTCHA");
    let submitButton = dialogElement.querySelector("#BUTTON_LOGIN_SUBMIT");
    let errorText = dialogElement.querySelector("#TEXT_LOGIN_ERROR");

    let recaptchaId = grecaptcha.render(recaptchaInput, {
        "sitekey": "6LfM8_okAAAAAELhbiyl9DBoKs9HMMIvv98Z_FNs",
        "theme": isDarkTheme() ? "dark" : "light"
    });

    submitButton.onclick = () => {

        let email = emailInput.value;
        let isEmailValid = emailRegex.test(email);
        if (!isEmailValid) {
            validateInput(errorText, false, "please enter a valid email");
            return;
        }

        let recaptchaResponse = grecaptcha.getResponse(recaptchaId);
        console.log("recaptchaResponse: " + recaptchaResponse);
        if (!recaptchaResponse) {
            validateInput(errorText, false, "please verify that you're not a bot");
            return;
        }

        grecaptcha.reset(recaptchaId);

        if (codeInput.parentElement.classList.contains("d-none")) {

            showLoader(dialogElement.firstElementChild, "", true);

            login(email, null, recaptchaResponse, (status, response) => {

                hideLoader();

                if (status !== 200) {
                    validateInput(errorText, false, response["error"].toLowerCase());
                    return;
                }

                validateInput(errorText, true, "a verification code has been sent to your email");
                codeInput.parentElement.classList.remove("d-none");
                submitButton.innerText = "sign in";

            });

        } else {

            let code = codeInput.value;
            let isCodeValid = codeRegex.test(code);
            if (!isCodeValid) {
                validateInput(errorText, false, "please enter a valid verification code");
                return;
            }

            showLoader(dialogElement.firstElementChild, "", true);

            login(email, code, recaptchaResponse, (status, response) => {

                hideLoader();

                if (status !== 200) {
                    validateInput(errorText, false, response["error"].toLowerCase());
                    return;
                }

                follow(showId, true);

            });

        }

    };

}

function validateInput(feedbackElement, isValid, feedback) {
    feedbackElement.className = isValid ? "text-success mb-3" : "text-danger mb-3";
    feedbackElement.innerText = feedback;
}

function login(email, code, recaptcha, callback) {
    let url = API_URL + "login";
    let data = {
        "email": email,
        "code": code,
        "recaptcha": recaptcha
    }
    postJson(url, data, callback);
}

function showFollowList(shows) {
    let followListHtml = getFollowListHtml(shows);
    showDialog(followListHtml);
}

function follow(showId, follow) {
    let url = API_URL + "follow?showId=" + showId + "&follow=" + follow;
    getJson(url, (status, response) => {

        if (status === 200) {
            let shows = response;
            showFollowList(shows);
        } else if (status === 401) {
            showLogin(showId);
        } else {
            showLoader(document.body, "error: " + response["error"].toLowerCase(), false);
        }

    });
}
//html

function getLoginHtml() {
    return `
        <div class="d-flex flex-column mx-auto mt-3">
            
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

//js

const emailRegex = new RegExp("\\S+@\\S+\\.\\S+");
const codeRegex = new RegExp("\\w{6}");

function showLoginDialog(onLogin) {
    const loginHtml = getLoginHtml();
    const dialogElement = showDialog("login", loginHtml);

    const emailInput = dialogElement.querySelector("#INPUT_LOGIN_EMAIL");
    const codeInput = dialogElement.querySelector("#INPUT_LOGIN_CODE");
    const recaptchaInput = dialogElement.querySelector("#INPUT_LOGIN_RECAPTCHA");
    const submitButton = dialogElement.querySelector("#BUTTON_LOGIN_SUBMIT");
    const errorText = dialogElement.querySelector("#TEXT_LOGIN_ERROR");

    const recaptchaId = grecaptcha.render(recaptchaInput, {
        "sitekey": "6LfM8_okAAAAAELhbiyl9DBoKs9HMMIvv98Z_FNs",
        "theme": isDarkTheme() ? "dark" : "light",
    });

    submitButton.onclick = () => {

        const email = emailInput.value;
        const isEmailValid = emailRegex.test(email);
        if (!isEmailValid) {
            validateInput(errorText, false, "please enter a valid email");
            return;
        }

        const recaptchaResponse = grecaptcha.getResponse(recaptchaId);
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

            const code = codeInput.value;
            const isCodeValid = codeRegex.test(code);
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

                onLogin();

            });

        }

    };

}

function validateInput(feedbackElement, isValid, feedback) {
    feedbackElement.className = isValid ? "text-success mb-3" : "text-danger mb-3";
    feedbackElement.innerText = feedback;
}

function login(email, code, recaptcha, callback) {
    const url = API_URL + "login";
    const data = {
        "email": email,
        "code": code,
        "recaptcha": recaptcha
    }
    postJson(url, data, callback);
}
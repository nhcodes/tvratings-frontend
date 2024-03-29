//html

function getLoaderHtml(text, showLoader) {
    const display = showLoader ? "" : "d-none";
    return `
        <div class="d-flex flex-row justify-content-center align-items-center position-absolute top-50 start-50 translate-middle">
            <div class="spinner-border ${display}" role="status"></div>
            <span class="m-3">${text}</span>
        </div>
    `
}

//js

let loaderElement = null;

function showLoader(targetElement, text, showLoader) {
    hideLoader();

    targetElement.classList.add("position-relative");
    for(const childElement of targetElement.children) {
        childElement.classList.add("opacity-25");
    }

    const loaderHtml = getLoaderHtml(text, showLoader);
    loaderElement = parseElement(loaderHtml);

    targetElement.append(loaderElement);
}

function hideLoader() {
    if (loaderElement === null) return;

    const targetElement = loaderElement.parentElement;
    targetElement.classList.remove("position-relative");
    for(const childElement of targetElement.children) {
        childElement.classList.remove("opacity-25");
    }

    loaderElement.remove();
    loaderElement = null;
}
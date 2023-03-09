function loop(objects, htmlFunction) {
    return objects.map((object) => htmlFunction(object)).join("");
}

function conditional(condition, trueHtml, falseHtml = ``) {
    return condition ? trueHtml : falseHtml;
}

function parseElement(html) {
    let div = document.createElement("div");
    div.innerHTML = html;
    return div.firstElementChild;
}
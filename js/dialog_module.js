//html

function getDialogHtml(title, contentHtml) {
    return `
        <div class="offcanvas offcanvas-bottom rounded-top-4 h-auto mx-auto col-12 col-sm-10 col-md-8 col-lg-6 overflow-y-auto">
            <div class="d-flex flex-column">
                <div class="d-flex flex-row align-items-center justify-content-center position-relative">
                    <span class="text-center my-2">${title}</span>
                    <button class="btn btn-link link-secondary position-absolute end-0" onclick="currentDialog.hide()">
                        <span class="bi bi-x"></span>
                    </button>
                </div>
                <hr class="my-0">
                ${contentHtml}
            </div>
        </div>
    `
}

//js

let currentDialog;

function showDialog(title, contentHtml) {
    if(currentDialog != null) {
        currentDialog.hide();
    }

    const dialogHtml = getDialogHtml(title, contentHtml);
    const dialogElement = parseElement(dialogHtml);
    document.body.append(dialogElement);
    const dialog = new bootstrap.Offcanvas(dialogElement);
    dialogElement.addEventListener("hidden.bs.offcanvas", event => {
        dialogElement.remove();
    });
    dialog.show();
    currentDialog = dialog;
    return dialogElement;
}
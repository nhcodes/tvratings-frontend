//html

function getDialogHtml(contentHtml) {
    return `
        <div class="offcanvas offcanvas-bottom rounded-top-4 h-auto mx-auto p-1 col-12 col-sm-10 col-md-8 col-lg-6">
            ${contentHtml}
        </div>
    `
}

//js

let currentDialog;

function showDialog(contentHtml) {
    if(currentDialog != null) {
        currentDialog.hide();
    }

    let dialogHtml = getDialogHtml(contentHtml);
    let dialogElement = parseElement(dialogHtml);
    document.body.append(dialogElement);
    let dialog = new bootstrap.Offcanvas(dialogElement);
    dialogElement.addEventListener("hidden.bs.offcanvas", event => {
        dialogElement.remove();
        dialog = null;
    });
    dialog.show();
    currentDialog = dialog;
    return dialogElement;
}
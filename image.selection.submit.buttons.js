'use strict';


const createSelectionSubmittionButtonHtml = (btnId, btnLabel) => {
    let html = ''
        +  '<button id="' + btnId + '" type="button" '
        +  'class="btn btn-secondary" '
        +  'onclick="doSubmitSelectedImage(this)">' + btnLabel + '</button>'
        ;
    return html;
}

const createSelectionSubmissionButtonsHtml = (imgClasses, imgClassLabels) => {
    if (imgClasses.length !== imgClassLabels.length) {
        throw 'Error: imgClasses length !== imgClassLabels';
    }
    let html = '';
        for (let i=0; i<imgClasses.length; i++) {
            html += createSelectionSubmittionButtonHtml(imgClasses[i], imgClassLabels[i]);
        }
    return html;
}

const addDynamicallyCreatedSelectionSubmissionButtonsToHtmlPage = (imgClasses, imgClassLabels) => {
    document.getElementById('imageSelectionSubmissionButtonGroup').innerHTML = createSelectionSubmissionButtonsHtml(imgClasses, imgClassLabels);
}

const resetAllImageSelectionSubmissionButtons = (imgClasses, imgClassesThatAreTrained) => {
    //reset the digit selection/submission buttons
    for (let i=0; i<imgClasses.length; i++) {
        document.getElementById(imgClasses[i]).className = 'btn btn-default';
        imageClassesThatAreTrained[i] = false;
    }
}
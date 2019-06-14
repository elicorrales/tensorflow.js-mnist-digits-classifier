'use strict';


let currentTrainingData; 
let currentTestData;
let toggleUseTrainingOrTestingData = true;

const doToggleUseTrainingOrTestingData = (button) => {

    clearMessages();
    resetTrainingStatus();

    toggleUseTrainingOrTestingData = toggleUseTrainingOrTestingData ? false : true;

    if (toggleUseTrainingOrTestingData) {
        button.className = 'btn btn-warning';
        button.innerHTML = 'Using Trainnig Data To Test';
    } else {
        button.className = 'btn btn-info';
        button.innerHTML = 'Using Test Data To Test';
    }
   
}


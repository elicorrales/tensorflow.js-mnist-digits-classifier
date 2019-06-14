'use strict';

addDynamicallyCreatedSelectionSubmissionButtonsToHtmlPage(imageClasses, imageClassLabels);

const doYes = (button) => {
    document.getElementById('guessingInnerStats').innerHTML = updateStats(true);
    background(0);
}

const doNo = (button)  => {
    document.getElementById('guessingInnerStats').innerHTML = updateStats(false);
    background(0);
}

const doStartGuessingImage = () => {

    if (guessingMode) {
        guessImage();
    } else {
        guessingMode = true;
        trainTheNetwork = false;
        totalGuesses = 0;
        correctGuesses = 0;
        document.getElementById('trainNetwork').innerHTML = 'Train Network';
        document.getElementById('trainNetwork').className = 'btn btn-primary';
        document.getElementById('canvasPanel').className = 'col col-xs-6';
        document.getElementById('guessingStatsPanel').className = 'col col-xs-6';
        document.getElementById('guessingStatsPanel').style.display = 'block';
        resizeTheCanvas();
        document.getElementById('guess').innerHTML = 'Guess Image';
        document.getElementById('guess').className = 'btn btn-warning';
        document.getElementById('yes').style.display = 'none';
        document.getElementById('no').style.display = 'none';
    }  
}

const doChangeCanvasWidth = () => {
    networkTrained = false;
    trainTheNetwork = true;
    clearMessages();
    resizeTheCanvas();
}

const doChangeCanvasHeight = (input) => {
    networkTrained = false;
    trainTheNetwork = true;
    clearMessages();
    newCanvasHeight = input.value;
}

const doChangeCanvasResolution = (input) => {
    if (isNaN(input.value)) {
        showMessages('danger','Need Number As Canvas Resolution');
        return;
    }

    if (input.value < 5) {
        showMessages('danger','Canvas Resolution Is Too Small');
        return;
    }
    networkTrained = false;
    trainTheNetwork = true;
    clearMessages();
    canvasResolution = parseInt(input.value);
    //assemblePredictionInputs();
}


const doCreateNetwork = () => {

    guessingMode = false;
    document.getElementById('canvasPanel').className = 'col col-xs-12';
    document.getElementById('guessingStatsPanel').className = '';
    document.getElementById('guessingStatsPanel').style.display = 'none';
    document.getElementById('guess').innerHTML = 'Start Guessing';
    document.getElementById('trainNetwork').className = 'btn btn-primary';
    thereExistsNetwork = false;

    networkTrained = false;
    trainTheNetwork = false;
    document.getElementById('trainNetwork').innerHTML = 'Train Network';
    document.getElementById('trainNetwork').className = 'btn btn-primary';

    resetAllImageSelectionSubmissionButtons(imageClasses, imageClassesThatAreTrained);

    clearMessages();

    resizeTheCanvas();

    try {
        let numHidden = parseInt(document.getElementById('nnNumHidden').value);
        let activationHidden = document.getElementById('activationHidden').value;
        let activationOutputs = document.getElementById('activationOutputs').value;
        let optimizer = document.getElementById('optimizer').value;
        let loss = document.getElementById('loss').value;
        let numEpoch = parseInt(document.getElementById('nnNumEpoch').value);
        let lossGoal = parseFloat(document.getElementById('nnLossGoal').value);
        createNeuralNetwork(numHidden, activationHidden, activationOutputs, optimizer, loss, numEpoch, lossGoal);

        thereExistsNetwork = true;
        document.getElementById('testNetwork').disabled = false;
        document.getElementById('trainNetwork').disabled = false;
        document.getElementById('guess').disabled = false;


    } catch (error) {
        console.log(error);
        showMessages('danger', error);
    }
}

const doTrainNetwork = (button) => {

    trainTheNetwork = trainTheNetwork?false:true;
    if (trainTheNetwork) {
        button.className = 'btn btn-warning';
        button.innerHTML = 'Stop';
        document.getElementById('createNetwork').disabled = true;
        document.getElementById('guess').disabled = true;
    } else {
        button.className = 'btn btn-primary';
        button.innerHTML = 'Train Network';
        document.getElementById('createNetwork').disabled = false;
        document.getElementById('guess').disabled = false;
        button.disabled = true;
    }

    networkTrained = false;
    startNetworTrainTime = new Date().getTime();
    clearMessages();

    resetAllImageSelectionSubmissionButtons(imageClasses, imageClassesThatAreTrained);

    trainTheModel();
}


const doTestNetwork = () => {
    testNetwork();
    document.getElementById('trainNetwork').disabled = false;
}

const doChangeLearningRate = (slider) => {
    networkTrained = false;
    trainTheNetwork = false;
    clearMessages();
    learningRate = slider.value;
    document.getElementById('learningRate').innerHTML = learningRate;
}


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

const doToggleTrainingVsTestingImages = (button) => {

    document.getElementById('hideWhileTraining1').style.display = 'block';
    document.getElementById('hideWhileTraining2').style.display = 'block';

    modeShowTrainingTestImagesOnCanvas = true;
    doTrain = false;
    document.getElementById('train').innerHTML = 'Train Network';
    toggleTrainingVsTesting = toggleTrainingVsTesting ? false : true;
    if (toggleTrainingVsTesting) {
        button.className = 'btn btn-warning';
        button.innerHTML = 'Show Trainnig Images';
    } else {
        button.className = 'btn btn-info';
        button.innerHTML = 'Show Test Images';
    }
    doShowWhichTrainingOrTestImages();
}

const doInvert = () => {

    //modeShowTrainingTestImagesOnCanvas = true;
    doTrain = false;
    document.getElementById('train').innerHTML = 'Train Network';
    inverted = true;

    invertTrainingImagesAndCanvasColoring = invertTrainingImagesAndCanvasColoring ? false : true;
    setupTrainingAndTestingData();
    neuralNetwork = undefined;
}

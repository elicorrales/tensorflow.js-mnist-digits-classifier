'use strict';

const nnNumInputsElem = document.getElementById('nnNumInputs');
const nnNumHiddenElem = document.getElementById('nnNumHidden');
const nnNumOutputsElem = document.getElementById('nnNumOutputs');
const learningRateSliderElem = document.getElementById('learningRateSlider');
const learningRateElem = document.getElementById('learningRate');
const trainingWaitSliderElem = document.getElementById('trainingWaitSlider');
const trainingWaitElem = document.getElementById('trainingWait');

const autoRelearnElem = document.getElementById('autoRelearn');

const minRequiredTestPercentCorrectSliderElem = document.getElementById('minRequiredTestPercentCorrectSlider');
const minRequiredTestPercentCorrectElem = document.getElementById('minRequiredTestPercentCorrect');

let neuralNetwork;
let doTrain = false;
let doTest = false;
let autoRelearn = autoRelearnElem.checked;



const doCreateNetwork = () => {

    document.getElementById('hideWhileTraining1').style.display = 'none';
    document.getElementById('hideWhileTraining2').style.display = 'none';
    try {


        //grabAnyImageAlreadyOnCanvas();
        doClearCanvas();
        clearMessages();
        resetTrainingStatus();
        modeShowTrainingTestImagesOnCanvas = false;

        let numIn = parseInt(nnNumInputsElem.value);
        let numHid = parseInt(nnNumHiddenElem.value);
        let numOut = parseInt(nnNumOutputsElem.value);
        let sqrt = Math.sqrt(numIn);
        let badNumber = numIn % sqrt;
        if (badNumber) {
            showMessages('danger', 'Attempted to Create Network. Need Inputs that make Square (9, 16, 25, etc)');
            return;
        }

        if (currentTrainingData === undefined || currentTrainingData[0].outputs.length !== numOut) {
            showMessages('danger','Training Data Missing Or Num Selected Classes do NOT match Network Outputs (' + numOut + ')');
            return;
        }

        neuralNetwork = new NeuralNetwork(numIn, numHid, numOut);
        showMessages('success', 'New Network Created');
        neuralNetwork.setLearningRate(learningRateSliderElem.value);
        neuralNetwork.setActivationFunction(tanh);

    } catch (error) {
        showMessages('danger', 'Inside doCreateTrainNetwork: ' + error);
        console.log(error);
    }
}



const doTrainNetwork = () => {

    showMessages2('info','Training...');

    if (document.getElementById('train').innerHTML === 'Stop') {
        doTrain = false;
        document.getElementById('train').innerHTML = 'Train Network';
        return;
    }

    document.getElementById('hideWhileTraining1').style.display = 'none';
    document.getElementById('hideWhileTraining2').style.display = 'none';
    try {
        //grabAnyImageAlreadyOnCanvas();
        doClearCanvas();
        clearMessages();
        resetTrainingStatus();
        modeShowTrainingTestImagesOnCanvas = false;

        let numIn = parseInt(nnNumInputsElem.value);
        let numOut = parseInt(nnNumOutputsElem.value);
        let sqrt = Math.sqrt(numIn);
        let badNumber = numIn % sqrt;
        if (badNumber) {
            showMessages('danger', 'Attempted to Train Network. Need Inputs that make Square (9, 16, 25, etc)');
            return;
        }

        if (currentTrainingData === undefined || currentTrainingData[0].outputs.length !== numOut) {
            showMessages('danger','Training Data Missing Or Num Selected Classes do NOT match Network Outputs (' + numOut + ')');
            return;
        }

        document.getElementById('train').innerHTML = 'Stop';
        doTrain = true;
        doTest = true;
    } catch (error) {
        showMessages('danger', 'Inside doTrainNetwork: ' + error);
        console.log(error);
    }
}

const doTestNetwork = () => {
    document.getElementById('hideWhileTraining1').style.display = 'none';
    document.getElementById('hideWhileTraining2').style.display = 'none';
    doClearCanvas();
    clearMessages();
    resetTrainingStatus();
    try {
        let useAllSamples = true;
        test(useAllSamples);

    } catch (error) {
        showMessages('danger', 'Inside doTestNetwork: ' + error);
        console.log(error);
    }
}

const doChangeLearningRate = (slider) => {
    let learningRate = slider.value;
    learningRateElem.innerHTML = learningRate;
}

const doAutoRelearn = () => {
    autoRelearn = autoRelearnElem.checked;
}

const doChangeMinRequiredTestPercentCorrect = (slider) => {
    let percent = slider.value;
    minRequiredTestPercentCorrect.innerHTML = percent;
}


const doDoodle = () => {
    document.getElementById('hideWhileTraining1').style.display = 'block';
    document.getElementById('hideWhileTraining2').style.display = 'block';
    //eraseFromMemoryAnyGrabbedImageAlreadyOnCavnas();
    doClearCanvas();
    clearMessages();
    resetTrainingStatus();
    jumbotronElem.style.display = 'block';
    guessJumbotronElem.innerHTML = '...What Will It Be..';
}

const doGuess = () => {
    clearMessages();
    //doClearCanvas();
    resetTrainingStatus();
    //grabAnyImageAlreadyOnCanvas();
    guess();
}
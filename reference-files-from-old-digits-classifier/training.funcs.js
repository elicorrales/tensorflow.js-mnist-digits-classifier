'use strict';

let outputErrors;
let isReadyToTest = false;
let thereWasACriticalError = false;
let allTrained = false;
let trainingStartTime = new Date().getTime();
let numTrainingCyclesBeforeTrained = 0;
let currentTrainingDataIndex = 0;

let displayResolution = 10;
let currDispCol = 0;
let currDispRow = 0;

const resetTrainingStatus = () => {
    isReadyToTest = false;
    doTrain = false;
    document.getElementById('train').innerHTML = 'Train Network';
    thereWasACriticalError = false;
    allTrained = false;
    trainingStartTime = new Date().getTime();
    numTrainingCyclesBeforeTrained = 0;
    currentTrainingDataIndex = 0;
    currentTestDataIndex = 0;
    totalNumSamples = 0;
    totalErrorCount = 0;

    /*
    if (currentTrainingDataIsAllTrainedTrackingArray !== undefined) {
        for (let i = 0; i < currentTrainingDataIsAllTrainedTrackingArray.length; i++) {
            currentTrainingDataIsAllTrainedTrackingArray[i] = false;
            currentTrainingDataErrorTrackingArray[i] = 1;
        }
    }
    */
}


const isEmpty = (obj) => {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


const sumTheOutputErrors = () => {
    let sumOutputErrors = 0;
    if (outputErrors !== undefined) {
        outputErrors.forEach( o => sumOutputErrors += Math.abs(o));
    }
    return sumOutputErrors;
}

const train = () => {

    stroke(255);

    try {
        if (allTrained) {
            showMessages2('success', 'All Trained ');
            doTrain = false;
            document.getElementById('train').innerHTML = 'Train Network';
            return;
        }

        let currentTime = new Date().getTime();
        let deltaTrainingTime = (currentTime - trainingStartTime) / 1000;
        /*
        console.log('info', 'Training '
            + parseInt(deltaTrainingTime).toFixed(1) + 'secs' 
            + ', Training Idx: ' + currentTrainingDataIndex
            + ', Tot Samples: ' + numTrainingCyclesBeforeTrained 
            + '...');
        */

        let numOutputs = currentTrainingData[0].outputs.length;
        let sumOutputErrors = sumTheOutputErrors();

        showMessages2('info', 
            '<font size="+2">Training: </font>'
            + '<font size="+3">' + (deltaTrainingTime>60? parseFloat(deltaTrainingTime/60).toFixed(2) + ' min' : Math.trunc(deltaTrainingTime) + ' secs') + '</font>'
            + ', Training Idx: ' + currentTrainingDataIndex
            + ', Tot Samples: ' + numTrainingCyclesBeforeTrained 
            + '...');

        if (neuralNetwork !== undefined && currentTrainingData !== undefined && !isEmpty(currentTrainingData)) {

            let fractionBad = 0;
            for (let someCycles = 0; someCycles < 50; someCycles++) {
                if (currentTrainingDataIndex >= currentTrainingData.length) {
                    break;
                }
                //TRAIN
                let whichInputs = currentTrainingData[currentTrainingDataIndex];
                currentTrainingDataIndex++;
                if (currentTrainingDataIndex>= currentTrainingData.length) { break; }
                numTrainingCyclesBeforeTrained++;
                neuralNetwork.setLearningRate(learningRateSliderElem.value);
                outputErrors = neuralNetwork.train(whichInputs.inputs, whichInputs.outputs);
            }

            isReadyToTest = true;

            if (currentTrainingDataIndex >= currentTrainingData.length) {
                currentTrainingDataIndex = 0;
                shuffle(currentTrainingData);
                //isReadyToTest = true;
                if (!autoRelearn) {
                    if (allTrained) {
                        console.log('success', 'Trained, Used All Available Training Data'
                            + ' Time: ' + parseInt(deltaTrainingTime).toFixed(1) + 'secs'
                            + ', Tot Samples: ' + numTrainingCyclesBeforeTrained 
                            + '...');
                        showMessages2('success', 'Trained, Used All Available Training Data'
                            + ' Time: ' + parseInt(deltaTrainingTime).toFixed(1) + 'secs'
                            + ', Tot Samples: ' + numTrainingCyclesBeforeTrained 
                            + '...');
                    } else {
                        console.log('info', 'NOT Trained, Used All Available Training Data'
                            + ' Time: ' + parseInt(deltaTrainingTime).toFixed(1) + 'secs'
                            + ', Tot Samples: ' + numTrainingCyclesBeforeTrained 
                            + '...');
                        showMessages2('info', 'NOT Trained, Used All Available Training Data'
                            + ' Time: ' + parseInt(deltaTrainingTime).toFixed(1) + 'secs'
                            + ', Tot Samples: ' + numTrainingCyclesBeforeTrained 
                            + '...');
                    }
                    doTrain = false;
                    document.getElementById('train').innerHTML = 'Train Network';
                    return;
                }
            }


        } else {
            showMessages('danger', 'There was nothing to train, either missing data, or missing network.');
            doTrain = false;
            document.getElementById('train').innerHTML = 'Train Network';
        }

    } catch (error) {
        console.log(error);
        showMessages('danger', error);
        thereWasACriticalError = true;
    }

}

let actualPercentCorrect = 0;
let toggleModifiedTestingData = false;
let totalTestErrorDelta = 0;
let currentTestDataIndex = 0;
let totalNumSamples = 0;
let totalErrorCount = 0;

const findMaxFloatValueInArray = (outputs) => {
    if (outputs === undefined) {
        throw 'Outputs undefined';
    }
    let max = 0;
    for (let i=0; i<outputs.length; i++) {
        if (max < outputs[i]) max = outputs[i];
    }
    return max;
}


const findIndexOfMaxOutput = (outputs) => {
    if (outputs === undefined) {
        throw 'Outputs undefined';
    }
    let max = findMaxFloatValueInArray(outputs);
    return outputs.indexOf(max);
}


const convertArrayOfFloatsToCategory = (outputs) => {
    let binaryString = '';
    outputs.forEach( o => {
        if (o >= 0.5) binaryString += '1';
        else binaryString += '0';
    })

    return parseInt(binaryString,2);
}


const test = (useAllSamples = false) => {

    let useWhichDataToTest;

    if (toggleUseTrainingOrTestingData) {
        useWhichDataToTest = currentTrainingData;
    } else {
        useWhichDataToTest = currentTestData;
    }

    if (useWhichDataToTest === undefined) {
        throw 'There is NO Test Data';
    }
    if (neuralNetwork === undefined) {
        throw 'No Neural Network';
    }

    let totalErrorCount = 0;
    let totalNumSamples = 0;

    let numTestCyclesToDo = 100;
    if (allTrained || useAllSamples) {
        numTestCyclesToDo = useWhichDataToTest.length;
        currentTestDataIndex = 0;
    }

    for (let i = 0; i < numTestCyclesToDo; i++) {
        let category = useWhichDataToTest[currentTestDataIndex].label;
        let expectedOutputs = useWhichDataToTest[currentTestDataIndex].outputs;
        let inputs = useWhichDataToTest[currentTestDataIndex].inputs.slice(0);
        totalNumSamples++;
        let outputs = neuralNetwork.predict(inputs);
        currentTestDataIndex++;
        if (currentTestDataIndex >= useWhichDataToTest.length) { currentTestDataIndex = 0; };

        //when using neural network with 1 output per digit (0-9),
        //we use these:
        let categoryGuessed = findIndexOfMaxOutput(outputs);
        let categoryExpected = findIndexOfMaxOutput(expectedOutputs);

/*
        //when using neural network whose outputs produce a binary sequence,
        //we only need 4 outputs to handle 10 digits, but we need to convert
        //the output values (floats somewhere between 0 and 1) into  logical
        //highs and lows, then we can just do a direct compary with expected
        //output.
        let categoryGuessed = convertArrayOfFloatsToCategory(outputs);
        let categoryExpected = convertArrayOfFloatsToCategory(expectedOutputs);
*/


        if (categoryGuessed != categoryExpected) {
            totalErrorCount ++;
        }


    }

    actualPercentCorrect = (((totalNumSamples-totalErrorCount)/totalNumSamples)*100).toFixed(1);
    console.log(
        'Test Results: Test Idx: ' + currentTestDataIndex 
        + ', Err Count : ' + totalErrorCount 
        + ', Samples: ' + totalNumSamples 
        + ', ' + actualPercentCorrect + '% Correct');
    if (useAllSamples) {    
        showMessages('info',
            '<font size="+2">Test:</font>'
            + ', <font size="+3">' + actualPercentCorrect + '% Correct</font>'
            + 'Test Idx: ' + currentTestDataIndex 
            + ', Err Count : ' + totalErrorCount 
            + ', Samples: ' + totalNumSamples 
        );
    } else {
        showMessages('info',
            '<font size="+2">Test:</font>'
            + ', <font size="+3">Err Count : ' + totalErrorCount + '</font>'
            + ', Samples: ' + totalNumSamples 
            + 'Test Idx: ' + currentTestDataIndex 
        );

    }

    allTrained = parseFloat(actualPercentCorrect) >= parseFloat(minRequiredTestPercentCorrectSliderElem.value);
    isReadyToTest = false;
}


const doToggleModifiedTestingData = (button) => {
    doClearCanvas();
    clearMessages();
    resetTrainingStatus();
    
    toggleModifiedTestingData = toggleModifiedTestingData ? false : true;
    if (toggleModifiedTestingData) {
        button.className = 'btn btn-warning';
        button.innerHTML = 'Modified';
    } else {
        button.className = 'btn btn-info';
        button.innerHTML = 'Original';
    }
}


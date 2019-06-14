'use strict';

let guessingMode = false;

let userChoice;

const highestValueOutputIdx = (outputs) => {

    let idx = 0;
    let high = 0;
    for (let i=0; i<outputs.length; i++) {
        if (high < outputs[i]) { high = outputs[i]; idx = i; }
    }
    return idx;
}


const convertDoodleToInputsForTensor = () => {
    let img= get();
    img.resize(imgBitmapWidth,imgBitmapHeight);
    img.loadPixels();
    let imgData = [];
    for (let i=0; i<imgBitmapSize; i++) {
        let pixel = img.pixels[i*4];
        let bright = max([img.pixels[i*4],img.pixels[i*4+1],img.pixels[i*4+2]]);
        if (bright < 0) bright = 0;
        imgData[i] = bright/255;
    }

    return imgData;
}


let totalGuesses = 0;
let correctGuesses = 0;
const guessImage = () => {

    let userDrawnImageData = convertDoodleToInputsForTensor();

    let tfUserInputs = tf.tensor2d([userDrawnImageData]);

    let outputs = tfModel.predict(tfUserInputs).dataSync();
    let prediction = imageClasses[highestValueOutputIdx(outputs)];
    //console.log('You picked ' + shade + ', I guessed ' + prediction);
    let html = '<span><font size="+2">'
            + 'Is it a :&nbsp ' + prediction + '?<br/>'
            + '</font></span>';

    document.getElementById('guessingInnerStats').innerHTML = html;
    document.getElementById('yes').style.display = 'block';
    document.getElementById('no').style.display = 'block';
}

const updateStats = (isCorrect) => {

    if (isCorrect) {
        correctGuesses++;
        document.getElementById('guessingInnerStats').style.backgroundColor = 'alert-success';
    } else {
        document.getElementById('guessingInnerStats').style.backgroundColor = 'alert-danger';
    }

    totalGuesses++;
    let html = ''
        + '<font size="+2">'
        + ((correctGuesses/totalGuesses)*100).toFixed(1) + '% correct'
        + '</font>';

    return html;
}

const testNetwork = () => {

    let predictions = tfModel.predict(tfTestInputs).dataSync();

    for (let i=0, j=0; i<predictions.length; i+=testDataOutputs[0].length, j++) {
        let prediction = predictions.subarray(i,i+testDataOutputs[0].length);
        let predictIdx = highestValueOutputIdx(prediction);
        if (testDataOutputs[j][i] === 1) {
            document.getElementById('testResults').innerHTML = updateStats(true);
        } else {
            document.getElementById('testResults').innerHTML = updateStats(false);
        }
    }

}
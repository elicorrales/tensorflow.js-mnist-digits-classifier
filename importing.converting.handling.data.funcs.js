'use strict';

//////////////////////////////////////////////////////////////////////////////////////
// WARNING!!!! this number affects how browser will start up (if it even will)
// it can create too many tensors
//////////////////////////////////////////////////////////////////////////////////////
let numImagesLimit = 6000; //4000; //2000; //1000;

const imgBitmapWidth = 28;
const imgBitmapHeight = 28;
const imgBitmapSize = imgBitmapWidth * imgBitmapHeight;

const numImgsAcross = 10;
const numImgsDown = 10;

let modeShowTrainingTestImagesOnCanvas = false;

//////////////////////////////////////////////////////////////////////////////////////
// raw images training + test) from input files
//////////////////////////////////////////////////////////////////////////////////////
let rawTrainingImages;
let rawTrainingLabels;
let rawTestImages;
let rawTestLabels;


//////////////////////////////////////////////////////////////////////////////////////
// training data
//////////////////////////////////////////////////////////////////////////////////////
let imageClassesTrainingData;
let tfTrainingInputs;
let tfTrainingOutputs;

//////////////////////////////////////////////////////////////////////////////////////
// test data
//////////////////////////////////////////////////////////////////////////////////////
let imageClassesTestData;
let tfTestInputs;
let testDataOutputs;



let imageClasses = [];
let imageClassLabels = [];
let imageClassesThatAreTrained = [];
for (let i=0; i<10; i++) {
    imageClasses[i] = i;
    imageClassLabels[i] = i;
    imageClassesThatAreTrained[i] = false;
}



let invertTrainingImagesAndCanvasColoring = false;
let inverted = false;
let toggleTrainingVsTesting = false;
let toggleUseTrainingOrTestingData = true;

const imgPath = 'raw.training.test.data.files/';
const preloadTrainingImageFiles = () => {

    rawTrainingImages = loadBytes(imgPath+'train-images.idx3-ubyte');
    rawTrainingLabels = loadBytes(imgPath+'train-labels.idx1-ubyte');
    rawTestImages     = loadBytes(imgPath+'t10k-images.idx3-ubyte');
    rawTestLabels     = loadBytes(imgPath+'t10k-labels.idx1-ubyte');
 
}


const convertRawImagesToTrainingOrTestingData = (images, labels, type, numImagesLimit) => {
    let inputData = [];
    let numImages = images.length/imgBitmapSize;
    if (numImages != labels.length) {
        throw 'Number of images (' + images.length + ') vs number of labels (' + labels.length + ') do not match.';
    }

    if (numImages > numImagesLimit) {
        showMessages('warning','Limiting number of ' + type + ' images to ' + numImagesLimit);
        console.log('warning','Limiting number of ' + type + ' images to ' + numImagesLimit);
        numImages = numImagesLimit;
    }

    for (let i = 0; i < numImages; i++) {
        let dataObject = {};
        let tempInputs = images.slice(i*imgBitmapSize, i*imgBitmapSize + imgBitmapSize); //get 1 image as inputs
        dataObject.inputs = [];
        //normalize and possibly invert input image pixel data
        for (let j=0; j<tempInputs.length; j++) {
            let numerator = invertTrainingImagesAndCanvasColoring ? 255 - tempInputs[j] : tempInputs[j];
            let normalized = numerator/255;
            dataObject.inputs[j] = normalized;
        }
        dataObject.label = labels[i];
        dataObject.type = type;
        dataObject.outputs = [0,0,0,0,0,0,0,0,0,0];//one for each possible digit (0-9)
        dataObject.outputs[labels[i]] = 1; // the actual digit location should be the only one at 1;
        inputData.push(dataObject);
    }
    return inputData;
}

const setupTrainingTestingImagesAndDataArrays = () => {
    let temp = rawTrainingImages.bytes.slice(16);
    rawTrainingImages = temp;
    temp = rawTrainingLabels.bytes.slice(8);
    rawTrainingLabels = temp;
    temp = rawTestImages.bytes.slice(16);
    rawTestImages = temp;
    temp = rawTestLabels.bytes.slice(8);
    rawTestLabels = temp;
}

const setupTrainingAndTestingData = () => {
    imageClassesTrainingData = convertRawImagesToTrainingOrTestingData(rawTrainingImages, rawTrainingLabels, 'training', numImagesLimit);
    imageClassesTestData = convertRawImagesToTrainingOrTestingData(rawTestImages, rawTestLabels, 'test', numImagesLimit);
    rawTrainingImages = undefined;
    rawTrainingLabels = undefined;
    rawTestImages = undefined;
    rawTestLabels = undefined;
}




const convertImageClassesTrainingTestAndDataIntoTensors = () => {

    if (tfTrainingInputs != undefined) {
        try { tfTrainingInputs.dispose(); } catch (error) {}
        try { tfTrainingOutputs.dispose(); } catch (error) {}
        try { tfTestInputs.dispose(); } catch (error) {}
    }

    let trainingDataInputs = [];
    let trainingDataOutputs = [];
    for (let i=0; i< imageClassesTrainingData.length; i++) {
        trainingDataInputs[i] = imageClassesTrainingData[i].inputs;
        trainingDataOutputs[i] = imageClassesTrainingData[i].outputs;
    }
    imageClassesTrainingData = undefined;


    let testDataInputs = [];
    testDataOutputs = [];
    for (let i=0; i< imageClassesTestData.length; i++) {
        testDataInputs[i] = imageClassesTestData[i].inputs;
        testDataOutputs[i] = imageClassesTestData[i].outputs;
    }
    imageClassesTestData = undefined;


    tfTrainingInputs = tf.tensor2d(trainingDataInputs);
    trainingDataInputs = undefined;

    tfTrainingOutputs = tf.tensor2d(trainingDataOutputs);
    trainingDataOutputs = undefined;

    tfTestInputs = tf.tensor2d(testDataInputs);
    testDataInputs = undefined;
}



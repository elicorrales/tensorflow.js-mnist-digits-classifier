'use strict';


const imgBitmapWidth = 28;
const imgBitmapHeight = 28;
const imgBitmapSize = imgBitmapWidth * imgBitmapHeight;

const numImgsAcross = 10;
const numImgsDown = 10;

let modeShowTrainingTestImagesOnCanvas = false;

//////////////////////////////////////////////////////////////////////////////////////
// raw images training + test) from input files
//////////////////////////////////////////////////////////////////////////////////////
let mnistDigitsTrainingImages;
let mnistDigitsTrainingLabels;
let mnistDigitsTestImages;
let mnistDigitsTestLabels;


//////////////////////////////////////////////////////////////////////////////////////
// training data
//////////////////////////////////////////////////////////////////////////////////////
let digitsTrainingData;


//////////////////////////////////////////////////////////////////////////////////////
// test data
//////////////////////////////////////////////////////////////////////////////////////
let digitsTestData;


let currShapesTrainingImagesToShow;
let invertTrainingImagesAndCanvasColoring = false;
let inverted = false;
let toggleTrainingVsTesting = false;


const imgPath = 'raw.training.test.data.files/';
const preloadTrainingImageFiles = () => {

    mnistDigitsTrainingImages = loadBytes(imgPath+'train-images.idx3-ubyte');
    mnistDigitsTrainingLabels = loadBytes(imgPath+'train-labels.idx1-ubyte');
    mnistDigitsTestImages     = loadBytes(imgPath+'t10k-images.idx3-ubyte');
    mnistDigitsTestLabels     = loadBytes(imgPath+'t10k-labels.idx1-ubyte');
 
}


const convertImagesToTrainingOrTestingData = (images, labels, type) => {
    let inputData = [];
    let numImages = images.length/imgBitmapSize;
    if (numImages != labels.length) {
        throw 'Number of images (' + images.length + ') vs number of labels (' + labels.length + ') do not match.';
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



        //one way to do this - one output per class , where only one is the highest value
        // thus we need 10 outputs
        dataObject.outputs = [0,0,0,0,0,0,0,0,0,0];//one for each possible digit (0-9)
        dataObject.outputs[labels[i]] = 1; // the actual digit location should be the only one at 1;



/*
        //another way - binary number sequence, so for our case of needing 10 different classes,
        //we can use 4 outputs in this manner:
        let outputs;
        switch (labels[i]) {
            case 0:
                outputs = [0,0,0,0];
                break;
            case 1:
                outputs = [0,0,0,1];
                break;
            case 2:
                outputs = [0,0,1,0];
                break;
            case 3:
                outputs = [0,0,1,1];
                break;
            case 4:
                outputs = [0,1,0,0];
                break;
            case 5:
                outputs = [0,1,0,1];
                break;
            case 6:
                outputs = [0,1,1,0];
                break;
            case 7:
                outputs = [0,1,1,1];
                break;
            case 8:
                outputs = [1,0,0,0];
                break;
            case 9:
                outputs = [1,0,0,1];
                break;
        }
        dataObject.outputs = outputs;
*/


        inputData.push(dataObject);
    }

    return inputData;
}

const setupTrainingTestingImagesAndDataArrays = () => {

    let temp = mnistDigitsTrainingImages.bytes.slice(16);
    mnistDigitsTrainingImages = temp;
    //let numTrainingDigits = mnistDigitsTrainingImages.length / imgBitmapSize;
    //console.log(numTrainingDigits);

    temp = mnistDigitsTrainingLabels.bytes.slice(8);
    mnistDigitsTrainingLabels = temp;
    //let numTrainingLabels = mnistDigitsTrainingLabels.length;
    //console.log(numTrainingLabels);

    temp = mnistDigitsTestImages.bytes.slice(16);
    mnistDigitsTestImages = temp;
    //let numTestDigits = mnistDigitsTestImages.length / imgBitmapSize;
    //console.log(numTestDigits);

    temp = mnistDigitsTestLabels.bytes.slice(8);
    mnistDigitsTestLabels = temp;
    //let numTestLabels = mnistDigitsTestLabels.length;
    //console.log(numTestLabels);

}

const setupTrainingAndTestingData = () => {

    digitsTrainingData = convertImagesToTrainingOrTestingData(mnistDigitsTrainingImages, mnistDigitsTrainingLabels, 'training');
    digitsTestData = convertImagesToTrainingOrTestingData(mnistDigitsTestImages, mnistDigitsTestLabels, 'test');
    currentTrainingData = digitsTrainingData; 
    currentTestData = digitsTestData;
}


const drawImgSet = (imgArray) => {
    let numImgs = imgArray.length / imgBitmapSize;
    let imgIdx = 0;
    for (let imgDownIdx = 0; imgDownIdx < numImgsDown; imgDownIdx++) {
        if (imgIdx >= numImgs) {
            break;
        }
        for (let imgAcrossIdx = 0; imgAcrossIdx < numImgsAcross; imgAcrossIdx++) {
            if (imgIdx >= numImgs) {
                break;
            }
            drawSingleImageFromArray(imgIdx, imgArray, imgAcrossIdx, imgDownIdx);
            imgIdx++;
        }
    }

}


const drawSingleImageFromArray = (imgIdx, imgArray, imgAcrossIdx, imgDownIdx) => {
    let startImgArrIdx = imgIdx * imgBitmapSize;
    let endImgArrIdx = startImgArrIdx + imgBitmapSize;
    let imgSubArr = imgArray.slice(startImgArrIdx, endImgArrIdx);
    let img = createImage(imgBitmapWidth, imgBitmapHeight);
    img.loadPixels();
    if (imgSubArr.length !== img.pixels.length / 4) {
        throw 'Error in arrays lengths';
    }
    for (let p = 0, a = 0; p < img.pixels.length, a < imgSubArr.length; p += 4, a++) {

        let value = invertTrainingImagesAndCanvasColoring ? 255 - imgSubArr[a] : imgSubArr[a];
        img.pixels[p] = value;
        img.pixels[p + 1] = value;
        img.pixels[p + 2] = value;
        img.pixels[p + 3] = 255;
    }
    img.updatePixels();
    image(img, imgBitmapWidth * imgAcrossIdx, imgBitmapHeight * imgDownIdx);
}


const doShowWhichTrainingOrTestImages = () => {

    modeShowTrainingTestImagesOnCanvas = true;
    doTrain = false;
    document.getElementById('train').innerHTML = 'Train Network';

     currShapesTrainingImagesToShow = toggleTrainingVsTesting ? mnistDigitsTrainingImages : mnistDigitsTestImages;

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

const drawTrainingOrTestImagesOnCanvas = () => {

    background(invertTrainingImagesAndCanvasColoring ? 255 : 0);

    if (currShapesTrainingImagesToShow !== undefined) {
        drawImgSet(currShapesTrainingImagesToShow);
    }
}

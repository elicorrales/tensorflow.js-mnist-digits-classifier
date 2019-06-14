const guessJumbotronElem = document.getElementById('GUESS');
const jumbotronElem = document.getElementById('JUMBOTRON');
const doodleNameElem = document.getElementById('doodleName');

let currY = 0;
let currX = 0;
let currPixelIdx = 0;

let topBlackX = -1;
let topBlackY = -1;
let bottomBlackX = -1;
let bottomBlackY = -1;
let leftBlackX = -1;
let leftBlackY = -1;
let rightBlackX = -1;
let rightBlackY = -1;

let numHorz = imgBitmapWidth;
let numVert = imgBitmapHeight;

//let grabbedAnyImageAlreadyOnCanvas;
let imageRegion;
let imageStartX;
let imageStartY;
let currGridSquareImage;
let currFilledGridSquaresImage;
let summedFilledGridSquaresImage;
let shade = 10;

// for saving image info
let imageInfoGridArray;
let imageInfoName;
let imageInfoTarget;


const doClearCanvas = () => {
    modeShowTrainingTestImagesOnCanvas = false;
    jumbotronElem.style.display = 'none';
    background(invertTrainingImagesAndCanvasColoring ? 255 : 0);
    //background(255);
    currX = 0;
    currY = 0;
    topBlackX = -1;
    topBlackY = -1;
    bottomBlackX = -1;
    bottomBlackY = -1;
    leftBlackX = -1;
    leftBlackY = -1;
    rightBlackX = -1;
    rightBlackY = -1;
    currPixelIdx = 0;
    imageRegion = undefined;
    imageStartX = -1;
    imageStartY = -1;
    currGridSquareImage = undefined;
    currFilledGridSquaresImage = undefined;
    summedFilledGridSquaresImage = undefined;
    imageInfoGridArray = undefined;
}

const doPlaceImage = () => {

    clearMessages();

    modeShowTrainingTestImagesOnCanvas = false;

    if (imageRegion !== undefined) {
        //imageRegion.save();
        image(imageRegion,0,0);
    } else {
        showMessages('danger','No Image To Place');
        return false;
    }
    return true;
}

const doSaveDoodleToDisk = () => {
    
    if (imageRegion !== undefined && doodleNameElem.value !== undefined && doodleNameElem.value !== '') {
        imageRegion.save(doodleNameElem.value,'png');
    } else {
        showMessages('danger','No Image To Save or No Image Name Or You didnt Try to Guess');
        return false;
    }
}

const doLoadDoodleFromDisk = () => {
    
    if (doodleNameElem.value !== undefined && doodleNameElem.value !== '') {
        imageRegion = loadImage('./doodles/' + doodleNameElem.value + '.png');
        image(imageRegion,0,0);
    } else {
        showMessages('danger','No Image To Save or No Image Name Or You didnt Try to Guess');
        return false;
    }
}

const convertDoodleToInputs = () => {

    // my updated method to do same thing as STEP 1 & 2
    //imgBitmapWidth = 28;
    //imgBitmapHeight = 28;
    //28 * canvas width multiplier
    //28 * canvas height multiplier
    //28 * 10 = 280
    //28 = 20 = 560
    imageRegion = get();
    let img = get();
    img.resize(imgBitmapWidth,imgBitmapHeight);
    img.loadPixels();
    //console.log(img.pixels);
    imageInfoGridArray = [];
    for (let i=0; i<imgBitmapSize; i++) {
        let pixel = img.pixels[i*4];
        let bright = max([img.pixels[i*4],img.pixels[i*4+1],img.pixels[i*4+2]]);
        if (bright < 0) bright = 0;
        imageInfoGridArray[i] = bright/255;
    }
}

const guessBasedOnFourOutputsRepresentingBinarySequenceEquivalentOfDigit = (guesses) => {

    return convertArrayOfFloatsToCategory(guesses);

}

const guessBasedOnTenOutputsOneForEachDigit = (guesses) => {

    let prevHighestGuessVal = 0;
    let highestGuess = 0;
    let highestGuessPositionIdx = -1;
    guesses.forEach( (guess,gidx) => {
        if (highestGuess<guess) { prevHighestGuessVal = highestGuess; highestGuess = guess; highestGuessPositionIdx = gidx; }
    });

/*
    for (let guess=0; guess<guesses.length; guess++) {
        for (let td=0; td<currentTrainingData.length; td++) {
            if (currentTrainingData[td].outputs[guess] === 1) {
                sole.log(currentTrainingData[td].label + ': ' + guesses[guess]);
            }
        }

    }
    console.log(guesses);
*/
    let tdMatch;
    
    for (let i=0; i<currentTrainingData.length; i++) {
        if (currentTrainingData[i].outputs[highestGuessPositionIdx] === 1) {
            console.log('Guessing it is a ' + currentTrainingData[i].label);
            tdMatch = currentTrainingData[i].label;
            break;
        }
    }

    return tdMatch;
}

const guess = () => {
    //clearMessages();
    jumbotronElem.style.display = 'none';

    if (currentTrainingData===undefined) {
        showMessages('danger','No Training Data');
        imageRegion = get();
        //imageRegion.save();
        return;
    }
    
    convertDoodleToInputs();


    if (neuralNetwork === undefined) {
        showMessages('danger','No Neural Network');
        imageRegion = get();
        return;
    }

    let guesses = neuralNetwork.predict(imageInfoGridArray);

    let tdMatch = guessBasedOnTenOutputsOneForEachDigit(guesses);
    //let tdMatch = guessBasedOnFourOutputsRepresentingBinarySequenceEquivalentOfDigit(guesses);


    if (tdMatch!==undefined) {
        jumbotronElem.style.display = 'block';
        guessJumbotronElem.innerHTML = 'Is it ' + tdMatch + '?';
    }
    doPlaceImage();
}

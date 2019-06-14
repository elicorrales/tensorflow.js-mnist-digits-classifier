'use stricti';

let canvas;

function preload() {
    preloadTrainingImageFiles();
}

function setup() {

    setupTrainingTestingImagesAndDataArrays();
    setupTrainingAndTestingData();
    convertImageClassesTrainingTestAndDataIntoTensors();
/*
*/
    document.getElementById('hideWhileLoading').style.display = 'block';

    canvas = createCanvas(400, 400);
    canvas.parent('canvasParent');

    resizeTheCanvas();

    background(0);
}


const resizeTheCanvas = () => {

    prevCanvasWidth = newCanvasWidth;
    newCanvasWidth = document.getElementById('canvasParent').clientWidth;
    tempCanvasHeight = canvasResolution * imageClasses.length; 
    if (newCanvasHeight / 2 > tempCanvasHeight) {
        newCanvaseHeight = tempCanvasHeight * 2;
    }
    document.getElementById('canvasHeight').value = newCanvasHeight;
    resizeCanvas(newCanvasWidth, newCanvasHeight);

    background(0);
}

function draw() {


    try {

        if (prevCanvasWidth !== newCanvasWidth) {
            resizeTheCanvas();
        }

        canvasCols = floor(newCanvasWidth / canvasResolution);
        canvasRows =  newCanvasHeight / canvasResolution;

/*
        //modes requiring the canvas to always be wiped
        if  (trainTheNetwork) {
            background(0);
        }
*/
        if (thereExistsNetwork && !guessingMode) {
            background(0);
            showTrainingResults();
        }


        document.getElementById('tensors').innerHTML = tf.memory().numTensors;

    } catch (error) {
        console.log(error);
        showMessages('danger',error);
    }


}
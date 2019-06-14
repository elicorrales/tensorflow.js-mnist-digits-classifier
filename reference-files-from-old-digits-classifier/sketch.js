'use strict';

let canvas;

function preload() {
    preloadTrainingImageFiles();
}

function setup() {


    //imgBitmapWidth = 28;
    //imgBitmapHeight = 28;
    //28 * canvas width multiplier
    //28 * canvas height multiplier
    //28 * 10 = 280
    //28 = 20 = 560
    canvas = createCanvas(280,280);
    //resizeCanvas(imgBitmapWidth*numImgsAcross, imgBitmapHeight*numImgsDown);
    canvas.parent('canvasParent');
    background(invertTrainingImagesAndCanvasColoring ? 255 : 0);
    //background(255);
    setupTrainingTestingImagesAndDataArrays();
    setupTrainingAndTestingData();

    document.getElementById('hideWhileLoading').style.display = 'block';
}


function draw() {

    if (inverted) {
        background(invertTrainingImagesAndCanvasColoring ? 255 : 0);
        inverted = false;
    }

    if (modeShowTrainingTestImagesOnCanvas) {
        //if (loadedDataImageToDrawBlownUp === undefined) {
            drawTrainingOrTestImagesOnCanvas();
        //} else {
            //image(loadedDataImageToDrawBlownUp);
        //}
    } else {
        //placeBackAnyGrabbedImageAlreadyOnCanvas();
        if (doTrain) {
            train();
        }
        if (doTest && isReadyToTest) {
            test();
        }
        if (allTrained) {
            showMessages('success','All Trained');
        }
    }
}

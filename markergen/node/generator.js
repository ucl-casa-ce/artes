#!/usr/bin/env node

//Command line Pattern file generator, based on https://github.com/AR-js-org/AR.js/tree/master/three.js/examples/marker-training
const fs = require('fs'), path = require('path'), Canvas = require('canvas');

//Variables
var THREEx = THREEx || {}
THREEx.ArPatternFile = {}

var innerImageURL = null
var imageName = null

const args= process.argv.slice(2)
const imgFolder = ( args[0] || 'img')


//3 functions are used: 
//encodeImageURL: to load the image (png or jpg)
//encodeImage: encode the pattern (matrix 16 by 16 RGB 4 rotations)
//triggerDownload: write the file (patt)

THREEx.ArPatternFile.encodeImageURL = function (imageURL, onComplete) {
    var image = new Canvas.Image;
    image.onload = function () {
        var patternFileString = THREEx.ArPatternFile.encodeImage(image)
        onComplete(patternFileString)
    }
    image.src = imageURL;
}

THREEx.ArPatternFile.encodeImage = function (image) {
    // Initialiaze a new Canvas 16 by 16
    // as the image, and get a 2D drawing context for it.
    var canvas = new Canvas.Canvas();
    canvas.width = 16;
    canvas.height = 16;
    var context = canvas.getContext('2d')


    var patternFileString = ''
    for (var orientation = 0; orientation > -2 * Math.PI; orientation -= Math.PI / 2) {
        // draw on canvas - honor orientation
        context.save();
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.translate(canvas.width / 2, canvas.height / 2);
        context.rotate(orientation);
        context.drawImage(image, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        context.restore();

        // get imageData
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height)

        // generate the patternFileString for this orientation
        if (orientation !== 0) patternFileString += '\n'
        // NOTE bgr order and not rgb!!! so from 2 to 0
        for (var channelOffset = 2; channelOffset >= 0; channelOffset--) {
            // console.log('channelOffset', channelOffset)
            for (var y = 0; y < imageData.height; y++) {
                for (var x = 0; x < imageData.width; x++) {

                    if (x !== 0) patternFileString += ' '

                    var offset = (y * imageData.width * 4) + (x * 4) + channelOffset
                    var value = imageData.data[offset]

                    patternFileString += String(value).padStart(3);
                }
                patternFileString += '\n'
            }
        }
    }

    return patternFileString
}

THREEx.ArPatternFile.triggerDownload = function (patternFileString, fileName = 'pattern-marker.patt') {

    fs.writeFile('./patt/'+fileName, patternFileString, function (err) {
        if (err) return console.log(err);

    })
}


//Encoding
let i = 0;
// Make an async function that gets executed immediately
async function generatePatts(folder) {
    try {
        // Get the files as an array
        console.log(folder);

        const files = await fs.promises.readdir(folder);

        // Loop them all with the new for...of
        for (const file of files) {
            // Get the full paths
            innerImageURL = path.join(folder, file);
            i++;
            console.log(i);
            // Stat the file to see if we have a file or dir
            const stat = await fs.promises.stat(innerImageURL);

            if (stat.isFile())
                console.log("'%s' is a file.", innerImageURL);
            else if (stat.isDirectory())
                console.log("'%s' is a directory.", innerImageURL);

            THREEx.ArPatternFile.encodeImageURL(innerImageURL, function onComplete(patternFileString) {
                THREEx.ArPatternFile.triggerDownload(patternFileString, "patt_" + (imageName || "marker_") + i + ".patt")
            })

        } // End for...of
    }
    catch (e) {
        // Catch anything bad that happens
        console.error("Couldn't find the folder!", e);
    }

}; // Wrap in parenthesis and call now

generatePatts(imgFolder);










## ARTES - Augmented Reality Tiles for Environmental Sensing :diamond_shape_with_a_dot_inside: :seedling:

![Plant Realtime feed Mqtt](./docs/ARTES_Mqtt.gif)

# About

:earth: [https://ucl-casa-ce.github.io/artes](https://ucl-casa-ce.github.io/artes)

ARTES uses WebAR and physical markers to visualise real time data from MQTT feeds. It has been first developed during the [EAST SUMMER SCHOOL](https://www.queenelizabetholympicpark.co.uk/our-story/supporting-communities/education-and-young-people/east-education-summer-school), 26 July – 6 August 2021

__Discover how to build a simple soil sensor prototype to make sure your plants are getting the right amount of light and water, and design an AR (augmented reality) marker using mosaic tiles. In this hands-on creative tech space you will learn how to make your marker come to life by making it interactive, pull in data from the sensors, and access it via a smartphone. You will also have the opportunity to ask questions and find out more about the application of similar technologies in cutting edge research projects by members of the Connected Environments Lab, such as the bat boxes in the Queen Elizabeth Olympic Park.__

# How it works

- [Build the tile](#build-the-tile)
- [Encode the tile](#encode-the-tile)
- [Visualise the data](#visualise-the-data)

## Build the Tile

In general, the same tips used to create a [custom marker](https://medium.com/chialab-open-source/10-tips-to-enhance-your-ar-js-app-8b44c6faffca) can be applied to physical tiles. In our case we used Lego 2x2 flat tiles in 7 different colours:

- White
- Bright Red
- Bright Yellow
- Dark Green
- Bright Orange
- Medium Azur
- Earth Blue

The final marker used a 3 by 3 tiles pattern (a 6 by 6 tiles pattern has been tested as well). The white tiles around the black frame are not essentials, but help in the detection of the marker.

![Example Plant Mqtt](./docs/Marker_s.jpg)

## Encode the tile

Next step is to translate the physical marker into a digital pattern. The `makerTiles/tiles.html` is a static (and very simple) page used to digitise and download an image of the tile made with Lego tiles. To match the colour of the physical tiles with their digital version we used the following HEX code:

| Tile          |   HEX  |
|---------------|--------|
| White         | #FFFFFF |
| Bright Red    | #ED1D2A |
| Bright Yellow | #FFD500 |
| Dark Green    | #00843D |
| Bright Orange | #FF8200 |
| Medium Azur   | #1D83AF |
| Earth Blue    | #003865 |

During the event we used a touchscreen to easily select the tiles and the colours.

The folder _./markergen/node_ contains the scripts to create the pattern _.patt_ used by _AR.Js_. It is based on the [AR.js marker-training](https://github.com/AR-js-org/AR.js/tree/master/three.js/examples/marker-training). After installing the _node_modules_, using `npm install`, these are the steps to follow:

- copy the images to convert into Pattern file in the _./markergen/node/img_ folder (images need to be square, PNG -with no alpha channel / transparency- or JPG);
- in a new `node.js` terminal, run `node generator` in the _./markergen/node/node_ folder ;
- the patterns will be created and saved in the folder _./markergen/node/patt_;

The [online tool](https://ar-js-org.github.io/AR.js/three.js/examples/marker-training/examples/generator.html) can be used to download the image with the black border 

## Visualise the data

The _patt files_ created with `markergen/node/generator.js` are used trigger the WebAR experience and need to be moved in the _patt_ folder of the main website

The real-time data are collected from a series of sensors connected to an Arduino board and published to a MQTT broker. We used [MQTT.js](https://github.com/mqttjs/MQTT.js) to subscribe to the public topics. As WebAR needs to access the camera of the smartphone a secure HTTPS connection is needed, therefore also the Websocket connection need to be secure (WSS).

## Libraries

- [AFrame](https://aframe.io/)
- [AR.JS](https://github.com/AR-js-org/AR.js/)
- [MQTT.js](https://github.com/mqttjs/MQTT.js)

## Team

Martin de Jode (UCL - CASA - Connected Environments)

Leah Lovett (UCL - CASA - Connected Environments) @leahlovett

Valerio Signorelli (UCL - CASA - Connected Environments) @ValeSignorelli

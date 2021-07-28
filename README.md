## ARTES - Augmented Reality Tiles for Environmental Sensing :diamond_shape_with_a_dot_inside: :seedling:

![Example Plant Mqtt](./docs/ARTES_Mqtt.gif)

# About

ARTES has been developed for the [EAST SUMMER SCHOOL PROGRAMME 2021](https://www.queenelizabetholympicpark.co.uk/our-story/supporting-communities/education-and-young-people/east-education-summer-school), 26 July – 6 August 2021

Discover how to build a simple soil sensor prototype to make sure your plants are getting the right amount of light and water, and design an AR (augmented reality) marker using mosaic tiles. In this hands-on creative tech space you will learn how to make your marker come to life by making it interactive, pull in data from the sensors, and access it via a smartphone. You will also have the opportunity to ask questions and find out more about the application of similar technologies in cutting edge research projects by members of the Connected Environments Lab, such as the bat boxes in the Queen Elizabeth Olympic Park.

# How it works

## Build the Tile

We used Lego to build our tiles. We used flat tiles 2x2 of 7 different colours. The marker used a 3 by 3 and a 6 by 6 pattern. The white tiles around the black frame are used to help AR.Js to detect the pattern of the marker. 

![Example Plant Mqtt](./docs/Marker.jpg)

## Encode the tile
    
The `makerTiles/tiles.html` is a static page used digitise and download an image of the tile made with Lego. During the event we used an external touchscreen.

The folder _./markergen/node_ contains the scripts to create the pattern _.patt_ used by _AR.Js_. It is based on the [AR.js marker-training](https://github.com/AR-js-org/AR.js/tree/master/three.js/examples/marker-training). After installing the _node_modules_, using `npm install`, these are the steps to follow:

- copy the images to convert into Pattern file in the _./markergen/node/img_ folder (images need to be square, PNG -with no alpha channel / transparency- or JPG);
- in a new `node.js` terminal, run `node generator` in the _./markergen/node/node_ folder ;
- the patterns will be created and saved in the folder _./markergen/node/patt_;

## Visualise the data

The _patt files_ created with `markergen/node/generator.js` are used trigger the WebAR experience and need to be moved in the _patt_ folder of the main website

The real-time data are collected from a series of sensors connected to an Arduino computer. The data are sent to a MQTT broker (we used [beebotte](https://beebotte.com/)) to be consumed via a secure WebSocket connection in the WebAR experience (as WebAR need to access the camera of the smartphone a secure HTTPS connection is needed, therefore also the Websocket connection need to be secure WSS).

## Team

Martin de Jode (UCL - CASA - Connected Environments)

Leah Lovett (UCL - CASA - Connected Environments)

Valerio Signorelli (UCL - CASA - Connected Environments)

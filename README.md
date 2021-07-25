## ARTES - Augmented Reality Tiles for Environmental Sensing :diamond_shape_with_a_dot_inside: :seedling:

![Example Plant Mqtt](./docs/ARTES_Mqtt.gif)

# About

ARTES has been developed for the [EAST SUMMER SCHOOL PROGRAMME 2021](https://www.queenelizabetholympicpark.co.uk/our-story/supporting-communities/education-and-young-people/east-education-summer-school), 26 July – 6 August 2021

Discover how to build a simple soil sensor prototype to make sure your plants are getting the right amount of light and water, and design an AR (augmented reality) marker using mosaic tiles. In this hands-on creative tech space you will learn how to make your marker come to life by making it interactive, pull in data from the sensors, and access it via a smartphone. You will also have the opportunity to ask questions and find out more about the application of similar technologies in cutting edge research projects by members of the Connected Environments Lab, such as the bat boxes in the Queen Elizabeth Olympic Park.

# How it works

* Build the Tile

    We used Lego to create our tiles. Tiles 2x2 of 7 different colours

* Encode the tile
    
    The `makerTiles/tiles.html` is a static page used recreate and download an image of the tile made with Lego

    The `markergen/node/generator.js` is used to convert the image of the tile in a marker for ARJs

* Visualise the data

    The patt files created with `markergen/node/generator.js` are used trigger the WebAR experience

The real-time data are collected from a series of sensors connected to an Arduino computer. The data are sent to a MQTT broker (we used [beebotte](https://beebotte.com/)) to be consumed via a secure WebSocket connection in the WebAR experience (as WebAR need to access the camera of the smartphone a secure HTTPS connection is needed, therefore also the Websocket connection need to be secure WSS).

## Team

Martin de Jode (UCL - CASA - Connected Environments)

Leah Lovett (UCL - CASA - Connected Environments)

Valerio Signorelli (UCL - CASA - Connected Environments)


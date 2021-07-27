//BeeBotte MQTT and Multi Markers WebAR - AR.js and Aframe - ARTES - Augmented Reality Tiles for Environmental Sensing - Connected Environment CASA-UCL @2021

//Reference of the scene
let sceneEL;

//BeeBotte variables
let bbt;
let mqttDataTemperature = "";
let mqttDataMoisture = "";
let mqttDataHumidity = "";
let mqttDataLight = "";

let currentTime = "";

//Component to visualise Time on a a-text entity
AFRAME.registerComponent('timenow',
    {
        init: function () {
            // Set up the tick throttling. Slow down to 500ms
            this.tick = AFRAME.utils.throttleTick(this.tick, 500, this);
        },

        tick: function () {
            this.el.setAttribute('value', this.getTime());
        },

        getTime: function () {
            var d = new Date();
            return d.toLocaleTimeString();
        }
    })


//Componetn to connect to BeeBotte MQTT Broker
AFRAME.registerComponent('bbreader', {
    init: function () {
        sceneEL = document.querySelector('a-scene');

        setTimeout(test, 1000);
        function test() {
            console.log('Setup...');

            var API_KEY = 'XKiJfFJw7BRdOFvIpd9Hmoei'; //be aware of what data you are sharing and publishing https://www.freecodecamp.org/news/how-to-securely-store-api-keys-4ff3ea19ebda/
            bbt = new BBT(API_KEY);

            //There should be a better way to subscribe on multiple resources
            //moved to the markerFound event for subscribe unsubscribe logic
            /* temperature moisture humidity light
            bbt.subscribe({ channel: 'Arduino', resource: 'temperature' }, function (msg) {
                console.log(msg);
                mqttDataTemperature = msg.data;
            })
            bbt.subscribe({ channel: 'Arduino', resource: 'moisture' }, function (msg) {
                console.log(msg);
                mqttDataMoisture = msg.data;
            })
            bbt.subscribe({ channel: 'Arduino', resource: 'humidity' }, function (msg) {
                console.log(msg);
                mqttDataHumidity = msg.data;
            })
            bbt.subscribe({ channel: 'Arduino', resource: 'light' }, function (msg) {
                console.log(msg);
                mqttDataLight = msg.data;
            })
            */
        }
    }
});

//component to create the marker a-entity from the content/json
AFRAME.registerComponent('markers_start_json', {
    init: function () {

        console.log('Add markers to the scene using json ref');
        device = navigator.platform; //checking which device is running the WebAR to provide best settings

        var sceneEl = document.querySelector('a-scene');

        //index.json contains the list of markers and content
        fetch("./resources/content/index.json")
            .then(response => response.json())
            .then(json => {
                console.log(json.content);

                let i = 0;

                json.content.forEach(el => {
                    i++;

                    let titleContent = '';
                    let markerURL = './resources/patt/' + el.markerName + '.patt';

                    titleContent = el.titleContent;

                    //Add Marker to scene
                    var markerEl = document.createElement('a-marker');
                    markerEl.setAttribute('type', 'pattern');
                    markerEl.setAttribute('url', markerURL);
                    markerEl.setAttribute('id', el.channel);

                    markerEl.setAttribute('registerevents', '');
                    sceneEl.appendChild(markerEl); //Add the marker to the scene

                    //Add text to each marker

                    let textEl = document.createElement('a-entity');
                    textEl.setAttribute('id', 'text' + el.channel);
                    textEl.setAttribute('text', { color: 'red', align: 'center', value: el.textContent, width: '6' });
                    textEl.object3D.position.set(-0.0, 0.1, 0.5);
                    textEl.setAttribute('rotation', { x: -90, y: 0, z: 0 });
                    markerEl.appendChild(textEl); //add the text to the marker


                    //Create the Plant Model and Panel for the data
                    //The main container
                    let plantRT = document.createElement('a-entity');
                    plantRT.setAttribute('id', 'planRT_' + el.channel);
                    plantRT.setAttribute('rotation', { x: -90, y: 0, z: 0 });
                    plantRT.object3D.position.set(0, 0, 0.2);
                    plantRT.object3D.scale.set(1.5, 1.5, 1.5);
                    markerEl.appendChild(plantRT);

                    //The panel that contains the data
                    //Using an AFrame plane primitive
                    /*
                    let screen = document.createElement('a-entity');
                    screen.setAttribute('id', 'screen_' + el.channel);
                    screen.setAttribute('geometry', { primitive: 'plane' });
                    screen.setAttribute('material', { opacity: '1', transparent: 'false', color: '#DA621E' });
                    screen.object3D.position.set(0.4, 0.3, 0);
                    screen.object3D.scale.set(0.8, 0.8, 1);
                    screen.setAttribute('rotation', { x: 0, y: 0, z: 0 });
                    plantRT.appendChild(screen);
                    */

                    //Using a GLB model
                    let screen = document.createElement('a-entity');
                    screen.setAttribute('id', 'screen_' + el.channel);
                    screen.setAttribute('gltf-model', '#display');
                    screen.object3D.position.set(0.3, 0.41, -0.01);
                    screen.object3D.scale.set(0.3, 0.3, 1);
                    screen.setAttribute('rotation', { x: 0, y: 0, z: 0 });
                    plantRT.appendChild(screen);

                    //A Date.time component
                    let timenowText = document.createElement('a-text');
                    timenowText.setAttribute('id', 'timenowText_' + el.channel);
                    timenowText.setAttribute('timenow', '');
                    timenowText.setAttribute('value', 't');
                    timenowText.setAttribute('width', '3.2'); //1.5 with AFrame primitive
                    timenowText.setAttribute('anchor', 'left');
                    //timenowText.object3D.position.set(0, 0.4, 0.02);
                    timenowText.object3D.position.set(0.35, 0.85, 0.02);
                    screen.appendChild(timenowText); //add the text to the screen

                    //Sensor Moisture
                    let moistureText = document.createElement('a-text');
                    moistureText.setAttribute('id', 'moisture-text_' + el.channel);
                    moistureText.setAttribute('value', 'Moisture:');
                    moistureText.setAttribute('width', '4');
                    moistureText.setAttribute('anchor', 'left');
                    moistureText.object3D.position.set(-0.9, 0.5, 0.02);
                    screen.appendChild(moistureText); //add the text to the screen

                    //Sensor Temperature
                    let temperatureText = document.createElement('a-text');
                    temperatureText.setAttribute('id', 'temperature-text_' + el.channel);
                    temperatureText.setAttribute('value', 'Temperature:');
                    temperatureText.setAttribute('width', '4');
                    temperatureText.setAttribute('anchor', 'left');
                    //temperatureText.object3D.position.set(-0.45, 0.1, 0.02);
                    temperatureText.object3D.position.set(-0.9, 0.1, 0.02);
                    screen.appendChild(temperatureText); //add the text to the screen

                    //Sensor Humidity
                    let humidityText = document.createElement('a-text');
                    humidityText.setAttribute('id', 'humidity-text_' + el.channel);
                    humidityText.setAttribute('value', 'Humidity:');
                    humidityText.setAttribute('width', '4');
                    humidityText.setAttribute('anchor', 'left');
                    //humidityText.object3D.position.set(-0.45, -0.1, 0.02);
                    humidityText.object3D.position.set(-0.9, -0.3, 0.02);
                    screen.appendChild(humidityText); //add the text to the screen

                    //Sensor Light
                    let lightText = document.createElement('a-text');
                    lightText.setAttribute('id', 'light-text_' + el.channel);
                    lightText.setAttribute('value', 'Light:');
                    lightText.setAttribute('width', '4');
                    lightText.setAttribute('anchor', 'left');
                    //lightText.object3D.position.set(-0.45, -0.3, 0.02);
                    lightText.object3D.position.set(-0.9, -0.7, 0.02);
                    screen.appendChild(lightText); //add the text to the screen

                    //3D model of the plant
                    let modelplant = document.createElement('a-entity');
                    modelplant.setAttribute('id', 'modelplant_' + el.channel);
                    modelplant.setAttribute('gltf-model', '#plant');
                    modelplant.object3D.position.set(-0.2, 0, 0);
                    modelplant.object3D.scale.set(0.2, 0.2, 0.2);
                    modelplant.setAttribute('rotation', { x: 0, y: 180, z: 0 });
                    plantRT.appendChild(modelplant);

                    //OPTIONAL adding sound with Howler
                    if (el.type == 'sound') {
                        var soundEl = document.createElement('a-entity');
                        soundEl.setAttribute('id', 'sound' + i);
                        markerEl.setAttribute('sound-sample', { src: el.channel });
                        markerEl.appendChild(soundEl); //add the sound to the marker
                    }
                    //OPTIONAL on Sound

                });
            })
    }
});




//Detect marker found and lost and subscribe unsubscribe from BBT
AFRAME.registerComponent('registerevents', {
    schema: {
        soundid: { type: 'int', default: 0 },
    },
    init: function () {
        const marker = this.el;

        marker.addEventListener("markerFound", () => {
            var markerId = marker.id; //marker.id is also the channel of the sensor
            console.log('Marker Found: ', markerId);

            let modelplant = marker.querySelector('#modelplant_' + markerId).object3D;

            bbt.subscribe({ channel: markerId, resource: 'moisture' }, function (msg) {
                marker.querySelector('#moisture-text_' + markerId).setAttribute('value', 'Moisture: ' + msg.data + '%');
                console.log(msg.data);

                //depending on the moisture value, change the colour of the leaf material
                if (parseInt(msg.data) > 80) {
                    modelplant.getObjectByName("leaf004").material.color.setHex(0x16720B);
                }
                else if (parseInt(msg.data) < 80 && parseInt(msg.data) > 70) {
                    modelplant.getObjectByName("leaf004").material.color.setHex(0xFFF222);
                }
                else if (parseInt(msg.data) < 70) {
                    modelplant.getObjectByName("leaf004").material.color.setHex(0xdc0005);
                }
            })

            bbt.subscribe({ channel: markerId, resource: 'temperature' }, function (msg) {
                marker.querySelector('#temperature-text_' + markerId).setAttribute('value', 'Temperature: ' + msg.data + '°C');
                console.log(msg.data);
            })

            bbt.subscribe({ channel: markerId, resource: 'humidity' }, function (msg) {
                marker.querySelector('#humidity-text_' + markerId).setAttribute('value', 'Humidity: ' + msg.data + '%');
                console.log(msg.data);
            })
            bbt.subscribe({ channel: markerId, resource: 'light' }, function (msg) {
                marker.querySelector('#light-text_' + markerId).setAttribute('value', 'Light: ' + msg.data);
                console.log(msg.data);
                //depending on the light value, change the colour of the pot (pot as two materials, 1 for the pot -pot_1- and one for the dirt -pot_2-)
                if (parseInt(msg.data) < 50) {
                    modelplant.getObjectByName("pot_1").material.color.setHex(0xA31800);
                }
                else if (parseInt(msg.data) > 50) {
                    modelplant.getObjectByName("pot_1").material.color.setHex(0xFF1D00);
                }
            })
            //OPTIONAL on Sound
            //if(markerId.includes("sound"))
            //{
            if (sound) {
                sound.volume(1);
                sound.play(marker.components['sound-sample'].data.src);
                console.log('play');
            }
            //}
            //OPTIONAL on Sound
        });


        marker.addEventListener("markerLost", () => {
            var markerId = marker.id;
            console.log('Marker Lost: ', markerId);

            bbt.unsubscribe({ channel: markerId, resource: 'temperature' });
            bbt.unsubscribe({ channel: markerId, resource: 'moisture' });
            bbt.unsubscribe({ channel: markerId, resource: 'humidity' });
            bbt.unsubscribe({ channel: markerId, resource: 'light' });

        });
    },
});
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
            
            var API_KEY = 'APIKEY'; //be aware of what data you are sharing and publishing https://www.freecodecamp.org/news/how-to-securely-store-api-keys-4ff3ea19ebda/
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

                    //Add text to each marker - DEBUG-
                    /*
                    let textEl = document.createElement('a-entity');
                    textEl.setAttribute('id', 'text' + el.channel);
                    textEl.setAttribute('text', { color: 'red', align: 'center', value: el.channel, width: '6' });
                    textEl.object3D.position.set(0.5, 0.1, -0.7);
                    textEl.setAttribute('rotation', { x: -90, y: 0, z: 0 });
                    markerEl.appendChild(textEl); //add the text to the marker
                    */
                    
                    //Create the Plant Model and Panel for the data
                    //The main container
                    let plantRT = document.createElement('a-entity');
                    plantRT.setAttribute('id', 'planRT_' + el.channel);
                    plantRT.setAttribute('rotation', { x: -90, y: 0, z: 0 });
                    plantRT.object3D.position.set(0,0,0.2);
                    markerEl.appendChild(plantRT);

                    //The panel that contains the data
                    let screen = document.createElement('a-entity');
                    screen.setAttribute('id', 'screen_' + el.channel);
                    screen.setAttribute('geometry', {primitive:'plane'});
                    screen.setAttribute('material', {opacity:'1',transparent:'false', color:'#DA621E'});
                    screen.object3D.position.set(0.4,0.3,0);
                    screen.object3D.scale.set(0.8,0.8, 1);
                    screen.setAttribute('rotation', { x: 0, y: 0, z: 0 });
                    plantRT.appendChild(screen);

                    //A Date.time component
                    let timenowText = document.createElement('a-text');
                    timenowText.setAttribute('id', 'timenowText_' + el.channel);
                    timenowText.setAttribute('timenow', '');
                    timenowText.setAttribute('value', 't');
                    timenowText.setAttribute('width', '1.5');
                    timenowText.setAttribute('anchor', 'left');
                    timenowText.object3D.position.set(0, 0.4, 0.02);
                    screen.appendChild(timenowText); //add the text to the marker

                    //Sensor Moisture
                    let moistureText = document.createElement('a-text');
                    moistureText.setAttribute('id', 'moisture-text_' + el.channel);
                    moistureText.setAttribute('value', 'Moisture:');
                    moistureText.setAttribute('width', '2');
                    moistureText.setAttribute('anchor', 'left');
                    moistureText.object3D.position.set(-0.45, 0.3, 0.02);
                    screen.appendChild(moistureText); //add the text to the marker

                    //Sensor Temperature
                    let temperatureText = document.createElement('a-text');
                    temperatureText.setAttribute('id', 'temperature-text_' + el.channel);
                    temperatureText.setAttribute('value', 'Temperature:');
                    temperatureText.setAttribute('width', '2');
                    temperatureText.setAttribute('anchor', 'left');
                    temperatureText.object3D.position.set(-0.45, 0.1, 0.02);
                    screen.appendChild(temperatureText); //add the text to the marker

                    //Sensor Humidity
                    let humidityText = document.createElement('a-text');
                    humidityText.setAttribute('id', 'humidity-text_' + el.channel);
                    humidityText.setAttribute('value', 'Humidity:');
                    humidityText.setAttribute('width', '2');
                    humidityText.setAttribute('anchor', 'left');
                    humidityText.object3D.position.set(-0.45, -0.1, 0.02);
                    screen.appendChild(humidityText); //add the text to the marker

                    //Sensor Light
                    let lightText = document.createElement('a-text');
                    lightText.setAttribute('id', 'light-text_' + el.channel);
                    lightText.setAttribute('value', 'Light:');
                    lightText.setAttribute('width', '2');
                    lightText.setAttribute('anchor', 'left');
                    lightText.object3D.position.set(-0.45, -0.3, 0.02);
                    screen.appendChild(lightText); //add the text to the marker

                    //3D model of the plant
                    let modelplant = document.createElement('a-entity');
                    modelplant.setAttribute('id', 'modelplant_' + el.channel);
                    modelplant.setAttribute('gltf-model','#plant');
                    modelplant.object3D.position.set(-0.2,0,0);
                    modelplant.object3D.scale.set(0.2,0.2, 0.2);
                    modelplant.setAttribute('rotation', { x: 0, y: 180, z: 0 });
                    plantRT.appendChild(modelplant);

                    
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

            bbt.subscribe({ channel: markerId, resource: 'moisture' }, function (msg) {
                marker.querySelector('#moisture-text_'+markerId).setAttribute('value', 'Moisture: ' + msg.data);
                console.log(msg.data);
            })

            bbt.subscribe({ channel: markerId, resource: 'temperature' }, function (msg) {
                marker.querySelector('#temperature-text_'+markerId).setAttribute('value', 'Temperature: ' + msg.data);
                console.log(msg.data);
            })

            bbt.subscribe({ channel: markerId, resource: 'humidity' }, function (msg) {
                marker.querySelector('#humidity-text_'+markerId).setAttribute('value', 'Humidity: ' + msg.data);
                console.log(msg.data);
            })
            bbt.subscribe({ channel: markerId, resource: 'light' }, function (msg) {
                marker.querySelector('#light-text_'+markerId).setAttribute('value', 'Light: ' + msg.data);
                console.log(msg.data);
            })

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






/*
//Detect marker found and lost
AFRAME.registerComponent('registerevents', {
    schema: {
        soundid: { type: 'int', default: 0 },
    },
    init: function () {
        const marker = this.el;

        marker.addEventListener("markerFound", () => {
            var markerId = marker.id;
            console.log('Marker Found: ', markerId);
            //console.log('The Data' + mqttData);

            console.log(marker.querySelector('#moisture-text'));

            marker.querySelector('#moisture-text').setAttribute('value', 'Moisture: ' + mqttDataMoisture);
            marker.querySelector('#temperature-text').setAttribute('value', 'Temperature: ' + mqttDataTemperature);
            marker.querySelector('#humidity-text').setAttribute('value', 'Humidity: ' + mqttDataHumidity);
            marker.querySelector('#light-text').setAttribute('value', 'Light: ' + mqttDataLight);

            //marker.querySelector('#timenow').setAttribute('value', currentTime);

            if (markerId.includes("sound")) {
                playSound(marker);
            }
        });

        marker.addEventListener("markerLost", () => {
            var markerId = marker.id;
            console.log('Marker Lost: ', markerId);

            if (markerId.includes("sound")) {
                sound.pause(marker.components['registerevents'].data.soundid);
            }

        });
    },
});
*/
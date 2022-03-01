
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


//Listen to the markers
AFRAME.registerComponent('registerevents', {
    init: function () {

let clients=[]; //a list of all MQTT clients
   
const handler=this.el;

handler.addEventListener("markerFound", (event) => {
    var markerId = event.target.id;
    console.log('Marker Found: ', markerId);

    //Create a new client with ID of the marker
   let client = mqtt.connect('ws://ADDRESS.BROKER.WEBSOCKET:8080',{clientId:event.target.id}); //if served under HTTPS, als Websocket need to be Secure --WSS connection 

   clients.push(client); //add the client to the Array

   client.on('connect', function () {
        console.log('Connected');
    });
    client.on('error', function (error) {
        console.log(error);
    });

        this.startMqtt(event.target,client);
    });

    handler.addEventListener("markerLost", (event) => {
        var markerId = event.target.id;

        console.log('Marker Lost: ', markerId);
        
        //Find the client according to its ID
        let clientToStop = clients.find(client => client.options.clientId === event.target.id);
        //remove the client from the Array
        let index = clients.indexOf(clientToStop);
        clients.splice(index,1);
        
        //pass the client to stopMQTT to end the connection
        this.stopMqtt(clientToStop);
    });
    },

    startMqtt: function (marker,client) {

        if (!client.connected) {
           client.reconnect()}

           console.log(client);
       
        //it is possible to update the Marker JSON and use this to subscribe to the topics
       client.subscribe('TOPIC/TO/SUBSCRIBE/moisture');
       client.subscribe('TOPIC/TO/SUBSCRIBE/temperature');
       client.subscribe('TOPIC/TO/SUBSCRIBE/humidity')

        client.on('message', function (topic, message) {
            //Called each time a message is received
            console.log('Received message:', topic, message.toString());

            if (topic.includes('moisture')) {
                marker.querySelector('#moisture-text_' + marker.id).setAttribute('value', 'Moisture: ' + message.toString() + '%');
            }

            if (topic.includes('temperature')) { //temperature
                marker.querySelector('#temperature-text_' + marker.id).setAttribute('value', 'Temperature: ' + parseFloat(message.toString()).toFixed(2).toString() + '°C');
            }

            if (topic.includes('humidity')) { //humidity
                marker.querySelector('#humidity-text_' + marker.id).setAttribute('value', 'Humidity: ' + message.toString() + '%');
            }
        })
    },

    stopMqtt: function (client) {
        client.end(true);
        console.log('connection closed');
    }
});



//component to create the marker a-entity from the content/json
AFRAME.registerComponent('markers_start_json', {
    init: function () {

        console.log('Add markers to the scene');

        let sceneEl = document.querySelector('a-scene');

        //index.json contains the list of markers and content
        fetch("./resources/markers.json")
            .then(response => response.json())
            .then(json => {
                console.log(json.content);

                json.content.forEach(el => {
                    //0. createa a string that contain the URL of the PATT file
                    let markerURL = './resources/patt/' + el.markerName + '.patt';

                    //1. Create and add a a-marker to scene
                    let markerEl = document.createElement('a-marker');
                    markerEl.setAttribute('type', 'pattern');
                    markerEl.setAttribute('url', markerURL);
                    markerEl.setAttribute('id', el.topic);
                   sceneEl.appendChild(markerEl); //Add the marker to the scene

                    //2. Add a text entity to each marker
                    let textEl = document.createElement('a-entity');
                    textEl.setAttribute('id', 'text' + el.textContent);
                    textEl.setAttribute('text', { color: 'red', align: 'center', value: el.textContent, width: '6' });
                    textEl.object3D.position.set(-0.0, 0.1, 0.5);
                    textEl.setAttribute('rotation', { x: -90, y: 0, z: 0 });
                    markerEl.appendChild(textEl); //add the text to the marker


                    //Create the Plant Model and Panel for the data
                    //3. The main container
                    let plantRT = document.createElement('a-entity');
                    plantRT.setAttribute('id', 'planRT_' + el.topic);
                    plantRT.setAttribute('rotation', { x: -90, y: 0, z: 0 });
                    plantRT.object3D.position.set(0, 0, 0.2);
                    plantRT.object3D.scale.set(1, 1, 1);
                    markerEl.appendChild(plantRT);


                    //4. the 3D model of the Display.glb
                    let screen = document.createElement('a-entity');
                    screen.setAttribute('id', 'screen_' + el.topic);
                    screen.setAttribute('gltf-model', '#display_glb');
                    screen.object3D.position.set(0.3, 0.41, -0.01);
                    screen.object3D.scale.set(0.3, 0.3, 1);
                    screen.setAttribute('rotation', { x: 0, y: 0, z: 0 });
                    plantRT.appendChild(screen);

                    //5. the 3D model of the plant
                    let modelplant = document.createElement('a-entity');
                    modelplant.setAttribute('id', 'modelplant_' + el.topic);
                    modelplant.setAttribute('gltf-model', '#plant_gltf');
                    modelplant.object3D.position.set(-0.2, 0, 0);
                    modelplant.object3D.scale.set(0.2, 0.2, 0.2);
                    modelplant.setAttribute('rotation', { x: 0, y: 180, z: 0 });
                    plantRT.appendChild(modelplant);

                    //6. Date.time component
                    let timenowText = document.createElement('a-text');
                    timenowText.setAttribute('id', 'timenowText_' + el.topic);
                    timenowText.setAttribute('timenow', '');
                    timenowText.setAttribute('value', 't');
                    timenowText.setAttribute('width', '3.2'); //1.5 with AFrame primitive
                    timenowText.setAttribute('anchor', 'left');
                    timenowText.object3D.position.set(0.35, 0.85, 0.02);
                    screen.appendChild(timenowText); //add the text to the screen

                    //7. Sensor Moisture
                    let moistureText = document.createElement('a-text');
                    moistureText.setAttribute('id', 'moisture-text_' + el.topic);
                    moistureText.setAttribute('value', 'Moisture:');
                    moistureText.setAttribute('width', '4');
                    moistureText.setAttribute('anchor', 'left');
                    moistureText.object3D.position.set(-0.9, 0.5, 0.02);
                    screen.appendChild(moistureText); //add the text to the screen

                    //8. Sensor Temperature
                    let temperatureText = document.createElement('a-text');
                    temperatureText.setAttribute('id', 'temperature-text_' + el.topic);
                    temperatureText.setAttribute('value', 'Temperature:');
                    temperatureText.setAttribute('width', '4');
                    temperatureText.setAttribute('anchor', 'left');
                    temperatureText.object3D.position.set(-0.9, 0.1, 0.02);
                    screen.appendChild(temperatureText); //add the text to the screen

                    //9. Sensor Humidity
                    let humidityText = document.createElement('a-text');
                    humidityText.setAttribute('id', 'humidity-text_' + el.topic);
                    humidityText.setAttribute('value', 'Humidity:');
                    humidityText.setAttribute('width', '4');
                    humidityText.setAttribute('anchor', 'left');
                    humidityText.object3D.position.set(-0.9, -0.3, 0.02);
                    screen.appendChild(humidityText); //add the text to the screen


                });
            })
    }
});

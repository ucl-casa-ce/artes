//Additional componets for the sounds

//Howler Variables
let isThis = ''; // a varibale to store the name of the marker detected
let sound; //the Howler sound
let device; //check the device to provide best settings for iOS or Android
let vector = new THREE.Vector3(); //target to getWorldDirection of the listener/camera //https://stackoverflow.com/questions/14813902/three-js-get-the-direction-in-which-the-camera-is-looking

//[on Entity - each marker] just a string with the ref of sound to play
AFRAME.registerComponent("sound-sample", {
    schema: {
        src: { type: 'string' },
    },
});

//[on Camera]. It is the listener of the sounds and update position and orientation every tick
AFRAME.registerComponent("listener-howler", {
    init: function () {
        Howler.pos(this.el.object3D.position.x, this.el.object3D.position.y, this.el.object3D.position.z);
        this.el.object3D.getWorldDirection(vector);
        Howler.orientation(vector.x, vector.y, vector.z, 0, -1, 0); //Threejs Up vector is -1?
    },

    tick: function () {
        Howler.pos(this.el.object3D.position.x, this.el.object3D.position.y, this.el.object3D.position.z);
        this.el.object3D.getWorldDirection(vector);
        Howler.orientation(vector.x, vector.y, vector.z, 0, -1, 0);//Threejs Up vector is -1?
    }
});


//[on Camera] Load the sample
AFRAME.registerComponent("sample-sound-load", {
    init: function () {

        let notiOS = true;
        if (device === 'iPad' || device === 'iPhone' || device === 'iPod' === true) {
            notiOS = false;
        }

        // A set of 7 Drum samples | some strange timing happens with Audacity. time from the SW is a bit off in duration
        let drumsSamples = './resources/content/drumsSamples.mp3'
        let drumsSprite = {
            one: [0, 600],
            two: [700, 900],
            three: [1713, 900],
            four: [2827, 900],
            five: [3975, 900],
            six: [5133, 1228],
            seven: [6361, 1002],
        };

        // A set of 7 samples made during Re-Invent
        let soundSamples = './resources/content/soundSamples.mp3'
        let otherSprite = {
            one: [0, 1362], //AppleL
            two: [9371, 1285], //CrispsL
            three: [16416, 353], //Light
            four: [18759, 1116], //PoolL
            five: [25813, 1130], //Toaster
            six: [27100, 1000], //Book
            seven: [32877, 1220], //Pen
        };

        sound = new Howl({
            mute: false,
            html5: notiOS,
            src: [soundSamples], //use the pair let above to change the sounds
            sprite: otherSprite,

            onload: function () {
                console.log("LOADED");
            },
        });

        sound.pannerAttr({
            coneInnerAngle: 360,
            coneOuterAngle: 360,
            coneOuterGain: 0,
            maxDistance: 10000,
            panningModel: 'HRTF',
            refDistance: 1,
            rolloffFactor: 1,
            distanceModel: 'exponential',
        });
    }
});
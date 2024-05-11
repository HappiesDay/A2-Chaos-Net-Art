// Setup canvas and context
document.body.style.margin = 0;
document.body.style.overflow = 'hidden';
const cnv = document.getElementById('cnv_element');
const ctx = cnv.getContext('2d', { willReadFrequently: true });


// Resize canvas to window
cnv.width = innerWidth;
cnv.height = innerHeight;
window.onresize = () => {
    cnv.width = innerWidth;
    cnv.height = innerHeight;};


// VISUAL

//Variables and constant-----------------------------------------
let clickTime = 0
let textDrawn = false; 
let resetCount = 0
let effect; 
let lineAnimationActive = true;  
let particleAnimationActive = false
const linesArray = [];
const numberOfLines = 20;

// Functions------------------------------------------------------
// Function to draw the text
function drawText() {
    if (!textDrawn) { // Check if text has not been drawn yet
        //Text properties
        ctx.fillStyle = 'magenta';
        ctx.font = "bold 40px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Clear the canvas
        ctx.clearRect(0, 0, cnv.width / 2, cnv.height / 2);

        // Draw the text
        var randomIndex = Math.random() < 0.5 ? 0 : 1;
        var texts = ["CLICK AND DRAG", "DISORDER REIGNS IN POINTER"];
        var selectedText = texts[randomIndex];
        ctx.fillText(selectedText, cnv.width / 2, cnv.height / 2);
        textDrawn = true; 

    }
}


// Animating lines sections---------------------------------------
// Class to handle the line drawing
class Line {
    constructor(cnv) {
        this.cnv = cnv;
        this.x = Math.random() * this.cnv.width;
        this.y = Math.random() * this.cnv.height;
        this.history = [{x: this.x, y: this.y}];
        this.lineWidth = Math.floor(Math.random() * 15 + 1);
        this.hue = Math.floor(Math.random() * 360);
        this.maxLength = Math.floor(Math.random() * 150 + 10);
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = 7;
        this.lifeSpan = this.maxLength * 2;
        this.preCalculate = this.lifeSpan * 0.85;
        this.timer = 0;
        this.angle = 0;
        this.curve = 0;
        this.va = Math.random() * 0.5 - 0.25;
        this.vc = Math.random() * 0.4 - 0.2;
    }

    draw(context) {
        context.strokeStyle = `hsl(${this.hue}, 100%, 100%)`;
        context.lineWidth = this.lineWidth;
        context.beginPath();
        context.moveTo(this.history[0].x, this.history[0].y);
        for (let i = 0; i < this.history.length; i++) {
            context.lineTo(this.history[i].x, this.history[i].y);
        }
        context.stroke();
    }

    update() {
        this.timer++;
        this.angle += this.va;
        this.curve += this.vc;
        if (this.timer < this.lifeSpan) {
            if (this.timer > this.preCalculate) {
                this.vc *= -1.2;
                this.va *= -1.2;
            }
            this.x += Math.sin(this.angle) * this.curve;
            this.y += Math.cos(this.angle) * this.curve;
            this.history.push({x: this.x, y: this.y});
            if (this.history.length > this.maxLength) {
                this.history.shift();
            }
        } else if (this.history.length <= 1) {
            this.reset();
        } else {
            this.history.shift();
        }
    }

    reset() {
        
        this.x = Math.random() * this.cnv.width;
        this.y = Math.random() * this.cnv.height;
        this.history = [{x: this.x, y: this.y}];
        this.timer = 0;
        this.angle = 0;
        this.curve = 0;
        resetCount = resetCount + 1;
        if (resetCount >= 20) {
            this.angle = 0
            this.curve = 0
            this.va = Math.random() * 0.5 - 0.25;
            this.vc = Math.random() * 0.4 - 0.2;
            resetCount = 0;
        }
        // console.log(resetCount)
        
    }
}
 

// Function animating lines
for (let i = 0; i < numberOfLines; i++) {
    linesArray.push(new Line(cnv));
}
function animateLines() {
    if (lineAnimationActive) {
        drawText();
        if (clickTime > 3){
        ctx.clearRect(0, 0, cnv.width, cnv.height);}
        linesArray.forEach(line => 
        {
            line.draw(ctx);
            line.update();
        });
        
        requestAnimationFrame(animateLines);
        
    }
    
}


// Particle sections---------------------------------------------
// Particle system setup (velocity, friction, appearing position,etc)
class Particle {
    constructor(effect, x, y, color) {
        this.effect = effect;
        this.x = x
        this.y = y;
        this.originX = Math.floor(x);
        this.originY = Math.floor(y);
        this.color = color;
        this.size = this.effect.gap;
        this.vx = 0;
        this.vy = 0;
        this.ease = 0.01;
        this.dx = 0;
        this.dy = 0;
        this.distance = 0;
        this.force = 0;
        this.angle = 0;
        this.friction = 0.95;
    }

    draw(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.size, this.size);
    }

    update() {
        this.dx = this.effect.mouse.x - this.x;
        this.dy = this.effect.mouse.y - this.y;
        this.distance = this.dx * this.dx + this.dy * this.dy;
        this.force = this.effect.mouse.radius / this.distance;

        if (this.distance < this.effect.mouse.radius) {
            this.angle = Math.atan2(this.dy, this.dx);
            this.vx += this.force * Math.cos(this.angle);
            this.vy += this.force * Math.sin(this.angle);
        }

        this.x += (this.vx * this.friction) + (this.originX - this.x) * this.ease;
        this.y += (this.vy * this.friction) + (this.originY - this.y) * this.ease;
    }
}

// Turning image to particle and mouse interaction
class Effect {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.particleWaves = []; // Array to store waves of particles
        this.image = null; 
        this.centerX = this.width * 0.5;
        this.centerY = this.height * 0.5;
        this.gap = 3;
        this.mouse = {
            radius: 5000,
            x: undefined,
            y: undefined
        };
        window.addEventListener('mousemove', event => {
            this.mouse.x = event.x;
            this.mouse.y = event.y;
        });
    }

    updateImageData(canvas) {
        console.log(this.particleWaves.length)

        this.image = canvas.toDataURL();
    }

    init(context) {
        // Initialize the first wave
        this.addWave(context, this.image);
    }

    addWave(context, imageData) {
        const newWave = [];
        const img = new Image();
        img.onload = () => {
            context.drawImage(img, this.centerX - img.width * 0.5, this.centerY - img.height * 0.5);
            this.scanImage(context, newWave);
        };
        img.src = imageData;
        this.particleWaves.push(newWave);
        if (this.particleWaves.length > 1) {
            this.particleWaves.shift();  // Remove the first wave
        }
    }

    scanImage(context, wave) {
        const pixels = context.getImageData(0, 0, this.width, this.height).data;
        for (let y = 0; y < this.height; y += this.gap) {
            for (let x = 0; x < this.width; x += this.gap) {
                const index = (y * this.width + x) * 4;
                const red = pixels[index];
                const green = pixels[index + 1];
                const blue = pixels[index + 2];
                const alpha = pixels[index + 3];
                const color = `rgb(${red},${green},${blue})`;
                if (alpha > 0) {
                    wave.push(new Particle(this, x, y, color));
                }
            }
        }
    }

    draw(context) {
        this.particleWaves.forEach(wave => {
            wave.forEach(particle => particle.draw(context));
        });
    }

    update() {
        this.particleWaves.forEach(wave => {
            wave.forEach(particle => particle.update());
        });
    }

    warp() {
        this.particleWaves.forEach(wave => {
            wave.forEach(particle => particle.warp());
        });
    }

    clearFirstWave() {
       
    }
}

function animateParticles() {
    if (particleAnimationActive) { 

    if (!lineAnimationActive && effect) {
        // ctx.clearRect(0, 0, cnv.width, cnv.height); //Uncomment to reset canvas
        effect.draw(ctx);
        effect.update();
  
        requestAnimationFrame(animateParticles);
    }
}}


// Setup event listener to toggle animations
cnv.addEventListener('click', function() {
    clickTime++
    lineAnimationActive = !lineAnimationActive;
    particleAnimationActive = !particleAnimationActive;

    if (particleAnimationActive) {
        // Stop lines and ensure particle effect runs
        if (!effect) {
            effect = new Effect(cnv.width, cnv.height);
        }
        effect.updateImageData(cnv);
        effect.init(ctx);
        animateParticles(); 
        // Start or continue particle animation
    } else {
        animateLines();
        // Stop particles and ensure line animation runs
    }
});
animateLines();

//End of Visual section==========================================


//AUDIO 

//Variable and constant------------------------------------------
// array of notes for the sounds
const notes = [61, 66, 69, 73, 74, 73, 69, 66]

// declaring a mutable iterator
let i = 0

// declaring a mutable state value
let running = false

// declaring a mutable variable for 
// the period of time between notes
let period = 200

// declaring a mutable variable for
// the length of the note
let len = 0
const audio_context = new AudioContext ()

// function sections---------------------------------------------
// getting the audio context function
function init_audio() {
    if (!audio_context) {
        audio_context = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function next_note () {

    // use the iterator to select a note from 
    // the notes array and pass it to the 
    // play_note function along with the 
    // len variable to specify the length of the note
    play_note (notes[i], len)

    // iterate the iterator
    i++

    // if i gets too big
    // cycle back to 0
    i %= notes.length
}

function note_player () {

    // play the next note
    next_note ()

    // if running is true
    // it uses setTimeout to call itself 
    // after period milliseconds
    if (running) setTimeout (note_player, period)
}

function play_note (note, length) {

    // if the audio context is not running, resume it
    if (audio_context.state != 'running') init_audio ()

    // create an oscillator
    const osc = audio_context.createOscillator ()

    // make it a triangle wave this time
    osc.type = 'sine'

    // set the value using the equation 
    // for midi note to Hz
    osc.frequency.value = 440 * 2 ** ((note - 69) / 12)

    // create an amp node
    const amp = audio_context.createGain ()

    // connect the oscillator 
    // to the amp
    // to the audio out
    osc.connect (amp).connect (audio_context.destination)

    // the .currentTime property of the audio context
    // contains a time value in seconds
    const now = audio_context.currentTime

    // make a gain envelope
    // start at 0
    amp.gain.setValueAtTime (0, now)

    // take 0.02 seconds to go to 0.4, linearly
    amp.gain.linearRampToValueAtTime (0.4, now + 0.02)

    // this method does not like going to all the way to 0
    // so take length seconds to go to 0.0001, exponentially
    amp.gain.exponentialRampToValueAtTime (01, now + length)

    // start the oscillator now
    osc.start (now)

    // stop the oscillator 1 second from now
    osc.stop  (now + length)
}

// declaring a function that plays the next note

// this is a recursive function

// this function handles the mouse event
// when the cursor enters the canvas
cnv.onpointerenter = e => {

    // set running to true
    running = true;

    // initiate the recurseive note_player function
    note_player ()
}

// this function handles the mouse event
// when the cursor moves over the canvas
cnv.onpointermove = e => {

    // as the cursor goes from left to right
    // len gos from 0 to 5
    len = 2 * e.offsetX / cnv.width

    // as the cursor goes from bottom to top
    // period goes from 420 to 20 (milliseconds)
    period = 200 + ((e.offsetY / cnv.height) ** 2) * 40
}

// this function handles the mouse event
// when the cursor leaves the canvas
cnv.onpointerleave = e => {

    // set running to false
    running = false
}


//END of AUDIO sections========================================


//console + bug society
console.log(clickTime)
console.log(lineAnimationActive)
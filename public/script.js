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
    cnv.height = innerHeight;
};
let clickTime = 0
let textDrawn = false; // Flag to track if text has been drawn
// Function to draw the text
function drawText() {
    if (!textDrawn) { // Check if text has not been drawn yet
        // Set text properties
        ctx.fillStyle = 'magenta';
        ctx.font = "bold 40px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Get the width and height of the canvas
        var canvasWidth = cnv.width;
        var canvasHeight = cnv.height;

        // Calculate the center coordinates
        var centerX = canvasWidth / 2;
        var centerY = canvasHeight / 2;

        // Clear the canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Draw the text
        ctx.fillText("CLICKED", centerX, centerY);

        textDrawn = true; // Set the flag to true, indicating text has been drawn

    }
}

// Initial drawing of the text



let resetCount = 0

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
        context.strokeStyle = `hsl(${this.hue}, 100%, 50%)`;
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

// Create an array of Line objects
const linesArray = [];
const numberOfLines = 20;
for (let i = 0; i < numberOfLines; i++) {
    linesArray.push(new Line(cnv));
}

// Line animation loop
 // Control flag for line animation

console.log(clickTime)


function animateLines() {
    
    if (lineAnimationActive) {

        drawText()
        if (clickTime > 1){
        ctx.clearRect(0, 0, cnv.width, cnv.height);}
        
        

        linesArray.forEach(line => {
            line.draw(ctx);
            line.update();
             
        });
        
        
        requestAnimationFrame(animateLines);
        
    }
    
}

// Particle system setup
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

// Class to manage particle effects
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


// Start line animation initially
// Class definitions (Line, Particle, Effect) are assumed to be correctly defined.

let effect; // Global variable for the effect instance
let lineAnimationActive = true;  // Initial state to animate lines
let particleAnimationActive = false


function animateParticles() {
    if (particleAnimationActive) { // Ensure this checks the correct flag

    if (!lineAnimationActive && effect) { // Check if effect is defined and line animation is inactive
        // ctx.clearRect(0, 0, cnv.width, cnv.height);
        effect.draw(ctx);
        effect.update();
  
        requestAnimationFrame(animateParticles);
    }
}}


// Setup event listener to toggle animations
cnv.addEventListener('click', function() {
    clickTime++
    lineAnimationActive = !lineAnimationActive;
    particleAnimationActive = !particleAnimationActive; // Toggle particle animation state as well

    if (particleAnimationActive) {
        // Stop lines and ensure particle effect runs
        if (!effect) {
            effect = new Effect(cnv.width, cnv.height);
        }
        effect.updateImageData(cnv);
        effect.init(ctx);
        animateParticles(); // Start or continue particle animation
    } else {
        // Stop particles and ensure line animation runs
        animateLines();
    }
});

// Start with line animation

animateLines();


// Start with line animation

console.log(lineAnimationActive)
// if (clickTime > 2){
//     animateParticles(); 
//             ctx.clearRect(0, 0, cnv.width, cnv.height);

// }

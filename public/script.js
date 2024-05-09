
//Deafault set up
document.body.style.margin   = 0
document.body.style.overflow = `hidden`

const cnv = document.getElementById (`cnv_element`)
const ctx = cnv.getContext (`2d`)

// const draw_frame = () => {
//    ctx.fillStyle = `red`
//    ctx.fillRect (0, 0, innerWidth, innerHeight)
//    requestAnimationFrame (draw_frame)
// }
// draw_frame ()




// Start of chaotic scribbly line script--------------------------------
ctx.lineWidth = 10
ctx.strokeStyle = 'red'

//shadows
ctx.shadowOffsetX = 10; // More noticeable offset
ctx.shadowOffsetY = 10; // More noticeable offset
ctx.shadowBlur = 20;    // Added blur for better visibility
ctx.shadowColor = 'black';

//reset Count
let resetCount = 0

//canvas size and resize
cnv.width = innerWidth
cnv.height = innerHeight
window.onresize = () => {
   cnv.width = innerWidth
   cnv.height = innerHeight   
}


//class Line
class Line{
   constructor(cnv){
      this.cnv = cnv
      this.x = Math.random() * this.cnv.width
      this.y = Math.random() * this.cnv.height
      this.history = [{x: this.x, y: this.y}]
      this.lineWidth = Math.floor(Math.random() * 15 + 1)
      this.hue = Math.floor(Math.random() * 360)
      this.maxLength = Math.floor(Math.random() * 150 + 10)
      this.speedX = Math.random() * 1 - 0.5
      this.speedY = 7
      this.lifeSpan = this.maxLength * 2
      this.preCalculate = this.lifeSpan * 0.85
      this.timer = 0
      this.angle = 0
      this.curve = 0
      this.va = Math.random() * 0.5 - 0.25
      this.vc = Math.random() * 0.4 - 0.2    
      
    //   this.vc = 0.25
   }

   draw(context){
      context.strokeStyle = 'hsl(' + this.hue + ',100%,50%)'
      context.lineWidth = this.lineWidth
      context.beginPath()
      context.moveTo(this.history[0].x, this.history[0].y)
      for (let i = 0; i < this.history.length; i++){
          context.lineTo(this.history[i].x, this.history[i].y)
      }
      context.stroke()
   }
   update(){
            this.timer++
            this.angle += this.va
            this.curve += this.vc
            if (this.timer < this.lifeSpan){
                if(this.timer > this.preCalculate){
                    this.vc *=-1.2
                    this.va *=-1.2
                }
            //X Y RANDOM
            this.x += Math.sin(this.angle) * this.curve
            this.y += Math.cos(this.angle) * this.curve 
            // this.speedY + Math.random() * 20 - 
            this.history.push({x: this.x, y: this.y})
            if (this.history.length > this.maxLength){
                this.history.shift()
                }
            }
            else if (this.history.length <= 1){
                this.reset()
                
            }
            else {
                this.history.shift()
            }
            }
    
         reset(){
            this.x = Math.random() * this.cnv.width
            this.y = Math.random() * this.cnv.height
            this.history = [{x: this.x, y: this.y}]
            this.timer = 0
            this.angle = 0
            this.curve = 0
            resetCount = resetCount + 1;
            // console.log(resetCount)
            if (resetCount >= 20) {
                this.angle = 0
                this.curve = 0
                this.va = Math.random() * 0.5 - 0.25;
                this.vc = Math.random() * 0.4 - 0.2;
                resetCount = 0;
                
            }
            }
            
   

}


const linesArray = []
const numberOfLines = 20
for (let i = 0; i < numberOfLines; i ++){
   linesArray.push(new Line(cnv))

}

//Recursion
function animate(){
   ctx.clearRect(0, 0, cnv.width, cnv.height)
   //drawline
   linesArray.forEach(line => {
      line.draw(ctx)
      line.update()
   })
   
   requestAnimationFrame(animate)
}
animate()


console.log('animating')
console.log(ctx)
console.log(linesArray)

//End of chaotic scribbly line script--------------------------------------






//Start of particle script-------------------------------------------------
var dataURL = cnv.toDataURL();

function updateCanvas() {
    // Example function that updates canvas content
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    // Assume some drawing functions are called here
    linesArray.forEach(line => {
        line.draw(ctx)
        line.update()
    });

    // Regenerate dataURL after updates
    var dataURL = cnv.toDataURL();
    // console.log(dataURL)// Optionally log or handle the new dataURL

    // Continue animation if needed
    requestAnimationFrame(updateCanvas);
}

// Call updateCanvas to start drawing and updating
updateCanvas();



class Particle{
    constructor(effect, x, y, color){
        this.effect = effect
        this.x = Math.random() * this.effect.width
        this.y = 0
        this.originX = Math.floor(x)
        this.originY = Math.floor(y)
        this.color = color
        this.size = this.effect.gap 
        this.vx = 0
        this.vy = 0
        this.ease = 0.01
        this.dx = 0
        this.dy = 0
        this.distance = 0
        this.force = 0
        this.angle = 0
        this.friction = 0.95
    }
    draw(context){
        context.fillStyle = this.color
        context.fillRect(this.x, this.y, this.size, this.size)
    }
    update(){
        this.dx = this.effect.mouse.x - this.x
        this.dy = this.effect.mouse.y - this.y
        this.distance =  this.dx * this.dx + this.dy * this.dy
        this.force = this.effect.mouse.radius / this.distance

        if (this.distance < this.effect.mouse.radius){
            this.angle = Math.atan2(this.dy, this.dx)
            this.vx += this.force * Math.cos(this.angle)
            this.vy += this.force * Math.sin(this.angle)
        }

        this.x += (this.vx * this.friction) + (this.originX - this.x)* this.ease
        this.y += (this.vy * this.friction) + (this.originY - this.y)* this.ease
    }
    warp(){
        this.x = Math.random() * this.effect.width
        this.y = Math.random() * this.effect.height
        this.ease = 0.05

    }
}

class Effect {
    constructor(width, height){
        this.width = width
        this.height = height
        this.particleArray = []
        this.image = dataURL
        console.log(this.image)
        this.centerX = this.width * 0.5
        this.centerY = this.height* 0.5
        this.x = this.centerX - this.image.width * 0.5
        this.y = this.centerY - this.image.height * 0.5
        this.gap = 3
        this.mouse = {
            radius: 3000,
            x: undefined,
            y: undefined
        }
        window.addEventListener('mousemove', event => {
            this.mouse.x = event.x
            this.mouse.y = event.y
            // console.log(this.mouse.x, this.mouse.y)
        })
    }
    init(context){
        context.drawImage(this.image, this.x, this.y)
        const pixels = context.getImageData (0, 0, this.width, this.height).data
        for (let y = 0; y < this.height; y += this.gap){
            for (let x = 0; x < this.width; x += this.gap){
                const index = (y * this.width + x) * 4
                const red = pixels[index]
                const green = pixels[index + 1]
                const blue = pixels[index + 2]
                const alpha = pixels[index + 3]
                const color = 'rgb('+ red +',' + green + ',' + blue + ')'
            
                if (alpha>0){
                    this.particleArray.push(new Particle(this, x, y, color))
                }
            
            }
        }
    }

    draw(context){
        this.particleArray.forEach(particle => particle.draw(context2))
    }
    update(){
        this.particleArray.forEach(particle => particle.update())
    }
    warp(){
        this.particleArray.forEach(particle => particle.warp())
    }
}

const effect = new Effect(cnv.width, cnv.height)
effect.init(ctx)
console.log(effect.particleArray)

function animate2(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    effect.draw(ctx)
    effect.update()
    requestAnimationFrame(animate2)
}
animate2()
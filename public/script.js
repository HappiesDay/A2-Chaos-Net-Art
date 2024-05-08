
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

//
ctx.lineWidth = 10
ctx.strokeStyle = 'red'

//shadows
ctx.shadowOffsetX = 10; // More noticeable offset
ctx.shadowOffsetY = 10; // More noticeable offset
ctx.shadowBlur = 20;    // Added blur for better visibility
ctx.shadowColor = 'black';

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
      this.resetCount = 0
      
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
            this.resetCount++;
            if (this.resetCount >= 20) {
                this.angle = 0
                this.curve = 0
                this.va = Math.random() * 0.5 - 0.25;
                this.vc = Math.random() * 0.4 - 0.2;
                this.resetCount = 0;
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
console.log(resetCount)

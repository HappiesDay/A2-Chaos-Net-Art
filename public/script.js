
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
      this.startX = Math.random() * this.cnv.width
      this.startY = Math.random() * this.cnv.height
      this.history = [{x: this.x, y: this.y}]
      this.lineWidth = Math.floor(Math.random() * 15 + 1)
      this.hue = Math.floor(Math.random() * 360)

   }

   draw(context){
      context.strokeStyle = 'hsl(' + this.hue + ',100%,50%)'
      context.lineWidth = this.lineWidth
      context.beginPath()
      context.moveTo(this.history[0].x, this.history[0].y)
      for (let i = 0; i < 3; i++){
         this.x = Math.random() * this.cnv.width
         this.y = Math.random() * this.cnv.height
         this.history.push({x: this.x, y: this.y})
      }
      for (let i = 0; i < this.history.length; i++){
         context.lineTo(this.history[i].x, this.history[i].y)
      }

      context.lineTo(this.endX, this.endY)
      context.stroke()
   }
}

const linesArray = []
for (let i = 0; i < 10; i ++){
   linesArray.push(new Line(cnv))

}

console.log(linesArray)

//Recursion
function animate(){
   ctx.clearRect(0, 0, cnv.width/2, cnv.height/2)
   linesArray.forEach(line => line.draw(ctx))

   requestAnimationFrame(animate)
}
console.log('animating')

animate()


console.log(ctx)

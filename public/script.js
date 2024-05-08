
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
ctx.strokeStyle = 'magenta'

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
      this.endX = Math.random() * this.cnv.width
      this.endY = Math.random() * this.cnv.height
      this.lineWidth = Math.floor(Math.random() * 15 + 1)
      

   }

   draw(context){
      context.lineWidth = this.lineWidth
      context.beginPath()
      context.moveTo(this.startX, this.startY)
      context.lineTo(this.endX, this.endY)
      context.stroke()
   }
}

const line1 = new Line(clearInterval)
line1.draw(ctx)

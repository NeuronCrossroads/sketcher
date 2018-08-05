const green = '#3cba54'
const blue = '#4885ed'
const yellow = '#f4c20d'
const red = '#db3236'
const purple = '#963D97'
const grey = '#D3D3D3'
var minX;
var maxX;
var minY;
var maxY;
var xHist = [];
var yHist = [];
var percents = [0.,0.,0.,0.,0.];
var new_percents = [0.166,0.166,0.166,0.166,0.166];
var mouseready = false;
let model = prepModel()
loadDict()

var drawingArea = function(i) {
  const cheight = 350
  const cwidth = 350
  var canvas;
  i.setup = function() {
    canvas = i.createCanvas(cwidth,cheight)
    canvas.style("border","1px solid grey")
    i.background(255)
    i.pixelDensity(1)
  }

  i.draw = function() {
    i.drawLines()
  }

  i.drawLines = function() {
    var conditions = i.mouseX > 0 && i.mouseX < cwidth && i.mouseY > 0 && i.mouseY < cheight && i.mouseIsPressed
    if (conditions) {
      i.strokeWeight(10)
      i.stroke(0)
      if (mouseready) {
        i.line(i.pmouseX,i.pmouseY,i.mouseX,i.mouseY)
      }
      else {
        i.line(i.mouseX,i.mouseY,i.mouseX,i.mouseY)
        mouseready = true
      }
      xHist.push(i.mouseX)
      yHist.push(i.mouseY)
    }
    if (i.mouseIsPressed != true) {
      mouseready = false
    }

    i.clear = function() {
      i.background(255)
      xHist = []
      yHist = []
    }

    i.getImage = function() {
      minX = Math.min(...xHist)-25
      maxX = Math.max(...xHist)+25
      minY = Math.min(...yHist)-25
      maxY = Math.max(...yHist)+25
      minval = Math.min(minX,minY)
      maxval = Math.min(maxX,maxY)
      ctx = i.get(minval,minval,maxval-minval,maxval-minval).drawingContext
      data = ctx.getImageData(0,0,maxval-minval,maxval-minval)
      return data
    }
  }

}

var drawingArea = new p5(drawingArea, 'drawingArea');

var pie = function(i) {
  const cheight = 450
  const cwidth = 350
  var canvas;
  i.setup = function() {
    canvas = i.createCanvas(cwidth,cheight)
    i.background(255)
    i.pixelDensity(1)
    i.angleMode(i.DEGREES)
  }

  i.draw = function() {
    i.drawPie()
  }

  i.drawPie = function() {
    i.noStroke()
    i.background(255)
    i.fill(175)
    i.ellipse(cwidth/2, cheight*0.95-50, 300, 50)
    new_percents.forEach((val,i) => {
      percents[i] += (val-percents[i])/15
    })
    i.drawArcPercent(percents)
    i.fill(255,255,255)
    i.ellipse(cwidth/2, cheight/2-50, 175);
  }

  i.drawArcPercent = function(percents) {
    //top 5 percents
    var oldpercent = 0
    const colors = [purple,blue,green,yellow,red]
    for (n = 0; n < 6; n++) {
      if (n != 5) {
        a = oldpercent*360-90
        b = (oldpercent+percents[n])*360-90
        i.fill(colors[n])
        i.arc(cwidth/2, cheight/2-50, 300, 300, a,b,i.PIE);
        oldpercent = percents[n]+oldpercent
      }
      else {
       a = oldpercent*360-90
       b = 360-90
       i.fill(grey)
       i.arc(cwidth/2, cheight/2-50, 300, 300, a,b,i.PIE);
      }
    }
  }
}
var graphArea = new p5(pie, 'pieArea')

document.addEventListener('mouseup',updatePie)

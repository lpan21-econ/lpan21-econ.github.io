// Edgeworth box

var ptx = 200;
var pty = 150;
var canvas;
var context;
var npts = 256;
var alpha1 = 0.7;
var alpha2 = 0.4;
var crsize = 8;
var cron = false;
var clickme = true;
var mdown = false;

function drawFunc(func,xmin,xmax) {
  delx = (xmax-xmin)/npts;

  context.beginPath();
  context.moveTo(xmin,height-func(xmin));
  for (var x = delx; x <= xmax; x = x + delx) {
    var y = height-func(x);
    context.lineTo(x,y);
    context.moveTo(x,y);
  }
  context.lineTo(xmax,height-func(xmax));
  context.closePath();
  context.stroke();
}

function draw_line(x1,y1,x2,y2) {
  context.beginPath();
  context.moveTo(x1,y1);
  context.lineTo(x2,y2);
  context.closePath();
  context.stroke();
}

function circle(x,y,rad,fill) {
  context.beginPath();
  context.arc(x,y,rad,0,Math.PI*2,true);
  context.closePath();
  if (fill) {
    context.fill();
  } else {
    context.stroke();
  }
}

function roundRect(x,y,w,h,rad,fill) {
  context.beginPath();
  context.moveTo(x+rad,y);
  context.lineTo(x+w-rad,y);
  context.quadraticCurveTo(x+w,y,x+w,y+rad);
  context.lineTo(x+w,y+h-rad);
  context.quadraticCurveTo(x+w,y+h,x+w-rad,y+h);
  context.lineTo(x+rad,y+h);
  context.quadraticCurveTo(x,y+h,x,y+h-rad);
  context.lineTo(x,y+rad);
  context.quadraticCurveTo(x,y,x+rad,y);
  context.closePath();

  if (fill) {
    context.fill();
  } else {
    context.stroke();
  }
}

function util(x,y,alpha) {
  return alpha*Math.log(x) + (1-alpha)*Math.log(y);
}

function draw() {
  console.log(width,height);

  context.clearRect(0,0,width,height);

  context.lineWidth = 0.5;
  context.strokeStyle = 'black';
  context.strokeRect(0,0,width,height);

  context.fillStyle = '#555555';
  circle(ptx,pty,3,true);

  context.lineWidth = 0.1;
  context.strokeStyle = 'red';
  draw_line(ptx,0,ptx,height);
  draw_line(0,pty,width,pty);

  rpx1 = ptx;
  rpy1 = height-pty;
  rpx2 = width-rpx1;
  rpy2 = height-rpy1;

  uval1 = util(rpx1,rpy1,alpha1);
  function indiff1(x) {
    return Math.exp((uval1-alpha1*Math.log(x))/(1-alpha1));
  }

  uval2 = util(rpx2,rpy2,alpha2);
  function indiff2(x) {
    return height-Math.exp((uval2-alpha2*Math.log(width-x))/(1-alpha2));
  }

  context.lineWidth = 0.5;
  context.strokeStyle = 'black';
  drawFunc(indiff1,0,width);
  drawFunc(indiff2,0,width);

  pstar = ((1-alpha1)*rpx1+(1-alpha2)*rpx2)/(alpha1*rpy1+alpha2*rpy2);
  function budget(x) {
    return (rpx1+pstar*rpy1-x)/pstar;
  }

  context.lineWidth = 0.5;
  context.strokeStyle = 'blue';
  drawFunc(budget,0,width);

  function contract(x) {
    return (alpha2*(1-alpha1)*height*x)/(alpha1*(1-alpha2)*width+(alpha2-alpha1)*x);
  }

  context.lineWidth = 0.3;
  context.strokeStyle = 'green';
  drawFunc(contract,0,width);

  w1 = rpx1+pstar*rpy1;
  eqx = alpha1*w1;
  eqy = (1-alpha1)*w1/pstar;

  context.fillStyle = '#555555';
  circle(eqx,height-eqy,3,true);

  if (clickme) {
    cmx = 0.6*width;
    cmy = 0.2*height;
    context.fillStyle = '#333333';
    roundRect(cmx-4,cmy-20,47,27,5,true);
    context.fillStyle = 'white';
    context.font = '20px sans-serif';
    context.fillText('click',cmx,cmy);
  }

  if (cron) {
    context.lineWidth = 0.7;
    context.strokeStyle = 'black';
    draw_line(crx-crsize,cry,crx+crsize,cry);
    draw_line(crx,cry-crsize,crx,cry+crsize);
  }
}

function onMouseDown(evt) {
  ptx = evt.pageX-canvas.offsetLeft;
  pty = evt.pageY-canvas.offsetTop;
  mdown = true;
  cron = false;
  clickme = false;
  draw();
}

function onMouseUp(evt) {
  mdown = false;
  cron = true;
}

function onMouseMove(evt) {
  crx = evt.pageX-canvas.offsetLeft;
  cry = evt.pageY-canvas.offsetTop;

  if (mdown) {
    ptx = evt.pageX-canvas.offsetLeft;
    pty = evt.pageY-canvas.offsetTop;
  }

  draw();
}

function onMouseOver() {
  cron = true;
}

function onMouseOut() {
  mdown = false;
  cron = false;
  draw();
}

canvas = document.getElementById("edgeworth");
context = canvas.getContext("2d");

canvas.onmousedown = onMouseDown;
canvas.onmouseup = onMouseUp;
canvas.onmousemove = onMouseMove;
canvas.onmouseover = onMouseOver;
canvas.onmouseout = onMouseOut;

$(window).ready(function() {
  width = canvas.offsetWidth;
  height = canvas.offsetHeight;
  canvas.width = width;
  canvas.height = height;
  ptx = 0.3*width;
  pty = 0.3*height;
  draw();
});


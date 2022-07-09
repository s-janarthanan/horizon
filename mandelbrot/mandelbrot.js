// This is p5js program to draw Mandelbrot set

// create a complex number with user given real and imaginary parts
function makeComplex(re, im) {
  return { real : re, imag : im };
}

// add the two given complex numbers, and return the sum
function addComplex(z1, z2) {
  return makeComplex(z1.real + z2.real, z1.imag + z2.imag);
}

// multiply the two given complex numbers, and return the product
function mulComplex(z1, z2) {
  return makeComplex(z1.real*z2.real - z1.imag*z2.imag,
                    z1.real*z2.imag + z1.imag*z2.real);
}

// find the absolute value/modulus of given complex number
function absComplex(z) {
  return Math.hypot(z.real, z.imag);
}

var numIterations = 50

// to check if the given complex number lies in the Mandelbrot set or not.
// we return the number of iterations after which the number reaches absolute
// value of 2. See also: https://en.wikipedia.org/wiki/Mandelbrot_set

function isInMandelbrot(c) {
  var z = makeComplex(0, 0);
  
  // We compute z-> z^2 + c mapping for numIterations times.
  // If absolute value remains within 2, we treat it as converging point
  // and so part of Mandelbrot set. Anything diverges before numIterations
  // iterations is not part of the Mandelbrot set.
  
  let threshold = 2;
  for (var i = 0; i < numIterations; i++) {
      // z -> z^2 + c
      z = addComplex(mulComplex(z, z), c)
      // If |z| > 2, the given point 'c' is not in the Mandelbrot set.
      if (absComplex(z) > threshold) {
          // return the number of iterations 'c' took to diverge
          return { iterations : i+1, isIn : false } 
      }
  }
  return { iterations : numIterations, isIn : true }
}

// mapping of screen coordinate system to complex plane 
// rectangle segment [-2, 2]x[-2i, 2i]

var centX = 0;
var centY = 0;
var zoomScale = 1;

// map given pixel to complex number
function pixelToComplex(x, y) {
  var re = ((x - width/2) * (4/width) * (16/(9*zoomScale))) + centX;
  var im = ((y - height/2) * (4/height) * (1/zoomScale)) + centY;
  return makeComplex(re, im);
}

 
function setup() {
  // Canvas size set for the aspect ratio of 16:9
  createCanvas(640, 360);
  
  noStroke();
  
  // We follow Hue-Saturation-Brightness system for
  // color specification. See also:
  // https://en.wikipedia.org/wiki/HSL_and_HSV
  colorMode(HSB);
  
  // initial Mandebrot picture
  drawMandelbrot();
}

function draw() {
  // check if we have to redraw the picture based on
  // zooming and shifting of the view window
  
  var redraw = false;
  
  if (keyIsDown(LEFT_ARROW)) {
    centX -= 0.5/zoomScale;
    redraw = true;
  }
  
  if (keyIsDown(RIGHT_ARROW)) {
    centX += 0.5/zoomScale;
    redraw = true;
  }
  
  if (keyIsDown(DOWN_ARROW)) {
    centY += 0.5/zoomScale;
    redraw = true;
  }
  
  if (keyIsDown(UP_ARROW)) {
    centY -= 0.5/zoomScale;
    redraw = true;
  }
  
  // 107 and 187 are keyCodes for "+"
  if (keyIsDown(107) || keyIsDown(187)) {
    zoomScale += 0.5;
    redraw = true
  }
  
  // 109 and 189 are keyCodes for "-"
  if (keyIsDown(109) || keyIsDown(189)) {
    zoomScale -= 0.5;
    redraw = true;
  }
     
  if (redraw) {
    drawMandelbrot();
  }
}

// a function to map number of iterations to hue/ color.
//it can be customized to get different colors!
function iterationsToHue(iterations) {
  return 130 + 250 - Math.sqrt(iterations/numIterations)*250 % 255;
}

// draw Mandelbrot set
function drawMandelbrot() {
  var x = 0;
  var y = 0;
  for (x = 0; x < width; x++) {
    for (y = 0; y < width; y++) {
      var c = pixelToComplex(x, y)
      var result = isInMandelbrot(c)
      if (result.isIn) {
        // The point is in the Mandelbrot set. Color it as black
        set(x, y, color(0));
      } else if (result.iterations > 1) {
        // Choose a color with fixed saturation and brightness but
        // hue varied depending on number of iterations.
        set(x, y, 
            color(iterationsToHue(result.iterations), 80, 100));
      } else {
        // Point diverages less than single iteration. Color it as gray.
        set(x, y, color(70));
      }
    }
  }
  updatePixels();
}

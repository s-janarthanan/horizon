// This is a p5js program to simulate Lanton's ant.
// There are three sliders - the first for initial x coordinate of ant, second for initial y coordinate and third for speed of ant.

var x;
var y;
var movement;
var grid;
var state;
var antspeed;

//function for clockwise turn
function clockwiseTurn() {
  movement += 1;
  if (movement > 4) {
    movement = 1;
  }
}

//function for counterclockwise turn
function anticlockwiseTurn() {
  movement -= 1;
  if(movement < 1) {
    movement = 4
  }
}

//function to move forward, once we made a turn
function moveForward() {
  //if movement equals 1, it goes 1 unit down (the pixel //coordinate system has y axis pointing down)
  if (movement == 1) {
    y += 1;
  }
  // if movement equals 2, it goes 1 unit left
  else if (movement == 2) {
    x -= 1;
  }
  //if movement equals 3, it goes 1 unit up
  else if (movement == 3) {
    y -= 1;
  }
  //if movement equals 4, it goes 1 unit right
  else if (movement == 4) {
    x += 1;
  }
  
  //if we reach and cross the edge, we come back from the other //edge.
  if (x > width - 1) {
    x = 0; //right edge to left
  }
  else if (x < 0) {
    x = width - 1; //left edge to right
  }
  
  if (y > height - 1) {
    y = 0; //top edge to bottom
  }
  else if (y < 0) {
    y = height - 1; // bottom edge to top.
  }
}

function setup() {
  createCanvas(400, 400);
  grid = create2Darray(width, height);
  movement = 1;
  xSlider = createSlider(0, width, width/2, 1);
  xSlider.input(updateX);
  updateX(width/2);
  
  ySlider = createSlider(0, height, height/2, 1);
  ySlider.input(updateY);
  updateY(height/2);
  
  speedSlider = createSlider(10, 100, 50, 1);
  speedSlider.input(updateSpeed);
  updateSpeed(50);
}

function updateSpeed() {
    antspeed = speedSlider.value();
}

function updateX() {
    x = xSlider.value();
}

function updateY() {
    y = ySlider.value();
}
function draw() {
  strokeWeight(1);
    for (let n = 0; n < antspeed; n++) {
      var state = grid[x][y];
      //we arbitrarily choose state = 0 as white and perform a //clockwise turn
      if (state == 0) {
        clockwiseTurn();
        grid[x][y] = 1; //change the value of the 2D array at that index, after moving
      } else if (state == 1) {
        anticlockwiseTurn();
        grid[x][y] = 0;
      }

      stroke(color(255));
      if (grid[x][y] == 1) {
        stroke(color(0)); //invert the color after going forward.
      }
      else {
        stroke(color(255))
      }
      point(x, y);
      moveForward();
  }
}

//create a 2D array of 0s.
function create2Darray(columns, rows) {
  arr = new Array(columns);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
    for(var j = 0; j < arr[i].length; j++) {
      arr[i][j] = 0
    }
  }
  return arr;
}

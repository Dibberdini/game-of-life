let tiles = 40;
let size;
let cells = [];
let buffercells = [];
let live = true;
let wrap = true;
let draggedcells = []

const STATES = {
  DEAD: 0,
  ALIVE: 1
}

function setup() {
  createCanvas(600, 600);
  frameRate(6);
  size = width / tiles;

  //Create the '2D-array' of cells
  cells = new Array(tiles)
  buffercells = new Array(tiles);
  for (let i = 0; i < cells.length; i++) {
    cells[i] = new Array(tiles);
    buffercells[i] = new Array(tiles);
  }

  //Populate all cells with an initial value of 0.
  reset();

  //Create initial glider
  cells[0][0] = 1;
  cells[0][2] = 1;
  cells[1][1] = 1;
  cells[1][2] = 1;
  cells[2][1] = 1;
}

function draw() {
  background(0);
  drawGrid();
  drawCells();
  if (live) {
    updateCells();
  }
}

function drawGrid() {
  //Style-commands
  stroke(255, 255, 255);

  //For each cell-space draw a line vertically and horizontally.
  for (let i = 0; i < width; i += size) {
    line(i, 0, i, height);
  }
  for (let i = 0; i < height; i += size) {
    line(0, i, width, i);
  }
}

function drawCells() {
  //Style-commands
  fill(255);

  //For each living cell, draw a rectangle.
  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells[i].length; j++) {
      if (cells[i][j] == STATES.ALIVE) {
        rect(i * size, j * size, size);
      }
    }
  }
}

function updateCells() {
  // console.log("new cycle")

  //Update buffercells
  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells[i].length; j++) {
      buffercells[i][j] = cells[i][j];
    }
  }

  //Update next generation into buffercells.
  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells[i].length; j++) {
      //Get number of neighbours for the given cells.
      let neighbours;
      if (wrap) {
        neighbours = getNeighboursWrapped(i, j);
      } else {
        neighbours = getNeighbours(i, j);
      }

      if (cells[i][j] == STATES.ALIVE) {
        if (neighbours < 2 || neighbours > 3) {
          // console.log(`cells[${i}][${j}] with ${neighbours} died`);
          buffercells[i][j] = 0;
        }
      } else {
        if (neighbours == 3) {
          // console.log(`cells[${i}][${j}] with ${neighbours} became alive`);
          buffercells[i][j] = 1;
        }
      }
    }
  }

  //Copy buffercells back into cells
  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells[i].length; j++) {
      cells[i][j] = buffercells[i][j];
    }
  }
}

//Get living neighbours for a given cell.
function getNeighbours(x, y) {
  let neighbours = 0;

  //Check a 3x3 grid centered around the input coordinates.
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (cells[x + i] && cells[y + j]) {
        neighbours += cells[x + i][y + j];
      }
    }
  }
  neighbours -= cells[x][y];

  return neighbours;
}

//Get living neighbours for a given cell.
//Wraps around if input cell in along an edge.
function getNeighboursWrapped(x, y) {
  let neighbours = 0;

  //Check a 3z3 grid centered around the input coordinates.
  //If a row/column doesn't exist wrap around the full grid.
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (cells[x + i] && cells[y + j]) {
        neighbours += cells[x + i][y + j];
      } else {
        let tempX = x + i;
        let tempY = y + j;

        if (x + i < 0) {
          tempX = tiles - 1;
        } else if (x + i == tiles) {
          tempX = 0;
        }

        if (y + j < 0) {
          tempY = tiles - 1;
        } else if (y + j == tiles) {
          tempY = 0;
        }

        neighbours += cells[tempX][tempY];
      }
    }
  }
  neighbours -= cells[x][y];

  return neighbours;
}

//Reset all cells to the 'dead' state.
function reset() {
  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells[i].length; j++) {
      cells[i][j] = STATES.DEAD;
      buffercells[i][j] = STATES.DEAD;
    }
  }
}

//Flip cell state at mouse position
function flipCell(x,y) {
  if (cells[x][y] == STATES.DEAD) {
    cells[x][y] = STATES.ALIVE;
  } else {
    cells[x][y] = STATES.DEAD;
  }
}


function mousePressed() {
  flipCell(Math.floor(mouseX / size), Math.floor(mouseY / size))
  draggedcells.push(Math.floor(mouseX/size) + "," + Math.floor(mouseY/size));
}

function mouseDragged() {
  let cell = Math.floor(mouseX/size) + "," + Math.floor(mouseY/size)
  if(!draggedcells.includes(cell)) {
    draggedcells.push(cell);
    flipCell(Math.floor(mouseX/size), Math.floor(mouseY / size))
  }
}

function mouseReleased() {
  draggedcells = [];
}

function keyPressed() {
  if (keyCode == 75) { //K toggles live-mode
    live = !live;
  } else if (keyCode == 82) { //R resets
    reset();
  } else if (keyCode == 84) { //T toggles wrap-mode
    wrap = !wrap;
  }
}
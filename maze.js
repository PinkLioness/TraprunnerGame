'use strict';

// Constants, in vector form
const VECTOR_NORTH = {x:1,  y:0};
const VECTOR_EAST  = {x:0,  y:1};
const VECTOR_SOUTH = {x:-1, y:0};
const VECTOR_WEST  = {x:0,  y:-1};
// Constants, for CSS and cell usage
const CELL_NORTH = 0;
const CELL_EAST = 1;
const CELL_SOUTH = 2;
const CELL_WEST = 3;

//////////////////////
/*
maze[x][y] = cell
cell[top, right, bottom, left] = walls, aka north, east, south, west. 1 means has wall, 0 means no wall

http://weblog.jamisbuck.org/2011/2/7/maze-generation-algorithm-recap
*/

/*
Growing Tree algorithm
	Let list be a list of cells, initially empty. Add one cell to list, at random.
	Choose a cell from list, and carve a passage to any unvisited neighbor of that cell, adding that neighbor to list as well. If there are no unvisited neighbors, remove the cell from list.
	Repeat #2 until list is empty.

This implementation isn't nearly as optimized as possible, but honestly there's no need for that.
*/
function GrowingTreeMazeGenerator(xsize, ysize, mazeType){
	function hasVisitedCell(cellX, cellY, maze){
		var cell = maze[cellX][cellY];
		for (var i = cell.length - 1; i >= 0; i--) {
			if(cell[i] == 0){return true;} // a cell without 4 walls was visited before
		}
		return false;
	}
	
	// init maze with 4 walls on every cell
	var maze = [];
	for (var x = xsize - 1; x >= 0; x--){
		maze[x] = [];
		for (var y = ysize - 1; y >= 0; y--){
			maze[x][y] = [1,1,1,1];
		}
	}
	
	// Let list be a list of cells, initially empty.
	var list = [];
	
	// Add one cell to list, at random.
	var initialCellX = randomIntFromInterval(0, xsize-1);
	var initialCellY = randomIntFromInterval(0, ysize-1);
	list.push({x:initialCellX, y:initialCellY});
	
	while(list.length != 0){
		var index = 0;
		switch(Number(mazeType)){
			case 1:
				// This one is for the recursive backtracker algorithm, tends to make long winding halls
				index = list.length-1;
				break;
			case 2:
				// This one transforms it into Prim's algorithm, has lots of dead ends
				index = randomIntFromInterval( 0, (list.length-1) );
				break;
			case 3:
				// This one is a mix of both, makes really great and really crappy mazes when it wants to
				if(randomIntFromInterval(0, 1)){
					index = randomIntFromInterval( 0, (list.length-1) );
				}else{
					index = list.length-1;
				}
				break;
			case 4:
				// Oldest cell added to list, aka Grandmother's
				var index = 0;
				break;
			default:
				alert('NO TYPE PASSED TO THE MAZE GENERATOR; USING RECURSIVE BACKTRACKER SO WE DON\'T CRASH');
				index = list.length-1;
		}
		
		var cell = list[index];
		
		// figure out which directions you can go from the cell
		var possibleDirections = [];
		// if it doesn't touches any of the borders and if the cell wasn't visited, that is, if the cell has 4 walls
		if((cell.x + 1 != xsize)  &&  !hasVisitedCell(cell.x + 1, cell.y, maze)){possibleDirections.push(VECTOR_NORTH)};
		if((cell.x - 1 != -1)     &&  !hasVisitedCell(cell.x - 1, cell.y, maze)){possibleDirections.push(VECTOR_SOUTH)};
		if((cell.y + 1 != ysize)  &&  !hasVisitedCell(cell.x, cell.y + 1, maze)){possibleDirections.push(VECTOR_EAST)};
		if((cell.y - 1 != -1)     &&  !hasVisitedCell(cell.x, cell.y - 1, maze)){possibleDirections.push(VECTOR_WEST)};
		
		// If there are no unvisited neighbors, remove the cell from list, otherwise make a path to a new cell
		if(possibleDirections.length == 0){
			list.splice(index, 1);
		}else{
			// Choose a random direction
			var direction = possibleDirections[randomIntFromInterval(0, (possibleDirections.length-1))];
			
			
			
			// carve passage
			var newCell = {x:(cell.x + direction.x), y:(cell.y + direction.y)};
			switch(direction){ // TODO: Think if we can do wall carving in a one-liner
				case VECTOR_NORTH:
					maze[cell.x][cell.y][CELL_NORTH] = 0;
					maze[newCell.x][newCell.y][CELL_SOUTH] = 0;
					break;
				case VECTOR_EAST:
					maze[cell.x][cell.y][CELL_EAST] = 0;
					maze[newCell.x][newCell.y][CELL_WEST] = 0;
					break;
				case VECTOR_SOUTH:
					maze[cell.x][cell.y][CELL_SOUTH] = 0;
					maze[newCell.x][newCell.y][CELL_NORTH] = 0;
					break;
				case VECTOR_WEST:
					maze[cell.x][cell.y][CELL_WEST] = 0;
					maze[newCell.x][newCell.y][CELL_EAST] = 0;
					break;
				default: // Should never happen, but doesn't hurts to scream
					alert('GOT A BUG DURING WALL-CARVING');
			}
			
			// add neighbor to list
			list.push(newCell);
		}
	}
	
	// Invert maze before returning it, because [0][0] being the top left seems more natural.
	// I have no idea what went "wrong" during the generation to cause that and this fixes it anyway, so...
	var invertedMaze = [];
	for (var i = 0; i < maze.length; i++) {
		invertedMaze.unshift(maze[i]);
	}
	return invertedMaze;
}

function drawMaze(maze){
	var container = GAME.interface.mazeArea;
	var defaultCellWidthHeight = (400 / maze.length) - 2; // -2 because of the borders
	
	var mazeCells = [];
	
	for (var x = 0; x < maze.length; x++){
		mazeCells[x] = [];
		for (var y = 0; y < maze[0].length; y++){
			var cell = document.createElement('div');
			var width = defaultCellWidthHeight;
			var height = defaultCellWidthHeight;
			
			var walls = [];
			if(maze[x][y][CELL_NORTH] == 1){walls.push('hasTopWall');}else{height += 1;}
			if(maze[x][y][CELL_EAST] == 1){walls.push('hasRightWall');}else{width += 1;}
			if(maze[x][y][CELL_SOUTH] == 1){walls.push('hasBottomWall');}else{height += 1;}
			if(maze[x][y][CELL_WEST] == 1){walls.push('hasLeftWall');}else{width += 1;}
			
			cell.style.width = width + 'px';
			cell.style.height = height + 'px';
			cell.style.display = 'inline-block';
			cell.style.verticalAlign = 'bottom';
			
			cell.className = walls.join(' ');
			
			mazeCells[x][y] = cell;
			
			container.appendChild(cell);
		}
	}
	
	return mazeCells;
}
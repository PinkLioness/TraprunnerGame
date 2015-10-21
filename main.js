'use strict';
var GAME = GAME || {};
GAME.main = {
	mazeWalls:undefined, // logical walls
	mazeDOM:undefined, // Stores the HTML nodes to update the interface

	mazeThings:[],
	/* Stores what's in each tile and follows this format:
	{
		type: string, possible values: 'keycard', 'exit' and 'trap'.
		data: Used by 'trap' things to store the trap data. Unused for the others...?
	}
	*/

	mazeSize:undefined,
	foundExit:false,
	exitLocation:undefined,
	difficulty:undefined,
	keycardsNeeded:undefined,

	timeTaken:0,
	
	mainMenu:function(){
		GAME.interface.clearText();
		GAME.interface.addText("Congratulations, you've been selected to compete in the TrapRunner gameshow, brand new toasters and sleek roadsters await you, etc etc etc. We need a decent intro");
		GAME.interface.addText('<span class="mainMenuSpacer">Your name: </span><input class="standardInput" type="text" id="charName">');
		GAME.interface.addText('<span class="mainMenuSpacer">Your gender: </span><select class="standardInput" id="sexType"><option value="1">Male</option><option value="2">Female</option><option value="4">Herm (hard mode)</option><option value="8">Shemale</option><option value="16">Cuntboy</option></select>');
		GAME.interface.addText('<span class="mainMenuSpacer">Maze type: </span><select class="standardInput" id="mazeType"><option value="1">Long and winding</option><option value="2">Random growth</option><option value="3">Long and winding + Random</option><option value="4">Straightened (HARD)</option></select>');
		GAME.interface.addText('<span class="mainMenuSpacer">Maze size (5, 10, 15 or 20, bigger is harder): </span><input class="standardInput" type="number" id="mazeSize" value="10" min="5" max="20" step="5">');
		GAME.interface.addText('<span class="mainMenuSpacer">Difficulty: </span><select class="standardInput" id="difficulty"><option value="1">Easy</option><option value="2" selected>Medium</option><option value="3">Hard</option><option value="4">Fap Mode</option></select>');
		GAME.interface.addText('When done, press New Game below.');

		GAME.interface.drawButtons({text:'New game', buttonFunction:GAME.main.newGame.start});
	},
	newGame:{ // Contains all functions related to starting a new game.
		start:function(){
			/*
			get data from menu
			validate input
				warn player of invalid input
				SANITIZE PLAYER NAME FOR EVIL SCRIPTS
			use data to generate maze and create player
			*/
			
			// Getting inputs
			var name = document.getElementById('charName').value.replace(/</, '&lt;');
			if(name == ''){
				name = 'Unnamed';
			}
			
			var gender = Number(document.getElementById('sexType').value);
			if((gender < 1) || (gender > 5) || (isNaN(gender))){
				alert("Weird, you picked a gender that doesn't exist. Defaulting to male.");
				gender = 1;
			}
			
			var mazeType = Number(document.getElementById('mazeType').value);
			if((mazeType < 1) || (mazeType > 4) || (isNaN(mazeType))){
				alert("Weird, you picked a maze type that doesn't exist. Defaulting to the first.");
				mazeType = 1;
			}
			
			var mazeSize = Number(document.getElementById('mazeSize').value);
			if((mazeSize % 5) != 0){mazeSize = Math.round(mazeSize / 5) * 5;}
			if(mazeSize < 5){mazeSize = 5;}
			if(mazeSize > 20 ){mazeSize = 20;}
			GAME.main.mazeSize = mazeSize;
			
			GAME.main.difficulty = Number(document.getElementById('difficulty').value);
			if((GAME.main.difficulty < 1) || (GAME.main.difficulty > 4) || (isNaN(GAME.main.difficulty))){
				alert("Weird, you picked a difficulty that doesn't exist. Defaulting to medium.");
				GAME.main.difficulty = 2;
			}
			var numberTraps = 0;
			switch(GAME.main.difficulty){
				case 1:
					GAME.main.keycardsNeeded = 1;
					numberTraps = Math.round(mazeSize * mazeSize / 10); // ~10% of the cells are trapped
					break;
				case 2:
					GAME.main.keycardsNeeded = 3;
					numberTraps = Math.round(mazeSize * mazeSize / 4); // ~25% of the cells are trapped
					break;
				case 3:
					GAME.main.keycardsNeeded = 5;
					numberTraps = Math.round(mazeSize * mazeSize / 2); // ~50% of the cells are trapped
					break;
				case 4:
					GAME.main.keycardsNeeded = 1;
					numberTraps = Math.round(mazeSize * mazeSize - 5); // ~80% in the 5x5 maze, only gets "worse"
					break;
			}
			//////////////////////////////////////////////////////////////////////////////////

			// creating maze
			GAME.interface.mazeArea.innerHTML = '';
			GAME.main.mazeWalls = GrowingTreeMazeGenerator(mazeSize, mazeSize, mazeType)
			GAME.main.mazeDOM = drawMaze(GAME.main.mazeWalls);
			for(var i = 0; i < mazeSize; i++){
				GAME.main.mazeThings[i] = [];
			}

			// creating player
			GAME.player.reset();
			GAME.player.init(name, gender);
			
			GAME.main.newGame.spawnPlayer();
			GAME.main.newGame.spawnKeycards(GAME.main.keycardsNeeded);
			GAME.main.exitLocation = GAME.main.newGame.spawnExit();
			GAME.main.newGame.spawnTraps(numberTraps);

			// On easy we get the exit painted by default
			if(GAME.main.difficulty === 1){
				GAME.main.maze.paintExit();
			};

			GAME.interface.clearTextAndButtons();
			GAME.interface.initWalkingButtons();

			// GAME.player.reset(); // TODO init lust and other things

			GAME.main.maze.paintPlayerPosition();
			GAME.main.newTurn();
		},

		spawnPlayer:function(){
			var placed = false;
			while(!placed){
				var x = randomIntFromInterval(0, GAME.main.mazeSize-1);
				var y = randomIntFromInterval(0, GAME.main.mazeSize-1);
				if(GAME.main.maze.isCellEmpty(x,y)){
					placed = true;
					GAME.player.placeAt(x,y);
				}
			}
		},
		spawnKeycards:function(amount){
			var placed = 0;
			while(placed != amount){
				var x = randomIntFromInterval(0, GAME.main.mazeSize-1);
				var y = randomIntFromInterval(0, GAME.main.mazeSize-1);
				if(GAME.main.maze.isCellEmpty(x,y)){
					placed++;
					GAME.main.mazeThings[x][y] = {type:'keycard'};
				}
			}
		},
		spawnExit:function(){
			var placed = false;
			while(!placed){
				var x = randomIntFromInterval(0, GAME.main.mazeSize-1);
				var y = randomIntFromInterval(0, GAME.main.mazeSize-1);
				if(GAME.main.maze.isCellEmpty(x,y)){
					placed = true;
					GAME.main.mazeThings[x][y] = {type:'exit'};
				}
			}
			return{'x':x, 'y':y};
		},
		spawnTraps:function(amount){
			var placed = 0, count = 0;
			while((placed != amount) && (count < 10)){ // Exits after 10 tries without finding an empty space, otherwise fap mode could take a whiiiiiiiiiile to generate.
				var x = randomIntFromInterval(0, GAME.main.mazeSize-1);
				var y = randomIntFromInterval(0, GAME.main.mazeSize-1);

				if(GAME.main.maze.isCellEmpty(x,y)){
					placed++;
					count = 0;
					//This one is a bit more involved
					GAME.main.mazeThings[x][y] = new Trap();
				}else{
					count++;
				}
			}
		}
	},
	
	maze:{ // Code related to maze game logic
		isCellEmpty:function(x, y){
			return GAME.main.mazeThings[x][y] == undefined;
		},
		getEntrancesSeenFrom:function(x,y){
			/*
			go in all 4 directions
				go ahead in the direction
					map perpendicular entrances
					count number of entrances
			*/
			const availableDirections = this.getWalkableDirectionsFrom(x,y);
			const originalX = x;
			const originalY = y;
			var entrances = {};
			const distanceLimit = 3;

			for (var i = 0; i < availableDirections.length; i++) {
				entrances[availableDirections[i]] = {
					close:{left:0, right:0},
					far:{left:0, right:0}
				};
				var directionVector = this.convertToVector(availableDirections[i]);
				var oppositeDirection = (availableDirections[i] + 2) % 4;
				var numberSteps = 0;

				// So we can map things to the relative right and left
				var rightEntranceDirection = (availableDirections[i] + 1) % 4;

				while(canWalkTo(x,y,availableDirections[i])){
					x += directionVector.x;
					y += directionVector.y;
					numberSteps++;

					// get the parallel pathways only
					var parallelEntrances = getWalkableDirectionsFrom(x,y).filter(function(elem){return !(elem == availableDirections[i] || elem == oppositeDirection);});
					for (var j = 0; j < parallelEntrances.length; j++){
						if(parallelEntrances[j] == rightEntranceDirection){
							if(numberSteps > distanceLimit){
								entrances[availableDirections[i]].far.right += 1;
							}else{
								entrances[availableDirections[i]].close.right += 1;
							}
						}else{
							if(numberSteps > distanceLimit){
								entrances[availableDirections[i]].far.left += 1;
							}else{
								entrances[availableDirections[i]].close.left += 1;
							}
						}
					}
				}
				x = originalX;
				y = originalY;
			}

			return entrances;
		},

		getWalkableDirectionsFrom:function(x,y){
			var directions = [];
			if(this.canWalkTo(x,y,CELL_NORTH)) {directions.push(CELL_NORTH);}
			if(this.canWalkTo(x,y,CELL_EAST))  {directions.push(CELL_EAST);}
			if(this.canWalkTo(x,y,CELL_SOUTH)) {directions.push(CELL_SOUTH);}
			if(this.canWalkTo(x,y,CELL_WEST))  {directions.push(CELL_WEST);}
			return directions;
		},

		canWalkTo:function(x,y,direction){
			return !(GAME.main.mazeWalls[x][y][direction]);
		},
		convertToVector:function(direction){
			switch(direction){
				case CELL_NORTH:
					return VECTOR_NORTH;
				case CELL_EAST:
					return VECTOR_EAST;
				case CELL_SOUTH:
					return VECTOR_SOUTH;
				case CELL_WEST:
					return VECTOR_WEST;
				default:
					alert("convertToVector got a direction that doesn't exist: '"+direction+"'");
			}
		},

		paintThing:function(x,y,color){
			if(x == undefined || y == undefined || color == undefined){
				// If all of them are undefined and the time is 0, it's the player's first turn. Afterwards, one of them being undefined is an error.
				if(GAME.main.timeTaken != 0){
					alert(sprintf("TRIED TO PAINT THING @ X:%i Y:%i WITH COLOR %s BUT SOMETHING FAILED", x, y, color));
				}
			}else{
				GAME.main.mazeDOM[x][y].style.backgroundColor = color;
			}
		},

		paintPlayerPosition:function(){
			GAME.main.maze.paintThing(GAME.player.previousX, GAME.player.previousY, GAME.player.previousColor);
			GAME.player.previousX = GAME.player.x;
			GAME.player.previousY = GAME.player.y;
			GAME.player.previousColor = GAME.main.mazeDOM[GAME.player.x][GAME.player.y].style.backgroundColor;
			GAME.main.maze.paintThing(GAME.player.x, GAME.player.y, 'red');
		},

		paintExit:function(){
			if(GAME.player.x == GAME.main.exitLocation.x && GAME.player.y == GAME.main.exitLocation.y){
				// Player is on the exit, we need to prevent the previous color from replacing it
				GAME.player.previousColor = 'chartreuse';
			}else{
				GAME.main.maze.paintThing(GAME.main.exitLocation.x, GAME.main.exitLocation.y, 'chartreuse');
			}
		}
	},

	newTurn:function(){
		var directions = this.maze.getWalkableDirectionsFrom(GAME.player.x, GAME.player.y);
		var directionButtons = [];

		// assume you can't walk in any direction unless the for proves you can
		GAME.interface.buttonArea.north.disabled = true;
		GAME.interface.buttonArea.west.disabled = true;
		GAME.interface.buttonArea.south.disabled = true;
		GAME.interface.buttonArea.east.disabled = true;
		for(var i = 0; i < directions.length; i++){
			switch(Number(directions[i])){
				case CELL_NORTH:
					GAME.interface.buttonArea.north.disabled = false;
					break;
				case CELL_EAST:
					GAME.interface.buttonArea.east.disabled = false;
					break;
				case CELL_SOUTH:
					GAME.interface.buttonArea.south.disabled = false;
					break;
				case CELL_WEST:
					GAME.interface.buttonArea.west.disabled = false;
					break;
				default:
					alert("newTurn got a direction that doesn't exists! '"+directions[i]+"'");
					break;
			}
		}

		GAME.inventory.updateTurn();

		GAME.interface.updatePlayerStats();

		// TODO: Get seen entrances and write them?
		// Print player status
		// Time calculations
	},
	movement:{
		north:function(){GAME.main.movement.doWalk(CELL_NORTH);},
		east:function(){GAME.main.movement.doWalk(CELL_EAST);},
		south:function(){GAME.main.movement.doWalk(CELL_SOUTH);},
		west:function(){GAME.main.movement.doWalk(CELL_WEST);},
		doWalk:function(direction){
			if(GAME.main.maze.canWalkTo(GAME.player.x, GAME.player.y, direction)){
				var directionVector = GAME.main.maze.convertToVector(direction);
				GAME.player.x -= directionVector.x;
				GAME.player.y += directionVector.y;

				GAME.main.maze.paintPlayerPosition();

				var thing = GAME.main.mazeThings[GAME.player.x][GAME.player.y];
				if(thing != undefined){
					switch(thing.type){
						case 'exit':
							// TODO text saying you found the exit
							GAME.main.maze.paintExit();
							if((GAME.main.keycardsNeeded - GAME.player.keys) == 0){
								GAME.interface.addText('victoly');

							}
							break;
						case 'keycard':
							GAME.player.getKeycard();
							break;
						case 'trap':
							GAME.player.getTrap(thing);
							break;
					}
					// add thing to player
					// messages
					// 
				}else{
					GAME.main.newTurn();
				}
			}else{
				alert("TRIED TO WALK BUT THERE'S A WALL ON THE WAY! x:%i, y:%i, direction: %i", GAME.player.x, GAME.player.y, direction);
			}
		},
		keyboardEventHandler:function(ev){
			ev = ev || window.event;
			var key = ev.keyCode;

			// WASD + arrow keys movement, enter and space to press the first button
			// We also stop the arrow keys from moving the page
			switch(Number(key)){
				case 38:
					ev.preventDefault();
				case 87:
					if(GAME.main.maze.canWalkTo(GAME.player.x, GAME.player.y, CELL_NORTH)){
						GAME.main.movement.doWalk(CELL_NORTH);
					}
					break;
				case 39:
					ev.preventDefault();
				case 68:
					if(GAME.main.maze.canWalkTo(GAME.player.x, GAME.player.y, CELL_EAST)){
						GAME.main.movement.doWalk(CELL_EAST);
					}
					break;
				case 40:
					ev.preventDefault();
				case 83:
					if(GAME.main.maze.canWalkTo(GAME.player.x, GAME.player.y, CELL_SOUTH)){
						GAME.main.movement.doWalk(CELL_SOUTH);
					}
					break;
				case 37:
					ev.preventDefault();
				case 65:
					if(GAME.main.maze.canWalkTo(GAME.player.x, GAME.player.y, CELL_WEST)){
						GAME.main.movement.doWalk(CELL_WEST);
					}
					break;
				case 13:
				case 32:
					document.querySelector('button').click();
					break;
			}
		}
	}
};
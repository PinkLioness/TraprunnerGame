'use strict';
var GAME = GAME || {};
GAME.main = {
	mainMenu:function(){
		GAME.interface.clearText();
		GAME.interface.addText("A few things will be here later, like a maze generation selector, a sex selector for your char, etc.");

		GAME.interface.drawButtons({text:'New game', buttonFunction:GAME.main.newGame.sexQuestion});
	},
	newGame:{ // Contains all functions related to starting a new game.
		sexQuestion:function(){
			GAME.interface.mazeArea.innerHTML = '';
			var x = drawMaze(GrowingTreeMazeGenerator(5,5));
			GAME.player.reset();
			x[0][0].style.backgroundColor = 'red';
			GAME.interface.statContainers['lust'].updateValue(70);
			
			/*GAME.interface.clearTextAndButtons();
			GAME.interface.addText("Just a few questions (one for now) before starting the game.");
			GAME.interface.addText("First, are you male or female? (You might be able to mix and match parts in the game)");
			
			GAME.interface.drawButtons({text:'Male', buttonFunction:GAME.main.newGame.choseMale}, {text:'Female', buttonFunction:GAME.main.newGame.choseFemale});*/
		},
		start:function(){
			// TODO: Set location to town
			// TODO: Add starting equipment?
		}
	}
};
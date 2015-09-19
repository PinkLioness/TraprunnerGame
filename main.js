'use strict';
var GAME = GAME || {};
GAME.main = {
	mainMenu:function(){
		GAME.interface.clearText();
		GAME.interface.addText("Congratulations, you've been selected to compete in the TrapRunner gameshow, brand new toasters and sleek roadsters await you, etc etc etc. We need a decent intro");
		GAME.interface.addText('Your name: <input type="text" id="charName">');
		GAME.interface.addText('Your gender: <select id="sexType"><option value="1">Male</option><option value="2">Female</option><option value="3">Herm (hard mode)</option><option value="4">Shemale</option><option value="5">Cuntboy</option></select>');
		GAME.interface.addText('Maze type: <select id="mazeType"><option value="1">Long and winding</option><option value="2">Random growth</option><option value="3">Long and winding + Random</option><option value="4">Straightened</option></select>');
		GAME.interface.addText('Maze size (5 to 20, bigger is harder): <input type="number" id="mazeSize" value="10" min="5" max="20">');

		GAME.interface.drawButtons({text:'New game', buttonFunction:GAME.main.newGame.start});
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
			/*
			get data from menu
			if all input is ok
				SANITIZE PLAYER NAME FOR EVIL SCRIPTS
				use data to generate maze and create player
			else
				warn player
			*/
			
			var name = document.getElementById('charName').value.replace(/</, '&lt;');
			if(name == ''){
				name = 'Unnamed';
			}
			
			var gender = document.getElementById('sexType').value;
			
			var mazeType = Number(document.getElementById('mazeType').value);
			
			var mazeSize = Number(document.getElementById('mazeSize').value);
			
			
			GAME.interface.mazeArea.innerHTML = '';
			var x = drawMaze(GrowingTreeMazeGenerator(mazeSize, mazeSize, mazeType));
			GAME.player.reset();
			x[0][0].style.backgroundColor = 'red';
			GAME.interface.statContainers['lust'].updateValue(70);
		}
	}
};
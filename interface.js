'use strict';
var GAME = GAME || {};
GAME.interface = {
	classes:{},
	// If any of these are accessed before they're defined, that's a bug
	buttonArea:{},
	textArea:undefined,
	statArea:undefined,
		inventoryArea:undefined, // These are children
		mazeArea:undefined,
	
	header:undefined,
	footer:undefined,
	middle:undefined,
	statContainers:{ // These variables are merely suggestions, they should be the same as the player stats all the time but might not be
		lust:undefined,
		keys:undefined
	},




	addButton:function(text, buttonFunction, disabled){
		var button = document.createElement('button');
		button.innerHTML = text;
		button.disabled = disabled;
		button.addEventListener('click', buttonFunction);
		GAME.interface.buttonArea.appendChild(button);
		return button;
	},
	clearButtons:function(){
		GAME.interface.buttonArea.innerHTML = ""; // TODO: This VERY probably causes problems, the buttons have functions that aren't removed before killing the buttons. Alê, help plz
	},
	drawButtons:function(){
		// Modders, read this if you don't understand the lack of arguments: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
		for (var i = 0; i < arguments.length; i++) {
			GAME.interface.addButton(arguments[i].text, arguments[i].buttonFunction, arguments[i].disabled);
		};
	},
	addText:function(text){
		GAME.interface.textArea.innerHTML += ('<p>' + text + '</p>');
	},
	clearText:function(){
		GAME.interface.textArea.innerHTML = "";
	},
	clearTextAndButtons:function(){
		this.clearText();
		this.clearButtons();
	},
	updatePlayerStats:function(player){
		// Use the player argument whenever it's sent, this is so battles are easier, we can easily set up fantasy battles, etc.
		if (player == undefined){ // But if it's not sent, well, it must be the main player object.
			player = GAME.player;
		}
		this.statContainers.lust.updateValue(player.lust);
		this.statContainers.keys.updateValue(player.keys);
		GAME.interface.updateInterface();
	},

	addMeter:function(meter){
		GAME.interface.statArea.appendChild(meter.container);

		return meter;
	},
	setWindowSize:function(){
		requestAnimationFrame(function(){
			var availableSize = window.innerHeight - (GAME.interface.header.offsetHeight + GAME.interface.footer.offsetHeight);
			if(availableSize < 800){availableSize = 800;}
			GAME.interface.textArea.style.height = GAME.interface.statArea.style.height = GAME.interface.middle.style.height = availableSize + 'px';
		});
	},

	init:function(){
		// These are set inside a function called after the DOMContentLoaded event just in case the DOM isn't fully built by the time the JS runs. Better play it safe.
		GAME.interface.buttonArea = document.getElementById('navigationButtons');
		GAME.interface.textArea = document.getElementById('textArea');
		GAME.interface.statArea = document.getElementById('statArea');
		GAME.interface.header = document.getElementsByTagName('header')[0];
		GAME.interface.footer = document.getElementsByTagName('footer')[0];
		GAME.interface.middle = document.getElementsByClassName('middle')[0];

		GAME.interface.setWindowSize();
		window.addEventListener('resize', GAME.interface.setWindowSize);


		GAME.interface.statContainers['lust'] = GAME.interface.addMeter(new GAME.interface.classes.statBar("Lust"));
		GAME.interface.statContainers['keys'] = GAME.interface.addMeter(new GAME.interface.classes.meterlessStatBar("Keys remaining", "keys", true));
		
		
		GAME.interface.statArea.appendChild(document.createElement('hr'));
		GAME.interface.inventoryArea = document.createElement('div');
		GAME.interface.inventoryArea.className = 'statContainer';
		GAME.interface.inventoryArea.innerHTML = 'Inventory goes here';
		GAME.interface.statArea.appendChild(GAME.interface.inventoryArea);
		
		
		GAME.interface.statArea.appendChild(document.createElement('hr'));
		GAME.interface.mazeArea = document.createElement('div');
		GAME.interface.mazeArea.id = 'mazeArea';
		GAME.interface.statArea.appendChild(GAME.interface.mazeArea);
	},

	initWalkingButtons:function(){
		GAME.interface.buttonArea.north = GAME.interface.addButton('North', GAME.main.movement.north);
		GAME.interface.buttonArea.west = GAME.interface.addButton('West', GAME.main.movement.west);
		GAME.interface.buttonArea.south = GAME.interface.addButton('South', GAME.main.movement.south);
		GAME.interface.buttonArea.east = GAME.interface.addButton('East', GAME.main.movement.east);
	}
};

'use strict';
var GAME = GAME || {};

function Trap(random){
	this.init();
}

Trap.prototype.init = function(){
	this.type = 'trap';
	// TODO: filter by genitals the player does have
	this.data = trapList[randomIntFromInterval(0, trapList.length)];
}

Trap.prototype.activateTrap = function(){
	
}

/*
item = {
		name: unique string for each item
		displayName: String that will be displayed
		
		amount: integer, how many of these you have
		equippable: boolean
		if equippable is true these must be defined
			slot: one of the slot constants, see inventory.js
			release: "never", "onOrgasm" or an integer with the number of turns.
			slowsDownBy: integer, representing seconds to add to area change. Can be zero, obviously.
			equipped: boolean
			
			effectEachTurn: function
			effectOnEquip: function, mostly used to display text
			effectOnUnequip: function, mostly used to display text
			effectCannotEquip: function, used when you activate a trap but the slot is already in use
		else these must
			effectWhenUsed: function
	}
*/

var trapList = [
	{
		name:'test1',
		displayName:'Testing Item 1',
		amount:1,
		equippable:true,
		slot:LEGS,
		release:5,
		slowsDownBy:5,

		effectEachTurn:function(){
			GAME.interface.addText('leg trap 1 slows you down');
		},
		effectOnEquip:function(){GAME.interface.addText('got trap 1');},
		effectOnUnequip:function(){GAME.interface.addText('lost trap 1');},
		effectCannotEquip:function(){GAME.interface.addText('trap 1 wraps around your legs but it fails');}
	},
	{
		name:'test2',
		displayName:'Testing Item 2',
		amount:1,
		equippable:true,
		slot:ASSHOLE,
		release:'onOrgasm',
		slowsDownBy:1,

		effectEachTurn:function(){
			GAME.interface.addText('testing item 2 buzzes inside your tailhole');
			GAME.player.addLust(10);
		},
		effectOnEquip:function(){GAME.interface.addText('got trap 2');},
		effectOnUnequip:function(){GAME.interface.addText('lost trap 2');}
	},
	{
		name:'test3',
		displayName:'Testing Item 3',
		amount:1,
		equippable:true,
		slot:LEGS,
		release:5,
		slowsDownBy:10,

		effectEachTurn:function(){
			GAME.interface.addText('leg trap 3 slows you down a lot');
		},
		effectOnEquip:function(){GAME.interface.addText('got trap 3');},
		effectOnUnequip:function(){GAME.interface.addText('lost trap 3');},
		effectCannotEquip:function(){GAME.interface.addText('trap 3 wraps around your legs but it fails');}
	}
];
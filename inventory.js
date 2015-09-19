'use strict';
var GAME = GAME || {};

// Constants for the item slots, in powers of 2 because an item might occupy 2 or more slots
const HEAD = 1;
const FACE = 2;
const NECK = 4;
const CHEST = 8;
const ARMS = 16;
const WRISTS = 32;
const BELLY = 64;
const HIPS = 128;
const LEGS = 256;
const FEET = 512;
const BREASTS = 1024;
const PENIS = 2048;
const SHEATH = 4096; // What if the player is, say, a dragon with a slit... Hmm.
const VAGINA = 8192;
const ASSHOLE = 16384;


GAME.inventory = {
	items:[],
	
	/*
	item = {
		name: unique string for each item
		displayName: String that will be displayed
		
		equippable: boolean
		if equippable is true these must be defined
			slot: one of the slot constants, see inventory.js
			release: "never", "onOrgasm" or an integer with the number of turns.
			slowsDownBy: integer, representing seconds to add to area change. Can be zero, obviously.
			equipped: boolean
			
			effectEachTurn: function
			effectOnEquip: function, mostly used to display text
			effectOnUnequip: function, mostly used to display text
		else these must
			effectWhenUsed: function
			amount: integer, how many of these you have
	}
	*/
	
	addItem:function(item){
		/*
		if item is in inventory
			update amount
		else
			add item to list
		*/
		var itemPosition = GAME.inventory.findItem(item);
		if(itemPosition != -1){
			GAME.inventory.items[itemPosition].amount += 1;
		}else{
			GAME.inventory.items.push(item);
		}
	},
	removeItem:function(){
		/*
		if item is in inventory
			update amount
			if amount is zero
				remove item
		else
			panic
		*/
		var itemPosition = GAME.inventory.findItem(item);
		if(itemPosition != -1){
			GAME.inventory.items[itemPosition].amount -= 1;
			if(GAME.inventory.items[itemPosition].amount == 0){
				GAME.inventory.items.splice(itemPosition, 1);
			}
		}else{
			alert("Tried to remove an item, but item wasn't in inventory, I will now panic");
		}
	},
	updateInterface:function(){
		/*
		clean interface
		init list
		for each item
			if item is equippable
				if item is equipped
					add text relative to release
			else
				add amount
		close list
		*/
		GAME.interface.inventoryArea.innerHTML = "Inventory:";
		
		var list = document.createElement('ul');
		for(var i = 0; i < GAME.inventory.items.length; i++){
			var item = document.createElement('li');
			item.innerHTML = GAME.inventory.items[i].displayName;
			if(GAME.inventory.items[i].equippable){
				if(GAME.inventory.items[i].release){
					switch(){
						case "never":
							item.innerHTML += " (Never releases)";
							break;
						case "onOrgasm":
							item.innerHTML += " (Releases on orgasm)";
							break;
						default:
							item.innerHTML += " (Releases in "+GAME.inventory.items[i].release+" turns)";
							break;
					}
				}
			}else{
				item.innerHTML += " x "+GAME.inventory.items[i].amount;
			}
			
			list.appendChild(item);
		}
		
		GAME.interface.inventoryArea.appendChild(list);
	},
	
	/*
	Finds an item and returns its index or -1 on failure.
	Yeah, ECMAScript 6 has a findIndex function, but some browsers don't support it yet
	
	@param item: item object
	@param property: property name to test for, default is 'name'
	@return item index, -1 on failure
	*/
	findItem:function(item, property){
		if(property == undefined){property = 'name';}
		
		for (var i = GAME.inventory.items.length - 1; i >= 0; i--){
			if(GAME.inventory.items[i][property] == item[property]){
				return i;
			}
		}
		return -1;
	},
	isSlotFree:function(){
		for (var i = GAME.inventory.items.length - 1; i >= 0; i--){
			if(GAME.inventory.items[i].slot == item.slot){
				return i;
			}
		}
		return -1;
	}
	
	canEquipItem:function(item){
		
		/*
		if there's no item in the slot and the player has the necessary slot
		*/
		if(GAME.inventory.findItem(item, 'slot')){}
	},
	equipItem:function(){
		
	},
	unequipItem:function(){
		
	}
}
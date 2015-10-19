'use strict';
var GAME = GAME || {};

const MALE = 1;
const FEMALE = 2;
const HERM = 4;
const SHEMALE = 8;
const CUNTBOY = 16;

// So the text generation can figure out if the strings can be used for a bound character
const NEEDS_VOICE = 256;
const NEEDS_STANDING = 512;
const NEEDS_HANDS = 1024;

GAME.player = {
	
	lust:0,
	keys:0,
	x:undefined,
	y:undefined,

	// These are used to restore the original color to the cell whenever the player walks on it
	previousX:undefined,
	previousY:undefined,
	previousColor:undefined,

	addLust:function(toAdd){
		this.lust += toAdd;
		if(this.lust >= 100){
			this.orgasm();
		}
	},

	orgasm:function(){
		this.generateOrgasmText();
		GAME.inventory.removeOnOrgasmItems();
		this.lust = 10; // TODO: test a good value
	},

	reset:function(){
		this.lust = 0;
		this.keys = 0;
		this.equipmentSlots = 0;
		this.name = "";
		this.x = undefined;
		this.y = undefined;
		this.gender = 0;
	},
	
	init:function(name, gender){
		this.name = name;
		
		this.gender = gender;
		this.equipmentSlots = BASEBODY + this.getGenderParts(gender);
	},

	getGenderParts:function(gender){
		switch(Number(gender)){
			case MALE:
				return PENIS + SHEATH;
			case FEMALE:
				return BREASTS + VAGINA;
			case HERM:
				return BREASTS + VAGINA + PENIS + SHEATH;
			case SHEMALE:
				return BREASTS + PENIS + SHEATH;
			case CUNTBOY:
				return VAGINA;
			default:
				alert('TRIED TO GET GENDER PARTS OF THE PLAYER BUT GOT AN INVALID GENDER TYPE THE GAME WILL NOW BREAK');
		}
	},

	placeAt:function(x, y){
		if((x < 0 || x >= GAME.main.mazeSize) || (y < 0 || y >= GAME.main.mazeSize)){
			alert(sprintf('Player tried to go outside the map! X: %i Y: %i, mazeSize: %i', x, y, GAME.main.mazeSize));
		}else{
			this.x = x;
			this.y = y;
		}
	},
	
	texts:{
		filterList:function(listName, flagsPlayerHas, playerGender){
			return this[listName].filter(
					function(elem){
						// If flagsNeeded contains the flagsPLayerHas && player is one of the genders allowed
						return ((elem.flagsNeeded & flagsPlayerHas) === flagsPlayerHas) && ((elem.gendersAllowed & playerGender) != 0);
					}
				);
		},
		generateOrgasmText:function(){ // TODO
			var text = '';
			
			return 'test: i came';

			/*
			watch out for ballgags and other speech impediments
			scenes must account for all possible variants of genitals (insert blocks of text?)
			account for items on those parts too
			Tag scenes as requiring arms / paws / what else free?
			account for being on all fours

			TODO: Think if being blindfolded could affect some descriptions

			---------------
			get an initial description
			get an orgasm description
			get a final description

			get a x description:
				get player state
					can voice
					can stand
					can manipulate
					is one of the allowed genders
				based on that, filter lists
				get random one

			

			*/
		},
		initialTexts:[
			{
				text:"You can't take it anymore. You fall to your knees and stroke your cock, desperate to end your torment.",
				gendersAllowed: MALE + HERM + SHEMALE,
				flagsNeeded: NEEDS_HANDS + NEEDS_STANDING + NEEDS_VOICE
			}
		]
	}
};

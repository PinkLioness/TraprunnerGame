'use strict';
var GAME = GAME || {};
GAME.player = {
	
	lust:0,
	keys:0,
	
	
	trapsGotten:[],

	

	reset:function(){
		this.lust = 0;
		this.keys = 0;
		this.trapsGotten = [];
	},
	
	changeLustToAfterOrgasm:function(){ // Maybe we'll use this one, we'll see
		this.lust = 20; // TODO: Think more on this, probably perks to change this value.
	},
	texts:{
		generateOrgasmText:function(){ // TODO
			var baseTexts = ['You let off a long, pleased moan, as ', 'You scream in bliss, the sensations moving your body as ', ];
			var text = '';
			if(this.hasPenis){
				;
			}
		}
	}
};

'use strict';
var GAME = GAME || {};
GAME.p = {
	// Battle stats
	// strength, dexterity, intelligence, wisdom, speed, constitution, sexuality, luck
	health:100,
	stats:{
		strength:10,
		dexterity:10,
		intelligence:10,
		wisdom:10,
		speed:10,
		constitution:10,
		sexuality:10,
		luck:10
	},
	updateStat:function(statName, newValue){
		if (this.stats[statName] != undefined){
			this.stats[statName] = newValue;
			GAME.interface.updatePlayerStats();
		}else{
			alert(sprintf('Tried to update stat %s which does not exist!', statName));
		}
	},

	// Misc stats
	tired:0,
	cash:300,

	// Porn stats
	cumInside:{vagina:0, ass:0},
	cumLimit:1500,
	vaginalCumLimit:500,
	soreness:{vagina:0, ass:0},
	basePregnancyRate:1,
	addiction:0,
	lust:0,
	currentlyInHeat:false,
	canGetPregnantFrom:{vagina:true, ass:false},

	// Porn functions
	canGetPregnant:function(){return this.canGetPregnantFrom.ass || this.canGetPregnantFrom.vagina;},
	startPregnancy:function(){/* TODO */},
	/**
	* Does all the math for the fucking (or passes it ahead), then:
	* 1- Applies special effects for the monster
	* 2- Should not apply the special effect of the scene? TODO: figure this out
	* 3- This is where the stretching is calculated, YET this is not where the skill should increase TODO: figure this out too
	*
	* @param partner - the monster OBJECT (can't emphasize this enough), probably will always be GAME.currentMonster outside of special events and post-defeat rape
	* @param where - a string, either 'vagina' or 'ass'. Validated, panics out if not one of these and proceeds to assume the ass TODO: Will the player ALWAYS have an ass? Might change it to assume mouth later?
	*
	* @ TODO: Figure out where in the code structure this needs to be passed to and adapt it
	* @ TODO: Figure out a more unique name (tentatively, simulateSex?) for it to make it easier for those who don't know the code to ctrl+f for it
	*/
	doSex:function(partner, where){
		// validating the where parameter
		if (!(where === 'ass' || where === 'vagina')){
			alert("BUG ALERT! READ EVERYTHING IN CAPS CAREFULLY! Some piece of bad code (bad, bad code, no treat for you) told the monster to fuck you somewhere that wasn't the ass or the vagina! Assuming they meant your ass, if you don't have an asshole THE GAME MIGHT BREAK SO DO NOT OVERWRITE YOUR SAVE AND REPORT THIS AS SOON AS POSSIBLE!");
			where = 'ass';
		};
		
		var p = this;
		partner.generateNew(); // DEBUG
		var ifCame = false;
		// text
		// change p
		// ???
		
		p.addLust(1);
		if (p.lust > 100) { // if player came TODO: Make this a function, maybe? If there's need to use it in more than one place, then yes
			p.changeLustToAfterOrgasm(); // some lust remains, only when you sleep with some toys it goes back to 0 // TODO: Is this a good idea? Sounds good on paper, needs testing.
			ifCame = true;
			
			p.addAddiction(5);
			p.addTired(-3);
			
			GAME.interface.addText(p.texts.generateOrgasmText());
		};
		
		
		
		//p.cash += p.applyCashUpgrades(((p.inHeat()) ? (cash * 2) : cash)); // double cash in heat
		
		
		// Filling player up and checking for overflow
		
		// TODO: Pass these calculations to a function? If for some reason there's need to use it in more than one place, then yes, otherwise we're trading code understandability for cleanliness and i kinda prefer the first
		// TODO: Better math for gameplay reasons? At the moment your average feral wolf cums between 8 and 20ml, and the player can take 500ml, this means 500/14 = ~38 fucks to get completely filled, this would make the game VERY repetitive.
		var cumAmount = 0;
		cumAmount += ((p.ifCame) ? (partner.ballsize * 5) : (partner.ballsize * 4)); // extra cum if player came
		cumAmount += ((p.inHeat()) ? (partner.ballsize * 2) : 0) // extra cum in heat
		cumAmount = p.applyCumUpgrades(cumAmount); // apply upgrades that affect cum
		
		p.addCum(where, cumAmount, partner.uniqueName);
		
		//////////////////////////////////////////////////////////////
		// soreness // TODO: PASS THESE TO SKILL-INCREASE-RELATED FUNCTIONS
		var sorenessBase = (where == 'vagina') ? 0.2 : 0.3; // more soreness if taking it in the ass
		sorenessBase -= (p.inHeat()) ? 0.1 : 0; // Less soreness during heat
		p.soreness[where] += sorenessBase * partner.dicksize; 
		//////////////////////////////////////////////////////////////
		
		
		
		
		//////////////////////////////////////////////////////////////
		// pregnancy
		if (p.canGetPregnantFrom[where] && p.inHeat()){
			var addedChance = Math.floor(p.cumInside[where].amount / 10);
			if (randomBetween(0, 100) < (p.basePregnancyRate + addedChance)){
				p.startPregnancy(partner, where);
			};
		};
		//////////////////////////////////////////////////////////////
		
		
		
		
		
		//////////////////////////////////////////////////////////////
		// tiredness // TODO: pass this to adventure code to treat cases like running away
		p.addTired(1);
		//////////////////////////////////////////////////////////////
		
		this = p;
		console.log(this); // DEBUG
	},

	// TF stats
	hasVagina:true,
	hasBreasts:true, // TODO: Think on a structure for breast size. TODO: Think on what breast size should do, possibly serve to train strength, constitution and dexterity faster while lowering dexterity and strength while they're big
	hasPenis:true,

	reset:function(){
		this.cumInside ={vagina:{amount:0, type:''},
						 ass:{amount:0, type:''}
						};
		this.cumLimit = 1500;
		this.vaginalCumLimit = 500;
		this.soreness = {vagina:0, ass:0};
		this.basePregnancyRate = 1;
		this.addiction = 0;
		this.canGetPregnantFrom = {vagina:true, ass:false};
		this.hasVagina = true;
		this.hasBreasts = true;
		this.hasPenis = true;

		for (var i = this.upgrades.length - 1; i >= 0; i--) {
			this.upgrades[i].bought = false;
		};
	},
	upgrades:[
	// TODO: Move all upgrades from here to the upgrade shop whenever it's done
	// TODO: Think on more of these
	// TODO: Think more on the structure of each upgrade:
	/* 1- An onlyIf parameter is needed, for male-only items, only if breasts/dick are bigger than a certain size, etc etc. The best way is to probably make it be a function?
	 * 2- Maybe a better way to define what each upgrade affects? Events would make this VERY easy on the modders, not so much for the main coders
	 * 3- Maybe a timer, as some only work for some time?
	 */
		{
			fancyName:"MPreg",
			description:"Allows you to get pregnant from your ass, and allows men to get in heat for extra cum.",
			affectsCash:false,
			affectsCum:false,
			onPurchase:function(){GAME.p.canGetPregnantFrom.ass = true;},
			onSex:doesNothing,
			bought:false,
			price:50,
			onlyIf:function(){return !GAME.p.canGetPregnantFrom.ass;}
		},
		
		{
			fancyName:"Size Queen",
			affectsCash:false,
			affectsCum:false,
			onPurchase:function(){ 
				alert('HOW THE FUCK DO I PATCH THIS IN OMG'); // TODO: figure this out, more probably give up because this doesn't really makes sense, though if it doesn't makes much sense might as well add it to a possible mode in the cheat mode?
				// Dica do alê: fazer um GAME.events.monsterGenerated.dispatch() e capturar ele, praí aumentar o bixo
			},
			onSex:doesNothing,
			bought:false,
			price:50
		},
		
		{
			fancyName:"Birth control",
			affectsCash:false,
			affectsCum:false,
			onPurchase:function(){GAME.p.canGetPregnantFrom.vagina = false; // TODO: Add a timer to this one if it's decided to do so
								  GAME.p.canGetPregnantFrom.ass = false;},
			onSex:doesNothing,
			bought:false,
			price:50,
			onlyIf:function(){return GAME.p.canGetPregnant();}
		}
	],
	applyCashUpgrades:function(cash){
		for (var i = 0; i < this.upgrades.length; i++) {
			if (this.upgrades[i].bought && this.upgrades[i].affectsCash) {
				cash = this.upgrades[i].does(cash);
			};
		};
		
		return cash;
	},
	applyCumUpgrades:function(cum){
		for (var i = 0; i < this.upgrades.length; i++) {
			if (this.upgrades[i].bought && this.upgrades[i].affectsCum) {
				cum = this.upgrades[i].does(cum);
			};
		};
		
		return cum;
	},
	applyLustUpgrades:function(lust){
		for (var i = 0; i < this.upgrades.length; i++) {
			if (this.upgrades[i].bought && this.upgrades[i].affectsLust) {
				lust = this.upgrades[i].does(lust);
			};
		};
		
		return lust;
	},
	applyAddictionUpgrades:function(addiction){
		for (var i = 0; i < this.upgrades.length; i++) {
			if (this.upgrades[i].bought && this.upgrades[i].affectsLust) {
				addiction = this.upgrades[i].does(addiction);
			};
		};
		
		return addiction;
	},
	applyTiredUpgrades:function(tired){
		for (var i = 0; i < this.upgrades.length; i++) {
			if (this.upgrades[i].bought && this.upgrades[i].affectsLust) {
				tired = this.upgrades[i].does(tired);
			};
		};
		
		return tired;
	},
	treatOverflow:function(where){
		if (where == 'vagina'){
			if (this.cumInside.vagina.amount > this.vaginalCumLimit){
				var overflow = (this.cumInside.vagina.amount - this.vaginalCumLimit);
				
				this.soreness.vagina.amount += overflow / 10; // extra pain because overfilling
				
				// reset amount of cum to limit
				this.cumInside.vagina.amount = this.vaginalCumLimit;
				
				// increase limits a bit after resetting // TODO: PASS THESE TO SKILL-INCREASE-RELATED FUNCTIONS
				this.vaginalCumLimit += overflow / 10;
				this.cumLimit += overflow / 10;
				
				
				// text about leaking from vagina
			};
			
			if ((this.cumInside.ass.amount + this.cumInside.vagina.amount) > this.cumLimit){
				var overflow = (this.cumInside.ass.amount + this.cumInside.vagina.amount) - this.cumLimit;
				this.cumLimit += overflow / 10; // increase limit a little bit // TODO: PASS THESE TO SKILL-INCREASE-RELATED FUNCTIONS
				
				this.cumInside.ass.amount -= overflow;
				
				// text about leaking from ass
			};
		}else{
			if ((pthis.cumInside.ass.amount + this.cumInside.vagina.amount) > this.cumLimit){
				var overflow = (this.cumInside.ass.amount + this.cumInside.vagina.amount) - this.cumLimit;
				this.soreness.ass += overflow / 10; // extra pain because overfilling
				this.cumLimit += overflow / 10; // increase limit a little bit // TODO: PASS THESE TO SKILL-INCREASE-RELATED FUNCTIONS
				
				this.cumInside.ass.amount -= overflow;
				
				// text about leaking from ass
			};
		};
	},
	inHeat:function(){
		// Technically I could make everything access that variable instead, but since the point is ease of modification instead of performance...
		return this.currentlyInHeat;
	},
	/*
	 *
	 *
	 *
	 *
	 */
	addLust:function(times){
		var lustToBeAdded = times * 10; // TODO: Test in gameplay if this works.
		lustToBeAdded = this.applyLustUpgrades(lustToBeAdded);
		
		this.lust += lustToBeAdded;
	},
	addAddiction:function(value){
		value = this.applyAddictionUpgrades(value);
		
		this.addiction += value;
	},
	addTired:function(value){
		value = this.applyTiredUpgrades(value);
		
		this.tired += value;
		
		// Negative values may be passed so we must check for negative tiredness
		if (this.tired < 0){this.tired = 0;};
	},
	addCum:function(where, cumAmount, monsterType){
		this.cumInside[where].amount += cumAmount; // add cum
		
		if(this.cumInside[where].type == ''){ // if nothing is there
			this.cumInside[where].type = monsterType; // then the cum type in that hole is the monster's type.
		}else if(this.cumInside[where].type != monsterType){ // If the type being added is different than the type that's already there
			this.cumInside[where].type = 'mixed'; // The type becomes mixed
		}
		
		this.treatOverflow(where);
	},
	changeLustToAfterOrgasm:function(){
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
	},

	//////////////////////////////
	// Battle data and functions
	skills:[
		{
			name: 'Attack',
			canUse: true,
			attackType: 'physical',
			element: 'physical',
			attacksStat: 'health',
			strength:{used:true, min:0, max:0},
			dexterity:{used:true, min:0, max:0},
			intelligence:{used:true, min:0, max:0},
			wisdom:{used:true, min:0, max:0},
			speed:{used:true, min:0, max:0},
			constitution:{used:true, min:0, max:0},
			sexuality:{used:true, min:0, max:0},
		},
		{
			name: 'Fireball',
			canUse: true,
			attackType: 'magical',
			element: 'fire',
			attacksStat: 'health',
			strength:{used:true, min:0, max:0},
			dexterity:{used:true, min:0, max:0},
			intelligence:{used:true, min:0, max:0},
			wisdom:{used:true, min:0, max:0},
			speed:{used:true, min:0, max:0},
			constitution:{used:true, min:0, max:0},
			sexuality:{used:true, min:0, max:0},
		}
	],

	// TODO: Implement formulas:
	/*
	Formula for magical attack power: AP = total equipment AP + 0-5% dexterity + 0-25% intelligence + 0-20% wisdom + luck formula
	Formula for defense power: AP = total equipment defense power + 0-10% dex + 0-10% int + 0-10% wis + 10-20% const + luck formula */

	getPhysicalAttackPower:function(){
		// Formula for physical attack power: AP = total equipment attack power + 0-25% strenght + 0-5% dexterity + 0-20% wisdom + luck formula
		var equipmentPower
		return 10;
	},

	getMagicalAttackPower:function(){
		// TODO: Add all equipment and upgrades
		return 5;
	},

	getUpgradedStatValue:function(statType){
		var equipment = this.getCurrentEquipment();
		var statValue = this.stats[statType];

		for (var i = 0; i < equipment.length; i++) {
			if (equipment[i].affects[statType]){
				statValue = equipment[i].applyStatModifier(statType, statValue);
			}
		}
	},

	// These getters might seem 
	getStrength:function(){return this.getUpgradedStatValue('strength');},
	getDexterity:function(){return this.getUpgradedStatValue('dexterity');},
	getIntelligence:function(){return this.getUpgradedStatValue('intelligence');},
	getWisdom:function(){return this.getUpgradedStatValue('wisdom');},
	getSpeed:function(){return this.getUpgradedStatValue('speed');},
	getConstitution:function(){return this.getUpgradedStatValue('constitution');},
	getSexuality:function(){return this.getUpgradedStatValue('sexuality');}
};

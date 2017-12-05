var helpers = {};
helpers.setRandom = function(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function Viking (name, health, strength) {
	this.name = name || "Superviking " + helpers.setRandom(0,1000);
	this.health = health || helpers.setRandom(20,30);
	this.strength = strength || helpers.setRandom(6,8);
	this.block = helpers.setRandom(2,4);
	this.dodge = helpers.setRandom(4,6);
}

function Saxon () {
	this.health = helpers.setRandom(10,15);
	this.strength = helpers.setRandom(2,4);
	this.block = helpers.setRandom(1,2);
	this.dodge = helpers.setRandom(0,3);
}

function Pit(viking1, viking2, turns) {
	this.viking1 = viking1;
	this.viking2 = viking2;
	this.turns = turns || helpers.setRandom(5,8);
}

function War(vikingArmy, saxonArmy, turns) {
	this.vikingArmy = vikingArmy;
	this.saxonArmy = saxonArmy;
	this.turns = turns || helpers.setRandom(5,8);
}

function Weapon (name, attackBonus, blockBonus) {
	this.name = name;
	this.attackBonus = attackBonus;
	this.blockBonus = blockBonus;
}

function createArmy(UnitType, number, weapons) {
	var army = [];
	var unit;

	for (var i = 0; i < number; i++) {
		unit = new UnitType();
		unit.weapon = weapons[helpers.setRandom(0, weapons.length - 1)];
		army.push(unit);
	}
	return army;
}

Viking.prototype.hit = function (enemy) {
	var hitDamage = helpers.setRandom(Math.floor(this.strength/2), this.strength);
	if(this.weapon) {
		hitDamage += this.weapon.attackBonus;
	}
	enemy.reciveDamage(hitDamage);
}

Viking.prototype.reciveDamage = function (damage) {
	var blockBonus = this.weapon ? this.weapon.blockBonus : 0;
	var block = (this.block + blockBonus) > helpers.setRandom(1,100);
	var dodge = this.dodge > helpers.setRandom(1,100);

	if(!block && !dodge) {
		this.health -= damage;
	}
}

Saxon.prototype = Viking.prototype;

Pit.prototype.fight = function () {
	var minHealth = 10;
	pit.pitStatus();
	while(this.turns > 0 && viking1.health > minHealth && viking2.health > minHealth) {
		viking1.hit(viking2);
		console.log(viking1.name + " has hitten " + viking2.name + " with a strength of " + viking1.strength);
		viking2.hit(viking1);
		console.log(viking2.name + " has hitten " + viking1.name + " with a strength of " + viking2.strength);
		this.turns--;
	}
	pit.showWinner();
}

Pit.prototype.showWinner = function () {

	if(viking1.health == viking2.health) {
		console.log("¡"+viking1.name + " and " + viking2.name + " has draw!");
	} else if (viking1.health > viking2.health) {
		this.winner = viking1.name;
		console.log("¡The winner is " + this.winner + "!");
	} else {
		this.winner = viking2.name;
		console.log("¡The winner is " + this.winner + "!");
	}
	pit.pitStatus();
}

Pit.prototype.pitStatus = function () {
	console.log(viking1.name + " health > " + viking1.health);
	console.log(viking2.name + " health > " + viking2.health);
}

War.prototype.killThemAll = function () {
	var viking, saxon, i = 0;
	var armiesAlive = true;
	var self = this;

	while(i < this.turns && armiesAlive) {
		this.vikingArmy.forEach(function(viking) {
			saxon = self.saxonArmy[helpers.setRandom(0, self.saxonArmy.length - 1)];
			viking.hit(saxon);
		})
		this.saxonArmy.forEach(function(saxon) {
			viking = self.vikingArmy[helpers.setRandom(0, self.vikingArmy.length - 1)];
			saxon.hit(viking);
		})
		this.vikingArmy = this.vikingArmy.filter(function (viking) {
			return viking.health > 0;
		})
		this.saxonArmy = this.saxonArmy.filter(function (saxon) {
			return saxon.health > 0;
		})
		armiesAlive = this.vikingArmy.length > 0 && this.saxonArmy.length > 0;
		i++;
	}
	this.winner = this.vikingArmy.length > this.saxonArmy.length ? "Vikings" : "Saxons";
	this.turns = i;
}

War.prototype.showWinner = function () {
	// CONDICIONES DE EMPATAR
	console.log("¡The winner is " + this.winner + "!");
	console.log("The turns were: " + this.turns);
	console.log("Vikings Alive: " + this.vikingArmy.length);
	console.log("Saxons Alive: " + this.saxonArmy.length);
}

/*var viking1 = new Viking ("Asterix");
var viking2 = new Viking ("Obelix");
var pit = new Pit(viking1, viking2, 8);
pit.fight();*/

var vikingWeapons = [ new Weapon("Combat Axe", 5, 3), 
				 	  new Weapon("Mace", 7, 1),
				      new Weapon("Long Sword", 3, 4)];

var saxonWeapons = [ new Weapon("Staff", 1, 0), 
				 	 new Weapon("Hummer", 2, 1),
				     new Weapon("Wood Shield", 1, 3)];				      

var vikingArmy = createArmy(Viking, 200, vikingWeapons);
var saxonArmy = createArmy(Saxon, 525, saxonWeapons);
var war = new War(vikingArmy, saxonArmy, 10);
war.killThemAll();
war.showWinner();

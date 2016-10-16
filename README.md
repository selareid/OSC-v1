# New Screeps Code

### I'm not gonna put any info here incase someone finds my code and tries to find flaws in it, good luck trying to figure out how my code works

## TODO:
* Fix remoteCreeps
* Put ally checks in creep.attack and creep.ranged_attack
* Implement automatic road creation
* Have scouts that go out into the world and save data into memory and use that data to decide on rooms to remoteMine etc.
* and more.

## Some code for later use

* put on hauler code so they repair roads under them
let underMe = creep.pos.lookFor(LOOK_STRUCTURES);
underMe = underMe.filter(function (obj) {
	return obj.hits < obj.hitsMax
});
if (underMe.length > 0) {
	let res = creep.repair(underMe[0]);
}

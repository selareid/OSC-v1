# New Screeps Code


### I'm not gonna put any info here incase someone finds my code and tries to find flaws in it, good luck trying to figure out how my code works

## TODO:
* Made energyThief have work part and become defenceManager when there's no flag for it
* Add 2 more spawn queues: 'war' and 'priority'
* Add nuke defensive mode to wallRepairers and as an energy mode
* Fix/Test remoteCreeps
* Implement automatic road creation
* Have scouts that go out into the world and save data into memory and use that data to decide on rooms to remoteMine etc.
* and more.

## Some code for later use

* Find value in array equal to something and
Array.indexOfsomething);
Array.splice(index);
* Useful https://lodash.com/docs/3.10.1#pull
* For when i get to making my creeps say things more
let words = 'dont mind me just passing through ...'.split(' ');
let word = words[Game.time % words.length];
creep.say(word, 1);
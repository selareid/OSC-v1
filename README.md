# New Screeps Code


### I'm not gonna put any info here incase someone finds my code and tries to find flaws in it, good luck trying to figure out how my code works

## TODO:
* Make energy thiefs work with storage
* Make energy wasting mode
* Add energy defense mode and creep mode etc.
* Add nuke defensive mode to wallRepairers and as an energy mode
* Have scouts that go out into the world and save data into memory and use that data to decide on rooms to remoteMine etc.
* and more.

## Some code for later use

* Find value in array equal to something and
`Array.indexOf(something);`
`Array.splice(index);`
* Useful https://lodash.com/docs/3.10.1#pull
* For when i get to making my creeps say things more
`let words = 'dont mind me just passing through ...'.split(' ');`
`let word = words[Game.time % words.length];`
`creep.say(word, 1);`
*"Push" creeps out of the way Needs Editing:
`this.creep.say("pardon me");`
`occupyingCreep.say("sorry");`
`this.creep.move(this.creep.pos.getDirectionTo(occupyingCreep));`
`occupyingCreep.move(occupyingCreep.pos.getDirectionTo(this.creep))`
*Teaching `room.find` to accept an array of things to look for:
``let find = Room.prototype.find;
 Room.prototype.find = function(c, opt) {
     if(_.isArray(c)) {
         return _(c)
                 .map(x => find.call(this,x,opt))
                 .flatten()
                 .value();
     } else
         return find.apply(this, arguments);
 }``
*With that snippet you can call room find the normal way, or like so: `room.find([FIND_MY_CREEPS, FIND_MY_STRUCTURES])` and it'll return a single array with both.
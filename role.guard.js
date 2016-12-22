module.exports = {
    run: function (room, creep) {
        PathFinder.use(true);

        if (Memory.rooms[room].isUnderAttack == true) {
            var target = this.getTarget(room, creep);
            if (target) {
                var attackResult = creep.rangedAttack(target);

                switch (attackResult) {
                    case -9: // returns ERR_NOT_IN_RANGE
                        creep.moveTo(target, {reusePath: 3, ignoreRoads: true});
                        break;
                    case 0: // returns OK
                        this.kite(room, creep, target);
                        //creep.say something here using prototype.creepSpeech.js
                        break;
                    default:
                        console.log('Error with creep: ' + creep.name + '' + ' Attack Error: ' + attackResult);
                }

            }
        }
        else {
            creep.moveTo(global[room.name].guardStationFlag);
        }

    },

    getTarget: function (room, creep) {
        var targets = _.filter(global[room.name].creepsNotMine, (c) => global.Allies.includes(c.owner.username) == false);

        if (targets.length > 0) {
            return creep.pos.findClosestByRange(targets);
        }
        else {
            Memory.rooms[room].isUnderAttack = false;
            return;
        }
    },

    kite: function (room, creep, target) {
        var directionToTarget = creep.pos.getDirectionTo(target);
        if (creep.pos.getRangeTo(target) <= 2) {
            creep.move(global.REVERSE_DIR[directionToTarget]);
        }
        else {
            creep.move(directionToTarget);
        }
    }
};


/*
*Notes:
* global[room.name].guardStationFlag for guard station flag
* global[this.name].creepsNotMine to get hostile creeps in room (includes allies)
* Memory.rooms[room].isUnderAttack
* global.Allies
*/

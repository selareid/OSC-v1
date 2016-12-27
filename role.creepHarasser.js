require('prototype.creepSpeech')();

module.exports = {
    run: function (room, creep) {
        PathFinder.use(true);

        if (creep.memory.team) {
            var teamGlobal = global['warCache'][creep.memory.team];
            if (teamGlobal) {
                var timeToAttack = teamGlobal.timeToAttack;
                if (timeToAttack != undefined && timeToAttack != null) {
                    if (Game.time >= timeToAttack) {
                        var targetFlag = teamGlobal.flag;
                        var targetRoom = teamGlobal.targetRoom;
                        if (targetRoom) {

                            if (creep.pos.roomName != targetRoom) {
                                creep.moveTo(targetFlag)
                            }
                            else {
                                var targetCreep = this.getTargetCreep(creep);
                                if (targetCreep) {
                                    var attackCreepResult = creep.attack(targetCreep);

                                    switch (attackCreepResult) {
                                        case -9: // returns ERR_NOT_IN_RANGE
                                            creep.moveTo(targetCreep, {reusePath: 3, ignoreRoads: true});
                                            break;
                                        case 0: // returns OK
                                            //creep.say something here using prototype.creepSpeech.js
                                            break;
                                        default:
                                            console.log('Error with creep: ' + creep.name + '' + ' Attack Error: ' + attackCreepResult);
                                    }

                                    this.rangedHandler(creep, targetCreep);


                                }
                                else {
                                    //maybe add a role changing mechanic here ?
                                }
                            }

                        }
                    }
                    else {
                        var timeToRally = Game.time >= teamGlobal.timeToAttack;
                        if (timeToRally != undefined && timeToRally != null) {
                            if (Game.time >= timeToRally) {
                                var rallyFlag = teamGlobal.rallyFlag;
                                if (rallyFlag) {
                                    creep.moveTo(rallyFlag, {ignoreRoads: true});
                                }
                                else {
                                    // something here
                                    creep.moveTo(global[room.name].guardStationFlag);
                                }
                            }
                            else {
                                creep.moveTo(global[room.name].guardStationFlag);
                            }
                        }
                    }
                }
            }
        }
        else {
            console.log('creepHarasser creep ' + creep.name + ' needs a team');
            creep.moveTo(global[room.name].guardStationFlag);
        }

    },

    rangedHandler: function (creep, targetCreep) {
        if (targetCreep) {
            creep.rangedAttack(targetCreep);
        }
    },

    getTargetCreep: function (creep) {
        creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3, {filter: (c) => !global.Allies.includes(c.owner.username)});
    }
};


/*
*Notes:
* global['warCache'] war Cache
* global[room.name].guardStationFlag for guard station flag
* global[this.name].creepsNotMine to get hostile creeps in room (includes allies)
* global.Allies
*/

require('global');
require('prototype.creep');

module.exports = {
    run: function (room, creep, remoteFlag) {

        creep.say('hauler remote');

        if (creep.memory.goingHome === true && creep.carry.energy == 0) {
            creep.memory.goingHome = false;
        }
        else if (creep.memory.goingHome === false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.goingHome = true;
        }

        if (creep.memory.goingHome === true) {
            if (creep.pos.roomName != creep.memory.room) {

                let underMe = creep.pos.findInRange(FIND_STRUCTURES, 1);
                underMe = underMe.filter(function (obj) {
                    return obj.hits < obj.hitsMax
                });
                if (underMe.length > 0) {
                    let res = creep.repair(underMe[0]);
                    if (res === OK) {
                        creep.say('REPAIR!!!', true);
                    }
                    else {
                        creep.say('REPAIR ERR', true);
                    }

                }
                else {
                    var constructionSitesInRange = creep.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 3);
                    if (constructionSitesInRange.length > 0) {
                        var buildTarget = creep.pos.findClosestByRange(constructionSitesInRange);
                        creep.build(buildTarget);
                    }
                    else {
                        creep.moveTo(Game.rooms[creep.memory.room].find(FIND_MY_SPAWNS)[0], {reusePath: 10});
                        if (!creep.pos.look(LOOK_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_ROAD})[0]) {
                            creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
                        }
                    }
                }
            }
            else {
                if (room.storage) {
                    if (_.sum(room.storage.store) >= room.storage.store) {
                        creep.drop(RESOURCE_ENERGY);
                    }
                    else {
                        if (creep.transfer(room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(room.storage);
                            if (!creep.pos.look(LOOK_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_ROAD})[0]) {
                                creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
                            }
                        }
                    }
                }
            }
        }
        else {
            if (creep.pos.roomName != remoteFlag.pos.roomName) {
                creep.moveTo(remoteFlag.pos, {reusePath: 20});
            }
            else {

                var droppedEnergy = creep.findDroppedEnergy(remoteFlag.room);

                if (droppedEnergy) {
                    if (creep.pickup(droppedEnergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(droppedEnergy, {reusePath: 10});
                    }
                }
                else {
                    var container = creep.findContainer(remoteFlag.room);

                    if (container) {
                        if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(container, {reusePath: 10});
                        }
                    }
                    else {
                        creep.moveTo(remoteFlag.pos, {reusePath: 20});
                    }
                }
            }
        }

    }
};

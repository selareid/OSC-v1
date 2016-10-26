require('global');
require('prototype.creep')();

module.exports = {
    run: function (room, creep, energyOfTowers) {

        if (!creep.pos.look(LOOK_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_ROAD})[0]) {
            if (creep.pos.roomName === room.name) {
                creep.pos.createFlag(undefined, COLOR_WHITE, COLOR_WHITE);
            }
            else {
                creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
            }
        }

        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working == true) {

            var spawn = this.findSpawn(room, creep);

            if (spawn) {
                if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn);
                }
            }
            else {
                var extension = this.findExtension(room, creep);
                if (extension) {
                    if (creep.transfer(extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(extension);
                    }
                }
                else {
                    var tower = this.findTower(room, energyOfTowers);
                    if (tower) {
                        if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(tower);
                        }
                    }
                    else {
                        var flagToGoTo = room.find(FIND_FLAGS, {filter: (f) => f.memory.type == 'distributorGoTo' && f.memory.room == creep.room.name})[0];
                        if (flagToGoTo) {
                            creep.moveTo(flagToGoTo);
                        }
                    }
                }
            }

        }
        else {

            var storage = room.storage;
            var droppedEnergy = creep.findDroppedEnergy(room);
            var container;

            if (!storage) {

                if (!droppedEnergy) {
                    droppedEnergy = [];
                }

                if (droppedEnergy.amount == undefined || droppedEnergy.amount < 1010) {
                    if (storage && storage.store[RESOURCE_ENERGY] > 1000) {
                        if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(storage, {reusePath: 10})
                        }
                    }
                    else {
                        container = creep.findContainer(room);
                        if (container) {
                            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(container)
                            }
                        }
                        else {
                            if (creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(container)
                            }
                        }
                    }
                }
                else {
                    if (creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(droppedEnergy);
                    }
                }
            }
            else {

                // link = Game.getObjectById('57e0d5dc07b9dd24411ea83f');
                // if (link && link.energy > 100) {
                //     if (creep.withdraw(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                //         creep.moveTo(link);
                //     }
                // }
                // else {
                if (storage.store[RESOURCE_ENERGY] > 50) {
                    if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage);
                    }
                }
                else {
                    container = creep.findContainer(room);
                    if (container) {
                        if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(container);
                        }
                    }
                    else {
                        if (droppedEnergy) {
                            if (creep.pickup(droppedEnergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(droppedEnergy);
                            }
                        }
                    }
                }
                //}
            }
        }
    },

    findSpawn: function (room, creep) {
        var spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS, {filter: (s) => s.energy < s.energyCapacity});
        return spawn;
    },

    findExtension: function (room, creep) {
        var extension = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_EXTENSION
            && s.energy < s.energyCapacity
        });
        return extension;
    },

    findTower: function (room, energyOfTowers) {
        var tower = room.find(FIND_MY_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_TOWER
            && s.energy <= energyOfTowers && s.energy != s.energyCapacity
        })[0];
        return tower;
    }
};
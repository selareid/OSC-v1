module.exports = {
    run: function (room, creep) {
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working == true) {

            spawn = this.findSpawn(room, creep);

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
                    var tower = this.findTower(room);
                    if (tower) {
                        if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(tower);
                        }
                    }
                    else {
                        creep.say('BORED', true);
                        console.log('')
                    }
                }
            }

        }
        else {



            var storage = room.storage;
            if (storage.store[RESOURCE_ENERGY] > 50) {
                if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage)
                }
            }
            else {
                var droppedenergy = this.findDroppedEnergy(room, creep);
                if (droppedenergy) {
                    if (creep.pickup(droppedenergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(droppedenergy)
                    }
                }
                else {
                    var container = this.findContainer(room, creep);
                    if (container) {
                        if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(container)
                        }
                    }
                }
            }

        }
    },

    findDroppedEnergy: function (room, creep) {
        var droppedEnergy = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
        if (droppedEnergy) {
            return droppedEnergy;
        }
        else {
            return undefined;
        }

    },

    findContainer: function (room, creep) {
        var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_CONTAINER
            && s.store > 0
        });
        if (container) {
            return container;
        }
        else {
            return undefined;
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

    findTower: function (room) {
        var tower = _.min(room.find(FIND_MY_STRUCTURES, {filter:{structureType:STRUCTURE_TOWER}}), s.energy < s.energyCapacity);
        return tower;
    }
};
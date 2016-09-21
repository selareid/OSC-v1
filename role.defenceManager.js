module.exports = {
    run: function (room, creep, hitsOfDefence) {
        creep.say('MERCY!!', true);
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working == true) {
            var rampartToRepair = this.findRampart(room, hitsOfDefence);

            if (rampartToRepair) {
                if (creep.repair(rampartToRepair) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(rampartToRepair);
                }
            }
            else {
                var wallToRepair = this.findRampart(room, hitsOfDefence);

                if (wallToRepair) {
                    if (creep.repair(wallToRepair) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(wallToRepair);
                    }
                }
            }
        }
        else {

            var storage = room.storage;

            if (storage && storage.store[RESOURCE_ENERGY] > 0) {
                if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage)
                }
            }
            else {
                var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_CONTAINER && _.sum(s.store) > 0});
                if (container) {
                    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container)
                    }
                }
            }
        }
    },

    findRampart: function (room, hitsOfDefence) {
        var rampart = room.find(FIND_STRUCTURES,
            {filter: (s) => s.structureType == STRUCTURE_RAMPART && s.hits < hitsOfDefence})[0];

        return rampart;
    },

    findWall: function (room, hitsOfDefence) {
        var wall = room.find(FIND_STRUCTURES,
            {filter: (s) => s.structureType == STRUCTURE_WALL && s.hits < hitsOfDefence})[0];

        return wall;
    }
};
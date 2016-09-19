var roleBuilder = require ('role.builder');

module.exports = {
    run: function (room, creep) {
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }


        if (creep.memory.working == true) {
            var structureToRepair = this.findStructureToRepair(room, creep);
            if (structureToRepair) {
                creep.say('REPAIR!', true);
                if (creep.repair(structureToRepair) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structureToRepair);
                }
            }
            else {
                roleBuilder.run(room, creep);
            }
        }
        else {
            var storage = room.storage;

            if (storage.store[RESOURCE_ENERGY] > 0) {
                if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage)
                }
            }

            else {
                var container = creep.pos.findInRange((FIND_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_CONTAINER
                    && s.store < s.storeCapacity
                }), 1)[0];
                if (container) {
                    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container)
                    }
                }
            }
        }
    },

    findStructureToRepair: function (room, creep) {
        var structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => s.hits < s.hitsMax
            && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART
        });
        return structure;
    }
};
module.exports = {
    run: function (room, creep, percentOfDamageBeforeRepair) {
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }


        if (creep.memory.working == true) {
            var structureToRepair = this.findStructureToRepair(room, creep, percentOfDamageBeforeRepair);
            if (structureToRepair) {
                creep.say('REPAIR!', true);
                if (creep.repair(structureToRepair) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structureToRepair);
                }
            }
            else {
                var structureToBuild = this.findStructureToBuild(room, creep);
                creep.say('BUILD!', true);
                if (structureToBuild) {
                    if (creep.build(structureToBuild) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(structureToBuild);
                    }
                }
            }
        }
        else {
            
            creep.say('ENERGY!!', true);
            var storage = room.storage;

                if (storage.store[RESOURCE_ENERGY] > 0) {
                    if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage)
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

    findStructureToRepair: function (room, creep, percentOfDamageBeforeRepair) {
        var structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => s.hits < s.hitsMax
        && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART});
        return structure;
    },

    findStructureToBuild: function (room, creep) {
        var structureToRepair = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
        return structureToRepair;
    }
};

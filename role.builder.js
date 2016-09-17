module.exports = {
    run: function (room, creep, percentOfDamageBeforeRepair) {
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }


        if (creep.memory.working == true) {
            var structureToRepair = this.findStructureToRepair(room, percentOfDamageBeforeRepair);
            if (structureToRepair) {
                if (creep.repair(structureToRepair) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structureToRepair);
                }
            }
            else {
                var structureToBuild = this.findStructureToBuild(room, creep);
                if (structureToBuild) {
                    if (creep.build(structureToBuild) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(structureToBuild);
                    }
                }
            }
        }
        else {

            var storage = room.storage;
            if (storage) {
                if (storage.store[RESOURCE_ENERGY] > 0) {
                    if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage)
                    }
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
        var container = creep.findClosestByRange(FIND_STRUCTURES, {
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

    findStructureToRepair: function (room, percentOfDamageBeforeRepair) {
        var structureToRepair = _.min(room.find(FIND_MY_STRUCTURES, {filter: (s) => s.hits < s.hitsMax*percentOfDamageBeforeRepair}), s < s.hits);
        return structureToRepair;
    },

    findStructureToBuild: function (room, creep) {
        var structureToRepair = creep.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
        return structureToRepair;
    }
};
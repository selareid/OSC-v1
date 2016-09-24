require('prototype.creep')();
const roleUpgrader = require ('role.upgrader');

module.exports = {
    run: function (room, creep) {
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }


        if (creep.memory.working == true) {

            var structureToBuild = this.findStructureToBuild(room, creep);
            creep.say('BUILD!', true);
            if (structureToBuild) {
                if (creep.build(structureToBuild) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structureToBuild, {reusePath: 7});
                }
            }
            else {
                roleUpgrader.run(room, creep);
            }
        }
        else {
            var storage = room.storage;

            if (storage && storage.store[RESOURCE_ENERGY] > 0) {
                if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage, {reusePath: 10})
                }
            }
            else {
                var container = creep.findContainer(room);
                if (container) {
                    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container)
                    }
                }
            }
        }
    },

    findStructureToBuild: function (room, creep) {
        var structureToRepair = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
        return structureToRepair;
    }
};
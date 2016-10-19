require('global');

module.exports = {
    run: function(creep) {
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working == true) {
            var spawn = creep.room.find(FIND_MY_SPAWNS, {filter: (s) => s.energy < s.energyCapacity});

            if (spawn) {
                if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn);
                }
            }
            else {
                if (creep.pos.x == 12 && creep.pos.y == 25) {
                    creep.drop(RESOURCE_ENERGY);
                }
                else {
                    creep.moveTo(12, 25);
                }
            }
        }
        else {
            var storage = creep.room.storage;

            if (storage && storage.store[RESOURCE_ENERGY] > 0) {
                if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                }
            }
        }
    }
};
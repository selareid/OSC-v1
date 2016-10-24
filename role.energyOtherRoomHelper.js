require('global');

module.exports = {
    run: function (room, creep, roomFlagToGiveEnergyTo) {

        var roomToGiveEnergyTo = roomFlagToGiveEnergyTo.room;

        creep.say('carry');
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working == true) {

            if (creep.room.name === roomToGiveEnergyTo.name) {

                var storage = roomToGiveEnergyTo.storage;

                if (storage) {
                    if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage, {reusePath: 40, ignoreCreeps: true});
                    }
                }
                else {

                    var structure = creep.findClosestByRange(FIND_STRUCTURES, {
                        filter: (s) => (s.structureType == STRUCTURE_SPAWN && s.energy < s.energyCapacity)
                        || (s.structureType == STRUCTURE_CONTAINER && _.sum(s.store) < s.storeCapacity)
                    });

                    if (structure) {
                        if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(structure);
                        }
                    }
                    else {
                        console.log('Creep ' + creep.memory.role + ' could not find structure in room ' + room);
                    }
                }
            }
            else {
                creep.moveTo(roomFlagToGiveEnergyTo);
            }
        }
        else {

            if (creep.room.name === room) {
                var storage = room.storage;

                if (storage.store.energy >= 40000) {
                    if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage);
                    }
                }
                else {
                    roomFlagToGiveEnergyTo.remove();
                }
            }
            else {
                creep.moveTo(room.controller);
            }

        }
    }
};
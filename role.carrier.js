require('global');
require('prototype.creep')();

module.exports = {
    run: function (room, creep) {

        if (!creep.pos.look(LOOK_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_ROAD})[0]) {
            if (creep.pos.roomName === room.name) {
                creep.pos.createFlag(undefined, COLOR_WHITE, COLOR_WHITE);
            }
            else {
                creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
            }
        }

        creep.say('carry');
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working == true) {

            var storage = room.storage;

            if (storage) {
                if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage, {reusePath: 40});
                }
            }
            else {
                console.log('Creep ' + creep + ' could not find structure storage in room ' + room);
            }
        }
        else {

            var droppedenergy = creep.findDroppedEnergy(room);
            if (droppedenergy) {
                if (creep.pickup(droppedenergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedenergy);
                }
            }
            else {

                if (!creep.memory.container) {
                    let foundContainer = creep.findContainer(room);
                    if (foundContainer) {
                        creep.memory.container = foundContainer.id;
                        console.log('carrier recalculating container');
                    }
                }

                var container = Game.getObjectById(creep.memory.container);

                if (container) {
                    if (container.store[RESOURCE_ENERGY] > 0) {

                        if (container) {
                            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(container, {reusePath: 10});
                            }
                        }
                    }
                    else {
                        delete creep.memory.container;
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
};
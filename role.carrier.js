require('global');
require('prototype.creep')();

module.exports = {
    run: function (room, creep) {
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
                    creep.moveTo(storage, {reusePath: 40, ignoreCreeps: true});
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
                    creep.moveTo(droppedenergy, {ignoreCreeps: true});
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
                                creep.moveTo(container, {reusePath: 10,ignoreCreeps: true});
                            }
                        }
                    }
                    else {
                        delete creep.memory.container;
                    }
                }
            }

        }
    }
};
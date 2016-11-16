require('global');
require('prototype.creep')();

var roleDistributor = require ('role.distributor');

module.exports = {
    run: function (room, creep) {

        creep.say('carry');
        if (creep.memory.working == true && _.sum(creep.carry) == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working == true) {

            var storage = room.storage;

            if (storage) {
                if (_.sum(room.storage.store) >= room.storage.storeCapacity) {
                    var energyOfTowers = function (room) {
                        var towers = room.find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER});
                        var allEnergy = [];

                        for (let tower of towers) {
                            allEnergy.push(tower.energy);
                        }
                        return _.min(allEnergy) + 1;
                    };
                    roleDistributor.run(room, creep, energyOfTowers);
                }
                else {
                    for (let resourceType in creep.carry) {
                        if (creep.transfer(storage, resourceType) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(storage, {reusePath: 19});
                        }
                    }
                }
            }
            else {
                console.log('Creep ' + creep + ' could not find structure storage in room ' + room);
            }
        }
        else {

            var droppedResource = room.find(FIND_DROPPED_RESOURCES)[0];
            if (droppedResource) {
                if (creep.pickup(droppedResource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedResource);
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
require('global');
require('prototype.roomPosition')();

module.exports = {
    run: function (room, creep) {
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }


        if (creep.memory.working == true) {

            var controller = room.controller;

            if (controller.pos.getRangeTo(creep.pos) <= 4) {
                creep.upgradeController(controller);
            }

            if (controller.pos.getRangeTo(creep.pos) > 1) {
                creep.moveTo(controller);
            }

        }
        else {
            var droppedEnergy = creep.findDroppedEnergy(room);

            if (!droppedEnergy) {
                droppedEnergy = [];
            }

            if (droppedEnergy.amount == undefined || droppedEnergy.amount < 1010) {
                var storage = room.storage;
                if (storage && storage.store[RESOURCE_ENERGY] > 1000) {
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
                    else {
                        if (creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(container)
                        }
                    }
                }
            }
            else {
                if (creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedEnergy);
                }
            }
        }
    }
};
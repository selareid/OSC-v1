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


            var target = room.controller;
            var minRangeToTarget = 2;
            if (Math.random() < 0.5) {
                var adjacentPositions = _.filter(creep.pos.getAdjacentRoomPositions(), pos => {
                    var range = pos.getRangeTo(target);
                    if (range > minRangeToTarget) {
                        return false
                    }
                    if (!pos.isWalkable()) {
                        return false
                    }
                    return true
                });

                if (adjacentPositions.length > 0) {
                    var newPos = _.sample(adjacentPositions); // random
                    creep.move(creep.pos.getDirectionTo(newPos));
                    creep.upgradeController(target)
                    creep.creepSpeech(room, 'upgrading');
                }
                else {
                    creep.moveTo(target);
                }
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
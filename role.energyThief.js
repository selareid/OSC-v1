require('global');
require('prototype.creepSpeech')();

module.exports = {
    run: function(room, creep, roomToGoTo) {
        if (roomToGoTo) {
            if (creep.memory.working == true && creep.carry.energy == 0) {
                creep.memory.working = false;
            }
            else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
                creep.memory.working = true;
            }

            if (creep.memory.working == true) {
                if (creep.room.name != room.name) {
                    let roomPos2 = new RoomPosition(12, 25, room.name);
                    creep.moveTo(roomPos2);
                }
                else {
                    var links = _.filter(global[room.name].links, (l) => l.energy > 0);
                    var storage = room.storage;

                    var arrayOfBoth = links;
                    arrayOfBoth.push(storage);

                    var closer = creep.pos.findClosestByRange(arrayOfBoth);

                    if (closer != storage) {
                        if (creep.withdraw(closer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(closer, {reusePath: 10})
                        }
                    }
                    else if (storage && _.sum(storage.store) < storage.storeCapacity) {
                        if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(storage, {reusePath: 10})
                        }
                    }
                    else {
                        creep.drop(RESOURCE_ENERGY);
                    }
                }
            }
            else {
                if (creep.room.name != roomToGoTo) {
                    let roomPos1 = new RoomPosition(26, 20, roomToGoTo);
                    creep.moveTo(roomPos1);
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
        }
    }
};
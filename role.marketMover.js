require('global');
require('prototype.creep')();

module.exports = {
    run: function (room, creep) {

        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working == true) {
            var terminal = room.terminal;
            if (terminal) {
                if (_.sum(terminal.store) < terminal.storeCapacity) {
                    for (let resourceType in creep.carry) {
                        if (creep.transfer(terminal, resourceType) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(terminal);
                        }
                    }
                }
            }
        }
        else {
            var storage = room.storage;
            if (storage) {
                var orders = Memory.rooms[room].market;
                if (orders != undefined) {
                    var order = Game.market.getOrderById(orders[0]);
                    if (order) {
                        var resource = order.resourceType;
                        if (_.filter(storage.store, (r) => r.resourceType == resource)) {
                            if (creep.withdraw(storage, resource) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(storage);
                            }
                        }
                        else {
                            this.collectEnergy(room, creep, storage);
                        }
                    }
                    else {
                        this.collectEnergy(room, creep, storage);
                    }
                }
            }
        }
    },

    collectEnergy: function (room, creep, storage) {
        if (storage.store[RESOURCE_ENERGY] > 350000) {
            if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage);
            }
        }
    }
};
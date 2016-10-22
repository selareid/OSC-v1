require('global');
require('prototype.creep');

module.exports = {
    run: function (room, creep, remoteFlag) {

        if (creep.memory.goingHome === true && creep.carry.energy == 0) {
            creep.memory.goingHome = false;
        }
        else if (creep.memory.goingHome === false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.goingHome = true;
        }

        if (creep.memory.goingHome === true) {
            if (creep.pos.roomName != creep.memory.room) {

                let underMe = creep.pos.findInRange(FIND_STRUCTURES, 1);
                underMe = underMe.filter(function (obj) { return obj.hits < obj.hitsMax });
                if (underMe.length > 0) {
                    let res = creep.repair(underMe[0]);
                    if (res === OK) {
                        creep.say('REPAIR!!!', true);
                    }
                    else {
                        creep.say('REPAIR ERR', true);
                    }

                }
                else {
                    creep.moveTo(Game.rooms[creep.memory.room].find(FIND_MY_SPAWNS)[0], {reusePath: 10});
                }
            }
            else {
                if (room.storage) {
                    if (creep.transfer(room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(room.storage);
                    }
                }
            }
        }
        else {
            if (creep.pos.roomName != remoteFlag.pos.roomName) {
                creep.moveTo(remoteFlag.pos, {ignoreCreeps: true, reusePath: 20});
            }
            else {
                var container = creep.findContainer(room);

                if (container) {
                    if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container, {ignoreCreeps: true, reusePath: 10});
                    }
                }
            }
        }

    }
};
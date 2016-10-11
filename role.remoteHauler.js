require('global');
require('prototype.creep');

module.exports = {
    run: function (room, creep, remoteFlag) {

        if (creep.room.name == room) {
            if (creep.memory.goingHome == false) {
                creep.moveTo(remoteFlag, {ignoreCreeps: true, reusePath: 30});
            }
            else {
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
                            creep.moveTo(storage, {ignoreCreeps: true});
                        }
                    }
                }
                else {
                    creep.memory.goingHome = false;
                }
            }
        }
        else if (creep.room.name == remoteFlag.pos.roomName) {

            if (creep.memory.working == true && creep.carry.energy == 0) {
                creep.memory.working = false;
            }
            else if (creep.memory.working == false && creep.carry.energy >= creep.carryCapacity) {
                creep.memory.working = true;
            }

            if (creep.memory.working == true) {
                var site = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if (site) {
                    if (creep.build(site) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(site, {ignoreCreeps: true});
                    }
                }
                else {
                    var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART});

                    if (structure) {
                        if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(structure);
                        }
                    }
                    else {
                        creep.memory.goingHome = true;
                    }
                }
            }
            else {
                var droppedEnergy = creep.findDroppedEnergy(room);
                if (droppedEnergy) {
                    if (creep.pickup(droppedEnergy)) {
                        creep.moveTo(droppedEnergy);
                    }
                }
                else {
                    var container = creep.findContainer(room);
                    if (container) {
                        if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(container);
                        }
                    }
                }
            }

        }
        else {
            if (creep.memory.goingHome == true) {
                if (Game.rooms[room]) {
                    creep.moveTo(Game.rooms[room].find(FIND_MY_SPAWNS)[0], {ignoreCreeps:true, reusePath: 30});
                }
            }
            creep.moveTo(remoteFlag, {ignoreCreeps:true, reusePath: 30});
        }
    }
};
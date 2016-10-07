module.exports = {
    run: function (room, creep) {

        var flag = Game.flags[creep.memory.flag];

        if (!flag) {
            let flags = this.findEnergyFlag(room, creep);
            creep.memory.flag = this.findFlagToDo(room, creep, flags);
        }

        if (creep.pos.roomName == Game.flags[creep.memory.flag].pos.roomName) {

            if (creep.memory.goingHome == false) {
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
                            creep.moveTo(site);
                        }
                    }
                    else {
                        var structure = creep.pos.findClosestByPath(FIND_STRUCTURES,
                            {
                                filter: (s) => (((s.structureType == STRUCTURE_RAMPART && s.hits <= 30000)
                                || (s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART)))
                            });

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
                    var source = creep.pos.findClosestByPath(FIND_SOURCES);
                    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    }
                }
            }
            else {
                creep.moveTo(Game.rooms[creep.memory.room].find(FIND_MY_SPAWNS));
            }
        }
        else if (creep.pos.roomName == creep.memory.room) {
            if (creep.memory.goingHome == true) {
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
                            creep.moveTo(storage);
                        }
                    }
                }
                else {
                    creep.memory.goingHome = false;
                }
            }
            else {
                creep.moveTo(Game.flags[creep.memory.flag]);
            }
        }
        else {
            if (creep.memory.goingHome == true) {
                creep.moveTo(Game.rooms[creep.memory.room].find(FIND_MY_SPAWNS));
            }
            else {
                creep.moveTo(Game.flags[creep.memory.flag]);
            }
        }
    },

    findEnergyFlag: function (room, creep) {
        var energyFlags = [];

        _.forEach(_.filter(Game.flags, (f) => f.memory.type == 'reserveFlag' && f.memory.room == creep.memory.room), function (flag) {
            energyFlags.push(flag);
        });

        return energyFlags;
    },

    findFlagToDo: function (room, creep, flags) {

        for (let flag of flags) {
            let flagRoom = flag.room;
            if (Game.rooms[flagRoom]) {
                let numberOfMyCreepsNearby = Game.rooms[flagRoom].find(FIND_MY_CREEPS, {
                    filter: (c) => c.memory.role == 'landlord'
                    && c.memory.room == flag.memory.room && c.memory.flag == flag.name
                }).length;

                if (numberOfMyCreepsNearby <= 3) {
                    return flag.name;

                }
            }
            else {
                return flag.name;
            }

        }
    }
};
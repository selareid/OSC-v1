require('global');
require('prototype.creep')();

module.exports = {
    run: function (room, creep, hitsOfDefence, isUnderAttack) {
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working == true) {
            var towerLowerThan = room.find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER && s.energy < 210});
            if (isUnderAttack === true || towerLowerThan.length > 0) {
                var tower = this.getTowerToRefill(room, creep);
                if (tower) {
                    if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(tower);
                    }
                }
            }
            else {
                var rampartToRepair = this.findRampart(room, hitsOfDefence);

                if (rampartToRepair) {
                    if (creep.repair(rampartToRepair) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(rampartToRepair);
                    }
                }
                else {
                    var wallToRepair = this.findWall(room, hitsOfDefence);
                    if (wallToRepair) {
                        if (creep.repair(wallToRepair) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(wallToRepair, {reusePath: 10});
                        }
                    }
                }
            }
        }
        else {

            var storage = room.storage;

            if (storage && storage.store[RESOURCE_ENERGY] > 0) {
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
            }
        }
    },

    findRampart: function (room, hitsOfDefence) {
        var rampart = room.find(FIND_STRUCTURES,
            {filter: (s) => s.structureType == STRUCTURE_RAMPART && s.hits <= hitsOfDefence});

        return rampart[0];
    },

    findWall: function (room, hitsOfDefence) {
        var wall = room.find(FIND_STRUCTURES,
            {filter: (s) => s.structureType == STRUCTURE_WALL && s.hits <= hitsOfDefence});

        return wall[0];
    },

    getTowerToRefill: function (room, creep) {
        var towers = room.find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER});

        if (towers.length > 0) {
            var allEnergyTowers = [];

            for (let tower of towers) {
                allEnergyTowers.push(tower.energy);
            }

            var towerEnergy = _.min(allEnergyTowers) - 200;

            var tower = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER && s.energy <= towerEnergy});

            if (tower) {
                return tower;
            }
            else {
                return undefined;
            }

        }
        else {
            return undefined;
        }

    }
};
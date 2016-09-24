var type2 = require ('role.type2');

module.exports = {
    run: function(creep) {
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working == true) {
            var percentOfWall = 0.0001;
            var structure = creep.pos.findClosestByPath(FIND_STRUCTURES,
                {filter: (s) => s.structureType == STRUCTURE_WALL && s.hits <= s.hitsMax*percentOfWall});

            if (structure) {
                if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            }
            else {
                var tower = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: (t) => t.structureType == STRUCTURE_TOWER
                && t.energy < t.energyCapacity});
                if (tower != undefined) {
                    if (creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(tower);
                    }
                }
                else {
                    type2.run(creep);
                }
            }
        }
        else {

            var source = creep.pos.findClosestByRange(FIND_SOURCES);
            if (source) {
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source)
                }
            }
        }
    }
};
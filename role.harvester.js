var roleEmergencyHarvester = require ('role.emergencyHarvester');

module.exports = {
    run: function (room, creep) {
        var numberOfDistributors = _.sum(Game.creeps, (c) => c.memory.role == 'distributor' && c.memory.room == room.name);
        if (numberOfDistributors <= 0) {
            roleEmergencyHarvester.run(room, creep);
        }
        else {
            //changes state
            if (creep.memory.working == true && creep.carry.energy == 0) {
                creep.memory.working = false;
            }
            else if (creep.memory.working == false && creep.carry.energy >= creep.carryCapacity) {
                creep.memory.working = true;
            }

            // if working if true do stuff or else mine
            if (creep.memory.working == true) {
                var doThis = this.checkContainerBuilt(room, creep);

                //if container found put transfer energy to container if container full drop energy
                if (doThis) {
                    var container = creep.findInRange((FIND_STRUCTURES, {
                        filter: (s) => s.structureType == STRUCTURE_CONTAINER
                        && s.store < s.storeCapacity
                    }), 1)[0];

                    if (container) {
                        creep.transfer(container, RESOURCE_ENERGY);
                    }
                    else {
                        creep.drop(RESOURCE_ENERGY);
                    }
                }
                else {
                    if (room.createConstructionSite(creep.pos) != 0) {
                        creep.drop(RESOURCE_ENERGY);
                    }
                }
            }
            else {

                var source = this.findSource(room, creep);

                creep.say('MINE!!', true);

                if (!source) {
                    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.say('M2M', true);
                        creep.moveTo(source);
                    }
                }
            }
        }
    },

    findSource: function (room, creep) {

        var sources = room.find(FIND_SOURCES);
        var foundSource;

        for (let source in sources) {
            if (!source.pos.findInRange(FIND_MY_CREEPS, 1,
                    {filter: (c) => c.name != creep.name && c.memory.role == 'harvester'})) {
                foundSource = source;
            }
        }

        if (foundSource) {
            return foundSource;
        }
        else {
            return creep.findClosestByPath(FIND_SOURCES);
        }

    },

    checkContainerBuilt: function (room, creep) {
        if (creep.pos.findInRange(FIND_SOURCES, 1)[0]) {
            if (creep.pos.findInRange((FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER}), 1)[0]) {
                return true;
            }
            else {
                return false;
            }
        }

    }
};
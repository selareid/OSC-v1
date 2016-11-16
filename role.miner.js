require('global');
require('prototype.creepSpeech')();
const roleEmergencyHarvester = require ('role.emergencyHarvester');

module.exports = {
    run: function (room, creep) {
        var numberOfDistributors = _.sum(Game.creeps, (c) => c.memory.role == 'distributor' && c.memory.room == room.name);
        if (numberOfDistributors <= 0) {
            roleEmergencyHarvester.run(room, creep);
        }
        else {
            //changes state
            if (creep.memory.working == true && _.sum(creep.carry) == 0) {
                creep.memory.working = false;
            }
            else if (creep.memory.working == false && _.sum(creep.carry) >= creep.carryCapacity) {
                creep.memory.working = true;
            }

            // if working if true do stuff or else mine
            if (creep.memory.working == true) {

                //if container found put transfer energy to container if container full drop energy

                var container = creep.pos.findInRange(FIND_STRUCTURES, 1, {
                    filter: (s) => s.structureType == STRUCTURE_CONTAINER
                    && _.sum(s.store) < s.storeCapacity
                })[0];

                if (container) {
                    creep.creepSpeech(room, 'droppingEnergyContainer');
                    for (let resourceType in creep.carry) {
                        creep.transfer(container, resourceType);
                    }
                }
                else {
                    creep.creepSpeech(room, 'droppingEnergy');
                    for (let resourceType in creep.carry) {
                        creep.drop(resourceType);
                    }
                }
            }
            else {

                var extractor = room.find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_EXTRACTOR});
                if (extractor) {
                    var mineral = room.find(FIND_MINERALS);
                    if (creep.harvest(mineral) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(mineral);
                    }
                }

            }
        }
    },

    findSource: function (room, creep, harvesters) {

        var takenSources = [];

        for (let harvester of harvesters) {
            if (harvester.memory.source) {
                takenSources.push(harvester.memory.source);
            }
        }

        var source = creep.pos.findClosestByPath(FIND_SOURCES, {filter: (s) => !takenSources.includes(s.id)});
        if (source) {
            return source;
        }
        else {
            return creep.pos.findClosestByPath(FIND_SOURCES);
        }

    }
};
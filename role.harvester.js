const roleEmergencyHarvester = require ('role.emergencyHarvester');

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

                //if container found put transfer energy to container if container full drop energy

                var container = creep.pos.findInRange(FIND_STRUCTURES, 1, {filter: (s) => s.structureType == STRUCTURE_CONTAINER
                && _.sum(s.store) < s.storeCapacity})[0];

                if (container) {
                    creep.say('Yay!');
                    creep.transfer(container, RESOURCE_ENERGY);
                }
                else {
                    creep.say('DropDBeat');
                    creep.drop(RESOURCE_ENERGY);
                }
            }
            else {

                var source = this.findSource(room, creep);

                creep.say('MINE!!', true);

                if (source) {
                    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.say('M2M', true);
                        creep.moveTo(source, {reusePath: 10});
                    }
                }
            }
        }
    },

    findSource: function (room, creep) {

        var source = creep.pos.findClosestByPath(FIND_SOURCES, {filter: (s) => s.pos.findInRange(FIND_MY_CREEPS, 1, {filter: (c) => c.memory.role == 'harvester'
        && c.getActiveBodyparts(WORK) >= 5 && c.name != creep.name})[0] == undefined});
        if (source) {
            return source;
        }
        else {
            return creep.pos.findClosestByPath(FIND_SOURCES);
        }

    }
};
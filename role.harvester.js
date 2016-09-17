module.exports = {
    run: function (room, creep) {

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
                room.createConstructionSite(creep.pos)
            }
        }
        else {

            //if no source in memory find one
            if (!creep.memory.source) {
                var source = this.findSource(room, creep);
                creep.memory.source = source;
            }

            if (creep.memory.source) {
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }

        }
    },

    findSource: function (room, creep) {

        var foundSource;
        var sourcesInRoom = room.find(FIND_SOURCES);
        var takenSources = [];
        var harvestersOfRoom = _.filter(Game.creeps, (c) => c.memory.role == 'harvester' && c.memory.room == room);

        for (let harvester in harvestersOfRoom) {
            if (harvester.memory.source) {
                takenSources.push(creep.memory.source);
            }
        }

        for (let source in sourcesInRoom) {
            if (!takenSources.includes(source)) {
                foundSource = source;
            }
        }

        if (foundSource) {
            return foundSource;
        }
        else {
            return creep.pos.findClosestByPath(FIND_SOURCES);
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
        else {
            creep.moveTo(creep.memory.source)
        }
    }
};
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
                if (room.createConstructionSite(creep.pos) != 0) {
                    creep.drop(RESOURCE_ENERGY);
                }
            }
        }
        else {

                var source = this.findSource(room, creep);

            if (source) {
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }

        }
    },

    findSource: function (room, creep) {

        var sourcesInRoom = room.find(FIND_SOURCES_ACTIVE);
        var sourcesNotAvailable = [];

        for (let source_it in sourcesInRoom) {
            let source = sourcesInRoom[source_it];
            if (source.pos.findInRange(FIND_MY_CREEPS, 0, {filter: (c) => c.memory.role == 'harvester'})[0]) {
                sourcesNotAvailable.push(source);
            }
            else {
                return source;
            }
        }

        return creep.findClosestByRange(FIND_SOURCES_ACTIVE);

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
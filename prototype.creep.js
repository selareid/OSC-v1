module.exports = function () {
    Creep.prototype.findDroppedEnergy =
        function (room) {
            var droppedEnergy = this.pos.findClosestByRange(FIND_DROPPED_ENERGY, {filter: (e) => e.amount > 1000});
            if (droppedEnergy) {
                return droppedEnergy;
            }
            else {
                droppedEnergy = this.pos.findClosestByRange(FIND_DROPPED_ENERGY, {filter: (e) => e.amount > 500});
                if (droppedEnergy) {
                    return droppedEnergy;
                }
                else {
                    droppedEnergy = this.pos.findClosestByRange(FIND_DROPPED_ENERGY, {filter: (e) => e.amount > 100});
                    if (droppedEnergy) {
                        return droppedEnergy;
                    }
                    else {
                        return undefined;
                    }
                }
            }
        },

        Creep.prototype.findContainer =
            function (room) {
                var allContainersInRoom = room.find(FIND_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0});

                if (allContainersInRoom.length > 0) {
                    var maxEnergyContainers = [];

                    for (let container of allContainersInRoom) {
                        maxEnergyContainers.push(container.store[RESOURCE_ENERGY]);
                    }

                    var containerEnergy = _.max(maxEnergyContainers) + 10;

                    var container = this.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] >= containerEnergy})

                    if (container) {
                        return container;
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
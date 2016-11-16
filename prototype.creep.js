require('global');

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
                    filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0
                });

                if (allContainersInRoom.length > 0) {

                    var containerEnergy = _.max(allContainersInRoom, '.store.energy').store.energy - 400;


                    var container = this.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY]
                        && s.store[RESOURCE_ENERGY] >= containerEnergy
                    });


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
            },

        Creep.prototype.runInSquares = function () {
            switch (creep.memory.lastMove) {
                case TOP:
                    creep.memory.lastMove = LEFT;
                    creep.move(LEFT);
                    break;
                case LEFT:
                    creep.memory.lastMove = BOTTOM;
                    creep.move(BOTTOM);
                    break;
                case BOTTOM:
                    creep.memory.lastMove = RIGHT;
                    creep.move(RIGHT);
                    break;
                case RIGHT:
                    creep.memory.lastMove = TOP;
                    creep.move(TOP);
                    break;
                default:
                    creep.memory.lastMove = TOP;
                    creep.move(TOP);
            }
        }
};
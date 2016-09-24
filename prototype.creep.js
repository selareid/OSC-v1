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
        }
};
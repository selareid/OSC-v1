require('global');

module.exports = {

    run: function (room, tower) {

        var towerTarget = this.findTarget(room, tower);

        if (towerTarget) {
            tower.attack(towerTarget);
        }
        else {
            var towerHeal = this.findHeal(room, tower);
            if (towerHeal) {
                tower.heal(towerHeal)
            }
        }
    },

    findTarget: function (room, tower) {

        var towerTarget;

        towerTarget = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {filter: (c) => !Allies.includes(c)});
        return towerTarget;
    },

    findHeal: function (room, tower) {
        var towerHeal;
        towerHeal = tower.pos.findClosestByRange(FIND_MY_CREEPS, {filter: (c) => c.hits < c.hitsMax});
        if (towerHeal) {
            return towerHeal;
        }
    },

    repairRampart: function (room, tower) {
        var towerRepair = tower.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_RAMPART && s.hits <= 400});
        if (towerRepair) {
            tower.repair(towerRepair)
        }
    }
};
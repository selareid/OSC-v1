module.exports = {

    run: function (tower, allyUsername) {

        var towerTarget = this.findTarget(tower, allyUsername);

        if (towerTarget) {
            tower.attack(towerTarget);
        }
        else {
            var towerHeal = this.findHeal(tower);
            if (towerHeal) {
                tower.heal(towerHeal)
            }
        }
    },

    findTarget: function (tower, allyUsername) {

        var towerTarget;

        towerTarget = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: (c) => c.getActiveBodyparts(HEAL) >= 1
            && allyUsername.includes(c.owner.username) == false
        });

        if (towerTarget) {
            return towerTarget;
        }
        else {
            towerTarget = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                filter: (c) => c.getActiveBodyparts(ATTACK) >= 1
                && allyUsername.includes(c.owner.username) == false
            });

            if (towerTarget) {
                return towerTarget;
            }
            else {
                towerTarget = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {filter: (c) => allyUsername.includes(c.owner.username) == false});
                if (towerTarget) {
                    return towerTarget;
                }
                else {

                }
            }
        }
    },

    findHeal: function (tower) {
        var towerHeal;
        towerHeal = tower.pos.findClosestByRange(FIND_MY_CREEPS, {filter: (c) => c.hits < c.hitsMax});
        if (towerHeal) {
            return towerHeal;
        }
    }
};
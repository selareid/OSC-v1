require('prototype.creep')();

module.exports = function () {
    Creep.prototype.basicRangedHandler =
        function (target) {
            if (target) {
                this.rangedAttack(target);
            }
        };

        Creep.prototype.basicSelfHeal =
        function () {
            if (this.hasActiveBodyparts(HEAL)) {
                if (this.hits < this.hitsMax) {
                    this.heal(this);
                }
            }
        };
};
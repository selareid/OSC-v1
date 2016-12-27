module.exports = function () {
    Creep.prototype.basicRangedHandler =
        function (target) {
            if (target) {
                this.rangedAttack(target);
            }
        };
};
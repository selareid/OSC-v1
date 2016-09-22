module.exports = {
    run: function (room) {

        if (Game.time % 10 == 0) {
            var sourceLink = Game.getObjectById('57e1b8d9491fd2351f28b6ea');
            var targetLink = Game.getObjectById('57e0d5dc07b9dd24411ea83f');
            if (sourceLink && targetLink) {
                if (sourceLink.energy >= 1) {
                    Memory.toll.paid = true;
                    if (sourceLink && targetLink && targetLink.energy < targetLink.energyCapacity - 1 && sourceLink.cooldown == 0) {
                        let res = sourceLink.transferEnergy(targetLink, 1);
                        console.log(`Link Xfer: ${res}`);
                    }
                }
                else {
                    Memory.toll.missedPayments += 1;
                    Memory.toll.paid = false;
                }
            }
        }
    }
};
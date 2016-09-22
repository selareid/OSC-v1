module.exports = {
    run: function (room) {

        var sourceLink = Game.getObjectById('57e1b8d9491fd2351f28b6ea');
        var targetLink = Game.getObjectById('57e0d5dc07b9dd24411ea83f');

        if (sourceLink != null && targetLink != null && sourceLink.energy > sourceLink.energyCapacity / 2 && targetLink.energy < targetLink.energyCapacity - 5 && sourceLink.cooldown == 0) {
            let res = sourceLink.transferEnergy(targetLink);
            console.log(`Link Xfer: ${res}`);
        }
    }
};
require('global');

const creepTalk = require('creepTalk');

module.exports = function () {
    Creep.prototype.creepSpeech = function (room, doingWhat) {

        switch (doingWhat) {
            case 'movingToSource':
                creepTalk.movingToSource(this);
                break;
            case 'movingToSpawn':
                creepTalk.movingToSpawn(this);
                break;
            case 'harvesting':
                creepTalk.harvesting(this);
                break;
            case 'droppingEnergy':
                creepTalk.droppingEnergy(this);
                break;
            case 'droppingEnergyContainer':
                creepTalk.droppingEnergyContainer(this);
                break;
        }

    }
};
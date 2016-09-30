require('global');

const creepTalk = require('creepTalk');

module.exports = function () {
    Creep.prototype.creepSpeech = function (room, creep, doingWhat) {

        switch (doingWhat) {
            case 'movingToSource':
                creepTalk.movingToSource(creep);
                break;
            case 'movingToSpawn':
                creepTalk.movingToSpawn(creep);
                break;
            case 'harvesting':
                creepTalk.harvesting(creep);
                break;
            case 'emergencyHarvesting':

                break;
            case 'droppingEnergy':
                break;
            case 'droppingEnergyContainer':

                break;
        }

    }
};
require('global');

module.exports = function () {
    Creep.prototype.creepSpeech = function (room, creep, doingWhat) {

        switch (doingWhat) {
            case 'movingToSource':

                break;
            case 'harvesting':

                break;
        }

    },
         function movingToSource(creep) {
        switch (Game.time % 8){
            case 0:
                creep.say("I'm on");
                break;
            case 1:
                creep.say('my way');
                break;
            case 2:
                creep.say('from spawn');
                break;
            case 3:
                creep.say('to source today');
                break;
            case 4:
                creep.say('uh-huh');
                break;
            case 5:
                creep.say('uh-huh');
                break;
            case 6:
                creep.say('uh-huh');
                break;
            case 7:
                creep.say('uh-huh');
                break;
        }
    }
};
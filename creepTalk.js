require('global');

module.exports = {

    movingToSource: function (creep) {
        switch (Game.time % 8) {
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
                creep.say('to source this tick');
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
    },
    movingToSpawn: function (creep) {
        switch (Game.time % 8) {
            case 0:
                creep.say("I'm on");
                break;
            case 1:
                creep.say('my way');
                break;
            case 2:
                creep.say('from source');
                break;
            case 3:
                creep.say('to spawn this tick');
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
    },
    harvesting: function (creep) {
        switch (Game.time % 17) {
            case 0:
                creep.say("Aw I'm");
                break;
            case 1:
                creep.say('a miner!');
                break;
            case 2:
                creep.say('MINE MINE!');
                break;
            case 3:
                creep.say('aw ya');
                break;
            case 4:
                creep.say("it's");
                break;
            case 5:
                creep.say('all I do');
                break;
            case 6:
                creep.say('MINE MINE!');
                break;
            case 7:
                creep.say("don't let");
                break;
            case 8:
                creep.say('that energy');
                break;
            case 9:
                creep.say('waste in');
                break;
            case 10:
                creep.say('the source');
                break;
            case 11:
                creep.say('gotta');
                break;
            case 12:
                creep.say('bring');
                break;
            case 13:
                creep.say('that energy');
                break;
            case 14:
                creep.say('and drop');
                break;
            case 15:
                creep.say('it out');
                break;
            case 16:
                creep.say('MINE MINE!');
                break;
        }
    }
};
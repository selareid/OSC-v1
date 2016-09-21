const creepHandler = require ('creepHandler');
const defenceHandler = require ('defenceHandler');
const spawnerHandler = require ('spawnerHandler');

module.exports = {
    run: function (room, allyUsername) {
        if (Game.time % 5 == 0) {
        var underAttack = defenceHandler.isUnderAttack(room, allyUsername);
        }
        if (underAttack) {
            defenceHandler.run(room, allyUsername);
        }
        //else {
            spawnerHandler.run(room);
            creepHandler.run(room);
        //}
    }
};
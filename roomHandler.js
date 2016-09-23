const creepHandler = require ('creepHandler');
const linkHandler = require ('linkHandler');
const defenceHandler = require ('defenceHandler');
const spawnerHandler = require ('spawnerHandler');

module.exports = {
    run: function (room, allyUsername) {
        if (Game.time % 5 == 0) {
            var underAttack = defenceHandler.isUnderAttack(room, allyUsername);
            if (underAttack === false) {
                Memory.rooms[room].isUnderAttack = false;
            }
            else {
                Memory.rooms[room].isUnderAttack = true;
            }
        }

        if (Memory.rooms[room].isUnderAttack == true) {
            defenceHandler.run(room, allyUsername);
        }
        //else {
        linkHandler.run(room);
        spawnerHandler.run(room, isUnderAttack);
        creepHandler.run(room, allyUsername, isUnderAttack);
        //}
    }
};
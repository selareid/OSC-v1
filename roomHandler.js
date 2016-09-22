const creepHandler = require ('creepHandler');
const linkHandler = require ('linkHandler');
const defenceHandler = require ('defenceHandler');
const spawnerHandler = require ('spawnerHandler');

module.exports = {
    run: function (room, allyUsername) {
        if (Game.time % 5 == 0) {
            var underAttack = defenceHandler.isUnderAttack(room, allyUsername);
            if (underAttack == true) {
                Memory.rooms[room].isUnderAttack = true;
            }
            else {
                Memory.rooms[room].isUnderAttack = false;
            }
        }

        if (Memory.rooms[room].isUnderAttack == true) {
            defenceHandler.run(room, allyUsername);
        }
        //else {
        linkHandler.run(room);
        spawnerHandler.run(room);
        creepHandler.run(room);
        //}
    }
};
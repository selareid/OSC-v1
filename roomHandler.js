const creepHandler = require ('creepHandler');
const linkHandler = require ('linkHandler');
const defenceHandler = require ('defenceHandler');
const spawnerHandler = require ('spawnerHandler');

module.exports = {
    run: function (room, allyUsername) {
        var roomsToAttackFrom = ['E58N9'];
        if (!roomsToAttackFrom.includes(room)) {
            var isAttacking = false;
            var armySize = 0;
            var roomToAttack = '';
        }
        else {
            var isAttacking = false;
            var armySize = 0;
            var roomToAttack = 'E58N8';
        }

        if (Game.time % 5 == 0) {
            var underAttack = defenceHandler.isUnderAttack(room, allyUsername);
            if (underAttack === false) {
                Memory.rooms[room].isUnderAttack = false;
            }
            else {
                Memory.rooms[room].isUnderAttack = true;
            }
        }

        var areWeUnderAttack = Memory.rooms[room].isUnderAttack;

        if (areWeUnderAttack == true) {
            defenceHandler.run(room, allyUsername);
        }
        //else {
        linkHandler.run(room);
        spawnerHandler.run(room, areWeUnderAttack, isAttacking, armySize);
        creepHandler.run(room, allyUsername, areWeUnderAttack, isAttacking, armySize, roomToAttack);
        //}
    }
};
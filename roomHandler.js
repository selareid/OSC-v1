require('global');
require('prototype.room')();

const creepHandler = require ('creepHandler');
const linkHandler = require ('linkHandler');
const defenceHandler = require ('defenceHandler');
const spawnerHandler = require ('spawnerHandler');

module.exports = {
    run: function (room) {

        if (Game.time % 20 == 0) {
            room.updateConstructionTargets();
        }

        var flagToRallyAt = room.findAttackFlag(room);

        var isAttacking;
        var armySize;

        var otherRoomCreepsRoomToGoTo = '';


        if (flagToRallyAt) {
            isAttacking = true;
            armySize = flagToRallyAt.memory.armySize;
        }


        if (Game.time % 5 == 0) {
            var underAttack = defenceHandler.isUnderAttack(room);
            if (underAttack === false) {
                Memory.rooms[room].isUnderAttack = false;
            }
            else {
                Memory.rooms[room].isUnderAttack = true;
            }
        }


        var areWeUnderAttack = Memory.rooms[room].isUnderAttack;

        if (areWeUnderAttack == true) {
            defenceHandler.run(room);
        }
        //else {
        linkHandler.run(room);
        spawnerHandler.run(room, areWeUnderAttack, isAttacking, armySize);
        creepHandler.run(room, areWeUnderAttack, isAttacking, flagToRallyAt, otherRoomCreepsRoomToGoTo);
        //}
    }
};
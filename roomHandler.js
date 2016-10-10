require('global');
require('prototype.room')();

const creepHandler = require ('creepHandler');
const linkHandler = require ('linkHandler');
const defenceHandler = require ('defenceHandler');
const towerHandler = require ('towerHandler');
const spawnerHandler = require ('spawnerHandler');

module.exports = {
    run: function (room) {

        if (Game.time % 20 == 0) {
            room.updateConstructionTargets();
        }

        var flagToRallyAt = room.findAttackFlag();

        var isAttacking;
        var armySize;

        var otherRoomCreepsRoomToGoTo = room.findOtherRoomToGoTo();
        //var remoteCreepFlags = room.findOtherRoomToGoTo();

        if (flagToRallyAt) {
            isAttacking = true;
            armySize = flagToRallyAt.memory.armySize;
        }


        if (Game.time % 3 == 0) {
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
        var towers = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER});
        for (let tower of towers) {
            towerHandler.repairRampart(room, tower);
        }

        linkHandler.run(room);
        spawnerHandler.run(room, areWeUnderAttack, isAttacking, armySize);
        creepHandler.run(room, areWeUnderAttack, isAttacking, flagToRallyAt, otherRoomCreepsRoomToGoTo);
        //}
    }
};
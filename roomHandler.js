require('global');
require('prototype.room')();

const creepHandler = require ('creepHandler');
const linkHandler = require ('linkHandler');
const defenceHandler = require ('defenceHandler');
const towerHandler = require ('towerHandler');
const spawnerHandler = require ('spawnerHandler');

module.exports = {
    run: function (room) {

        if (Game.time % 20 == 0 || !Memory.rooms[room].maxPartsForCarrier) {
            room.updateConstructionTargets();


            let minContEn = _.min(room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0}),
                'store.energy');

            if (minContEn) {
                if (minContEn >= 1000) {
                    Memory.rooms[room].maxPartsForCarrier = 6;
                }
                else if (minContEn < 500) {
                    Memory.rooms[room].maxPartsForCarrier = 4;
                }
                else {
                    Memory.rooms[room].maxPartsForCarrier = 5;
                }
            }


            if (room.storage) {
                var energyInStore = room.storage.store[RESOURCE_ENERGY];
                if (energyInStore >= 150000) {
                    Memory.rooms[room].energyMode = 'normal';
                }
                else if (energyInStore <= 20000) {
                    Memory.rooms[room].energyMode = 'saving';
                }
            }
            else if (room.controller.level < 4) {
                Memory.rooms[room].energyMode = 'upgrading';
            }
            else {
                Memory.rooms[room].energyMode = 'building';
            }

        }

        var flagToRallyAt = room.findAttackFlag();

        var isAttacking;
        var armySize;

        var otherRoomCreepsRoomToGoTo = room.findOtherRoomToGoTo();
        var remoteCreepFlags = room.getRemoteFlags();

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
        spawnerHandler.run(room, areWeUnderAttack, isAttacking, armySize, remoteCreepFlags);
        creepHandler.run(room, areWeUnderAttack, isAttacking, flagToRallyAt, otherRoomCreepsRoomToGoTo, remoteCreepFlags);
        //}
    }
};
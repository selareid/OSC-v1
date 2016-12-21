require('prototype.room')();

const creepHandler = require ('creepHandler');
const linkHandler = require ('linkHandler');
const defenceHandler = require ('defenceHandler');
const towerHandler = require ('towerHandler');
const spawnerHandler = require ('spawnerHandler');
const marketDealer = require ('marketDealer');

module.exports = {
    run: function (room) {

        room.cacheThingsInRoom();

        try {
            if (Game.time % 7 == 0) {
                if (Game.cpu.bucket > 2000) {
                    var terminal = room.terminal;
                    if (terminal) {
                        marketDealer.run(room, terminal);
                    }
                }

                linkHandler.run(room);
            }
        }
        catch (err) {
            if (err !== null && err !== undefined) {
                Game.notify("Error in every 7 tick room logic: \n" + err + "\n " + err.stack);
                console.log("Error in every 7 tick room logic: \n" + err + "\n" + err.stack + " room: " + room.name);
            }
        }
        
        if (Game.time % 20 == 0 || !Memory.rooms[room].maxPartsForCarrier) {

            if (Game.cpu.bucket < 2000) {
                if (Game.time % 100 == 0) {
                    room.updateConstructionTargets();
                }
            }
            else {
                room.updateConstructionTargets();
            }

            let minContEn = _.min(room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0}),
                'store.energy');

            if (minContEn) {
                if (minContEn >= 1000) {
                    Memory.rooms[room].maxPartsForCarrier = 16;
                }
                else if (minContEn < 500) {
                    Memory.rooms[room].maxPartsForCarrier = 10;
                }
                else {
                    Memory.rooms[room].maxPartsForCarrier = 12;
                }
            }


            if (room.storage) {
                var energyInStore = room.storage.store[RESOURCE_ENERGY];
                if (energyInStore >= 250000) {
                    Memory.rooms[room].energyMode = 'spendy';
                }
                else if (energyInStore >= 100000) {
                    Memory.rooms[room].energyMode = 'normal';
                }
                else if (energyInStore >= 40000) {
                    Memory.rooms[room].energyMode = 'ok';
                }
                else if (energyInStore <= 30000) {
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

        var flagToRallyAt = function () {
            if (Game.time % 3 == 0 || global[room.name].cachedAttackFlag == undefined) {
                var newAttackFlag = room.findAttackFlag();
                global[room.name].cachedAttackFlag = newAttackFlag;
                return newAttackFlag;
            }
            else {
                return global[room.name].cachedAttackFlag;
            }
        };

        var isAttacking;
        var armySize;

        if (Game.cpu.bucket > 2000) {
            var otherRoomCreepsRoomToGoTo = room.findOtherRoomToGoTo();
            var otherRoomCreepsRoomToGoToPos;
            if (otherRoomCreepsRoomToGoTo) {
                if (otherRoomCreepsRoomToGoTo.room && otherRoomCreepsRoomToGoTo.room.find(FIND_MY_SPAWNS)[0]) {
                    otherRoomCreepsRoomToGoTo.remove();
                }
                otherRoomCreepsRoomToGoToPos = otherRoomCreepsRoomToGoTo.pos.roomName
            }
        }

        if (Game.cpu.bucket > 2000) {
            var roomToStealFrom = room.findRoomToStealFrom();
            var roomToStealFromPos;
            if (roomToStealFrom) {
                roomToStealFromPos = roomToStealFrom.pos.roomName;
            }
        }

        var remoteCreepFlags = room.getRemoteFlags();

        if (Game.cpu.bucket > 2000) {
            if (flagToRallyAt) {
                isAttacking = true;
                armySize = flagToRallyAt.memory.armySize;
            }
        }

        if (Game.cpu.bucket > 2000) {
            var energyHelperFlag = room.getEnergyHelperFlags();
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

        var towers = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER});
        for (let tower of towers) {
            if (tower.energy > 500) {
                towerHandler.repairRampart(room, tower);
            }
        }

        try {
            spawnerHandler.run(room, areWeUnderAttack, isAttacking, armySize, remoteCreepFlags, otherRoomCreepsRoomToGoTo, roomToStealFrom, energyHelperFlag);
        }
        catch (err) {
            if (err !== null && err !== undefined) {
                Game.notify("Error in spawner logic: \n" + err + "\n " + err.stack);
                console.log("Error in spawner logic: \n" + err + "\n" + err.stack + " room: " + room.name);
            }
        }

        creepHandler.run(room, areWeUnderAttack, isAttacking, flagToRallyAt, otherRoomCreepsRoomToGoToPos, remoteCreepFlags, roomToStealFromPos, energyHelperFlag);

        //grafana room stuff
        Memory.stats['room.' + room.name + '.myRoom'] = 1;
        Memory.stats['room.' + room.name + '.energyAvailable'] = room.energyAvailable;
        Memory.stats['room.' + room.name + '.controllerProgress'] = room.controller.progress;
        Memory.stats['room.' + room.name + '.controllerProgressTotal'] = room.controller.progressTotal;

        var stored = 0;
        var storedTotal = 0;

        if (room.storage) {
            stored = room.storage.store[RESOURCE_ENERGY];
            storedTotal = room.storage.storeCapacity[RESOURCE_ENERGY];
        } else {
            stored = 0;
            storedTotal = 0
        }


        var energyMode = 0;

        switch (Memory.rooms[room].energyMode) {
            case 'normal':
                energyMode = 1;
                break;
            case 'ok':
                energyMode = 2;
                break;
            case 'saving':
                energyMode = 3;
                break;
            case 'upgrading':
                energyMode = 4;
                break;
            case 'building':
                energyMode = 5;
                break;
        }

        Memory.stats['room.' + room.name + '.storedEnergy'] = stored;
        Memory.stats['room.' + room.name + '.energyMode'] = energyMode;
    }
};

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

        //guard station flag stuff starts
        var setGuardStationFlagInGlobal = function() {
            if (global[room.name].guardStationFlag == undefined) {
                var newGuardStationFlag = room.getGuardStationFlag(); //get guard station flag (yes it's a redundant variable)
                global[room.name].guardStationFlag = newGuardStationFlag; // cache guard station flag
            }
        };
        //guard station flag stuff ends

        // otherRoomCreep stuff starts
        // other room creeps are creeps that start new rooms (build spawns, upgrade controller, etc)
        if (Game.cpu.bucket > 2000) {

            var getOtherRoomCreepsRoomToGoTo = function () {
                if (Game.time % 7 == 0 || global[room.name].cachedOtherRoomCreepsRoomToGoTo == undefined) {
                    var newOtherRoomCreepsRoomToGoTo = room.findOtherRoomToGoTo(); // get data
                    global[room.name].cachedOtherRoomCreepsRoomToGoTo = newOtherRoomCreepsRoomToGoTo; // cache data
                    return newOtherRoomCreepsRoomToGoTo; // return data
                }
                else {
                    return global[room.name].cachedOtherRoomCreepsRoomToGoTo; // use cached data
                }
            };
            var otherRoomCreepsRoomToGoTo = getOtherRoomCreepsRoomToGoTo(); //because getOtherRoomCreepsRoomToGoTo() is always a "truthy"

            var otherRoomCreepsRoomToGoToPos;
            if (otherRoomCreepsRoomToGoTo) { //if otherRoomCreepsRoomToGoTo is a thing
                if (otherRoomCreepsRoomToGoTo.room && otherRoomCreepsRoomToGoTo.room.find(FIND_MY_SPAWNS)[0]) { // if it has a spawn in it
                    otherRoomCreepsRoomToGoTo.remove(); // remove the flag
                    global[room.name].cachedOtherRoomCreepsRoomToGoTo = undefined;
                }
                otherRoomCreepsRoomToGoToPos = otherRoomCreepsRoomToGoTo.pos.roomName; // set room var to roomName
            }
        }
        // otherRoomCreep stuff ends

        //room to steal from stuff starts
        if (Game.cpu.bucket > 2000) {
            var roomToStealFrom = room.findRoomToStealFrom();
            var roomToStealFromPos;
            if (roomToStealFrom) {
                roomToStealFromPos = roomToStealFrom.pos.roomName;
            }
        }
        //room to steal from stuff ends

        //remote flag stuff starts
        var getRemoteCreepFlags = function () {
            if (Game.time % 23 == 0 || global[room.name].cachedRemoteCreepFlags == undefined) {
                var newRemoteCreepFlags = room.getRemoteFlags(); // get remote flags
                global[room.name].cachedRemoteCreepFlags = newRemoteCreepFlags; //cache remote flags
                return newRemoteCreepFlags; // use new remote flags
            }
            else {
                return global[room.name].cachedRemoteCreepFlags; //used cached remote flags
            }
        };
        var remoteCreepFlags = getRemoteCreepFlags(); //because getRemoteCreepFlags() is always a "truthy"
        //remote flag stuff ends

        //energyHelperFlag stuff starts
        if (Game.cpu.bucket > 2000) {
                if (Game.time % 7 == 0 || global[room.name].cachedEnergyHelperFlags == undefined) {
                    var newEnergyHelperFlags = room.getEnergyHelperFlags(); // get remote flags
                    global[room.name].cachedEnergyHelperFlags = newEnergyHelperFlags; //cache remote flags
                }
                var energyHelperFlag = global[room.name].cachedEnergyHelperFlags;
        }
        //energyHelperFlag stuff ends

        //check if we're under attack starts
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
        //check if we're under attack ends

        //defenceHandler stuff starts
        if (areWeUnderAttack == true) { //if we are under attack
            defenceHandler.run(room); //run defence handler
        }
        //defenceHandler stuff ends

        //tower stuff starts
        var towers = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER}); // get towers in room
        for (let tower of towers) {
            if (tower.energy > 500) { // if energy in tower is greater than x
                towerHandler.repairRampart(room, tower); // tower repairs ramparts
            }
        }
        //tower stuff ends

        try {
            spawnerHandler.run(room, remoteCreepFlags, roomToStealFrom);
        }
        catch (err) {
            if (err !== null && err !== undefined) {
                Game.notify("Error in spawner logic: \n" + err + "\n " + err.stack);
                console.log("Error in spawner logic: \n" + err + "\n" + err.stack + " room: " + room.name);
            }
        }

        creepHandler.run(room, areWeUnderAttack, otherRoomCreepsRoomToGoToPos, remoteCreepFlags, roomToStealFromPos, energyHelperFlag);

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

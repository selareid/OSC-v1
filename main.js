const roomHandler = require ('roomHandler');

module.exports.loop = function () {

    var allyUsername = ['BuffyNZ'];

    //memory stuff
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
        else if (!Memory.creeps[name].room) {
            Memory.creeps[name].room = '' + Game.creeps[name].room.name;
        }
    }
    for (let spawn in Memory.spawns) {
        if (!Game.spawns[spawn]) {
            delete Memory.spawns[spawn];
        }
        else if (!Memory.spawns[spawn].room) {
            Memory.spawns[spawn].room = '' + Game.spawns[spawn].room.name;
        }
    }
    for (let flag in Memory.flags) {
        if (!Game.flags[flag]) {
            delete Memory.spawns[flag];
        }

    }
    

    //do actual stuff
    for (let room_it in Game.rooms) {
        var room = Game.rooms[room_it];
        var spawn = room.find(FIND_MY_SPAWNS)[0];
        if (spawn) {

            if (!Memory.rooms[room]) {
                Memory.rooms[room] = {};
            }

            roomHandler.run(room, allyUsername);
        }
    }

//Grafana stuff
    if (Memory.stats == undefined) {
        Memory.stats = {}
    }

    var rooms = Game.rooms;
    var spawns = Game.spawns;
    for (let roomKey in rooms) {
        let room = Game.rooms[roomKey];
        var isMyRoom = (room.controller ? room.controller.my : 0);
        if (isMyRoom) {
            Memory.stats['room.' + room.name + '.myRoom'] = 1;
            Memory.stats['room.' + room.name + '.energyAvailable'] = room.energyAvailable;
            Memory.stats['room.' + room.name + '.energyCapacityAvailable'] = room.energyCapacityAvailable;
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

            Memory.stats['room.' + room.name + '.storedEnergy'] = stored
        } else {
            Memory.stats['room.' + room.name + '.myRoom'] = undefined
        }
    }
    Memory.stats['gcl.progress'] = Game.gcl.progress;
    Memory.stats['gcl.progressTotal'] = Game.gcl.progressTotal;
    Memory.stats['gcl.level'] = Game.gcl.level;
    for (let spawnKey in spawns) {
        let spawn = Game.spawns[spawnKey];
        Memory.stats['spawn.' + spawn.name + '.defenderIndex'] = spawn.memory['defenderIndex']
    }


    Memory.stats['cpu.bucket'] = Game.cpu.bucket;
    Memory.stats['cpu.limit'] = Game.cpu.limit;
    Memory.stats['cpu.getUsed'] = Game.cpu.getUsed()
};
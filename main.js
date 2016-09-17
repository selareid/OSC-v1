var roomHandler = require ('roomHandler');

module.exports.loop = function () {

    var allyUsername = ['BuffyNZ'];

    for (let name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            delete Memory.creeps[name];
        }
    }

    for (let name in Game.creeps) {
        let creep = Game.creeps[name];

        if (!creep.memory.room) {
            creep.memory.room = creep.room.name;
        }
    }

    for (let room_it in Game.rooms) {
        var room = Game.rooms[room_it];
        var spawn = room.find(FIND_MY_SPAWNS)[0];
        if (spawn) {
            roomHandler.run(room, allyUsername);
        }
    }
};
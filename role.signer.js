require('global');
require('prototype.creep')();
require('prototype.creepSpeech')();

module.exports = {
    run: function (room, creep) {

        creep.creepSpeech(room);

        if (!creep.memory.roomsBeenIn) {
            creep.memory.roomsBeenIn = [];
        }

        if (!creep.memory.roomsBeenIn.includes(creep.pos.roomName)) {
            creep.memory.roomsBeenIn.push(creep.pos.roomName);
        }

        var currentRoom = creep.room;
        var roomController = currentRoom.controller;
        if (!roomController || (roomController.sign && roomController.sign.username == creep.owner.username)) {
            this.moveToOtherRoom(room, creep);
        }
        else {
            this.signController(creep, roomController)
        }
    },
    
    signController: function (creep, controller) {
        var result = creep.signController(controller, 'Merry Christmas');
        if (result == -9) {
            creep.moveTo(controller);
        }
    },

    moveToOtherRoom: function (room, creep) {
        var roomToMoveTo = this.getRoomToGoTo(room, creep);

        creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(roomToMoveTo)), {reusePath: 10});
    },
    
    getRoomToGoTo: function (room, creep) {
        var exit = _.filter(Game.map.describeExits(creep.pos.roomName), (e) => !creep.memory.roomsBeenIn.includes(e) && !Game.rooms[e])[0];

        return exit;
    }
};
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
        else if (result == 0) {
            creep.memory.roomsBeenIn.push(controller.pos.roomName);
        }
    },

    moveToOtherRoom: function (room, creep) {
        var roomToMoveTo = this.getRoomToGoTo(room, creep);

        creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(roomToMoveTo)), {reusePath: 10});
    },
    
    getRoomToGoTo: function (room, creep) {
        var exits = Game.map.describeExits(creep.pos.roomName);

        var exit = _.filter(exits, (e) => !creep.memory.roomsBeenIn.includes(e) && !Game.rooms[e])[0];

        if (exit) return exit;
        else return exits[0];
    }
};
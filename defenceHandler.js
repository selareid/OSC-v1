require('global');

const towerHandler = require('towerHandler');

module.exports = {
    run: function (room) {
        var hostileCreepsInRoom = JSON.stringify(this.getHostileCreeps(room));

        if (Game.time % 20 == 0) {
            console.log('Enemy creeps spotted in room ' + room);
            console.log('The creeps are' + hostileCreepsInRoom);
            console.log('Prepare to die future self');

            Game.notify('Enemy creeps spotted in room ' + room);
            Game.notify('The creeps are' + hostileCreepsInRoom);
            Game.notify('Prepare to die future self');
        }

        var towers = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER});

        for (let tower of towers) {
            towerHandler.run(room, tower);
        }

    },

    getHostileCreeps: function (room) {
        var hostileCreepsInRoom = room.find(FIND_HOSTILE_CREEPS, {filter: (c) => Allies.includes(c.owner.username) == false});
        return hostileCreepsInRoom;
    },

    isUnderAttack: function (room) {

        var hostileCreepsInRoom = this.getHostileCreeps(room)[0];

        if (hostileCreepsInRoom && hostileCreepsInRoom.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
};
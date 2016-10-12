require('global');
const roleRemoteHarvester = require('role.remoteHarvester');
const roleRemoteHauler = require('role.remoteHauler');

module.exports = {
    run: function (room, creep, remoteCreepFlags) {
creep.say('yeah');
        if (remoteCreepFlags.length > 0) {

            if (!creep.memory.remoteFlag) {
                creep.memory.remoteFlag = this.setRemoteFlagMemory(room, creep);
            }

            var remoteFlag = creep.memory.remoteFlag;

            if (remoteFlag) {
                if (creep.memory.role == 'remoteHarvester') {
                    this.remoteHarvesterHandler(room, creep, remoteFlag);
                }
                else if (creep.memory.role == 'hauler') {
                    this.haulerHandler(room, creep, remoteFlag);
                }
            }

        }
        else {
            creep.moveTo(35, 40);
        }
    },

    setRemoteFlagMemory: function (room, creep) {

        var zeChosenFlag;

        switch (creep.memory.type) {
            case 'remoteHarvester':
                zeChosenFlag = _.filter(Game.flags, (f) => f.memory.type == 'remoteFlag' && f.memory.room == room.name && (!f.room ||
                _.sum(Game.creeps, (c) => (c.memory.role == 'remoteHarvester') && c.memory.room == room.name && creep.memory.remoteFlag == f.name) < f.room.find(FIND_SOURCES)));
                break;
            case 'hauler':
                zeChosenFlag = _.filter(Game.flags, (f) => f.memory.type == 'remoteFlag' && f.memory.room == room.name && (!f.room ||
                _.sum(Game.creeps, (c) => (c.memory.role == 'hauler') && c.memory.room == room.name && creep.memory.remoteFlag == f.name) <
                (_.sum(Game.creeps, (c) => (c.memory.role == 'remoteHarvester') && c.memory.room == room.name && creep.memory.remoteFlag == f.name) * 2)));
                break;
        }

        if (zeChosenFlag && zeChosenFlag.id) {
            return zeChosenFlag.id;
        }
        else {
            return undefined;
        }
    },

    remoteHarvesterHandler: function (room, creep, remoteFlag) {
        if (creep.pos.roomName != remoteFlag.pos.roomName) {
            creep.moveTo(remoteFlag, {reusePath: 30, ignoreCreeps: true});
        }
        else {
            roleRemoteHarvester.run(room, creep);
        }
    },

    haulerHandler: function (room, creep, remoteFlag) {
        roleRemoteHauler.run(room, creep, remoteFlag);
    }
};
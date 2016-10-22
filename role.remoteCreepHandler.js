require('global');
const roleRemoteHarvester = require('role.remoteHarvester');
const roleRemoteHauler = require('role.remoteHauler');

module.exports = {
    run: function (room, creep, remoteCreepFlags) {
creep.say('yeah');
        if (remoteCreepFlags.length > 0) {

            if (!creep.memory.remoteFlag) {
                creep.memory.remoteFlag = this.setRemoteFlagMemory(room, creep, remoteCreepFlags);
            }

            var remoteFlag = Game.flags[creep.memory.remoteFlag];

            if (remoteFlag) {

                if (!creep.pos.look(LOOK_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_ROAD})[0]) {
                    creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
                }

                if (creep.memory.role == 'remoteHarvester') {
                    this.remoteHarvesterHandler(room, creep, remoteFlag);
                }
                else if (creep.memory.role == 'remoteHauler') {
                    this.haulerHandler(room, creep, remoteFlag);
                }
            }
            else {
                creep.move(BOTTOM);
            }

        }
        else {
            creep.move(BOTTOM);
        }
    },

    setRemoteFlagMemory: function (room, creep, remoteCreepFlags) {

        var zeChosenFlag;

        switch (creep.memory.role) {
            case 'remoteHarvester':
                for (let flag in remoteCreepFlags) {
                    var amountOfCreepsAssignedToThisFlag = _.filter(Game.creeps, (c) => c.memory.room = room && c.memory.role == 'remoteHarvester' && c.memory.flag && c.memory.flag == flag.id).length;
                    if (amountOfCreepsAssignedToThisFlag < flag.memory.numberOfRemoteHarvesters) {
                        zeChosenFlag = flag;
                        break;
                    }
                }
                break;
            case 'remoteHauler':
                for (let flag in remoteCreepFlags) {
                    var amountOfCreepsAssignedToThisFlag = _.filter(Game.creeps, (c) => c.memory.room = room && c.memory.role == 'remoteHarvester' && c.memory.flag && c.memory.flag == flag.id).length;
                    if (amountOfCreepsAssignedToThisFlag < flag.memory.numberOfRemoteHaulers) {
                        zeChosenFlag = flag;
                        break;
                    }
                }
                break;
        }

        if (zeChosenFlag) {
            return zeChosenFlag.name;
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
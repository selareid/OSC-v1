module.exports = {
    run: function (room, creep) {

        var flag = Game.flags[creep.memory.flag];

        if (!flag) {
            let claimFlags = this.findClaimFlags(room, creep);
            let reserveFlags = this.findReserveFlags(room, creep);
            creep.memory.flag = this.findFlagToDo(room, creep, claimFlags, reserveFlags);
        }
        else {

            if (creep.room.name != flag.room.name) {
                creep.moveTo(flag.pos);
            }
            else {

                if (flag.memory.type == 'claimFlag') {
                    if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }

                }
                else if (flag.memory.type == 'reserveFlag') {
                    if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }

            }


        }
    },

    findClaimFlags: function (room, creep) {
        var claimFlags = [];
        _.forEach(_.filter(Game.flags, (f) => f.memory.type == 'claimFlag' && f.memory.room == creep.memory.room), function (flag) {
            claimFlags.push(flag);
        });
        return claimFlags;
    },

    findReserveFlags: function (room, creep) {
        var reserveFlags = [];
        _.forEach(_.filter(Game.flags, (f) => f.memory.type == 'reserveFlag' && f.memory.room == creep.memory.room), function (flag) {
            reserveFlags.push(flag);
        });
        return reserveFlags;
    },

    findFlagToDo: function (room, creep, claimFlags, reserveFlags) {

        for (let flag of claimFlags) {
            if (!Game.flags.flag.room.find(FIND_MY_CREEPS, {filter: (c) => c.memory.role == 'landlord'
                && c.memory.room == flag.room && c.memory.flag == flag.name})[0]) {
                return flag.name;
            }
        }
        for (let flag of reserveFlags) {
            let numberOfMyCreepsNearby = Game.flags.flag.room.find(FIND_MY_CREEPS, {filter: (c) => c.memory.role == 'landlord'
            && c.memory.room == flag.room && c.memory.flag == flag.name});

            if (numberOfMyCreepsNearby <= 2) {
                return flag.name;
            }
        }

    }
};
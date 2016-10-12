require('global');

module.exports = function () {
    StructureSpawn.prototype.createCustomCreep =
        function (room, energy, roleName, amountToSave) {

            var numberOfParts;
            var body = [];

            switch (roleName) {
                case 'harvester':
                    numberOfParts = Math.floor(((energy - (energy * amountToSave)) - 100) / 100);

                    if (numberOfParts > 6) {
                        numberOfParts = 6;
                    }
                    body.push(MOVE);
                    body.push(CARRY);
                    for (let i = 0; i < numberOfParts; i++) {
                        body.push(WORK);
                    }
                    return this.createCreep(body, undefined, {role: roleName, room: room.name, working: false});
                case 'distributor':
                    numberOfParts = Math.floor((energy - (energy * amountToSave)) / 150);
                    for (let i = 0; i < numberOfParts; i++) {
                        body.push(CARRY);
                        body.push(CARRY);
                        body.push(MOVE);
                    }
                    return this.createCreep(body, undefined, {role: roleName, room: room.name, working: false});
                case 'carrier':
                    numberOfParts = Math.floor((energy - (energy * amountToSave)) / 150);

                    if (numberOfParts > Memory.rooms[room].partsForCarrier) {
                        numberOfParts = Memory.rooms[room].partsForCarrier;
                    }

                    for (let i = 0; i < numberOfParts; i++) {
                        body.push(CARRY);
                        body.push(CARRY);
                        body.push(MOVE);
                    }
                    return this.createCreep(body, undefined, {role: roleName, room: room.name, working: false});
                case 'warrior':
                    var numberOfRanged = _.sum(Game.creeps, (c) => c.memory.role == 'warrior' && c.memory.room == room.name && c.getActiveBodyparts(RANGED_ATTACK) >= 1);
                    var numberOfAttack = _.sum(Game.creeps, (c) => c.memory.role == 'warrior' && c.memory.room == room.name && c.getActiveBodyparts(ATTACK) >= 1);


                    if (numberOfRanged <= 3) {
                        numberOfParts = Math.floor((energy - (energy * amountToSave)) / 200);
                        if (numberOfParts > 5) {
                            numberOfParts = 5;
                        }
                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(MOVE);
                            body.push(RANGED_ATTACK);
                        }
                    }
                    else if (numberOfAttack < 10) {
                        numberOfParts = Math.floor((energy - (energy * amountToSave)) / 210);
                        if (numberOfParts > 5) {
                            numberOfParts = 5;
                        }
                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(MOVE);
                            body.push(ATTACK);
                            body.push(ATTACK);
                        }
                    }
                    else {
                        numberOfParts = Math.floor((energy - (energy * amountToSave)) / 300);
                        for (let i = 0; i < numberOfParts; i++) {
                            body.push(MOVE);
                            body.push(HEAL);
                        }
                    }
                    return this.createCreep(body, undefined, {role: roleName, room: room.name, working: false});
                case 'upgrader':
                    numberOfParts = Math.floor(((energy - (energy * amountToSave)) - 100) / 100);

                    if (Memory.rooms[room].energyMode == 'saving' && numberOfParts > 7) {
                        numberOfParts = 7;
                    }
                    if (Memory.rooms[room].energyMode == 'ok' && numberOfParts > 15) {
                        numberOfParts = 15;
                    }

                    body.push(MOVE);
                    for (let i = 0; i < numberOfParts; i++) {
                        body.push(WORK);
                    }
                    body.push(CARRY);
                    return this.createCreep(body, undefined, {role: roleName, room: room.name, working: false});
                case 'builder':
                    numberOfParts = Math.floor((energy - (energy * amountToSave)) / 200);

                    for (let i = 0; i < numberOfParts; i++) {
                        body.push(WORK);
                        body.push(CARRY);
                        body.push(MOVE);
                    }
                    return this.createCreep(body, undefined, {role: roleName, room: room.name, working: false});
                case 'repairer':
                    numberOfParts = Math.floor((energy - (energy * amountToSave)) / 200);

                    for (let i = 0; i < numberOfParts; i++) {
                        body.push(WORK);
                        body.push(CARRY);
                        body.push(MOVE);
                    }
                    return this.createCreep(body, undefined, {role: roleName, room: room.name, working: false});
                case 'defenceManager':
                    numberOfParts = Math.floor((energy - (energy * amountToSave)) / 200);

                    for (let i = 0; i < numberOfParts; i++) {
                        body.push(WORK);
                        body.push(CARRY);
                        body.push(MOVE);
                    }
                    return this.createCreep(body, undefined, {role: roleName, room: room.name, working: false});
                case 'landlord':
                    numberOfParts = Math.floor((energy - (energy * amountToSave)) / 650);

                    if (numberOfParts >= 1) {
                        body.push(CLAIM);
                        body.push(MOVE);
                    }
                    return this.createCreep(body, undefined, {role: roleName, room: room.name, working: false});
                case 'remoteHarvester':
                    numberOfParts = Math.floor(((energy - (energy * amountToSave)) - 100) / 150);
                    if (numberOfParts > 7) {
                        numberOfParts = 7;
                    }
                    body.push(CARRY);
                    body.push(MOVE);
                    for (let i = 0; i < numberOfParts; i++) {
                        body.push(MOVE);
                        body.push(WORK);
                    }
                    return this.createCreep(body, undefined, {role: roleName, room: room.name, working: false});
                case 'remoteHauler':
                    numberOfParts = Math.floor(((energy - (energy * amountToSave)) - 150) / 150);
                    body.push(WORK);
                    body.push(MOVE);
                    for (let i = 0; i < numberOfParts; i++) {
                        body.push(MOVE);
                        body.push(CARRY);
                        body.push(CARRY);
                    }
                    return this.createCreep(body, undefined, {role: roleName, room: room.name, working: false});
                case 'otherRoomCreep':
                    numberOfParts = Math.floor((energy - (energy * amountToSave)) / 200);

                    for (let i = 0; i < numberOfParts; i++) {
                        body.push(WORK);
                        body.push(MOVE);
                        body.push(CARRY);
                    }
                    return this.createCreep(body, undefined, {role: roleName, room: room.name, working: false});
                default:
                    return undefined;
            }

        }
};
module.exports = function () {
    StructureSpawn.prototype.createCustomCreep =
        function (room, energy, roleName, amountToSave) {

            var numberOfParts;
            var body = [];

            if (roleName == 'harvester') {
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
            }
            else if (roleName == 'distributor') {
                numberOfParts = Math.floor(((energy - (energy * amountToSave)) - 100) / 150);
                body.push(WORK);
                for (let i = 0; i < numberOfParts; i++) {
                    body.push(CARRY);
                    body.push(CARRY);
                    body.push(MOVE);
                }
                return this.createCreep(body, undefined, {role: roleName, room: room.name, working: false});
            }
            else if (roleName == 'carrier') {
                numberOfParts = Math.floor(((energy - (energy * amountToSave)) - 100) / 150);
                body.push(WORK);
                for (let i = 0; i < numberOfParts; i++) {
                    body.push(CARRY);
                    body.push(CARRY);
                    body.push(MOVE);
                }
                return this.createCreep(body, undefined, {role: roleName, room: room.name, working: false});
            }
            else if (roleName == 'warrior') {

                var numberOfRanged = _.sum(Game.creeps, (c) => c.memory.role == 'warrior' && c.memory.room == room.name && c.getActiveBodyparts(RANGED_ATTACK) >= 1);

                if (numberOfRanged < 2) {
                    numberOfParts = Math.floor((energy - (energy * amountToSave)) / 200);
                    if (numberOfParts > 4) {
                        numberOfParts = 4;
                    }
                    for (let i = 0; i < numberOfParts; i++) {
                        body.push(MOVE);
                        body.push(RANGED_ATTACK);
                    }
                }
                else {
                    numberOfParts = Math.floor((energy - (energy * amountToSave)) / 210);
                    if (numberOfParts > 3) {
                        numberOfParts = 3;
                    }
                    for (let i = 0; i < numberOfParts; i++) {
                        body.push(MOVE);
                        body.push(ATTACK);
                        body.push(ATTACK);
                    }
                }

                return this.createCreep(body, undefined, {role: roleName, room: room.name, working: false});
            }
            else if (roleName == 'upgrader') {
                numberOfParts = Math.floor(((energy - (energy * amountToSave)) - 50) / 150);
                body.push(MOVE);
                for (let i = 0; i < numberOfParts; i++) {
                    body.push(WORK);
                    body.push(CARRY);
                }
                return this.createCreep(body, undefined, {role: roleName, room: room.name, working: false});
            }
            else if (roleName == 'builder') {
                numberOfParts = Math.floor((energy - (energy * amountToSave)) / 200);

                for (let i = 0; i < numberOfParts; i++) {
                    body.push(WORK);
                    body.push(CARRY);
                    body.push(MOVE);
                }
                return this.createCreep(body, undefined, {role: roleName, room: room.name, working: false});
            }
            else if (roleName == 'repairer') {
                numberOfParts = Math.floor((energy - (energy * amountToSave)) / 200);

                for (let i = 0; i < numberOfParts; i++) {
                    body.push(WORK);
                    body.push(CARRY);
                    body.push(MOVE);
                }
                return this.createCreep(body, undefined, {role: roleName, room: room.name, working: false});
            }
            else if (roleName == 'defenceManager') {
                numberOfParts = Math.floor((energy - (energy * amountToSave)) / 200);

                for (let i = 0; i < numberOfParts; i++) {
                    body.push(WORK);
                    body.push(CARRY);
                    body.push(MOVE);
                }
                return this.createCreep(body, undefined, {role: roleName, room: room.name, working: false});
            }
            else {
                return 'SPAWNING ERROR';
            }
        }
};
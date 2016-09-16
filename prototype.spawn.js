module.exports = function () {
    StructureSpawn.prototype.createCustomCreep =
        function (room, energy, roleName, amountToSave) {

            var numberOfParts;
            var body = [];

            if (roleName == 'harvester') {
                numberOfParts = Math.floor(((energy - (energy * amountToSave)) - 100) / 100);

                if (numberOfParts > 5) {
                    numberOfParts = 5;
                }
                body.push(MOVE);
                body.push(CARRY);
                for (let i = 0; i < numberOfParts; i++) {
                    body.push(WORK);
                }
                return this.createCreep(body, undefined, {role: roleName, room: room, working: false});
            }
            else if (roleName == 'distributor') {
                numberOfParts = Math.floor(((energy - (energy * amountToSave))-100) / 150);
                body.push(WORK);
                for (let i = 0; i < numberOfParts; i++) {
                    body.push(CARRY);
                    body.push(CARRY);
                    body.push(MOVE);
                }
                return this.createCreep(body, undefined, {role: roleName, room: room, working: false});
            }
            else if (roleName == 'carrier') {
                numberOfParts = Math.floor(((energy - (energy * amountToSave))-100) / 150);
                body.push(WORK);
                for (let i = 0; i < numberOfParts; i++) {
                    body.push(CARRY);
                    body.push(CARRY);
                    body.push(MOVE);
                }
                return this.createCreep(body, undefined, {role: roleName, room: room, working: false});
            }
            else if (roleName == 'upgrader') {
                numberOfParts = Math.floor(((energy - (energy * amountToSave))-50) / 100);
                body.push(MOVE);
                for (let i = 0; i < numberOfParts; i++) {
                    body.push(WORK);
                    body.push(CARRY);
                }
                return this.createCreep(body, undefined, {role: roleName, room: room, working: false});
            }
            else if (roleName == 'builder') {
                numberOfParts = Math.floor((energy - (energy * amountToSave)) / 200);

                for (let i = 0; i < numberOfParts; i++) {
                    body.push(WORK);
                    body.push(CARRY);
                    body.push(MOVE);
                }
                return this.createCreep(body, undefined, {role: roleName, room: room, working: false});
            }
            else if (roleName == 'wallRepairer') {
                numberOfParts = Math.floor((energy - (energy * amountToSave)) / 200);

                for (let i = 0; i < numberOfParts; i++) {
                    body.push(WORK);
                    body.push(CARRY);
                    body.push(MOVE);
                }
                return this.createCreep(body, undefined, {role: roleName, room: room, working: false});
            }
            else {
                return 'SPAWNING ERROR';
            }
        }
};
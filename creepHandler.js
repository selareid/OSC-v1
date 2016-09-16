var roleHarvester = require ('role.harvester');
var roleCarrier = require ('role.carrier');

module.exports = {
    run: function (room) {

        for (let name in Game.creeps) {
            let creep = Game.creeps[name];

            if (!creep.memory.room) {
                creep.memory.room = creep.room;
            }

            if (creep.memory.role == 'harvester') {
                roleHarvester.run(room, creep);
            }
            else if (creep.memory.role == 'carrier') {
                roleCarrier.run(room, creep);
            }
            else {
                creep.say('', true);
                console.log('Unknown Creep Role ' + creep.memory.role);
            }

        }

    }
};
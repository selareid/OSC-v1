var roleHarvester = require ('role.harvester');

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
            else {
                console.log('Unknown Creep');
            }

        }

    }
};
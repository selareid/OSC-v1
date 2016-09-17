var roleHarvester = require ('role.harvester');
var roleCarrier = require ('role.carrier');
var roleDistributor = require ('role.distributor');
var roleUpgrader = require ('role.upgrader');

module.exports = {
    run: function (room) {

        var creepsInRoom = _.filter(Game.creeps, (c) => c.memory.room == room)

        for (let name in creepsInRoom) {
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
            else if (creep.memory.role == 'distributor') {
                roleDistributor.run(room, creep);
            }
            else {
                creep.say('ERROR!!!', true);
                console.log('Unknown Creep Role ' + creep.memory.role);
            }

        }

    }
};
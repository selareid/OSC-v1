var roleHarvester = require ('role.harvester');
var roleCarrier = require ('role.carrier');
var roleDistributor = require ('role.distributor');
var roleUpgrader = require ('role.upgrader');
var roleBuilder = require ('role.builder');
var roleDefenceManager = require ('role.defenceManager');

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
            else if (creep.memory.role == 'upgrader') {
                roleUpgrader.run(room, creep);
            }
            else if (creep.memory.role == 'builder') {
                var percentOfDamageBeforeRepair = 0.8;
                roleBuilder.run(room, creep, percentOfDamageBeforeRepair);
            }
            else if (creep.memory.role == 'defenceManager') {
                var hitsOfDefence = 300000;
                roleDefenceManager.run(room, creep, hitsOfDefence);
            }
            else {
                creep.say('ERROR!!!', true);
                console.log('Unknown Creep Role ' + creep.memory.role);
            }

        }

    }
};
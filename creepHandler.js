var roleHarvester = require ('role.harvester');
var roleCarrier = require ('role.carrier');
var roleDistributor = require ('role.distributor');
var roleUpgrader = require ('role.upgrader');
var roleBuilder = require ('role.builder');
var roleRepairer = require ('role.repairer');
var roleDefenceManager = require ('role.defenceManager');

module.exports = {
    run: function (room) {

        for (let name in Game.creeps) {
            let creep = Game.creeps[name];

            if (creep.memory.room == room.name) {

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
                    roleBuilder.run(room, creep);
                }
                else if (creep.memory.role == 'repairer') {
                    roleRepairer.run(room, creep);
                }
                else if (creep.memory.role == 'defenceManager') {

                    var hitsOfDefence = this.getHitsOfDefence(room);

                    roleDefenceManager.run(room, creep, hitsOfDefence);
                }
                else {
                    creep.say('ERROR!!!', true);
                    console.log('Unknown Creep Role ' + creep.memory.role);
                    creep.memory.role = 'upgrader';
                }
            }
        }
    },

    getHitsOfDefence: function (room) {
        var wallsRamparts = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_WALL|| STRUCTURE_RAMPART});
        var allHits = [];

        for (let structure of wallsRamparts) {
            allHits.push(structure.hits);
        }
        return _.min(allHits) + 1;
    }
};
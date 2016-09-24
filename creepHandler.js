const roleHarvester = require ('role.harvester');
const roleCarrier = require ('role.carrier');
const roleDistributor = require ('role.distributor');
const roleUpgrader = require ('role.upgrader');
const roleBuilder = require ('role.builder');
const roleRepairer = require ('role.repairer');
const roleDefenceManager = require ('role.defenceManager');
const roleWarrior = require ('role.warrior');
const roleLandlord = require ('role.landlord');
const otherRoomCreep = require ('role.otherRoomCreep');

module.exports = {
    run: function (room, allyUsername, isUnderAttack, isAttacking, armySize, roomToAttack, roomToRallyAt) {

        for (let name in Game.creeps) {
            let creep = Game.creeps[name];

            if (creep.memory.room == room.name && creep.spawning === false) {

                if (creep.memory.role == 'harvester') {
                    roleHarvester.run(room, creep);
                }
                else if (creep.memory.role == 'carrier') {
                    roleCarrier.run(room, creep);
                }
                else if (creep.memory.role == 'distributor') {
                    var energyOfTowers = this.getEnergyOfTower(room);
                    roleDistributor.run(room, creep, energyOfTowers);
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
                else if (creep.memory.role == 'warrior') {
                    roleWarrior.run(room, creep, allyUsername, isUnderAttack, isAttacking, armySize, roomToAttack, roomToRallyAt);
                }
                else if (creep.memory.role == 'landlord') {
                    roleLandlord.run(room, creep);
                }
                else if (creep.memory.role == 'otherRoomCreep') {
                    otherRoomCreep.run(room, creep, 'E58N8');
                }
                else if (creep.memory.role === '') {
                    creep.say('ERROR!!!', true);
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
        var wallsRamparts = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_WALL|| s.structureType == STRUCTURE_RAMPART});
        var allHits = [];

        for (let structure of wallsRamparts) {
            allHits.push(structure.hits);
        }
        return _.min(allHits) + 1;
    },

    getEnergyOfTower: function (room) {
        var towers = room.find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER});
        var allEnergy = [];

        for (let tower of towers) {
            allEnergy.push(tower.energy);
        }
        return _.min(allEnergy) + 1;
    }
};
require('global');

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
    run: function (room, isUnderAttack, isAttacking, flagToRallyAt, roomToGoTo) {

        for (let name in Game.creeps) {
            let creep = Game.creeps[name];

            if (creep.memory.room == room.name && creep.spawning === false) {

                switch(creep.memory.role) {
                    case 'harvester':
                        roleHarvester.run(room, creep);
                        break;
                    case 'carrier':
                        roleCarrier.run(room, creep);
                        break;
                    case 'distributor':
                        var energyOfTowers = this.getEnergyOfTower(room);
                        roleDistributor.run(room, creep, energyOfTowers);
                        break;
                    case 'upgrader':
                        roleUpgrader.run(room, creep);
                        break;
                    case 'builder':
                        roleBuilder.run(room, creep);
                        break;
                    case 'repairer':
                        roleRepairer.run(room, creep);
                        break;
                    case 'defenceManager':
                        var hitsOfDefence = this.getHitsOfDefence(room);
                        roleDefenceManager.run(room, creep, hitsOfDefence, isUnderAttack);
                        break;
                    case 'warrior':
                        roleWarrior.run(room, creep, isUnderAttack, isAttacking, flagToRallyAt);
                        break;
                    case 'landlord':
                        roleLandlord.run(room, creep);
                        break;
                    case 'otherRoomCreep':
                        otherRoomCreep.run(room, creep, roomToGoTo);
                        break;
                    case '':
                        creep.say('ERROR!!!', true);
                        break;
                    default:
                        creep.say('ERROR!!!', true);
                        console.log('Unknown Creep Role ' + creep.memory.role);
                        creep.memory.role = 'upgrader';
                        break;
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
        return _.min(allHits) + 1000;
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
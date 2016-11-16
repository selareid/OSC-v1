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
const energyThief = require ('role.energyThief');
const roleRemoteCreepHandler = require ('role.remoteCreepHandler');
const roleEnergyHelper = require ('role.energyOtherRoomHelper');
const roleMiner = require ('role.miner');

module.exports = {
    run: function (room, isUnderAttack, isAttacking, flagToRallyAt, roomToGoTo, remoteCreepFlags, roomToTakeFrom, energyHelperFlag) {

        try {
            for (let name in Game.creeps) {
                 let creep = Game.creeps[name];
            
                
            if (creep.memory.room == room.name && creep.spawning === false) {

                switch (creep.memory.role) {
                    case 'harvester':
                        roleHarvester.run(room, creep);
                        break;
                    case 'carrier':
                        if (room.storage) {
                            roleCarrier.run(room, creep);
                        }
                        else {
                            creep.memory.role = 'distributor';
                        }
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
                        roleDefenceManager.run(room, creep, isUnderAttack);
                        break;
                    case 'warrior':
                        roleWarrior.run(room, creep, isUnderAttack, isAttacking, flagToRallyAt);
                        break;
                    case 'landlord':
                        roleLandlord.run(room, creep);
                        break;
                    case 'otherRoomCreep':
                        if (roomToGoTo) {
                            otherRoomCreep.run(room, creep, roomToGoTo);
                        }
                        else {
                            creep.memory.role = 'upgrader';
                        }
                        break;
                    case 'energyThief':
                        if (roomToTakeFrom != undefined) {
                            energyThief.run(room, creep, roomToTakeFrom);
                        }
                        else {
                            creep.memory.role = 'carrier';
                        }
                        break;
                    case 'remoteHarvester':
                        roleRemoteCreepHandler.run(room, creep, remoteCreepFlags);
                        break;
                    case 'remoteHauler':
                        roleRemoteCreepHandler.run(room, creep, remoteCreepFlags);
                        break;
                    case 'energyHelper':
                        if (energyHelperFlag != undefined) {
                            roleEnergyHelper.run(room, creep, energyHelperFlag);
                        }
                        else {
                            creep.memory.role = 'carrier';
                        }
                        break;
                    case 'miner':
                        roleMiner.run(room, creep);
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
        }
        catch (err) {
            if (err !== null && err !== undefined) {
                Game.notify("Error in memory management logic: \n" + err + "\n " + err.stack);
                console.log("Error in memory management logic: \n" + err + "\n" + err.stack);
            }
        }

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

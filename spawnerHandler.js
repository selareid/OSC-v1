require('global');

require('prototype.spawn')();

module.exports = {
    run: function (room, isUnderAttack, isAttacking, armySize) {

        var spawn = room.find(FIND_MY_SPAWNS, {filter: (s) => s.spawning != true})[0];

        if (spawn) {

            var minimumNumberOfHarvesters = 3;
            var minimumNumberOfCarriers = 3;
            var minimumNumberOfDistributors = 1;
            var minimumNumberOfUpgraders = 2;
            var minimumNumberOfBuilders = 1;
            var minimumNumberOfRepairers = 1;
            var minimumNumberOfDefenceManagers = 1;
            var minimumNumberOfWarriors = 7;
            var minimumNumberOfLandlords = 0;
            var minimumNumberOfOtherRoomCreeps = 0;

            if (!room.storage) {
                minimumNumberOfUpgraders = 4;
                minimumNumberOfCarriers = 0;
                minimumNumberOfDistributors = 3;
                minimumNumberOfBuilders = 4;
            }

            var numberOfSources = room.find(FIND_SOURCES).length;
            var amountOfBigHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester' && c.memory.room == room.name
            && c.getActiveBodyparts(WORK) >= 5);
            if (amountOfBigHarvesters >= numberOfSources) {
                minimumNumberOfHarvesters = 2;
            }

            var numberOfClaimFlags = _.sum(Game.flags, (f) => f.memory.type == 'claimFlag' && f.memory.room == room.name);
            var numberOfReserveFlags = _.sum(Game.flags, (f) => f.memory.type == 'reserveFlag' && f.memory.room == room.name);
            minimumNumberOfLandlords = numberOfClaimFlags + (numberOfReserveFlags * 2);

            if (isUnderAttack === true) {
                let numberOfHostiles = room.find(FIND_HOSTILE_CREEPS, {
                    filter: (c) => c.getActiveBodyparts(ATTACK) >= 1 || c.getActiveBodyparts(RANGED_ATTACK) >= 1
                    || c.getActiveBodyparts(HEAL) >= 1 || c.getActiveBodyparts(WORK) >= 1
                }).length;

                minimumNumberOfWarriors = Math.round(numberOfHostiles * 2.10);
                minimumNumberOfUpgraders = 0;
                minimumNumberOfBuilders = 1;
                minimumNumberOfRepairers = 1;
                minimumNumberOfDefenceManagers = 1;
                minimumNumberOfLandlords = 0;
                minimumNumberOfOtherRoomCreeps = 0;
            }
            else if (isAttacking === true) {
                minimumNumberOfWarriors = armySize;
            }

            var creepAboutToDie = _.min(_.filter(Game.creeps, (c) => c.ticksToLive <= 400 && c.memory.role), 'ticksToLive');

            if (creepAboutToDie.length > 0) {
                let role = creepAboutToDie.memory.role;

                switch (role) {
                    case 'harvester':
                        minimumNumberOfHarvesters += 1;
                        break;
                    case 'carrier':
                        minimumNumberOfCarriers += 1;
                        break;
                    case 'distributor':
                        minimumNumberOfDistributors += 1;
                        break;
                    case 'upgrader':
                        minimumNumberOfUpgraders += 1;
                        break;
                    case 'builder':
                        minimumNumberOfBuilders += 1;
                        break;
                    case 'repairer':
                        minimumNumberOfRepairers += 1;
                        break;
                    case 'defenceManager':
                        minimumNumberOfDefenceManagers += 1;
                        break;
                    case 'warrior':
                        minimumNumberOfWarriors += 1;
                        break;
                    case 'landlord':
                        minimumNumberOfLandlords += 1;
                        break;
                    case 'otherRoomCreep':
                        minimumNumberOfOtherRoomCreeps += 1;
                        break;
                }
            }

            var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester' && c.memory.room == room.name);
            var numberOfCarriers = _.sum(Game.creeps, (c) => c.memory.role == 'carrier' && c.memory.room == room.name);
            var numberOfDistributors = _.sum(Game.creeps, (c) => c.memory.role == 'distributor' && c.memory.room == room.name);
            var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader' && c.memory.room == room.name);
            var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder' && c.memory.room == room.name);
            var numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repairer' && c.memory.room == room.name);
            var numberOfDefenceManagers = _.sum(Game.creeps, (c) => c.memory.role == 'defenceManager' && c.memory.room == room.name);
            var numberOfWarriors = _.sum(Game.creeps, (c) => c.memory.role == 'warrior' && c.memory.room == room.name);
            var numberOfLandlords = _.sum(Game.creeps, (c) => c.memory.role == 'landlord' && c.memory.room == room.name);
            var numberOfOtherRoomCreeps = _.sum(Game.creeps, (c) => c.memory.role == 'otherRoomCreep' && c.memory.room == room.name);

            // console.log('Harvesters ' + numberOfHarvesters);
            // console.log('Carriers ' + numberOfCarriers);
            // console.log('Distributors ' + numberOfDistributors);
            // console.log('Upgraders ' + numberOfUpgraders);
            // console.log('Builders ' + numberOfBuilders);
            // console.log('Repairer ' + numberOfRepairers);
            // console.log('Defence Managers ' + numberOfDefenceManagers);
            // console.log('Warriors ' + numberOfWarriors);
            // console.log('Landlords ' + numberOfLandlords);
            // console.log('Other Room Creeps ' + numberOfOtherRoomCreeps);

            var energy = spawn.room.energyAvailable;
            var amountToSave = 0;
            var name = undefined;

            if (room.energyCapacityAvailable >= 400 && (numberOfHarvesters >= minimumNumberOfHarvesters)
                && (numberOfDistributors >= minimumNumberOfDistributors)
                && (numberOfCarriers >= minimumNumberOfCarriers)) {
                amountToSave = 0.1;//in percent
            }

            if (room.energyAvailable >= 300) {
                if (numberOfHarvesters < minimumNumberOfHarvesters) {
                    name = spawn.createCustomCreep(room, energy, 'harvester', amountToSave);
                }
                else if (numberOfDistributors < minimumNumberOfDistributors) {
                    name = spawn.createCustomCreep(room, energy, 'distributor', amountToSave);
                }
                else if (numberOfCarriers < minimumNumberOfCarriers) {
                    name = spawn.createCustomCreep(room, energy, 'carrier', amountToSave);
                }
                else if (numberOfUpgraders < minimumNumberOfUpgraders) {

                    if (room.storage) {
                        if (room.storage.store[RESOURCE_ENERGY] > 100000) {
                            name = spawn.createCustomCreep(room, room.energyCapacityAvailable, 'upgrader', amountToSave);
                        }
                        else {
                            name = spawn.createCustomCreep(room, energy, 'upgrader', amountToSave);
                        }
                    }
                    else {
                        name = spawn.createCustomCreep(room, energy, 'upgrader', amountToSave);
                    }

                }
                else if (numberOfBuilders < minimumNumberOfBuilders) {
                    name = spawn.createCustomCreep(room, energy, 'builder', amountToSave);
                }
                else if (numberOfRepairers < minimumNumberOfRepairers) {
                    name = spawn.createCustomCreep(room, energy, 'repairer', amountToSave);
                }
                else if (numberOfDefenceManagers < minimumNumberOfDefenceManagers) {
                    name = spawn.createCustomCreep(room, energy, 'defenceManager', amountToSave);
                }
                else if (numberOfWarriors < minimumNumberOfWarriors) {
                    name = spawn.createCustomCreep(room, energy, 'warrior', amountToSave);
                }
                else if (numberOfLandlords < minimumNumberOfLandlords && energy - (energy * amountToSave) >= 650) {
                    name = spawn.createCustomCreep(room, energy, 'landlord', amountToSave);
                }
                else if (numberOfOtherRoomCreeps < minimumNumberOfOtherRoomCreeps) {
                    name = spawn.createCustomCreep(room, energy, 'otherRoomCreep', amountToSave);
                }

                if ((name in Game.creeps)) {
                    console.log("Creating Creep " + name);
                }
            }


            if (numberOfHarvesters <= 0) {
                Game.notify("No harvesters in room " + room);
                console.log("No harvesters in room " + room);
            }

        }

    }
};
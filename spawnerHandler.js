require('global');

require('prototype.spawn')();

module.exports = {
    run: function (room, isUnderAttack, isAttacking, armySize, remoteCreepFlags, otherRoomCreepsRoomToGoTo) {

        this.checkMemory(room);


        var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester' && c.memory.room == room.name);
        var numberOfCarriers = _.sum(Game.creeps, (c) => c.memory.role == 'carrier' && c.memory.room == room.name);
        var numberOfDistributors = _.sum(Game.creeps, (c) => c.memory.role == 'distributor' && c.memory.room == room.name);
        var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader' && c.memory.room == room.name);
        var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder' && c.memory.room == room.name);
        var numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repairer' && c.memory.room == room.name);
        var numberOfDefenceManagers = _.sum(Game.creeps, (c) => c.memory.role == 'defenceManager' && c.memory.room == room.name);
        var numberOfWarriors = _.sum(Game.creeps, (c) => c.memory.role == 'warrior' && c.memory.room == room.name);
        var numberOfLandlords = _.sum(Game.creeps, (c) => c.memory.role == 'landlord' && c.memory.room == room.name);
        var numberOfRemoteHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'remoteHarvester' && c.memory.room == room.name);
        var numberOfRemoteHaulers = _.sum(Game.creeps, (c) => c.memory.role == 'remoteHauler' && c.memory.room == room.name);
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
        // add more cause this ain't all the roles ^

        if (numberOfHarvesters <= 0) {
            Game.notify("No harvesters in room " + room);
            console.log("No harvesters in room " + room);
        }

        //grafana population stats
        Memory.stats['room.' + room.name + '.creeps' + '.numberOfHarvesters'] = numberOfHarvesters;
        Memory.stats['room.' + room.name + '.creeps' + '.numberOfCarriers'] = numberOfCarriers;
        Memory.stats['room.' + room.name + '.creeps' + '.numberOfDistributors'] = numberOfDistributors;
        Memory.stats['room.' + room.name + '.creeps' + '.numberOfUpgraders'] = numberOfUpgraders;
        Memory.stats['room.' + room.name + '.creeps' + '.numberOfBuilders'] = numberOfBuilders;
        Memory.stats['room.' + room.name + '.creeps' + '.numberOfRepairers'] = numberOfRepairers;
        Memory.stats['room.' + room.name + '.creeps' + '.numberOfDefenceManagers'] = numberOfDefenceManagers;
        Memory.stats['room.' + room.name + '.creeps' + '.numberOfWarriors'] = numberOfWarriors;
        Memory.stats['room.' + room.name + '.creeps' + '.numberOfLandlords'] = numberOfLandlords;
        Memory.stats['room.' + room.name + '.creeps' + '.numberOfRemoteHarvesters'] = numberOfRemoteHarvesters;
        Memory.stats['room.' + room.name + '.creeps' + '.numberOfRemoteHaulers'] = numberOfRemoteHaulers;
        Memory.stats['room.' + room.name + '.creeps' + '.numberOfOtherRoomCreeps'] = numberOfOtherRoomCreeps;

        var minimumNumberOfHarvesters = Memory.rooms[room].populationGoal.harvesters;
        var minimumNumberOfCarriers = Memory.rooms[room].populationGoal.carriers;
        var minimumNumberOfDistributors = Memory.rooms[room].populationGoal.distributors;
        var minimumNumberOfUpgraders = Memory.rooms[room].populationGoal.upgraders;
        var minimumNumberOfBuilders = Memory.rooms[room].populationGoal.builders;
        var minimumNumberOfRepairers = Memory.rooms[room].populationGoal.repairers;
        var minimumNumberOfDefenceManagers = Memory.rooms[room].populationGoal.defenceManagers;
        var minimumNumberOfWarriors = Memory.rooms[room].populationGoal.warriors;
        var minimumNumberOfLandlords = Memory.rooms[room].populationGoal.landlords;
        var minimumNumberOfRemoteHarvesters = Memory.rooms[room].populationGoal.remoteHarvesters;
        var minimumNumberOfRemoteHaulers = Memory.rooms[room].populationGoal.remoteHaulers;
        var minimumNumberOfOtherRoomCreeps = Memory.rooms[room].populationGoal.otherRoomCreeps;

        if (numberOfHarvesters == 0 && Memory.rooms[room].spawnQueue.normal[0] != 'harvester') {
            Memory.rooms[room].spawnQueue.normal.splice(0, 0, 'harvester');
        }
        else {

            var harvestersInQueue = _.sum(Memory.rooms[room].spawnQueue.normal, (r) => r == 'harvester');
            var carriersInQueue = _.sum(Memory.rooms[room].spawnQueue.normal, (r) => r == 'carrier');
            var distributorsInQueue = _.sum(Memory.rooms[room].spawnQueue.normal, (r) => r == 'distributor');
            var upgradersInQueue = _.sum(Memory.rooms[room].spawnQueue.normal, (r) => r == 'upgrader');
            var buildersInQueue = _.sum(Memory.rooms[room].spawnQueue.normal, (r) => r == 'builder');
            var repairersInQueue = _.sum(Memory.rooms[room].spawnQueue.normal, (r) => r == 'repairer');
            var defenceManagersInQueue = _.sum(Memory.rooms[room].spawnQueue.normal, (r) => r == 'defenceManager');
            var warriorsInQueue = _.sum(Memory.rooms[room].spawnQueue.normal, (r) => r == 'warrior');
            var landlordsInQueue = _.sum(Memory.rooms[room].spawnQueue.normal, (r) => r == 'landlord');
            var remoteHarvestersInQueue = _.sum(Memory.rooms[room].spawnQueue.normal, (r) => r == 'remoteHarvester');
            var remoteHaulersInQueue = _.sum(Memory.rooms[room].spawnQueue.normal, (r) => r == 'remoteHauler');
            var otherRoomCreepsInQueue = _.sum(Memory.rooms[room].spawnQueue.normal, (r) => r == 'otherRoomCreep');

            var maximumNumberOfWarriors = Memory.rooms[room].populationGoal.maxWarriors;

            if (otherRoomCreepsRoomToGoTo) {
                minimumNumberOfOtherRoomCreeps = otherRoomCreepsRoomToGoTo.length * 10;
            }

            if (!room.storage) {
                minimumNumberOfUpgraders = 4;
                minimumNumberOfCarriers = 0;
                minimumNumberOfDistributors = 3;
                minimumNumberOfBuilders = 4;
            }
            else if (room.storage.store[RESOURCE_ENERGY] <= 150000) {
                minimumNumberOfCarriers = 4;
            }
            else {
                minimumNumberOfCarriers = 3;
            }

            var numberOfSources = room.find(FIND_SOURCES).length;
            var amountOfBigHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester' && c.memory.room == room.name
            && c.getActiveBodyparts(WORK) >= 5);
            if (amountOfBigHarvesters >= numberOfSources) {
                minimumNumberOfHarvesters = 2;
            }

            var lowestDefenceHits = _.min(_.filter(room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_RAMPART || s.structureType == STRUCTURE_WALL})), 'hits').hits;
            if (lowestDefenceHits < 60000) {
                minimumNumberOfDefenceManagers = 4;
            }
            else if (lowestDefenceHits < 100000) {
                minimumNumberOfDefenceManagers = 3;
            }
            else if (lowestDefenceHits < 200000) {
                minimumNumberOfDefenceManagers = 2;
            }

            var numberOfClaimFlags = _.sum(Game.flags, (f) => f.memory.type == 'claimFlag' && f.memory.room == room.name);
            var reserveFlags = _.filter(Game.flags, (f) => f.memory.type == 'reserveFlag' && f.memory.room == room.name);
            var amountOfReservers = this.getAmountOfReservers(room, reserveFlags);
            minimumNumberOfLandlords = numberOfClaimFlags + amountOfReservers;

            for (let flag of remoteCreepFlags) {
                minimumNumberOfRemoteHarvesters += flag.memory.numberOfRemoteHarvesters;
                minimumNumberOfRemoteHaulers += flag.memory.numberOfRemoteHaulers;
            }

            switch (Memory.rooms[room].energyMode) {
                case 'normal':
                    break;
                case 'ok':
                    minimumNumberOfUpgraders = 1;
                    minimumNumberOfBuilders = 1;
                    minimumNumberOfRepairers = 1;
                    //minimumNumberOfDefenceManagers = 1;
                    minimumNumberOfWarriors = 2;
                    //minimumNumberOfLandlords = 0;
                    //minimumNumberOfRemoteHarvesters = 0;
                    //minimumNumberOfRemoteHaulers = 0;
                    //minimumNumberOfOtherRoomCreeps = 0;

                    maximumNumberOfWarriors = 0;
                    break;
                case 'saving':
                    minimumNumberOfUpgraders = 1;
                    minimumNumberOfBuilders = 1;
                    minimumNumberOfRepairers = 1;
                    //minimumNumberOfDefenceManagers = 1;
                    minimumNumberOfWarriors = 1;
                    minimumNumberOfLandlords = 0;
                    minimumNumberOfRemoteHarvesters = 0;
                    minimumNumberOfRemoteHaulers = 0;
                    minimumNumberOfOtherRoomCreeps = 0;

                    maximumNumberOfWarriors = 0;
                    break;
                case 'upgrading':
                    minimumNumberOfHarvesters = 5;
                    minimumNumberOfUpgraders = 3;
                    break;
                case 'building':
                    minimumNumberOfBuilders = 3;
                    break;
            }

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
                minimumNumberOfRemoteHarvesters = 0;
                minimumNumberOfRemoteHaulers = 0;
                minimumNumberOfOtherRoomCreeps = 0;
            }
            else if (isAttacking === true) {
                minimumNumberOfWarriors = armySize;
            }

            var creepAboutToDie = _.filter(Game.creeps, (c) => c.memory.room == room && c.ticksToLive <= 150 && c.memory.role)[0];

            if (creepAboutToDie) {
                let role = creepAboutToDie.memory.role;
                Memory.rooms[room].spawnQueue.normal.push(role);
            }

            var creepToAddToQueue;

            if (minimumNumberOfHarvesters > harvestersInQueue + numberOfHarvesters) {
                creepToAddToQueue = 'harvester';
            }
            else if (minimumNumberOfDistributors > distributorsInQueue + numberOfDistributors) {
                creepToAddToQueue = 'distributor';
            }
            else if (minimumNumberOfCarriers > carriersInQueue + numberOfCarriers) {
                creepToAddToQueue = 'carrier';
            }
            else if (minimumNumberOfUpgraders > upgradersInQueue + numberOfUpgraders) {
                creepToAddToQueue = 'upgrader';
            }
            else if (minimumNumberOfBuilders > buildersInQueue + numberOfBuilders) {
                creepToAddToQueue = 'builder';
            }
            else if (minimumNumberOfRepairers > repairersInQueue + numberOfRepairers) {
                creepToAddToQueue = 'repairer';
            }
            else if (minimumNumberOfDefenceManagers > defenceManagersInQueue + numberOfDefenceManagers) {
                creepToAddToQueue = 'defenceManager';
            }
            else if (minimumNumberOfWarriors > warriorsInQueue + numberOfWarriors) {
                creepToAddToQueue = 'warrior';
            }
            else if (minimumNumberOfLandlords > landlordsInQueue + numberOfLandlords) {
                creepToAddToQueue = 'landlord';
            }
            else if (minimumNumberOfRemoteHarvesters > remoteHarvestersInQueue + numberOfRemoteHarvesters) {
                creepToAddToQueue = 'remoteHarvester';
            }
            else if (minimumNumberOfRemoteHaulers > remoteHaulersInQueue + numberOfRemoteHaulers) {
                creepToAddToQueue = 'remoteHauler';
            }
            else if (minimumNumberOfOtherRoomCreeps > otherRoomCreepsInQueue + numberOfOtherRoomCreeps) {
                creepToAddToQueue = 'otherRoomCreep';
            }

            if (creepToAddToQueue) {
                Memory.rooms[room].spawnQueue.normal.push(creepToAddToQueue);
            }

        }



        var spawns = room.find(FIND_MY_SPAWNS, {filter: (s) => s.spawning != true});
        var spawn = spawns[Game.time % spawns.length];

        if (spawn) {

            var energy = spawn.room.energyAvailable/spawns.length;
            var amountToSave = 0;//in percent
            var name = undefined;

            if (room.energyCapacityAvailable >= 400) {
                if (Memory.rooms[room].energyMode == 'saving') {
                    amountToSave = 0.3;
                }
                else if (Memory.rooms[room].energyMode == 'ok') {
                    amountToSave = 0.2;
                }
                else if ((numberOfHarvesters >= minimumNumberOfHarvesters)
                    && (numberOfDistributors >= minimumNumberOfDistributors)
                    && (numberOfCarriers >= 2)) {
                    amountToSave = 0.1;
                }
            }

            if (room.energyAvailable >= 300) {

                spawn.createCustomCreep(room, energy, Memory.rooms[room].spawnQueue.normal[0], amountToSave);


                if (Game.creeps[name]) {
                    Memory.rooms[room].spawnQueue.normal.shift;
                    console.log("Creating Creep " + name);
                }
            }
        }

        Memory.rooms[room].populationGoal.harvesters = minimumNumberOfHarvesters;
        Memory.rooms[room].populationGoal.carriers = minimumNumberOfCarriers;
        Memory.rooms[room].populationGoal.distributors = minimumNumberOfDistributors;
        Memory.rooms[room].populationGoal.upgraders = minimumNumberOfUpgraders;
        Memory.rooms[room].populationGoal.builders = minimumNumberOfBuilders;
        Memory.rooms[room].populationGoal.repairers = minimumNumberOfRepairers;
        Memory.rooms[room].populationGoal.defenceManagers = minimumNumberOfDefenceManagers;
        Memory.rooms[room].populationGoal.warriors = minimumNumberOfWarriors;
        Memory.rooms[room].populationGoal.landlords = minimumNumberOfLandlords;
        Memory.rooms[room].populationGoal.remoteHarvesters = minimumNumberOfRemoteHarvesters;
        Memory.rooms[room].populationGoal.remoteHaulers = minimumNumberOfRemoteHaulers;
        Memory.rooms[room].populationGoal.otherRoomCreeps = minimumNumberOfOtherRoomCreeps;

        Memory.rooms[room].populationGoal.maxWarriors = maximumNumberOfWarriors;
    },

    checkMemory: function (room) {
        if (!Memory.rooms[room].spawnQueue || !Memory.rooms[room].spawnQueue.normal) {
            Memory.rooms[room].spawnQueue = {};
            Memory.rooms[room].spawnQueue.normal = [];
        }
        if (!Memory.rooms[room].populationGoal) {
            Memory.rooms[room].populationGoal = {};
        }

        if (Memory.rooms[room].populationGoal.harvesters == undefined) {
            Memory.rooms[room].populationGoal.harvesters = 3;
        }
        if (Memory.rooms[room].populationGoal.carriers == undefined) {
            Memory.rooms[room].populationGoal.carriers = 2;
        }
        if (Memory.rooms[room].populationGoal.distributors == undefined) {
            Memory.rooms[room].populationGoal.distributors = 1;
        }
        if (Memory.rooms[room].populationGoal.upgraders == undefined) {
            Memory.rooms[room].populationGoal.upgraders = 2;
        }
        if (Memory.rooms[room].populationGoal.builders == undefined) {
            Memory.rooms[room].populationGoal.builders = 1;
        }
        if (Memory.rooms[room].populationGoal.repairers == undefined) {
            Memory.rooms[room].populationGoal.repairers = 1;
        }
        if (Memory.rooms[room].populationGoal.defenceManagers == undefined) {
            Memory.rooms[room].populationGoal.defenceManagers = 1;
        }
        if (Memory.rooms[room].populationGoal.warriors == undefined) {
            Memory.rooms[room].populationGoal.warriors = 3;
        }
        if (Memory.rooms[room].populationGoal.landlords == undefined) {
            Memory.rooms[room].populationGoal.landlords = 0;
        }
        if (Memory.rooms[room].populationGoal.remoteHarvesters == undefined) {
            Memory.rooms[room].populationGoal.remoteHarvesters = 0;
        }
        if (Memory.rooms[room].populationGoal.remoteHaulers == undefined) {
            Memory.rooms[room].populationGoal.remoteHaulers = 0;
        }
        if (Memory.rooms[room].populationGoal.otherRoomCreeps == undefined) {
            Memory.rooms[room].populationGoal.otherRoomCreeps = 0;
        }
        if (Memory.rooms[room].populationGoal.maxWarriors == undefined) {
            Memory.rooms[room].populationGoal.maxWarriors = 7;
        }
    },

    getAmountOfReservers: function (room, reserveFlags) {

        var amountToReturn = 0;

        for (let flag of reserveFlags) {
            if (flag.room) {
                if (flag.room.controller.reservation) {
                    if (flag.room.controller.reservation.ticksToEnd <= 2500) {
                        amountToReturn += 2;
                    }
                    else {
                        var landlordsInRoom = flag.room.find(FIND_CREEPS, {filter: (c) => c.memory.role == 'landlord' && c.memory.flag == flag.name});
                        if (landlordsInRoom == 0) {
                            amountToReturn += 1;
                        }
                    }
                }
                else {
                    amountToReturn += 2;
                }
            }
            else {
                amountToReturn += 2;
            }
        }

        return amountToReturn + _.sum(Game.creeps, (c) => c.memory.role == 'landlord' && c.memory.room == room && reserveFlags.includes(Game.flags[c.memory.flag]));

    }
};

require('global');

require('prototype.spawn')();

module.exports = {
    run: function (room, isUnderAttack, isAttacking, armySize, remoteCreepFlags, otherRoomFlag, roomToStealFromFlag, energyHelperFlag) {

        //make sure memory is set
        if (!Memory.rooms[room].spawnQueue || Game.time % 50 == 0) {
            this.checkMemory(room);
        }

        //get number of each creeps of each role
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
        var numberOfEnergyThiefs = _.sum(Game.creeps, (c) => c.memory.role == 'energyThief' && c.memory.room == room.name);
        var numberOfEnergyHelpers = _.sum(Game.creeps, (c) => c.memory.role == 'energyHelper' && c.memory.room == room.name);
        var numberOfMiners = _.sum(Game.creeps, (c) => c.memory.role == 'miner' && c.memory.room == room.name);

        // debugging
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

        //if no harvesters email me and spam console
        if (numberOfHarvesters <= 0) {
            if (Game.time % 200 == 0) {
                Game.notify("No harvesters in room " + room);
            }
            console.log("No harvesters in room " + room);
        }


        if (numberOfHarvesters == 0 && (Memory.rooms[room].spawnQueue.priority[0] != 'harvester' || Memory.rooms[room].spawnQueue.normal[0] != 'harvester')) {
            //if no harvesters in room and next role in queue is not harvester
            Memory.rooms[room].spawnQueue.normal = [];
            Memory.rooms[room].spawnQueue.priority = [];
            Memory.rooms[room].spawnQueue.priority.push('harvester');
            Memory.rooms[room].spawnQueue.normal.push('harvester');
        }
        else {

            //get number of each role in normal queue
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
            var energyThiefsInQueue = _.sum(Memory.rooms[room].spawnQueue.normal, (r) => r == 'energyThief');
            var energyHelpersInQueue = _.sum(Memory.rooms[room].spawnQueue.normal, (r) => r == 'energyHelper');
            var minersInQueue = _.sum(Memory.rooms[room].spawnQueue.normal, (r) => r == 'miner');

            //get number of each role in priority queue
            var harvestersInPriorityQueue = _.sum(Memory.rooms[room].spawnQueue.priority, (r) => r == 'harvester');
            var distributorsInPriorityQueue = _.sum(Memory.rooms[room].spawnQueue.priority, (r) => r == 'distributor');
            var carriersInPriorityQueue = _.sum(Memory.rooms[room].spawnQueue.priority, (r) => r == 'carrier');
            var warriorsInPriorityQueue = _.sum(Memory.rooms[room].spawnQueue.priority, (r) => r == 'warrior');

            //get number of warriors in war queue
            var warriorsInWarQueue = _.sum(Memory.rooms[room].spawnQueue.war, (r) => r == 'warrior');

            //get the population goal from memory
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
            var minimumNumberOfEnergyThiefs = Memory.rooms[room].populationGoal.energyThiefs;
            var minimumNumberOfEnergyHelpers = Memory.rooms[room].populationGoal.energyHelpers;
            var minimumNumberOfMiners = Memory.rooms[room].populationGoal.miners;

            var maximumNumberOfWarriors = Memory.rooms[room].populationGoal.maxWarriors;

            //get flag for other room creep and if it exists set minimumNumberOfOtherRoomCreeps to the numberOfCreeps in flag memory, same for energy thief flag
            if (otherRoomFlag && otherRoomFlag.memory != undefined) {
                minimumNumberOfOtherRoomCreeps = otherRoomFlag.memory.numberOfCreeps;
            }
            if (roomToStealFromFlag && roomToStealFromFlag.memory != undefined) {
                minimumNumberOfEnergyThiefs = roomToStealFromFlag.memory.numberOfCreeps;
            }
            if (energyHelperFlag && energyHelperFlag.memory != undefined) {
                minimumNumberOfEnergyHelpers = energyHelperFlag.memory.numberOfCreeps;
            }

            //if there's no storage you don't need carriers
            if (!room.storage) {
                minimumNumberOfCarriers = 0;

                let maxDropEn = _.max(room.find(FIND_DROPPED_ENERGY, {filter: (e) => e.amount > 200}), '.amount').amount;

                if (maxDropEn) {
                        minimumNumberOfUpgraders = 2;
                }
            }
            else {
                minimumNumberOfCarriers = 3;
            }

            //set number of harvesters
            var numberOfSources = room.find(FIND_SOURCES).length;
            var amountOfBigHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester' && c.memory.room == room.name
            && c.getActiveBodyparts(WORK) >= 5);
            if (amountOfBigHarvesters >= numberOfSources) {
                minimumNumberOfHarvesters = 2;
            }

            //set minimumNumberOfDefenceManagers
            var lowestDefenceHits = _.min(_.filter(room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_RAMPART || s.structureType == STRUCTURE_WALL})), 'hits').hits;
            if (lowestDefenceHits > 80000 && lowestDefenceHits < 100000) {
                minimumNumberOfDefenceManagers = 2;
            }
            else if (lowestDefenceHits > 50000) {
                      minimumNumberOfDefenceManagers = 3;
            }

            //set number of landlords
            var numberOfClaimFlags = _.sum(Game.flags, (f) => f.memory.type == 'claimFlag' && f.memory.room == room.name);
            var reserveFlags = _.filter(Game.flags, (f) => f.memory.type == 'reserveFlag' && f.memory.room == room.name);
            var amountOfReservers = this.getAmountOfReservers(room, reserveFlags);
            minimumNumberOfLandlords = numberOfClaimFlags + amountOfReservers;

            //set number of remote creeps
            var tempRemoteHarvesters = 0;
            var tempRemoteHaulers = 0;

            for (let flag of remoteCreepFlags) {
                tempRemoteHarvesters += flag.memory.numberOfRemoteHarvesters;
                tempRemoteHaulers += flag.memory.numberOfRemoteHaulers;
            }

            minimumNumberOfRemoteHarvesters = tempRemoteHarvesters;
            minimumNumberOfRemoteHaulers = tempRemoteHaulers;

            if (room.find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_EXTRACTOR})[0]) {
                minimumNumberOfMiners = 1;
            }
            else {
                minimumNumberOfMiners = 0;
            }

            //set number of some creep roles depending on energy mode
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
                    //minimumNumberOfEnergyThiefs = 0;

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
//minimumNumberOfEnergyThiefs = 0;
                    minimumNumberOfMiners = 0;

                    maximumNumberOfWarriors = 0;
                    break;
                case 'upgrading':
                    minimumNumberOfHarvesters = 5;
                    minimumNumberOfUpgraders = 3;
                    break;
                case 'building':
                    minimumNumberOfBuilders = 3;
                    break;
                default:
                    break;
            }

            //if under attack over ride everything
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
                minimumNumberOfEnergyHelpers = 0;
                minimumNumberOfMiners = 0;
            }
            else if (isAttacking === true) {
                minimumNumberOfWarriors = armySize;
            }

            //add creeps close to death to queue
            var creepAboutToDie = _.filter(Game.creeps, (c) => c.memory.room == room && c.ticksToLive <= 150 && c.memory.role)[0];

            if (creepAboutToDie) {
                let role = creepAboutToDie.memory.role;
                var whichQueue = 0; //0 is normal queue and 1 is priority 2 is war queue
                switch (role) {
                    case 'harvester':
                        if (harvestersInPriorityQueue == 0) {
                            whichQueue = 1;
                        }
                        break;
                    case 'distributor':
                        if (distributorsInPriorityQueue == 0) {
                            whichQueue = 1;
                        }
                        break;
                    case 'carrier':
                        if (carriersInPriorityQueue == 0) {
                            whichQueue = 1;
                        }
                        break;
                    case 'warrior':
                        if (warriorsInPriorityQueue == 0) {
                            whichQueue = 1;
                        }
                        else if (warriorsInWarQueue == 0) {
                            whichQueue = 2;
                        }
                        break;
                }

                switch (whichQueue) {
                    case 0:
                        Memory.rooms[room].spawnQueue.normal.push(role);
                        break;
                    case 1:
                        Memory.rooms[room].spawnQueue.priority.push(role);
                        break;
                    case 2:
                        Memory.rooms[room].spawnQueue.war.push(role);
                        break;
                }
            }

            //add creep that needs to be added to queue to queue
            var creepToAddToQueue;
            var queueToAddTo = 0; // 0 is normal and 1 is priority 2 is war

            if (minimumNumberOfHarvesters > harvestersInQueue + numberOfHarvesters + harvestersInPriorityQueue) {
                if (!harvestersInPriorityQueue > 0) {
                    queueToAddTo = 1;
                }
                creepToAddToQueue = 'harvester';
            }
            else if (minimumNumberOfDistributors > distributorsInQueue + numberOfDistributors + distributorsInPriorityQueue) {
                if (!distributorsInPriorityQueue > 0) {
                    queueToAddTo = 1;
                }
                creepToAddToQueue = 'distributor';
            }
            else if (minimumNumberOfCarriers > carriersInQueue + numberOfCarriers + carriersInPriorityQueue) {
                if (!carriersInPriorityQueue > 0) {
                    queueToAddTo = 1;
                }
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
            else if (minimumNumberOfWarriors > warriorsInQueue + numberOfWarriors + warriorsInPriorityQueue + warriorsInWarQueue) {
                if (!warriorsInPriorityQueue > 0) {
                    queueToAddTo = 1;
                }
                else if (warriorsInQueue > 2) {
                    queueToAddTo = 2;
                }
                creepToAddToQueue = 'warrior';
            }
            else if (minimumNumberOfEnergyThiefs > energyThiefsInQueue + numberOfEnergyThiefs) {
                creepToAddToQueue = 'energyThief';
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
            else if (minimumNumberOfEnergyHelpers > energyHelpersInQueue + numberOfEnergyHelpers) {
                creepToAddToQueue = 'energyHelper';
            }
            else if (minimumNumberOfMiners > minersInQueue + numberOfMiners) {
                creepToAddToQueue = 'miner';
            }

            if (creepToAddToQueue) {
                switch (queueToAddTo) {
                    case 0:
                        Memory.rooms[room].spawnQueue.normal.push(creepToAddToQueue);
                        break;
                    case 1:
                        Memory.rooms[room].spawnQueue.priority.push(creepToAddToQueue);
                        break;
                    case 2:
                        Memory.rooms[room].spawnQueue.war.push(creepToAddToQueue);
                        break;
                }
            }
        }


        //spawn next creep in queue
        var spawns = room.find(FIND_MY_SPAWNS, {filter: (s) => s.spawning != true});
        var spawn = spawns[Game.time % spawns.length];

        if (spawn) {

            var energy = spawn.room.energyAvailable / spawns.length;
            var amountToSave = 0;//in percent
            var name = undefined;
            var queueUsed = 0; // 0 is normal and 1 is priority 2 is war

            if (room.energyAvailable >= 400) {

                if (Memory.rooms[room].energyMode == 'saving') {
                    amountToSave = 0.35;
                }
                else if (Memory.rooms[room].energyMode == 'ok') {
                    amountToSave = 0.25;
                }
                else if ((numberOfHarvesters >= minimumNumberOfHarvesters)
                    && (numberOfDistributors >= minimumNumberOfDistributors)
                    && (numberOfCarriers >= 2)) {
                    amountToSave = 0.15;
                }
            }

            if (room.energyAvailable >= 300) {

                if (!Memory.rooms[room].spawnQueue.war || !Memory.rooms[room].spawnQueue.war.length > 0 || Game.time % 5 == 0 || Game.time % 5 == 1) {
                    if (!Memory.rooms[room].spawnQueue.priority.length > 0 || Game.time % 3 == 0 || Game.time % 3 == 1) {
                        name = spawn.createCustomCreep(room, energy, Memory.rooms[room].spawnQueue.normal[0], amountToSave);
                    }
                    else {
                        queueUsed = 1;
                        name = spawn.createCustomCreep(room, energy, Memory.rooms[room].spawnQueue.priority[0], amountToSave);
                    }
                }
                else {
                    queueUsed = 2;
                    name = spawn.createCustomCreep(room, energy, Memory.rooms[room].spawnQueue.war[0], amountToSave);
                }

                if (Game.creeps[name]) {

                    switch (queueUsed) {
                        case 0:
                            Memory.rooms[room].spawnQueue.normal.splice(0, 1);
                            break;
                        case 1:
                            Memory.rooms[room].spawnQueue.priority.splice(0, 1);
                            break;
                        case 2:
                            Memory.rooms[room].spawnQueue.war.splice(0, 1);
                            break;
                    }
                    console.log("Creating Creep " + name);
                }
            }
        }

        //memory "cleanup"
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
        Memory.rooms[room].populationGoal.energyThiefs = minimumNumberOfEnergyThiefs;
        Memory.rooms[room].populationGoal.energyHelpers = minimumNumberOfEnergyHelpers;
        Memory.rooms[room].populationGoal.miners = minimumNumberOfMiners;

        Memory.rooms[room].populationGoal.maxWarriors = maximumNumberOfWarriors;

        //grafana population stats stuff
        // Memory.stats['room.' + room.name + '.creeps' + '.numberOfHarvesters'] = numberOfHarvesters;
        // Memory.stats['room.' + room.name + '.creeps' + '.numberOfCarriers'] = numberOfCarriers;
        // Memory.stats['room.' + room.name + '.creeps' + '.numberOfDistributors'] = numberOfDistributors;
        // Memory.stats['room.' + room.name + '.creeps' + '.numberOfUpgraders'] = numberOfUpgraders;
        // Memory.stats['room.' + room.name + '.creeps' + '.numberOfBuilders'] = numberOfBuilders;
        // Memory.stats['room.' + room.name + '.creeps' + '.numberOfRepairers'] = numberOfRepairers;
        // Memory.stats['room.' + room.name + '.creeps' + '.numberOfDefenceManagers'] = numberOfDefenceManagers;
        // Memory.stats['room.' + room.name + '.creeps' + '.numberOfWarriors'] = numberOfWarriors;
        // Memory.stats['room.' + room.name + '.creeps' + '.numberOfLandlords'] = numberOfLandlords;
        // Memory.stats['room.' + room.name + '.creeps' + '.numberOfRemoteHarvesters'] = numberOfRemoteHarvesters;
        // Memory.stats['room.' + room.name + '.creeps' + '.numberOfRemoteHaulers'] = numberOfRemoteHaulers;
        // Memory.stats['room.' + room.name + '.creeps' + '.numberOfOtherRoomCreeps'] = numberOfOtherRoomCreeps;
        // Memory.stats['room.' + room.name + '.creeps' + '.numberOfEnergyThiefs'] = numberOfEnergyThiefs;
        // Memory.stats['room.' + room.name + '.creeps' + '.numberOfEnergyHelpers'] = numberOfEnergyHelpers;
        //add more cause that's not all

        var normalSpawnQueue = Memory.rooms[room].spawnQueue.normal;
        Memory.stats['room.' + room.name + '.spawnQueues' + '.normal'] = normalSpawnQueue.length;
        var prioritySpawnQueue = Memory.rooms[room].spawnQueue.priority;
        Memory.stats['room.' + room.name + '.spawnQueues' + '.priority'] = prioritySpawnQueue.length;
        var warSpawnQueue = Memory.rooms[room].spawnQueue.war;
        Memory.stats['room.' + room.name + '.spawnQueues' + '.war'] = warSpawnQueue.length;

    },

    checkMemory: function (room) {
        //memory if undefined checking and setting to default value if undefined
        if (!Memory.rooms[room].spawnQueue) {
            Memory.rooms[room].spawnQueue = {};
        }
        if (!Memory.rooms[room].spawnQueue.normal) {
            Memory.rooms[room].spawnQueue.normal = [];
        }
        if (!Memory.rooms[room].spawnQueue.priority) {
            Memory.rooms[room].spawnQueue.priority = [];
        }
        if (!Memory.rooms[room].spawnQueue.war) {
            Memory.rooms[room].spawnQueue.war = [];
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
        if (Memory.rooms[room].populationGoal.energyThiefs == undefined) {
            Memory.rooms[room].populationGoal.energyThiefs = 0;
        }
        if (Memory.rooms[room].populationGoal.energyHelpers == undefined) {
            Memory.rooms[room].populationGoal.energyHelpers = 0;
        }
        if (Memory.rooms[room].populationGoal.miners == undefined) {
            Memory.rooms[room].populationGoal.miners = 0;
        }
        if (Memory.rooms[room].populationGoal.maxWarriors == undefined) {
            Memory.rooms[room].populationGoal.maxWarriors = 7;
        }
    },

    getAmountOfReservers: function (room, reserveFlags) {
//find the amount of reservers we need to add to the number of landlords
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

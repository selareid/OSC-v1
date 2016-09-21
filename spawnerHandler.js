require('prototype.spawn')();

module.exports = {
    run: function (room) {

        var spawn = room.find(FIND_MY_SPAWNS, {filter: (s) => s.spawning != true})[0];

        if (spawn) {

            var minimumNumberOfHarvesters = 6;
            var minimumNumberOfCarriers = 3;
            var minimumNumberOfDistributors = 1;
            var minimumNumberOfUpgraders = 2;
            var minimumNumberOfBuilders = 1;
            var minimumNumberOfRepairers = 1;
            var minimumNumberOfDefenceManagers = 1;

            var numberOfSources = room.find(FIND_SOURCES).length;

            var amountOfBigHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester' && c.memory.room == room.name
            && c.getActiveBodyparts(WORK) >= 5);

            if (amountOfBigHarvesters >= numberOfSources) {
                minimumNumberOfHarvesters = 2;
            }
            else {
                var creepsGonnaDie = room.find(FIND_MY_CREEPS, {filter: (c) => c.memory.role == 'harvester' && c.ticksToLive <= 200})[0];
                if (creepsGonnaDie) {
                    minimumNumberOfHarvesters += 1;
                }
            }

            if (!room.storage) {
                minimumNumberOfCarriers = 0;
            }

            var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester' && c.memory.room == room.name);
            var numberOfCarriers = _.sum(Game.creeps, (c) => c.memory.role == 'carrier' && c.memory.room == room.name);
            var numberOfDistributors = _.sum(Game.creeps, (c) => c.memory.role == 'distributor' && c.memory.room == room.name);
            var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader' && c.memory.room == room.name);
            var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder' && c.memory.room == room.name);
            var numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repairer' && c.memory.room == room.name);
            var numberOfDefenceManagers = _.sum(Game.creeps, (c) => c.memory.role == 'defenceManager' && c.memory.room == room.name);

            // console.log('Harvesters ' + numberOfHarvesters);
            // console.log('Carriers ' + numberOfCarriers);
            // console.log('Distributors ' + numberOfDistributors);
            // console.log('Upgraders ' + numberOfUpgraders);
            // console.log('Builders ' + numberOfBuilders);
            // console.log('Repairer ' + numberOfRepairers);
            // console.log('Defence Managers ' + numberOfDefenceManagers);

            var energy = spawn.room.energyAvailable;
            var amountToSave = 0;
            var name = undefined;

            if ((numberOfHarvesters >= minimumNumberOfHarvesters)
                && (numberOfDistributors >= minimumNumberOfDistributors)
                && (numberOfCarriers >= minimumNumberOfCarriers)) {
                amountToSave = 0.1;//in percent
            }


            if (energy - (energy * amountToSave) >= 300) {

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
                    name = spawn.createCustomCreep(room, energy, 'upgrader', amountToSave);
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

                if (name) {
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

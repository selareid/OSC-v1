require('global');

module.exports = {
    run: function (room, creep, isUnderAttack, isAttacking, flagToRallyAt) {

        var creepAttackRange;
        if (creep.getActiveBodyparts(HEAL) >= 1) {
            //put creep healer code here
        }
        else if (creep.getActiveBodyparts(RANGED_ATTACK) >= 1) {
            creepAttackRange = 3;
            this.creepAttack(room, creep, isUnderAttack, creepAttackRange, isAttacking, flagToRallyAt);
        }
        else if (creep.getActiveBodyparts(ATTACK) >= 1) {
            creepAttackRange = 1;
            this.creepAttack(room, creep, isUnderAttack, creepAttackRange, isAttacking, flagToRallyAt);
        }

    },

    creepAttack: function (room, creep, isUnderAttack, creepAttackRange, isAttacking, flagToRallyAt) {

        var armySize = flagToRallyAt.memory.armySize;
        var roomToAttack = flagToRallyAt.memory.whereToAttack;
        var whenToAttack = flagToRallyAt.memory.whenToAttack;

        if (isUnderAttack === true) {
            if (creep.room.name == room) {
                var target = this.findTarget(room, creep);
                if (target) {
                    var rampart = this.findRampartNearTarget(room, creep, target, creepAttackRange);
                    if (rampart) {
                        if (creep.pos != rampart.pos) {
                            creep.moveTo(rampart);
                        }
                        else {
                            if (!creepAttackRange > 1) {
                                creep.attack(target)
                            }
                            else {
                                creep.rangedAttack(target);
                            }
                        }
                    }
                    else {
                        if (!creepAttackRange > 1) {
                            creep.attack(target)
                        }
                        else {
                            creep.rangedAttack(target);
                        }
                    }
                }
                else {
                    creep.say('All Clear', true);
                }
            }
            else {
                creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(room)));
            }
        }
        else if (isAttacking === true && roomToAttack && armySize > 0) {

            var target = this.findTarget(room, creep);

            //the number is the game time to attack
            if (Game.time < whenToAttack) {
                var rallyPoint = flagToRallyAt.pos;

                if (!creepAttackRange > 1) {
                    if (creep.attack(target) != 0) {
                        creep.moveTo(rallyPoint, {reusePath: 20});
                    }
                }
                else {
                    if (creep.rangedAttack(target) != 0) {
                        creep.moveTo(rallyPoint, {reusePath: 20});
                    }
                }
            }
            else {
                if (creep.room.name != roomToAttack) {
                    creep.moveTo(creep.pos.findClosestByRange(room.findExitTo(roomToAttack)));
                }
                else {
                    var targetSpawn = creep.room.find(FIND_HOSTILE_SPAWNS)[0];
                    if (targetSpawn) {
                        if (creep.attack(targetSpawn) == ERR_NOT_IN_RANGE) {
                            if (creep.moveTo(targetSpawn, {ignoreCreeps: true, ignoreDestructibleStructures: true}) == ERR_NO_PATH) {
                                if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(target);
                                }
                            }
                        }
                    }
                    else {
                        if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                        }
                    }
                 }
            }
        }
        else {
            //do stuff when not under attack and not attacking
        }
    },

    findTarget: function (room, creep) {

        var target;

        target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: (c) => c.getActiveBodyparts(HEAL) >= 1
            && Allies.includes(c.owner.username) == false
        });

        if (target) {
            return target;
        }
        else {
            target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                filter: (c) => c.getActiveBodyparts(ATTACK) >= 1
                && Allies.includes(c.owner.username) == false
            });

            if (target) {
                return target;
            }
            else {
                target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {filter: (c) => Allies.includes(c.owner.username) == false});
                if (target) {
                    return target;
                }
                else {
                    return undefined;
                }
            }
        }
    },

    findRampartNearTarget: function (room, creep, target, creepAttackRange) {

        var rampart = target.pos.findInRange(FIND_MY_STRUCTURES, creepAttackRange, {filter: (s) => s.structureType == STRUCTURE_RAMPART && s.findInRange(FIND_CREEPS, 1).length == 0})[0];

        if (rampart) {
            return rampart;
        }
        else {
            return undefined;
        }
    }
};
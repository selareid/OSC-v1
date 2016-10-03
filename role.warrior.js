require('global');

module.exports = {
    run: function (room, creep, isUnderAttack, isAttacking, flagToRallyAt) {

        var creepAttackRange;
        var beforeRallyFlag = room.findBeforeRallyFlag(room);
        var shouldWeAttack = this.creepGoToRoomToAttack(room, creep, isUnderAttack, isAttacking, flagToRallyAt, beforeRallyFlag);

        if (shouldWeAttack == true) {
            if (creep.getActiveBodyparts(HEAL) >= 1) {
                creep.creepHeal(room, creep, isUnderAttack, isAttacking, flagToRallyAt, flagToRallyAt, beforeRallyFlag);
            }
            else if (creep.getActiveBodyparts(RANGED_ATTACK) >= 1) {
                creepAttackRange = 3;
                creep.creepAttack(room, creep, isUnderAttack, creepAttackRange, isAttacking, flagToRallyAt, beforeRallyFlag);
            }
            else if (creep.getActiveBodyparts(ATTACK) >= 1) {
                creepAttackRange = 1;
                creep.creepAttack(room, creep, isUnderAttack, creepAttackRange, isAttacking, flagToRallyAt, beforeRallyFlag);
            }
        }
        else {

        }

    },

    creepGoToRoomToAttack: function (room, creep, isUnderAttack, isAttacking, flagToRallyAt, beforeRallyFlag) {

        if (flagToRallyAt) {
            var roomToAttack = flagToRallyAt.memory.whereToAttack;
            var whenToAttack = flagToRallyAt.memory.whenToAttack;
            var whenToRally = flagToRallyAt.memory.whenToRally;
            var armySize = flagToRallyAt.memory.armySize;

        }

        if (isUnderAttack === true) {
            if (creep.room.name != room.name) {
                creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(room)),
                    {ignoreDestructibleStructures:  true, ignoreCreeps: true, ignoreRoads: true});
                return false;
            }
            else {
                return true;
            }
        }
        else if (isAttacking === true && roomToAttack && armySize > 0) {

            //the number is the game time to attack
            if (Game.time < whenToAttack) {

                if (whenToRally < Game.time) {
                    if (creep.moveTo(beforeRallyFlag.pos) == ERR_NO_PATH) {
                        if (creep.pos.findInRange(FIND_FLAGS, 5, {filter: (f) => f.name == beforeRallyFlag.name}).length > 0) {
                            return true;
                        }
                        else {
                            var beforeRallyPoint = beforeRallyFlag.pos;
                            creep.moveTo(beforeRallyPoint, {reusePath: 20});

                            return false;
                        }
                    }
                }
                else if (creep.moveTo(flagToRallyAt.pos) == ERR_NO_PATH) {
                    if (creep.pos.findInRange(FIND_FLAGS, 5, {filter: (f) => f.name == flagToRallyAt.name}).length > 0) {
                        return true;
                    }
                    else {
                        var rallyPoint = flagToRallyAt.pos;
                        creep.moveTo(rallyPoint, {reusePath: 20});

                        return false;
                    }
                }
            }
            else {
                if (creep.room.name != roomToAttack) {
                    creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(roomToAttack)),
                        {ignoreDestructibleStructures:  true, ignoreCreeps: true, ignoreRoads: true});
                    return false;
                }
                else {
                    return true;
                }
            }
        }
        else {
            return true;
        }


    },

    creepAttack: function (room, creep, isUnderAttack, creepAttackRange, isAttacking, flagToRallyAt, beforeRallyFlag) {

        var whenToAttack = flagToRallyAt.memory.whenToAttack;

        if (isUnderAttack === true) {

            var target = this.findTarget(room, creep);
            if (target) {
                var rampart = this.findRampartNearTarget(room, creep, target, creepAttackRange);
                if (rampart) {
                    if (creep.pos != rampart.pos) {
                        creep.moveTo(rampart, {
                            ignoreDestructibleStructures: true,
                            ignoreCreeps: true,
                            ignoreRoads: true
                        });
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
                        if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, {
                                ignoreDestructibleStructures: true,
                                ignoreCreeps: true,
                                ignoreRoads: true
                            });
                        }
                    }
                    else {
                        if (creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, {
                                ignoreDestructibleStructures: true,
                                ignoreCreeps: true,
                                ignoreRoads: true
                            });
                        }
                    }
                }
            }
            else {
                //no one left to kill
            }
        }
        else if (isAttacking === true && whenToAttack < Game.time) {

            var target = this.findTarget(room, creep);

            var targetSpawn = creep.room.find(FIND_HOSTILE_SPAWNS)[0];
            if (targetSpawn) {
                if (creep.attack(targetSpawn) == ERR_NOT_IN_RANGE) {
                    if (creep.moveTo(targetSpawn,
                            {
                                ignoreDestructibleStructures: true,
                                ignoreCreeps: true,
                                ignoreRoads: true
                            }) == ERR_NO_PATH) {
                        var wallTarget = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_WALL && s.structureType == STRUCTURE_RAMPART});
                        if (creep.attack(wallTarget) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(wallTarget, {
                                ignoreDestructibleStructures: true,
                                ignoreCreeps: true,
                                ignoreRoads: true
                            });
                        }
                        else if (creep.attack(wallTarget) == ERR_NO_PATH) {
                            creep.moveTo(target, {
                                ignoreDestructibleStructures: true,
                                ignoreCreeps: true,
                                ignoreRoads: true
                            });
                        }
                    }
                }
            }
            else if (creep.rangedAttack(targetSpawn) == ERR_NOT_IN_RANGE) {
                if (creep.moveTo(targetSpawn,
                        {ignoreDestructibleStructures: true, ignoreCreeps: true, ignoreRoads: true}) == ERR_NO_PATH) {
                    var wallTarget = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_WALL && s.structureType == STRUCTURE_RAMPART});
                    if (creep.rangedAttack(wallTarget) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(wallTarget,
                            {ignoreDestructibleStructures: true, ignoreCreeps: true, ignoreRoads: true});
                    }
                    else if (creep.rangedAttack(wallTarget) == ERR_NO_PATH) {
                        creep.moveTo(target,
                            {ignoreDestructibleStructures: true, ignoreCreeps: true, ignoreRoads: true});
                    }
                }
                else {
                    if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target,
                            {ignoreDestructibleStructures: true, ignoreCreeps: true, ignoreRoads: true});
                    }
                    else if (creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target,
                            {ignoreDestructibleStructures: true, ignoreCreeps: true, ignoreRoads: true});
                    }
                }
            }
        }
        else {
            creep.moveTo(beforeRallyFlag);
        }

    },

    creepHeal: function (room, creep, flagToRallyAt, beforeRallyFlag) {

        var healTarget = this.findCreepToHeal(room, creep);

        if (creep.hits < creep.hitsMax) {
            creep.heal(creep);
        }
        else {
            creep.heal(healTarget);
        }

        var tower = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER && !Allies.includes(s.owner.username)});

        if (tower) {
            if (creep.moveTo(tower,
                    {ignoreDestructibleStructures: true, ignoreCreeps: true, ignoreRoads: true}) != 0) {
                if (creep.heal(healTarget) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(healTarget,
                        {ignoreDestructibleStructures: true, ignoreCreeps: true, ignoreRoads: true});
                }
            }
        }
        else {
            if (creep.heal(healTarget) == ERR_NOT_IN_RANGE) {
                creep.moveTo(healTarget,
                    {ignoreDestructibleStructures: true, ignoreCreeps: true, ignoreRoads: true});
            }
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

        var rampart = target.pos.findInRange(FIND_MY_STRUCTURES, creepAttackRange, {filter: (s) => s.structureType == STRUCTURE_RAMPART && s.pos.findInRange(FIND_CREEPS, 1).length == 0})[0];

        if (rampart) {
            return rampart;
        }
        else {
            return undefined;
        }
    },

    findCreepToHeal: function (room, creep) {

        var creepToHeal = creep.pos.findClosestByRange(FIND_CREEPS, {filter: (c) => Allies.includes(c.owner.username) && c.hits < c.hitsMax});
        if (creepToHeal) {
            return creepToHeal
        }
        else {
            return undefined;
        }
    }
};

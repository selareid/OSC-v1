require('global');

module.exports = {
    run: function (room, creep, isUnderAttack, isAttacking, flagToRallyAt) {

        var beforeRallyFlag = room.findBeforeRallyFlag(room);
        var shouldWeAttack = this.creepGoToRoomToAttack(room, creep, isUnderAttack, isAttacking, flagToRallyAt, beforeRallyFlag);

        if (shouldWeAttack == true) {
            if (creep.getActiveBodyparts(HEAL) >= 1) {
                this.creepHeal(room, creep, isUnderAttack, isAttacking, flagToRallyAt, flagToRallyAt, beforeRallyFlag);
            }
            else if (creep.getActiveBodyparts(RANGED_ATTACK) >= 1) {
                this.creepAttack(room, creep, isUnderAttack, isAttacking, flagToRallyAt, beforeRallyFlag);
            }
            else if (creep.getActiveBodyparts(ATTACK) >= 1) {
                this.creepAttack(room, creep, isUnderAttack, isAttacking, flagToRallyAt, beforeRallyFlag);
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
                    {ignoreCreeps: true, ignoreRoads: true});
                return false;
            }
            else {
                return true;
            }
        }
        else if (isAttacking === true && roomToAttack && armySize > 0) {

            //the number is the game time to attack
            if (Game.time < whenToAttack) {

                if (whenToRally > Game.time) {
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

    creepAttack: function (room, creep, isUnderAttack, isAttacking, flagToRallyAt, beforeRallyFlag) {

        var whenToAttack;
        var whenToRally;

        if (flagToRallyAt) {
            whenToAttack = flagToRallyAt.memory.whenToAttack;
            whenToRally = flagToRallyAt.memory.whenToRally;
        }

        if (isUnderAttack === true) {

            var target = this.findTarget(room, creep);
            if (target) {
                var rampart = this.findRampartNearTarget(room, creep, target);
                if (rampart) {
                    if (creep.pos != rampart.pos) {
                        creep.moveTo(rampart, {
                            ignoreDestructibleStructures: true,
                            ignoreCreeps: true,
                            ignoreRoads: true
                        });
                    }
                    else {
                        if (creep.getActiveBodyparts(ATTACK) >= 1) {
                            creep.attack(target)
                        }
                        else {
                            creep.rangedAttack(target);
                        }
                    }
                }
                else {
                    if (creep.getActiveBodyparts(ATTACK) >= 1) {
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
        else if (isAttacking === true && whenToAttack != undefined && whenToRally != undefined && whenToAttack < Game.time) {

            var target = this.findTarget(room, creep);
            var objectsToAttack = this.findThingsToAttack(room, creep);

            if (objectsToAttack.length > 0) {
                var objectTarget = creep.pos.findClosestByPath(objectsToAttack);
                if (objectTarget) {
                    if (creep.attack(objectTarget) == ERR_NOT_IN_RANGE) {

                        creep.moveTo(objectTarget,
                            {
                                ignoreCreeps: true,
                                ignoreRoads: true
                            });

                    }
                    else if (creep.rangedAttack(objectTarget) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(objectTarget,
                            {
                                ignoreCreeps: true,
                                ignoreRoads: true
                            });
                    }
                }
                else {
                    this.becauseWritingItTwiceDidntSeemCool(room, creep, target);
                }
            }
            else {
                this.becauseWritingItTwiceDidntSeemCool(room, creep, target);
            }
        }
        else {
            creep.moveTo(beforeRallyFlag);
        }

    },

    becauseWritingItTwiceDidntSeemCool: function (room, creep, target) {
        var targetSpawn = creep.room.find(FIND_HOSTILE_SPAWNS)[0];
        if (targetSpawn) {
            if (creep.attack(targetSpawn) == ERR_NOT_IN_RANGE) {

                creep.moveTo(targetSpawn,
                    {
                        ignoreCreeps: true,
                        ignoreRoads: true
                    });

            }
            else if (creep.rangedAttack(targetSpawn) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targetSpawn,
                    {
                        ignoreCreeps: true,
                        ignoreRoads: true
                    });
            }
        }
        else if (target) {
            if (creep.attack(target) == ERR_NOT_IN_RANGE) {

                creep.moveTo(target,
                    {
                        ignoreCreeps: true,
                        ignoreRoads: true
                    });

            }
            else if (creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target,
                    {
                        ignoreCreeps: true,
                        ignoreRoads: true
                    });
            }
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

        target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
            filter: (c) => c.getActiveBodyparts(HEAL) >= 1
            && Allies.includes(c.owner.username) == false
        });

        if (target) {
            return target;
        }
        else {
            target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
                filter: (c) => c.getActiveBodyparts(ATTACK) >= 1
                && Allies.includes(c.owner.username) == false
            });

            if (target) {
                return target;
            }
            else {
                target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {filter: (c) => Allies.includes(c.owner.username) == false});
                if (target) {
                    return target;
                }
                else {
                    return undefined;
                }
            }
        }
    },

    findThingsToAttack: function (room, creep) {
        var thingsToAttackFlags = creep.room.find(FIND_FLAGS, {filter: (f) => f.memory.type == 'attackThingFlag' && f.memory.room == room.name});
        var objectsToReturn = [];

        for (let flag in thingsToAttackFlags) {
            var look = creep.room.lookAt(flag);
            look.forEach(function (lookObject) {
                if (lookObject == 'structure') {
                    objectsToReturn.push(objectsToReturn);
                }
            });
        }

        return objectsToReturn;
    },

    findRampartNearTarget: function (room, creep, target) {

        var creepAttackRange;

        if (creep.getActiveBodyparts(ATTACK) >= 1) {
            creepAttackRange = 1;
        }
        else if (creep.getActiveBodyparts(RANGED_ATTACK) >= 1) {
            creepAttackRange = 3;
        }

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

module.exports = {
    run: function (room, creep, allyUsername, isUnderAttack) {

        var creepAttackRange;
        if (creep.getActiveBodyparts(HEAL) >= 1) {
            //put creep healer code here
        }
        else if (creep.getActiveBodyparts(RANGED_ATTACK) >= 1) {
            creepAttackRange = 3;
            this.creepAttack(room, creep, allyUsername, isUnderAttack, creepAttackRange);
        }
        else if (creep.getActiveBodyparts(ATTACK) >= 1) {
            creepAttackRange = 1;
            this.creepAttack(room, creep, allyUsername, isUnderAttack, creepAttackRange);
        }

    },

    creepAttack: function (room, creep, allyUsername, isUnderAttack, creepAttackRange) {

        if (isUnderAttack === true) {
            if (creep.room.name == room) {
                var target = this.findTarget(room, creep, allyUsername);
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
        else {
            //put attack flag go to attack other room stuff here and stuff
            //when you're ready though
            //don't rush yourself
            //you only have 10 CPU anyway
            //don't even try yet
            //wait a while
            //ok a long-ish time
            //you know just don't do it
            //make everything work first
            //if I haven't convinced you yet you shouldn't be here
            //unless you think you're ready
            //nope forget that I'm not trusting you
            //when I say you're ready you can

            // if (iSayReady === true) {
            //     doStuff.startCodeing(human, universe, codeWhat);
            // }
            // else {
            //     doStuff.sleep(human, universe);
            // }
        }

    },

    findTarget: function (room, creep, allyUsername) {

        var target;

        target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: (c) => c.getActiveBodyparts(HEAL) >= 1
            && allyUsername.includes(c.owner.username) == false
        });

        if (target) {
            return target;
        }
        else {
            target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                filter: (c) => c.getActiveBodyparts(ATTACK) >= 1
                && allyUsername.includes(c.owner.username) == false
            });

            if (target) {
                return target;
            }
            else {
                target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {filter: (c) => allyUsername.includes(c.owner.username) == false});
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

        var rampart = target.pos.findInRange(FIND_MY_STRUCTURES, creepAttackRange, {filter: (s) => s.structureType == STRUCTURE_RAMPART})[0];

        if (rampart) {
            return rampart;
        }
        else {
            return undefined;
        }
    }
};
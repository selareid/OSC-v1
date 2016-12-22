module.exports = {
    run: function (room, creep) {
        PathFinder.use(true);

        if (Memory.rooms[room].isUnderAttack == true) {
            var target = this.getTarget(room, creep);
            if (target) {
                var attackResult = creep.rangedAttack(target);

                switch (attackResult) {
                    case -9: // returns ERR_NOT_IN_RANGE
                        creep.moveTo(target, {reusePath: 3, ignoreRoads: true});
                        break;
                    case 0: // returns OK
                        this.kite(room, creep, target);
                        //creep.say something here using prototype.creepSpeech.js
                        break;
                    default:
                        console.log('Error with creep: ' + creep.name + '' + ' Attack Error: ' + attackResult);
                }

            }
        }
        else {
            creep.moveTo(global[room.name].guardStationFlag);
        }

    },

    getTarget: function (room, creep) {
        var targets = _.filter(global[room.name].creepsNotMine, (c) => global.Allies.includes(c.owner.username) == false);

        if (targets.length > 0) {
            return creep.pos.findClosestByRange(targets);
        }
        else {
            Memory.rooms[room].isUnderAttack = false;
            return;
        }
    },

    kite: function (room, creep, target) {
        var directionToTarget = creep.pos.getDirectionTo(target);
        if (creep.pos.getRangeTo(target) <= 2) {
            var oppositeDir = global.REVERSE_DIR[directionToTarget];
            var virtualMoveResult = this.virtualMove(creep.pos, oppositeDir);
            if (virtualMoveResult) {
                var look = virtualMoveResult.look();
                if (look[0].terrain && look[0].terrain != 'wall') {
                    creep.move(oppositeDir);
                }
                else if (look[0].structure && look[0].structure.structureType == STRUCTURE_ROAD) {
                    creep.move(oppositeDir);
                }
                else {
                    creep.moveTo(room.find(FIND_MINERALS)[0], {reusePath: 2});
                }
            }
        }
        else {
            creep.move(directionToTarget);
        }
    },
    
    virtualMove: function (pos, dir) {
        var tempPos;
        var newPos;

        if (!pos) return;

        tempPos = pos;

        switch (dir) {
            case TOP:
                tempPos.y = tempPos.y - 1;
                break;
            case TOP_RIGHT:
                tempPos.y = tempPos.y - 1;
                tempPos.x = tempPos.x + 1;
                break;
            case RIGHT:
                tempPos.x = tempPos.x + 1;
                break;
            case BOTTOM_RIGHT:
                tempPos.y = tempPos.y + 1;
                tempPos.x = tempPos.x + 1;
                break;
            case BOTTOM:
                tempPos.y = tempPos.y + 1;
                break;
            case BOTTOM_LEFT:
                tempPos.y = tempPos.y + 1;
                tempPos.x = tempPos.x - 1;
            break;
            case LEFT:
                tempPos.x = tempPos.x - 1;
                break;
            case TOP_LEFT:
                tempPos.y = tempPos.y - 1;
                tempPos.x = tempPos.x - 1;
                break;
            default:
                return;
        }

        newPos = tempPos;

        return newPos;
    }
};


/*
*Notes:
* global[room.name].guardStationFlag for guard station flag
* global[this.name].creepsNotMine to get hostile creeps in room (includes allies)
* Memory.rooms[room].isUnderAttack
* global.Allies
*/

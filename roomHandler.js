var creepHandler = require ('creepHandler');
var defenceHandler = require ('defenceHandler');
var spawnerHandler = require ('spawnerHandler');

module.exports = {
    run: function (room, allyUsername) {

        var underAttack = defenceHandler.isUnderAttack(room, allyUsername);
        if (underAttack) {
            defenceHandler.run(room, allyUsername);
        }
        //else {
            spawnerHandler.run(room);
            creepHandler.run(room);
        //}
    }
};
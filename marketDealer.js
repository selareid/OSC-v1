require('global');

module.exports = {
    run: function (room) {
        var orders = Memory.room.[room].market;
        if (orders != undefined) {

        }
        else {
            Memory.room.[room].market = {};
        }
    }
};

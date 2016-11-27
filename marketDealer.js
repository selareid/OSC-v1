require('global');

module.exports = {
    run: function (room, terminal) {
        var orders = Memory.rooms[room].market;
        if (orders != undefined) {
            var order = Game.market.getOrderById(orders[0]);
            if (order && order.amount > 0) {
                var resourceInTerm = _.filter(terminal.store, (r) => r.resourceType == order.resourceType);
                if (resourceInTerm) {
                    var amountToDeal = resourceInTerm;

                    if (amountToDeal > order.amount) {
                        amountToDeal = order.amount;
                    }

                    Game.market.deal(order, amountToDeal, room)
                }
            }
            else {
                delete Memory.rooms[room].market[0];
            }

        }
        else {
            Memory.rooms[room].market = [];
        }
    }
};
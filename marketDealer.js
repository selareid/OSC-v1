require('global');

module.exports = {
    run: function (room, terminal) {
        var orders = Memory.rooms[room].market;
        if (orders != undefined) {
            var order = Game.market.getOrderById(orders[0]);
            if (order && order.amount > 0) {
                var resourceInTerm = false;
                var resourcesInTerm = [];
                for (let resourceType in terminal.store) {
                    resourcesInTerm.push(resourceType);
                }

                if (resourcesInTerm.includes(resourceInTerm)) {
                    resourceInTerm = true;
                }

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
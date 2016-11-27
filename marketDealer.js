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

                if (resourcesInTerm.includes(order.resourceType)) {
                    resourceInTerm = true;
                }

                if (resourceInTerm) {
                    var amountToDeal = terminal.store[order.resourceType];
                    var costOfTrans = Game.market.calcTransactionCost(amountToDeal, room.name, order.roomName);

                    if (amountToDeal > order.amount) {
                        amountToDeal = order.amount;
                    }

                    var addedTogether = amountToDeal + costOfTrans;

                    while (addedTogether > terminal.storeCapacity) {
                        amountToDeal -= 1000;
                        costOfTrans = Game.market.calcTransactionCost(amountToDeal, room.name, order.roomName);
                        addedTogether = amountToDeal + costOfTrans;
                    }

                    var result = Game.market.deal(order.id, amountToDeal, room.name);

                    console.log('Market Dealt Result = ' + result);
                }
            }
            else {
                Memory.rooms[room].market.splice(0, 1);
            }

        }
        else {
            Memory.rooms[room].market = [];
        }
    }
};
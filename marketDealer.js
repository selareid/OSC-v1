'use strict';

require('global');

module.exports = {
    run: function (room, terminal) {
        var orders = Memory.rooms[room].market;
        if (orders != undefined) {
            var order = Game.market.getOrderById(orders[0]);
            if (order && order.amount > 0) {
                switch (order.type) {
                    case ORDER_SELL:
                        this.sell(room, terminal, order);
                        break;
                    case ORDER_BUY:
                        this.buy(room, terminal, order);
                        break;
                }
            }
            else {
                Memory.rooms[room].market.splice(0, 1);
            }

        }
        else {
            Memory.rooms[room].market = [];
        }
    },

    sell: function (room, terminal, order) {
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

            while (addedTogether > terminal.storeCapacity - 100) {
                amountToDeal = amountToDeal * 0.25;
                costOfTrans = Game.market.calcTransactionCost(amountToDeal, room.name, order.roomName);
                addedTogether = amountToDeal + costOfTrans;
            }

            var result = Game.market.deal(order.id, amountToDeal, room.name);

            console.log('Market Sell Order Dealt Result = ' + result + ' Room = ' + room.name);
        }
    },

    buy: function (room, terminal, order) {
        if (_.sum(terminal.store) <= order.amount) {
            var creditsAvailable = Game.market.credits - 2000;
            if (creditsAvailable > 0) {
                var amountToBuy = Math.floor(creditsAvailable/order.price);
                if (amountToBuy > 0) {
                    if (amountToBuy > order.amount) {
                        amountToBuy = order.amount;
                    }

                    var result = Game.market.deal(order.id, amountToBuy, room.name);

                    console.log('Market Buy Order Dealt Result = ' + result + ' Room = ' + room.name);

                }
                else {
                    Memory.rooms[room].market.splice(0, 1);
                }
            }
            else {
                Memory.rooms[room].market.splice(0, 1);
            }
        }
        else {
            Memory.rooms[room].market.splice(0, 1);
        }
    }
};
require('global');

module.exports = {
    run: function (room) {
        var links = room.find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_LINK});

        if (links.length > 0) {
            var averageEn = _.sum(links, '.energy')/links.length;
            if (averageEn > 101) {

                var linksOverAverage = [];
                var linksUnderAverage = [];

                for (let link of links) {
                    var linkEn = link.energy;
                    if (linkEn > averageEn + 100 && link.cooldown == 0) {
                        linksOverAverage.push(link);
                    }
                    else if (linkEn < averageEn - 100) {
                        linksUnderAverage.push(link);
                    }
                }

                if (linksOverAverage.length > 0) {
                    var linkMostOver = _.max(linksOverAverage, '.energy');
                    var linkMostUnder = _.min(linksUnderAverage, '.energy');

                    var amountToTransfer = linkMostOver.energy - averageEn;

                    linkMostOver.transferEnergy(linkMostUnder, amountToTransfer);

                }

            }
        }

    }
};
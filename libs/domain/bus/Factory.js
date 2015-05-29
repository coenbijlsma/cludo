var Bus = require('./Bus.js');

function BusFactory() {
}

BusFactory.prototype.createBus = function() {
    return new Bus();
};

module.exports = BusFactory;

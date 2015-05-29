var Queue = require('./Queue.js');

function QueueFactory() {
}

QueueFactory.prototype.createQueue = function() {
    return new Queue();
};

module.exports = QueueFactory;

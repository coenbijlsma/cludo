var events = require('events');
var util = require('util');

function Queue() {
    events.EventEmitter.call(this);
}
util.inherits(Queue, events.EventEmitter);

Queue.prototype.enqueue = function(envelope) {
};

module.exports = Queue;

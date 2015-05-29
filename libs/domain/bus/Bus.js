var events = require('events');
var util = require('util');

/**
 * @class
 */
function Bus() {
    events.EventEmitter.call(this);
}
util.inherits(Bus, events.EventEmitter);

/**
 * Starts this Bus instance.
 * @fires Bus#started
 */
Bus.prototype.start = function(queueFactory) {
    this.queueFactory = queueFactory;

    /**
     * Started event.
     *
     * @event Bus#started
     */
    this.emit('started');
};

module.exports = Bus;

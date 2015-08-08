var events = require('events');
var util = require('util');

var cutil = mod('domain/core/Util');

/**
 * Creates a new Queue.
 * @class
 */
function Queue() {
    events.EventEmitter.call(this);

    var self = this;
    self.items = [];

    Object.defineProperty(self, 'length', {
        get: function() { return self.items.length; }
    });
}
util.inherits(Queue, events.EventEmitter);

/**
 * Adds the supplied item to the end of the queue. 
 * If the item is null or not an object, this function will not
 * add it to the queue.
 *
 * @param {object} item
 * @returns {boolean} Whether the queue contents have been changed.
 */
Queue.prototype.enqueue = function(item) {
    cutil.typecheck(item, 'item', 'object');

    var success = this.items.length !== this.items.push(item);

    if (success) { this.emit('item', item, this); }

    return success;
};

/**
 * Returns the first item in the queue, but does
 * not remove it. If the queue is empty, this
 * function returns null.
 *
 * @returns {object|null}
 */
Queue.prototype.peek = function() {
    if (this.items.length > 0) {
        return this.items[0];
    }

    return null;
};

/**
 * Returns the first item in the queue, and
 * removes it from the queue. If the queue is empty,
 * this function returns null.
 *
 * @returns {object|null}
 */
Queue.prototype.dequeue = function() {
    return  this.items.pop();
};

module.exports = Queue;

"use strict";

var events = require('events');
var util = require('util');

var cutil = mod('model/core/Util');

/**
 * Creates a new Queue.
 * @class
 */
function Queue() {
    events.EventEmitter.call(this);

    this.items = [];

    var self = this;
    Object.defineProperty(this, 'length', {
        get: function() {
            return self.items.length;
        }
    });
}
util.inherits(Queue, events.EventEmitter);

/**
 * Adds the supplied item to the end of the queue. 
 * If the item is null or not an object, this function will not
 * add it to the queue.
 *
 * @param {object} item
 * @fires Queue#enqueue
 * @fires Queue#error
 */
Queue.prototype.enqueue = function(item) {
    cutil.typecheck(item, 'item', 'object');

    process.nextTick( () => {
        var success = this.items.length !== this.items.push(item);
        if (success) {

            /**
             * @event Queue#enqueue
             * @type {object}
             * @param {object} item - The item that was added to the queue
             * @param {Queue} queue - The queue the item was added to
             */
            this.emit('enqueue', {
                item: item,
                queue: this
            }); 
        } else {

            /**
             * @event Queue#error
             * @type {object}
             */
            this.emit('error', {
                error: 'Could not enqueue item in queue',
                item: item
            });
        }
    });
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
    return this.items.pop();
};

module.exports = Queue;

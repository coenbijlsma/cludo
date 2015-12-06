"use strict";

var util = require('util');
var events = require('events');

var cutil = mod('library/core/Util');
var Queue = mod('library/messaging/Queue');

/**
 * Creates a new QueuePool with size queues.
 *
 * @class
 * @param {integer} size - The amount of queues in the pool
 * @throws {Error} The size parameter is mandatory and must be an integer.
 */
function QueuePool(size) {
    cutil.typecheck(size, 'size', 'int');
    events.EventEmitter.call(this);

    this.pool = [];
    for (let i = 0; i < size; i++) {
        var queue = new Queue();
        queue.on('enqueue', (event) => {
            this.emit('message', event);
        });
        this.pool.push(queue);
    }
}
util.inherits(QueuePool, events.EventEmitter);

/**
 * Returns the next suitable queue to be used. The returned queue
 * is the queue that contains the least amount of items, which
 * does not have to be zero.
 * 
 * @returns {Queue} 
 */
QueuePool.prototype.get = function() {
    
    var sorted = this.pool.sort( (left, right) => {
       let llength = left.length;
       let rlength = right.length;

       if (llength > rlength) {
           return 1;
       } else if (llength < rlength) {
           return -1;
       }
       return 0;
    });

    return sorted[0];
};

module.exports = QueuePool;

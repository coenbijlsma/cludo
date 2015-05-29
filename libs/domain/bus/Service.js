var events = require('events');
var util = require('util');

/**
 * Creates a new Service
 * @class
 */
function Service(name) {
    events.EventEmitter.call(this);

    this.name = name;
}
util.inherits(Service, events.EventEmitter);

/**
 * 
 */
Service.prototype.send = function(message, receiver, cb) {
    
};

Service.prototype.receive = function(message, sender, cb) {
};

module.exports = Service;

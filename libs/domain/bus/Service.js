var util = require('util');
var events = require('events');

var cutil = mod('domain/core/Util');


function Service(name) {
    events.EventEmitter.call(this);

    cutil.typecheck(name, 'name', 'string');
    this.name = name;
}
util.inherits(Service, events.EventEmitter);


Service.prototype.start = function() {

    /**
     * @event Service#started
     */
    this.emit('started');
};

Service.prototype.stop = function(force) {

    /**
     * @event Service#stopped
     */
    this.emit('stopped', force);
};

module.exports = Service;

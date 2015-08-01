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
    this.emit('error', new Error('Not implemented'));
};

Service.prototype.stop = function(force) {
    this.emit('error', new Error('Not implemented'));
};

module.exports = Service;

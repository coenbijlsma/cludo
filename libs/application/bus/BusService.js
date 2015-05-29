var events = require('events');
var util = require('util');

var busFactory = require('bus/Factory');
var queueFactory = require('queue/Factory');

function BusService() {
    events.EventEmitter.call(this);
}
util.inherits(BusService, events.EventEmitter);

BusService.startBus = function(cb) {
};

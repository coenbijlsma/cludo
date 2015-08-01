var util = require('util');

var Service = mod('core/bus/Service');

function InputService(name) {
    Service.call(this, name);
}
util.inherits(InputService, Service);

module.exports = InputService;

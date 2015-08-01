var util = require('util');

var Service = mod('domain/bus/Service');

function OutputService(name) {
    Service.call(this, name);
}
util.inherits(OutputService, Service);

module.exports = OutputService;

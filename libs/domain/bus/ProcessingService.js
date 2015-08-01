var util = require('util');

var Service = mod('domain/bus/Service');

function ProcessingService(name) {
    Service.call(this, name);
}
util.inherits(ProcessingService, Service);

module.exports = ProcessingService;

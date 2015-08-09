var util = require('util');

var Service = mod('domain/bus/Service');

function MyProcessingService(name) {
    Service.call(this, name);

    var self = this;
    self.on('receive', function(message) {
        self.send(message, 'my.output.service');
    });
}
util.inherits(MyProcessingService, Service);

module.exports = MyProcessingService;

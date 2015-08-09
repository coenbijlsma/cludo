var util = require('util');

var Service = mod('domain/bus/Service');

function MyOutputService(name) {
    Service.call(this, name);

    var self = this;
    self.on('receive', function(message) {
        console.log('Received message: ');
        console.log(message);
    });
}
util.inherits(MyOutputService, Service);

module.exports = MyOutputService;

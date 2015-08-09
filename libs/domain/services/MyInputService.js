var util = require('util');
var fs = require('fs');

var Service = mod('domain/bus/Service');

function MyInputService(name) {
    Service.call(this, name);

    var self = this;
    self.on('receive', self.onMessage);
    self.on('start', function() {
        self.watcher = fs.watch('/tmp/testfile.test', {}, function(event, name) {
            self.send({
                message: 'file found'
            }, 'my.input.service');
        });
    });
}
util.inherits(MyInputService, Service);

MyInputService.prototype.onMessage = function(message) {
    self.send(message, 'my.processing.service');
};


var util = require('util');
var fs = require('fs');

var Service = mod('domain/bus/Service');

function MyInputService(name) {
    Service.call(this, name);

    var self = this;
    self.on('start', function() {
        self.watcher = fs.watch('/tmp/testfile.test', {}, function(event, name) {
            self.send({
                message: 'file found'
            }, 'my.processing.service');
        });
    });
}
util.inherits(MyInputService, Service);

module.exports = MyInputService;

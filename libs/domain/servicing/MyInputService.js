"use strict";

var util = require('util');
var fs = require('fs');

var Service = mod('domain/bus/Service');

function MyInputService(name) {
    Service.call(this, name);

    this.on('start', () => {
        this.watcher = fs.watch('/tmp/testfile.test', {}, (event, name) => {
            this.send({
                message: 'file found'
            }, 'my.processing.service');
        });
    });
}
util.inherits(MyInputService, Service);

module.exports = MyInputService;

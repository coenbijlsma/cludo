"use strict";

var util = require('util');
var fs = require('fs');

var Service = mod('domain/servicing/Service');

function MyInputService(name) {
    Service.call(this, name);

    this.on('start', () => {
        this.watcher = fs.watch('/tmp/', {}, (event, name) => {
            this.send({
                message: 'change detected im /tmp'
            }, 'my.processing.service');
        });
    });
}
util.inherits(MyInputService, Service);

module.exports = MyInputService;

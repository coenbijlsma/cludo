"use strict";

var util = require('util');

var Service = mod('domain/bus/Service');

function MyProcessingService(name) {
    Service.call(this, name);

    this.on('receive', (message) => {
        this.send(message, 'my.output.service');
    });
}
util.inherits(MyProcessingService, Service);

module.exports = MyProcessingService;

"use strict";

var util = require('util');

var Service = mod('domain/servicing/Service');

function MyOutputService(name) {
    Service.call(this, name);

    this.on('receive', (message) => {
        console.log('Received message: ');
        console.log(message);
    });
}
util.inherits(MyOutputService, Service);

module.exports = MyOutputService;

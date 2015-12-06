"use strict";

var fs = require('fs');

var mod = (file) => require('./' + file);

function bootstrap() {
    if(typeof global.mod === 'undefined') {
        global.mod = mod;
    }
}

function test() {
    var Bus = mod('domain/bus/Bus');
    var QueuePool = mod('domain/messaging/QueuePool');
    var MyInputService = mod('domain/servicing/MyInputService');
    var MyOutputService = mod('domain/servicing/MyOutputService');
    var MyProcessingService = mod('domain/servicing/MyProcessingService');

    var queuePool = new QueuePool(5);
    var services = [
        new MyProcessingService('my.processing.service'),
        new MyOutputService('my.output.service'),
        new MyInputService('my.input.service')
    ];
    for (let i = 0; i < services.length; i++) {
        services[i].on('start', function() {
            console.log('Service started!');
        });
    }

    var bus = new Bus();
    bus.on('configured', function() {
        console.log('Bus configured!');
    });
    bus.on('started', function() {
        console.log('Bus started!');
    });
    bus.configure(queuePool, services);
    bus.start();
}

bootstrap();

test();

var fs = require('fs');

var mod = function(file) {
    return require('./' + file);
};

function bootstrap() {
    if(typeof global.mod === 'undefined') {
        global.mod = mod;
    }
}

function test() {
    var Bus = mod('domain/bus/Bus');
    var QueuePool = mod('domain/messaging/QueuePool');
    var MyInputService = mod('domain/services/MyInputService');
    var MyOutputService = mod('domain/services/MyOutputService');
    var MyProcessingService = mod('domain/services/MyProcessingService');

    var queuePool = new QueuePool(5);
    var services = [
        new MyProcessingService('my.processing.service'),
        new MyOutputService('my.output.service'),
        new MyInputService('my.input.service')
    ];
    for (i = 0; i < services.length; i++) {
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
    console.log(bus);
    bus.start();

}

bootstrap();

module.exports = test;

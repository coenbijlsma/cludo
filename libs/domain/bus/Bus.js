var events = require('events');
var util = require('util');

var BusError = mod('domain/core/BusError');
var QueuePool = mod('domain/messaging/QueuePool');
var ServiceWrapper = mod('domain/bus/InputService');
var InputService = mod('domain/bus/InputService');
var OutputService = mod('domain/bus/OutputService');
var ProcessingService = mod('domain/bus/ProcessingService');
var cutil = mod('domain/core/Util');

/**
 * Constructs a new Bus
 * @class
 */
function Bus() {
    events.EventEmitter.call(this);
}
util.inherits(Bus, events.EventEmitter);

/**
 * Configures this Bus instance.
 * @fires Bus#configured
 * @param {QueuePool} queuePool - The queue pool to use for sending messages between services.
 * @param {InputService[]} [inputServices] - The input services for this Bus instance.
 * @param {OutputService[]} [outputServices] - The output services for this Bus instance.
 * @param {ProcessingService[]} [processingServices] - The processing services for this Bus 
 * instance.
 */
Bus.prototype.configure = function(queuePool, inputServices, outputServices, processingServices) {
    cutil.typecheck(queuePool, 'queuePool', QueuePool);
    cutil.typecheck(inputServices, 'inputServices', Array, true);
    cutil.typecheck(outputServices, 'outputServices', Array, true);
    cutil.typecheck(processingServices, 'processingServices', Array, true);

    var self = this;

    self.queuePool = queuePool;
    self.inputServices = [];
    self.outputServices = [];
    self.processingServices = [];

    for (i = 0; i < queuePool.pool.length; i++) {
        queuePool.pool[i].on('item', function(item, queue) {
            // TODO figure out who is responsible for
            // processing new items in a queue.
        });
    }

    var addServices = function(services, type, receiver) {
        for ( i = 0; i < services.length; i++) {
            service = services[i];
            cutil.typecheck(service, type.name + '[' + i + ']', type);
            receiver[service.name] = {
                service: service,
                state: 'IDLE'
            };
        }
    };

    if (inputServices) { addServices(inputServices, InputService, self.inputServices); }
    if (outputServices) { addServices(outputServices, OutputService, self.outputServices); }
    if (processingServices { addServices(processingServices, ProcessingService, 
        self.processingServices);

    /**
     * @event Bus#started
     */
    this.emit('configured');
};

/**
 * Starts this Bus and all services that it contains.
 *
 * @fires Bus#started
 *
 */
Bus.prototype.start = function() {
    var self = this;

    var handler = function(service, index, subject) {
        var serviceErrorHandler = function(err) {
            service.state = 'ERROR';
            // TODO Log this
        };
        try {
            service.on('error', serviceErrorHandler);
            service.on('started', function() { service.state = 'STARTED'; });
            service.on('stopped', function() { service.state = 'STOPPED'; });
            service.on('message', function(envelope) { 
                self.queuePool.get().enqueue(envelope);
            });

            service.start();

        } catch(ex) {
            serviceErrorHandler(ex);
        }
    };

    process.nextTick(function() {
        self.outputServices.forEach(handler);
        self.processingServices.forEach(handler);
        self.inputServices.forEach(handler);

        /**
         * @event Bus#started
         */
        this.emit('started');
    });
};

Bus.prototype.stop = function() {
    // TODO
};

module.exports = Bus;

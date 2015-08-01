var events = require('events');
var util = require('util');

var BusError = mod('domain/core/BusError');
var QueuePool = mod('domain/messaging/QueuePool');
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

    this.queuePool = queuePool;
    this.inputServices = [];
    this.outputServices = [];
    this.processingServices = [];

    if (inputServices) {
        for (i = 0; i < inputServices.length; i++) {
            inputService = inputServices[i];
            cutil.typecheck(inputService, 'inputServices[' + i + ']', InputService);
            this.inputServices[inputService.name] = inputService;
        }
    }
    if (outputServices) {
        for (i = 0; i < outputServices.length; i++) {
            outputService = outputServices[i];
            cutil.typecheck(outputService, 'outputServices[' + i + ']', OutputService);
            this.outputServices[outputService.name] = outputService;
        }
    }
    if (processingServices) {
        for (i = 0; i < processingServices.length; i++) {
            processingService = processingServices[i];
            cutil.typecheck(processingService, 'processingServices[' + i + ']', ProcessingService);
            this.processingServices[processingService.name] = processingService;
        }
    }

    /**
     * @event Bus#started
     */
    this.emit('configured');
};

Bus.prototype.start = function() {
    var self = this;

    process.nextTick(function() {
        self.outputServices.forEach(function(service, index, subject) {
            try {
                service.start();
            } catch(ex) {
                // TODO Log this and continue
            }
        });
    });
};

Bus.prototype.startService

module.exports = Bus;

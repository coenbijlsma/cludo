var events = require('events');
var util = require('util');

var BusError = mod('domain/core/BusError');
var QueuePool = mod('domain/messaging/QueuePool');
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
 * @param {Service[]} services - The input, output and processing services for this Bus instance.
 * instance.
 */
Bus.prototype.configure = function(queuePool, services) {
    cutil.typecheck(queuePool, 'queuePool', QueuePool);
    cutil.typecheck(services, 'services', Array, true);

    var self = this;

    self.queuePool = queuePool;
    self.services = [];

    // Configure handling of messages sent by services
    self.queuePool.on('message', function(event) {
        var envelope = event.item;

        if (self.services[envelope.target] === undefined) {
            self.emit('error', new Error('Target [' + envelope.target + '] for message [' 
                + envelope.id + '] not defined'));
        } else {
            self.services[envelope.target].instance.receive(envelope.message); 
        }
    });

    if (services) {
        for ( i = 0; i < services.length, i++) {
            service = services[i];
            cutil.typecheck(service, 'service', Service);

            // Add the service to this Bus instance
            self.services[service.name] = {
                instance: service,
                state: 'IDLE',
            };
            
            function updateServiceState(name, state) {
                var previousState = self.services[name].instance.state;
                self.services[name].instance.state = state;

                /**
                 * @event Bus#service.state.change
                 * @type {object}
                 * @property {string} name - The name of the service that changed state
                 * @property {string} previousState - The previous state of the service
                 * @property {string} currentState - The current state of the service
                 */
                self.emit('service-state-change', {
                    name: name,
                    previousState: previousState,
                    currentState: state
                });

            }

            // Set up listeners for service state changes
            service.on('start', function() {
                updateServiceState(service.name, 'STARTED');
            });
            service.on('stop', function() {
                updateServiceState(service.name, 'STOPPED');
            });
            service.on('error', function() {
                updateServiceState(service.name, 'ERROR');
            });
        }
    }

    /**
     * @event Bus#configured
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

    process.nextTick(function() {
        self.services.forEach(function(service, index, serviceArray) {
            var serviceErrorHandler = function(err) {
                // TODO Log this
            };

            try {
                service.on('error', serviceErrorHandler);
                service.on('send', function(envelope) {
                    self.queuePool.get().enqueue(envelope);
                });

                service.start();
            } catch(ex) {
                serviceErrorHandler(ex);
            }
        });

        /**
         * @event Bus#started
         */
        self.emit('started');
    });
};

/**
 * Stops this Bus and all services that it contains.
 *
 * @fires Bus#stopped
 */
Bus.prototype.stop = function() {
    var self this;

    process.nextTick(function() {
        self.services.forEach(function(service, index, serviceArray) {
            service.stop();
        });

        self.emit('stopped');
    });
};

module.exports = Bus;

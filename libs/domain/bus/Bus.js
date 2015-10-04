"use strict";

var events = require('events');
var util = require('util');

var BusError = mod('domain/core/BusError');
var QueuePool = mod('domain/messaging/QueuePool');
var Service = mod('domain/bus/Service');
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

    this.queuePool = queuePool;
    this.services = [];

    // Configure handling of messages sent by services
    this.queuePool.on('message', (event) => {
        var envelope = event.item;

        if (this.services[envelope.target] === undefined) {
            this.emit('error', new Error('Target [' + envelope.target + '] for message [' 
                + envelope.id + '] not defined'));
        } else {
            this.services[envelope.target].instance.receive(envelope.message); 
        }
    });

    if (services) {
        for (let i = 0; i < services.length; i++) {
            let service = services[i];
            cutil.typecheck(service, 'service', Service);

            // Add the service to this Bus instance
            this.services[service.name] = {
                instance: service,
                state: 'IDLE',
            };
            
            let updateServiceState = (name, state) => {
                var previousState = this.services[name].instance.state;
                this.services[name].instance.state = state;

                /**
                 * @event Bus#service.state.change
                 * @type {object}
                 * @property {string} name - The name of the service that changed state
                 * @property {string} previousState - The previous state of the service
                 * @property {string} currentState - The current state of the service
                 */
                this.emit('service-state-change', {
                    name: name,
                    previousState: previousState,
                    currentState: state
                });

            }

            // Set up listeners for service state changes
            service.on('start', () => {
                updateServiceState(service.name, 'STARTED');
            });
            service.on('stop', () => {
                updateServiceState(service.name, 'STOPPED');
            });
            service.on('error', () => {
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
    for (var key in this.services) {
        if (this.services.hasOwnProperty(key)) {
            var service = this.services[key];
            console.log('trying to start service ' + service.instance.name);

            let serviceErrorHandler = (err) => {
                // TODO Log this
                throw err;
            };

            try {
                service.instance.on('error', serviceErrorHandler);
                service.instance.on('send', (envelope) => {
                    this.queuePool.get().enqueue(envelope);
                });

                console.log('starting service ' + service.instance.name);
                service.instance.start();
            } catch(ex) {
                serviceErrorHandler(ex);
            }
        }
    }

    /**
     * @event Bus#started
     */
    this.emit('started');
};

/**
 * Stops this Bus and all services that it contains.
 *
 * @fires Bus#stopped
 */
Bus.prototype.stop = function() {
    process.nextTick(() => {
        this.services.forEach((service, index, serviceArray) => {
            service.stop();
        });

        this.emit('stopped');
    });
};

module.exports = Bus;

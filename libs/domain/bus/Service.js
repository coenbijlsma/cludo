"use strict";

var util = require('util');
var events = require('events');

var cutil = mod('domain/core/Util');


function Service(name) {
    events.EventEmitter.call(this);
    cutil.typecheck(name, 'name', 'string');
    this.name = name;
}
util.inherits(Service, events.EventEmitter);

/**
 * Sends a message from this service to the target service.
 *
 * @param {object} message - The message to send
 * @param {string} target - The name of the target service
 * @fires Service#send
 */
Service.prototype.send = function(message, target) {

    /**
     * @event Service#send
     * @type {object}
     * @property {string} id - An RFC4122 v4 UUID that uniquely identifies the message
     * @property {object} message - The message that will be sent
     * @property {string} target - The name of the service to send the message to
     */
    this.emit('send', {
        id: cutil.uuid(),
        message: message,
        target: target
    });
};

/**
 * Receives a message from another service.
 *
 * @param {object} message - the received message
 */
Service.prototype.receive = function(message) {

    /**
     * @event Service#receive
     */
    this.emit('receive', message);
};

/**
 * Emits the start event, so sub classes and other interested
 * parties can act on it.
 *
 * @fires Service#start
 */
Service.prototype.start = function() {

    /**
     * @event Service#start
     */
    this.emit('start');
};

/**
 * Emits the stop event, so sub classes and other interested
 * parties can act on it.
 *
 * @fires Service#stop
 */
Service.prototype.stop = function(force) {

    /**
     * @event Service#stop
     */
    this.emit('stop', force);
};

module.exports = Service;

"use strict";

var util = require('util');

var cutil = mod('domain/core/Util');

let BusError = (message, cause) => {
    cutil.typecheck(cause, 'cause', Error, true);

    Error.call(this, message);

    Object.defineProperty(this, 'cause', {
        enumerable: true,
        value: cause
    });
};
util.inherits(BusError, Error);

module.exports = BusError;

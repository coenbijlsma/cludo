var util = require('util');
var uuid = require('node-uuid');

function isBoolean(candidate) {
    return typeof candidate === 'boolean';
};
exports.isBoolean = isBoolean;

function isNumber(candidate) {
    return typeof candidate === 'number';
};
exports.isNumber = isNumber;

function isString(candidate) {
    return typeof candidate === 'string';
};
exports.isString = isString;

function isObject(candidate) {
    return (candidate !== null) && (typeof candidate === 'object');
};
exports.isObject = isObject;

function isUndefined(candidate) {
    return typeof candidate === 'undefined';
}
exports.isUndefined = isUndefined;

function isInteger(candidate) {
    return parseInt(candidate) === candidate;
};
exports.isInteger = isInteger;

function isFloat(candidate) {
    return parseFloat(candidate) === candidate;
};
exports.isFloat = isFloat;

function isFunction(candidate) {
    return typeof candidate === 'function';
};

function isA(instance, type) {
    return instance instanceof type;
};
exports.isA = isA;

exports.isArray = util.isArray;

/**
 * Checks if the supplied variable is of the specified type.
 * If the variable does not conform to the requested type,
 * or if it is null or undefined and the nullable parameter is false,
 * this function throws an exception.
 *
 * @param {*} variable - The variable value to be checked
 * @param {string} name - The name of the variable
 * @param {string} type - The expected type of the variable
 * @param {boolean} [nullable=false] - Whether the supplied variable value is 
 * nullable. If true, it also allows for undefined values.
 */
exports.typecheck = function(variable, name, type, nullable) {
    allowedTypes = [
        'boolean',
        'number',
        'string',
        'object',
        'undefined',
        'int',
        'integer',
        'float'
    ];

    // First check our own parameters.
    if (!isString(name)) {
        throw new Error('The name parameter must be of type string');
    } else if (!isString(type) && !isFunction(type) ) {
        throw new Error('The type parameter must be of type string or function, but got ' 
            + (typeof type));
    } else {
        if (!isUndefined(nullable) && (nullable !== null)) {
            if (!isBoolean(nullable)) {
                throw new Error('The nullable parameter must be either undefined, ' 
                    + 'null or a boolean, but got ' + (typeof nullable));
            }
        }
    }

    // Check if the type variable contains a supported type to check.
    if (!isFunction(type) && (allowedTypes.indexOf(type) === -1)) {
        throw new Error('The [type] parameter must be a function, or one one of [' 
            + allowedTypes.toString()  + ']');
    }

    // Provide a default value for nullable if necessary.
    if (isUndefined(nullable)) {
        nullable = false;
    }

    // Execute the actual type check.
    if(nullable === false) {
        if(variable === null || isUndefined(variable)) {
            throw new Error('Variable [' + name + '] cannot be null or undefined');
        }
    }

    if ((variable !== null) && !isUndefined(variable)) {
        if (isFunction(type)) {
            // The supplied variable must be of a certain object type
            
            if (!isA(variable, type)) {
                throw new Error('Illegal type for variable [' + name
                    + ']. Expected [' + type.name + '] but got [' + variable.constructor.name  
                    + ']');
            }

        } else if (type === 'int' || type === 'integer') {
            if (!isInteger(variable)) {
                // Note that this exception can be somewhat confusing when a 
                // float value is provided, because the exception will state that
                // it exoected an integer but got a number.
                throw new Error('Illegal type for variable [' + name 
                    + ']. Expected [integer] but got [' + (typeof variable) + ']');
            }
        } else if (type === 'float') {
            if (!isFloat(variable)) {
                // Note that this exception can be somewhat confusing when an
                // integer value is provided, because the exception will state that
                // it expected a float but got a number.
                throw new Error('Illegal type for variable [' + name
                    + ']. Expected [float] but got [' + (typeof variable) + ']');
            }
        } else if (typeof variable !== type) {
            throw new Error('Illegal type for variable [' + name 
                + ']. Expected [' + type + '] but got [' + (typeof variable) + ']');
        }
    }
};

exports.uuid = function() {
    return uuid.v4();
};

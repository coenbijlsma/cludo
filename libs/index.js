var fs = require('fs');

var mod = function(file) {
    return require('./' + file);
};

function bootstrap() {
    if(typeof global.mod === 'undefined') {
        global.mod = mod;
    }
}

bootstrap();


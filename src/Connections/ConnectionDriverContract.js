'use strict';

/**
 * An Interface for Connection Driver.
 * @author Rej Mediodia
 */

class ConnectionDriverContract {

    fire() {
        throw new Exception('please declare the fire function');
    }

    listen() {
        throw new Exception('please declare the listen function');
    }

    removeListener() {
        throw new Exception('please declare the removeListener function');
    }

    getSocketInstance() {
        throw new Exception('please declare the getSocketInstance function');
    }

    getInstance() {
        throw new Exception('please declare the getInstance function');
    }
    
    getInstance() {
        throw new Exception('please declare the addHook function');
    }
}

module.exports = ConnectionDriverContract;

'use strict';
/**
 * A Server to Client Broadcasting Service.
 * Inspired by Laravel Broadcasting Service
 * @author Rej Mediodia
 */

const SocketIODriver = require('./Connections/SocketIODriver');
const ConnectionContract = require('./Connections/ConnectionDriverContract');

class BroadcastManager {

    constructor(config, serverInstance) {
        this.config = {...config};
        this.serverInstance = serverInstance;
        // contain the list of established connection
        this.establishedConnection = {};

        // contain the list of extended connection
        this.customDrivers = {};
        // list of supported connection implementation
        this.defaultDrivers = {
            socketio: this.createSocketIODriver.bind(this)
        };
    }

    setServerInstance(instance) {
        this.serverInstance = instance;
    }

    getServerInstance() {
        return this.serverInstance;
    }

    connection(name) {
        return this.getConnection(name);
    }

    getConnection(name) {
        name = name || this.getDefaultConnection();
        // assign and return the driver connection
        return this.establishedConnection[name] = this.get(name);
    }

    get(name) {
        // check if the connection was already fetch before.
        return this.establishedConnection.hasOwnProperty(name)
            ? this.establishedConnection[name]
            // if not try to initialize the connection
            : this.resolve(name);
    }

    getDefaultConnection() {
        return this.config.default;
    }

    /**
     * Identify and Initialize the right driver to be used.
     * @param {string} name - name of the connection to be used.
     * @return {object} instance of driver to be used.
     */
    resolve(name) {
        // to prevent mutability
        let config = {...this.config['connections'][name]};

        if (!config) throw new Error('connection configuration for', name, 'was not specified');

        let driver = (this.customDrivers.hasOwnProperty(config.driver))
            ? this.customDrivers[config.driver](config)
            // if no custom connection specified search for the default connections
            : this.defaultDrivers[config.driver](config);

        if (!(driver instanceof ConnectionContract))
            throw new Error('specified driver must implement ConnectionContract')

        return driver;
    }

    /**
     * Initialize the socket io driver.
     * @param {object} config - socketio driver config
     * @return {object} socketio driver isntance.  
     */
    createSocketIODriver(config) {
        let serverInstance = this.getServerInstance();
        return new SocketIODriver(serverInstance, config, this.logger);
    }

    logger() {
        if (!this.config.log) return;

        console.log(arguments.join(' '));
    }

    /**
     * Extend additional or override existing connection implementation.
     * @param {string} name  - connection name specified in config
     * @param {function} callback - implementation to be done if the connection was called.
     */
    extendDriver(name, callback) {
        this.customDrivers[name] = callback;
    }
}

module.exports = BroadcastManager;

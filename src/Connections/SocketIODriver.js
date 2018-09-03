'use strict';

/**
 * A SocketIO Connection Driver.
 * @author Rej Mediodia
 */

const ConnectionContract = require('./ConnectionDriverContract');
const SocketServer = require('socket.io');
const Socket = require('./Socket');

class SocketIO extends ConnectionDriverContract {
    constructor(serverInstance, config) { //, logger) {
        super(serverInstance, config);

        this.listeners = [];
        this.hooks = [];
        this.socket;

        serverInstance = serverInstance || config.port;

        this.io = new SocketServer(serverInstance, config.options);

        // this.initializeMiddleware();

        this.io.on('connection', (socket)=> {
            this.socket = new Socket(socket);
            console.log('someone connected to socket', this.socket.getId());
            // this.logger('someone connected to socket', this.socket.getId());
            this.listeners.map(({eventName, callback}) => this.listen(eventName, callback));

            this.hooks.map((hook) => this.addHook(hook));
        });
    }

    initializeMiddleware() {
        this.config.middlewares.map((middleware) => {
            let instance = new (require(middleware))();
            this.io.use(instance.handle()); 
        });
    }

    /**
     * {channel} - array of channels
     * {eventName} - name of event to be emitted.
     * {data} - data object to be emitted.
     */
    fire(channel, eventName, data) {
        if (!channel) return this.io.emit(eventName, data);
        
        console.log('firing event to', channel, 'channel with event', eventName, ' and data', data);
        this.io.to(channel).emit(eventName, data);
    }

    listen(eventName, callback) {
        // temporary solution to wait first if there is no socket
        if (!this.socket)
            return this.listeners.push({eventName, callback});

        console.log('someone joined adding', eventName, 'listener to it');
        this.socket.on(eventName, callback, this.socket);
    }

    removeListener(eventName, callback) {
        if (!this.socket) return;
        this.socket.off(eventName, callback, this.socket);
    }

    getInstance() {
        return this.io;
    }

    getSocketInstance() {
        return this.socket;
    }

    addHook(callback) {
        if (!this.socket) return this.hooks.push(callback);

        console.log('someone joined adding hooks to it');
        callback(this.socket);
    }

}

module.exports = SocketIO;

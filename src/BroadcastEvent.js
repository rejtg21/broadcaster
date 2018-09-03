'use strict';
/**
 * A Server to Client Broadcasting Service.
 * @author Rej Mediodia
 */

const BroadcastEventContract = require('./Contracts/BroadcastEventContract');
const BroadcastListenContract = require('./Contracts/BroadcastListenContract');

class BroadcastEvent {
    constructor(manager) {
        this.manager = manager;
    }

    fire(eventClass) {
        if (!(eventClass instanceof BroadcastEventContract))
            throw new Error('Event should be an instance of BroadcastEventContract');

        // get the connection where to fire the event.
        let connection = this.manager.connection(eventClass.connection());

        connection.fire(
            eventClass.broadcastOn(),
            eventClass.broadcastAs(),
            eventClass.data(),
        );
    }

    listen(listenClass) {
        if (!(listenClass instanceof BroadcastListenContract))
            throw new Error('Event should be an instance of BroadcastListenContract');

        // get the connection where to fire the event.
        let connection = this.manager.connection(listenClass.connection());

        connection.listen(
            listenClass.eventName(),
            listenClass.handle
        );
    }

    removeListener(listenClass) {
        if (!(listenClass instanceof BroadcastListenContract))
            throw new Error('Event should be an instance of BroadcastListenContract');

        // get the connection where to fire the event.
        let connection = this.manager.connection(listenClass.connection());

        connection.fire(
            listenClass.eventName(),
            listenClass.handle.bind(listenClass)
        );
    }

    bootListeners(listenersPath) {
        const requireAll = require('require-all');
        const options = {
            recursive: true
        };
        listenersPath.map((listenerPath)=>{
            let listeners = requireAll({
                dirname: rootPath + listenerPath,
                ...options
            });

            Object.values(listeners).map((Listener) => {
                this.listen(new Listener());
            });
        });
    }

    addHook(callback, connectionName) {
        // get the connection where to fire the event.
        let connection = this.manager.connection(connectionName);

        connection.addHook(callback);
    }
}

module.exports = BroadcastEvent;

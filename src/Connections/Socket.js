'use strict';

/**
 * A Socket Entity.
 * @author Rej Mediodia
 */

class Socket {
    constructor(socket) {
        this.socket = socket;
    }

    getId() {
        return this.socket.id;
    }

    on(eventName, callback, socketInstance) {
        this.socket.on(eventName, (data) => {
            callback(data, socketInstance);
        });
    }

    off(eventName, callback, socketInstance) {
        // in socket io removelistener need the same callback used in listening
        this.socket.removeListener(eventName, (data) => {
            callback(data, socketInstance)
        })
    }

    joinRoom(channel) {
        this.socket.join(channel);
    }

    leaveRoom(channel) {
        this.socket.leave(channel);
    }
}

module.exports = Socket;

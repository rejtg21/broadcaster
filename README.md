# Broadcaster
A nodejs broadcasting library that focus with server to client and client to server communication.

## Prerequisite
- [require-all](https://github.com/felixge/node-require-all#readme)
- [resm-env](https://github.com/rejtg21/envjs) or any `env` library.

## Installation
`npm install --save resm-broadcaster`

## Current Driver Supported
- [SocketIO](https://socket.io/)
- Custom Driver is supported. You can easily extend drivers to be used.

## Usage

#### Define a Config.
`Config.js`
```
'use strict'

const ENV = new (require('resm-env'))({
    path: 'env file path'
});

module.exports = {
    log: true,
    // Default connection
    default: ENV.get('BROADCAST_CONNECTION', 'socketio'),
    /**
     * List of connections that can be used
     */
    connections: {
        socketio: {
            driver: 'socketio',
            client: {
                uri: ENV.get('SOCKET_URL')
            },
            /**
             * {optional} Specify the port to be use,
             * If you have bootstrap a server instance
             * this is not requierd
             */
            port: ENV.get('SOCKET_PORT', '9000'),
            options: {},
            // io middleware
            middlewares: [],
        }
    }
};
```
#### Bootstrap Services
Initialize first the `BroadcastManager` and `BroadcastEvent` Service.

`Server.js`
```
const config = require('Config');

const BroadcastManager = require('resm-broadcaster/BroadcastManager');

Broadcaster = new BroadcastManager(config);

const BroadcastEvent = new (require('resm-broadcaster/BroadcastEvent'))(Broadcaster);

// boot listeners
/**
 * Listener Path Directory/Files
 */
const listeners = [
        __dirname + '/app/Listener'
    ],

BroadcastEvent.bootListeners(listeners);

// add hook to be called when socket establish connection
BroadcastEvent.addHook((socket) => {
    // other hooks here
    socket.joinRoom('test')
});
```

#### Firing Events.
After successful bootstrap `BroadCastEvent`. Create a Event file that implements the `BroadcastEventContract`. In ES6 there is no implements yet so we will utilize the extends.

`Sample.js`
```
const BroadcastEvent = require('resm-broadcaster/Contracts/BroadcastEventContract');

class Sample extends BroadcastEvent {

    constructor(data) {
        super();
        console.log('constructing event data', data);

        this.sampleData = data;
    }

    /**
     * Data to be send when the event was emitted.
     * @return object
     */
    data() {
        // input logic here

        return this.sampleData;
    }

    /**
     * Event Channel to be broadcasted.
     * @return array
     */
    broadcastOn() {
        // this will emit in channel test
        return 'test'; // Default: null
    }

    /**
     * Event Name to be broadcast
     * @return string
     */
    broadcastAs() {
        return 'sample-event-emit';
    }
}

```

`Server.js`

```
const Sample = require('Sample');

const data = {
    name: 'Rej Mediodia',
    message: 'This is a test'
};

BroadCastEvent.fireEvent(new Sample(data));
```
All joined in channel `test` will received this in `Client.js`.

```
socket.on('sample-event-emit', function(data) {
    console.log(data);
    /**
     * data = {
     *   name: 'Rej Mediodia',
     *   message: 'This is a test'
     */
};
});
```

#### Listener

`Client.js`
``` 
const data = {
    name: 'Rej Mediodia',
    message: 'This is from client'
};

socket.emit('sample-event', data);
```

We need to define first our Listener File that implements the `BroadcastListenContract`. In ES6 there is no implements yet so we will utilize the extends.

`SampleListener.js`
```
const BroadcastListenContract = require('resm-broadcaster/Contracts/BroadcastListenContract')

class SampleListener extends BroadcastListenContract {

    handle(data, socket) {
        console.log('received data', data);
        /**
         * data = {
         *   name: 'Rej Mediodia',
         *   message: 'This is from client'
         * }
    }

    eventName() {
        return 'sample-event';
    }
}

module.exports = SampleListener;

```

## Todo
- Security for SocketIODriver
- Test Cases

## Inspiration
- [BroadcastService](https://laravel.com/docs/5.6/broadcasting) of Laravel.

## License
MIT

#io
socket.io client and server library for webApp developer

<br />

## Table of Contents  

1. [Usage](#Usage)  
2. [APIs and Events](#APIs) 
3. [Data Model](#DataModel)
4. [Appendix](#Appendix)

<br />

<a name="Usage"></a>
## 1. Usage  

Just need to require **ioServer** or **ioClient** module to get a singleton, and use `start()` method to let socket.io server or client start running.

- ioServer

```javascript
var ioServer = require('ioServer');

var server = http.createServer();

server.listen(3000);

ioServer.start(server);
```

- ioClient

```javascript
var ioClient = require('ioClient');

ioClient.start('http://localhost:3000');
```

<br />

<a name="APIs"></a>
## 2. APIs and Events  

### IoServer Apis  

* [isRunning()](#API_isRunServer)
* [start()](#API_startServer)
* [stop()](#API_stopServer)
* [sendInd()](#API_indServer)
* [regReqHdlr()](#API_reqServer)

### IoClient Apis

* [isRunning()](#API_isRunClient)
* [start()](#API_startClient)
* [sendReq()](#API_reqClient)
* [Events](#Events)

<br />

## IoServer Class
`require('ioServer')` returns an instance of this class

*************************************************

<a name="API_isRunServer"></a>
### .isRunning()

Check whether the socket.io server is running.

**Arguments:** 

- (*none*)

**Returns**

- (*Boolean*): `true` if ioServer running, otherwise `false`  

**Example**

```javascript
if (ioServer.isRunning()) {
    // ioServer is running
} else {
    // ioServer is stop running
};
```

*************************************************
<a name="API_startServer"></a>
### .start(server)

Start running socket.io server.

**Arguments:**

1. `server` (*Object*): http server

**Returns**

- (*Boolean*): `true` if ioServer started, otherwise `false`  

**Example**

```javascript
var server = http.createServer();

server.listen(3000);

ioServer.start(server);
```

*************************************************
<a name="API_stopServer"></a>
### .stop()

Stop running socket.io server.

**Arguments:**

- (*none*)

**Returns**

- (*Boolean*): `true` if ioServer stopped, otherwise `false`  

**Example**

```javascript
ioServer.stop();
```

*************************************************
<a name="API_indServer"></a>
### .sendInd(indType, data)

Send an indication to all socket.io clients.

**Arguments:**

1. `indType` (*String*): Indication type. It is same with the [Indication](#Indication).    
2. `data` (*Object*): Data along with the indication. Please see section [Indication](#Indication) to learn more about the indication data format.  

**Returns**

- (*Object*): ioServer  

**Example**
```javascript
ioServer.sendInd('ready', {});
```

*************************************************
<a name="API_reqServer"></a>
### .regReqHdlr(reqType, hdlr)

Register a handler to handle the request from client side.

**Arguments:**

1. `reqType` (*String*): Request type. It is same with the [Request](#Request).    
2. `hdlr` (*Function*): `function (args, callback) {}`, handler function.  

    * `'args'` (*Object*): A data object of arguments. Please see section [Request](#Request) to learn more about the arguments data format. 
    * `'callback'` (*Function*): `function (err, result) ()`, result contains data to response the client asking for. Please see section [Response](#Response) to learn more about the response data format. 

**Returns**

- (*Object*): ioServer  

**Example**
```javascript
ioServer.regReqHdlr('getDevs', function (args, callback) {
    // 1. do something to get all device information
    // 2. invoke callback to pass error or result back
});
```

<br />


## IoClient Class
`require('ioClient')` returns an instance of this class

*************************************************
<a name="API_isRunClient"></a>
### .isRunning()

Check whether the socket.io client is running.

**Arguments:** 

- (*none*)

**Returns**

- (*Boolean*): `true` if ioClient running, otherwise `false` 

```javascript
if (ioClient.isRunning()) {
    // ioClient is running
    // you can send request here
} else {
    // ioClient is stop running
};
```

*************************************************
<a name="API_startClient"></a>
### .start(addr)

Start running socket.io client.

**Arguments:**

1. `addr` (*String*): host address

**Returns**

- (*Boolean*): `true` if ioClient started, otherwise `false`  

**Example**
```javascript
ioClient.start('http://localhost:3000');
```

*************************************************
<a name="API_reqClient"></a>
### .sendReq(reqType, args, callback)

Client sends to Server to request something or to ask the server to perform an operation.

**Arguments:** 

1. `reqType` (*String*): Request Type. It is same with the [Request](#Request).    
2. `args` (*Object*): A value-object that contains command arguments. Please see section [Request](#Request) to learn more about the arguments data format. 
3. `callback` (*Function*): `function (err, result) {}`. Get called when server respond to client with the results of the client asking for.
    * `'err'` (*Error*): Error object.
    * `'result'` (*Object*): `result` is a response data object. Please see section [Response](#Response) to learn more about the response data format. 

**Returns**

- (*none*)

**Example**

```javascript
wsClient.sendReq('permitJoin', { time: 180 }, function(err, result) {
    if (err) {
        console.log(err);
    } else {
        console.log(result);

    // result equal to 
        // {}
});
```

<a name="Events"></a>
### Event

The ioClient will fire event when receiving an indication from socket.io server side.

### .on(evtType, function(msg) {...})

* `evtType` (*String*): Event type. It is same with the [Indication](#Indication)
* `msg` (*Object*): It is a message object contains data along with the indication. Please see section [Indication](#Indication) to learn more about the indication data format.

<br />

<a name="DataModel"></a>
## 3. Data Model 

<a name="Request"></a>
### Request

| Request Type | Arguments                                            | Description                                    |
|--------------|------------------------------------------------------|------------------------------------------------|
| getDevs      | { }                                                  | Get information of all devices.                |
| permitJoin   | { time: Number }                                     | Allow or disallow devices to join the network. |
| write        | { permaddr: String, auxId: Depends, value: Depends } | Write a value to an attribute on a device.     |

<a name="Response"></a>
### Response
    
| Response Type | Data                                                 | Data Description                                                                     |
|---------------|------------------------------------------------------|--------------------------------------------------------------------------------------|
| getDevs       | { xx:xx:xx: [devInfo](#devInfo), ... }               | Object of device information objects, the key of object is device permanent address. |
| permitJoin    | {}                                                   | Response contains no data.                                                           |
| write         | { permaddr: String, auxId: Depends, value: Depends } | Device information and the written value of device.                                  |

<a name="Indication"></a>
### Indication

| Indication Type | Message                                        | Description                                                         |
|-----------------|------------------------------------------------|---------------------------------------------------------------------|
| ready           | {}                                             | Shepherd is ready                                                   |
| permitJoining   | { timeLeft: Number }                           | Shepherd is now allowing or disallowing devices to join the network |
| devIncoming     | { dev: [devInfo](#devInfo) }                   | A new device is incoming                                            |
| devStatus       | { permAddr: String, status: String }           | Status of a device has changed                                      |
| attrsChange     | { permAddr: String, gad: [gadInfo](#gadInfo) } | Attribue(s) on a device has changed                                 |
| toast           | { msg: String }                                |                                                                     |


<br />

<a name="Appendix"></a>
## 4. Appendix

<a name="devInfo"></a>
- Device Information (devInfo) Object

    - Properties

    | Property | Type   | Description                                                                                                                          |
    |----------|--------|--------------------------------------------------------------------------------------------------------------------------------------|
    | permAddr | String | Device permanent addresses.                                                                                                          |
    | status   | String | Device status.                                                                                                                       |
    | gads     | Object | An object gathered all gadgets information. The key of object is gadget's auxiliary address, value of object is [gadInfo](#gadInfo). |

<a name="gadInfo"></a>
- Gadget Information (gadInfo) Object

    - Properties

    | Property | Type    | Description                                          |
    |----------|---------|------------------------------------------------------|
    | type     | String  | Gadget Type.                                         |
    | auxId    | String  | The auxiliary id to identify the gadget on a device. |
    | value    | Depends | Gadget Value.                                        |
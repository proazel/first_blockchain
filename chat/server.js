var WebSocketServer = require('ws').Server
  , config = {
        host: "0.0.0.0",
        port: 8080,
        verifyClient: verifyClient
    }
  , wss = new WebSocketServer(config, function() {
        console.log('Web Socket Server is established on port 8080');
    });

wss.on('connection', function(ws) {

    // when a new connection is established
    console.log('A connection is established')
    ws.send('SERVER: Welcome to the ws chat');
    console.log(ws.upgradeReq.url);

    // when receive a message
    ws.on('message', function(message) {
        console.log('received: %s', message);
        ws.send('SERVER: You sent "' + message + '"');
    });

    // when a connection is closed
    ws.on('close', function() {
        console.log('connection is closed');
    });
});

function verifyClient(info) {
    console.log('verifyClient');
    return true;
}
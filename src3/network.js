const WebSocket = require('ws');

// 내 자신을 WebSocket Server로 설정
// function wsInit(){
//     const server = new WebSocket.Server({ port: 6005 });
//     console.log(1);
//     server.on('connection', (ws)=>{
//         console.log(2);
//         ws.on('message', (message)=>{
//             console.log(3);
//             console.log(`received: ${message}`);
//         });
//         ws.send('change');
//         /*
//             .send는 .on('message')로 받을 수 있음
//             .send로 보낸 ''값은 받는쪽에서 콜백함수의 인자값이 됨 // .on('', (여기)=>{})
//         */
//         console.log(4);
//     });
// }
// wsInit();

let sockets = []; // 내가 접속한 사람들의 특정 사람에게만 내용을 전달하고 싶어서

function wsInit(){
    const server = new WebSocket.Server({ port: 6005 });
    server.on('connection', (ws)=>{
       init(ws);
       
    });
}

function init(ws){
    sockets.push(ws);
    initMessageHandler(ws);
    initErrorHandler(ws);
}

function initErrorHandler(ws){
    ws.on('close', ()=>{
        closeConnection(ws);
    });
    ws.on('error', ()=>{
        closeConnection(ws);
    });
}

function closeConnection(ws){
    console.log(`connection close ${ws.url}`);
    sockets.splice(sockets.indexOf(ws), 1);
}

// const MSG = "msg";
// const SEND = "send";
const MessageAction = {
    QUERY_LAST: 0,
    QUERY_ALL: 1,
    RESPONSE_BLOCK: 2,
}

function initMessageHandler(ws){
    ws.on('message', (data)=>{
        const message = JSON.parse(data);
        // console.log(JSON.parse(data));
        console.log(message.type);
        switch (message.type){
            case MessageAction.QUERY_LAST:
                console.log(message.data);
                // console.log("메세지 출력");
            break;
            case MessageAction.QUERY_ALL:
                console.log(message.data);
                // console.log("센드 출력");
            break;
            case MessageAction.RESPONSE_BLOCK:
                handleBlockResponse();
            break;
        }
    });
}

function handleBlockResponse(){
    
}

wsInit();

/*
    http://     localhost:3000
    ws://       localhost:3001

    server <--> clinet
*/

module.exports = {
    wsInit,
}
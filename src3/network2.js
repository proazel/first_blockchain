const WebSocket = require('ws');

const ws = new WebSocket("ws://localhost:6005");

ws.on('open', ()=>{
    // ws.send(`{"name":"test123"}`);
    // let obj = { name: 'test123' };
    // let obj = {
    //     type: 0,
    //     data: 'hello world111',
    // };
    // let rst = JSON.stringify(obj);
    // ws.send(rst);
    // write(ws, obj);
    write(ws, queryBlockMsg());

    // let obj2 = {
    //     type: 1,
    //     data: '데이터 전송',
    // }
    // write(ws, obj2);
    write(ws, queryAllMsg());
});

const MessageAction = {
    QUERY_LAST: 0,
    QUERY_ALL: 1,
    RESPONSE_BLOCK: 2,
}

function queryBlockMsg(){
    return {
        type: MessageAction.QUERY_LAST,
        data: null,
    }
}

function queryAllMsg(){
    return {
        type: MessageAction.QUERY_ALL,
        data: null,
    }
}

function write(ws, message){
    ws.send(JSON.stringify(message));
}

ws.on('error', ()=>{
    console.log('error 발생');    
});

ws.on('message', (message)=>{
    console.log(`received: ${message}`);
});
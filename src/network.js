// npm install ws
const WebSocket = require('ws');
const wsPORT = process.env.WS_PORT || 6005;
const bc = require('./block');

// 전역 변수 peer
let sockets = [];
function getSockets(){ return sockets; }

const MessageAction = {
    QUERY_LAST: 0,
    QUERY_ALL: 1,
    RESPONSE_BLOCK: 2,
}

// reducer 같은 느낌
function initMessageHandler(ws){
    ws.on('message', data=>{
        const message = JSON.parse(data);
        switch(message.type){
            case MessageAction.QUERY_LAST:
                write(ws, responseLastMsg());
            break;
            case MessageAction.QUERY_ALL:
                write(ws, responseBlockMsg());
            break;
            case MessageAction.RESPONSE_BLOCK:
                handleBlockResponse(message); // 여기서 실행
            break;
        }
    });
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

function responseLastMsg(){
    return {
        type: MessageAction.RESPONSE_BLOCK,
        data: JSON.stringify([bc.getLastBlock()]),
    }
}

function responseBlockMsg(){
    return {
        type: MessageAction.RESPONSE_BLOCK,
        data: JSON.stringify(bc.getBlocks()),
    }
}

function handleBlockResponse(message){
    const receivedBlocks = JSON.parse(message.data);                        // 받은 블록
    const lastBlockReceived = receivedBlocks[receivedBlocks.length - 1];    // 받은 블록 중 마지막
    const lastBlockHeld = bc.getLastBlock();                                // 가지고 있는 블록 중 마지막

    // 블록 최신화 체크
    if (lastBlockReceived.header.index > lastBlockHeld.header.index){
        console.log(
            "블록의 갯수 \n" +
            `내가 받은 블록의 index값 ${lastBlockReceived.header.index}\n` +
            `내가 가지고있는 블럭의 index값 ${lastBlockHeld.header.index}\n`
        );

        // 연결점이 어느정도?
        if (bc.createHash(lastBlockHeld) === lastBlockReceived.header.previousHash){
            console.log(`마지막 하나만 비어있는 경우에는 하나만 추가합니다.`);
            if (bc.addBlock(lastBlockReceived)){
                broadcast(responseLastMsg());
            }
        } else if (receivedBlocks.length === 1){
            console.log(`peer로부터 블록을 연결해야합니다.`);
            broadcast(queryAllMsg());
        } else {
            console.group(`블록의 최신화를 진행합니다.`);
            // 블록을 최신화하는 코드
            bc.replaceBlock(receivedBlocks);

        }
    } else {
        console.log('블록이 이미 최신화 되었습니다.');
    }
}

function initErrorHandler(ws){
    ws.on('close', ()=>{ closeConnection(ws); });
    ws.on('error', ()=>{ closeConnection(ws); });
}

function closeConnection(ws){
    console.log(`connection close ${ws.url}`);
    sockets.splice(sockets.indexOf(ws), 1);
}

// socket은 event 코드를 많이 작성 // JS에서 event는 비동기
// 최초 실행(접속)
function wsInit(){
    const server = new WebSocket.Server({ port: wsPORT });
    // server == 내가 받은 socket
    server.on('connection', (ws)=>{
        // console.log(ws);
        init(ws); // socket의 key값
    });
}

function write(ws, message){
    ws.send(JSON.stringify(message));
}

function broadcast(message){
    sockets.forEach(socket=>{
        write(socket, message);
    });
}

// 여러 사용자 접속 시 처리
function connectionToPeers(newPeers){ // 배열로 들어감 ["ws://localhost:7001", "ws://localhost:7002"]
    newPeers.forEach(peer=>{ // peer == 주소값, http://localhost:3000
        const ws = new WebSocket(peer);
        ws.on('open', ()=>{
            init(ws);
        });
        ws.on('error', ()=>{
            console.log('connection failed');
        });
    });
}

// 전역 변수 sockets에 push만 하는 역할
function init(ws){
    sockets.push(ws);
    initMessageHandler(ws);
    initErrorHandler(ws);
    // ws.send(JSON.stringify({type:MessageAction.QUERY_LAST, data:null}));
    write(ws, queryBlockMsg());
}

module.exports = {
    wsInit,
    getSockets,
    broadcast,
    responseLastMsg,
    connectionToPeers,
}
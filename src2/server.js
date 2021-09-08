const port = process.env.PORT || 3001;

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const bc = require('./block.js');
const ws = require('./network.js');

app.use(bodyParser.json());

// 블록 확인
app.get('/blocks', (req,res)=>{
    res.send(bc.getBlocks());
    // Windows PowerShell 에서 확인
    // curl -X GET http://localhost:3000/blocks
    // PostMan에서 확인
    // GET -> http://localhost:3000/blocks
});

// 버젼 확인
// curl -X GET http://localhost:3000/version
app.get('/version', (req,res)=>{
    res.send(bc.getVersion());
});

// Blocks 배열에 객체{ }
// curl -X POST -H "Content-Type:application/json" -d "{\"data\":[\"hello world\"]}" http://localhost:3001/mineBlock
// 내용 뒤에 -H ***로 헤더 내용 추가 가능
app.post('/mineBlock', (req,res)=>{
    const data = req.body.data;
    const result = bc.mineBlock(data);
    if (result === null){
        // res.send(`mineBlock failed`);
        res.status(400).send(`블록 추가에 오류가 발생했습니다.`);
    } else {
        res.send(result);
    }
});

// peers -> 현재 가지고 있는 socketList를 가져옴, GET
// curl -X GET http://localhost:3000/peers
app.get('/peers', (req,res)=>{
    res.send(ws.getSockets().map(socket=>{
        return `${socket._socket.remoteAddress}:${socket._socket.remotePort}`;
    }));
});

// addPeers -> 보낼 주소값에 socket을 생성, POST
// curl -X POST -H "Content-Type:application/json" -d "{\"peers\":[\"ws://localhost:6006\"]}" http://localhost:3001/addPeers
app.post('/addPeers', (req,res)=>{
    const peers = req.body.peers;
    ws.connectionToPeers(peers);
    res.send('success');
})

// 외부에서 서버 작동 중지
// curl http://localhost:3000/stop
app.get('/stop', (req,res)=>{
    res.send('server stop');
    process.exit(0);
});

ws.wsInit();
app.listen(port, ()=>{
    console.log(`server on PORT ${port}`);
});


// express      == 클라이언트
// websocket    == 서버

/*
    블록 가져오기
    peer
*/

/*
    환경 변수 설정 명령어

    WINDOW
    set [변수명]=[값]       // 설정
    set [변수명]            // 확인

    MAC or LINUX
    export [변수명]=[값]    // 설정
    env | grep [변수명]     // 확인
*/
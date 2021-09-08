const fs = require('fs');
const merkle = require('merkle');
const CryptoJs = require('crypto-js');
const SHA256 = require('crypto-js/sha256');
const random = require('random');

/*
사용법
const tree =
merkle("sha256")    // 인자값 : 암호화 방법
.sync([]);          // tree 구조로 변환
tree.root();        // root를 가져옴
 */

// 붕어빵 틀
class BlockHeader{
    constructor(version, index, previousHash, time, merkleRoot){
        this.version = version;             // 1 { version : 1 }
        this.index = index;                 // 2 { version : 1, index : 2}
        this.previousHash = previousHash;   // 3 { version : 1, index : 2, previousHash : 3}
        this.time = time;                   // ...
        this.merkleRoot = merkleRoot;       // ......
    }
    // 안에서 함수 선언도 가능, React에서 했던 Render 등..
    // render(){}
}
// 헤더 블록 확인
// const header = new BlockHeader(1,2,3,4,5);
// console.log(header);

class Block{
    constructor(header, body){
        this.header = header;
        this.body = body;
    }
}
// 단일 블록 확인
// const blockchain = new Block(new BlockHeader(1,2,3,4,5), ['hello']);
// console.log(blockchain);

let Blocks = [createGenesisBlock()];

function getBlocks(){
    return Blocks;
}

function getLastBlock(){
    return Blocks[Blocks.length - 1];
}

function createGenesisBlock(){
    /*
        1. header 생성 : 5개의 인자값을 만들어야 함
    */
    // const version = getVersion();           // 1.0.0
    const version = "1.0.0";
    const index = 0;
    const previousHash = '0'.repeat(64);    // 0을 64번 반복
    // const time = getCurrentTime();          // 1630466608 비슷한 결과
    const time = 1630907567;                // 하드코딩
    const body = ['hello block'];

    const tree = merkle('sha256').sync(body);
    const root = tree.root() || '0'.repeat(64);

    const header = new BlockHeader(version, index, previousHash, time, root); // header 생성
    return new Block(header, body);
}

// 다음 블록의 Header와 Body를 만들어주는 함수
function nextBlock(data){
    // header
    const prevBlock = getLastBlock();
    const version = getVersion();
    const index = prevBlock.header.index + 1;
    /*
        이전 해쉬값에
        previousHash = SHA256(version + index + previousHash + timestamp + merkleRoot)
    */
    const previousHash = createHash(prevBlock);
    const time = getCurrentTime();

    const merkleTree = merkle("sha256").sync(data); // 배열
    const merkleRoot = merkleTree.root() || '0'.repeat(64);

    const header = new BlockHeader(version, index, previousHash, time, merkleRoot);
    return new Block(header, data);
}

function createHash(block){
    const {
        version,
        index,
        previousHash,
        time,
        merkleRoot,
    } = block.header;
    const blockString = version + index + previousHash + time + merkleRoot;
    const Hash = SHA256(blockString).toString();

    return Hash;
}

// Block push
// addBlock 함수 실행할때 다음 블럭 만들면서, 인덱스값의 변화 필요 +1?
function addBlock(newBlock){
    // const lastIndex = getLastBlock().header.index;
    // const lastHash = getLastBlock().header.previousHash;
    // // console.log('라스트해쉬 : ', SHA256(lastHash).toString());

    // const version = getVersion();
    // const index = lastIndex + 1;
    // // const previousHash = '0'.repeat(64);
    // const previousHash = SHA256(lastHash).toString();
    // const time = getCurrentTime();
    // const body = ['hello block'];

    // const tree = merkle('sha256').sync(body);
    // const root = tree.root() || '0'.repeat(64);

    // const header = new BlockHeader(version, index, previousHash, time, root); // header 생성
    // return new Block(header, body);
    if (isValidNewBlock(newBlock, getLastBlock())) {
        Blocks.push(newBlock);
        return true;
        // return newBlock;
    }
    return false;
}

function mineBlock(blockData){
    const newBlock = nextBlock(blockData); // Object Block {header, body}

    if (addBlock(newBlock)){
        const nw = require('./network');
        nw.broadcast(nw.responseLastMsg());
        return newBlock;
    } else {
        return null;
    }
}

// 새 블록의 유효성 검사
function isValidNewBlock(currentBlock, previousBlock){
    // 1. header 검사
    // 1-1. currentBlock에 대한 header, body의 Data Type 검사
    if (!isValidType(currentBlock)){
        console.log(`invalid block ${JSON.stringify(currentBlock)}`);
        return false;
    }
    // 1-2. index 값의 유효성 검사
    if (previousBlock.header.index + 1 !== currentBlock.header.index){
        console.log(`invalid index`);
        return false;
    }
    // 1.3 previousHash 검사
    /*
        previousHash         previousHash
        제네시스 블록 기준 -> 두번째 블록
    */
    if (createHash(previousBlock) !== currentBlock.header.previousHash){
        console.log(`invalid previousBlock`);
        return false;
    }
    
    // 2. body 검사
    /*
        currentBlock.header.merkleRoot -> body [배열]
        currentBlock.body -> merkleTree, root -> result !== currentBlock.header.merkleRoot
        body의 내용 유무 검사
        currentBlock.body.length !== 0 || ( cureentBlock.body로 만든 merkleRoot !== currentBlock.header.merkelRoot )
        currentBlock.body.length !== 0 || ( merkle("sha256").sync(currentBlock.body).root() !== currentBlock.header.merkelRoot )
    */
    // 2.1 body 내용 유무 검사
    if (currentBlock.body.length === 0){
        console.log(`invalid body`);
        return false;
    }
    // 2.2 merkleRoot 검사
    if (merkle("sha256").sync(currentBlock.body).root() !== currentBlock.header.merkleRoot){
        console.log(`invalid merkleRoot`);
        return false;
    }
    return true;
}

// Type 검사
function isValidType(block){
    return(
        typeof(block.header.version) === "string" &&        // string
        typeof(block.header.index) === "number" &&          // number
        typeof(block.header.previousHash) === "string" &&   // string
        typeof(block.header.time) === "number" &&           // number
        typeof(block.header.merkleRoot) === "string" &&     // string
        typeof(block.body) === "object"                     // object
    );
}

function replaceBlock(newBlocks){
    // newBlocks : 내가 받은 전체 배열 -> 내가 받은 전체 블록들
    /*
        1. newBlock 내용을 검증해야함
        2. 검증은 한번만 할 수도 있고, 두번 또는 세번 할 수도 있게 함, 랜덤하게 설정 -> 조건문에 random 패키지 사용
        3. Blocks = newBlocks
        4. broadcast를 날림
    */
    if (isValidBlock(newBlocks) && newBlocks.length > Blocks.length && random.boolean()){
        console.log(`Blocks 배열을 newBlocks로 교체합니다.`);
        const nw = require('./network');
        Blocks = newBlocks;
        nw.broadcast(nw.responseLastMsg());
    } else {
        console.log(`메시지로부터 받은 블록 배열이 맞지 않습니다.`);
    }
}

function getVersion(){
    // readFileSync로 내용 가져와서 Json.Parse로 제이슨 형태로 변환 후 비구조할당 처리
    const { version } = JSON.parse(fs.readFileSync("../package.json"));
    // console.log('패키지 : ', package.toString("utf8"));
    // console.log('제이슨 파서 : ', JSON.parse(package).version);
    // console.log('version : ', version);
    return version;
}

function getCurrentTime(){
    // console.log('뉴 데이트 : ', new Date());
    // getTime 메서드로 변환 후 ceil로 소수점 올림 처리
    // console.log('겟 타임 : ', Math.ceil(new Date().getTime()/1000));
    return Math.ceil(new Date().getTime()/1000);
}

// getVersion();
// getCurrentTime();

// addBlock(["hello2"]);
// addBlock(["hello3"]);
// addBlock(["hello4"]);

// 제네시스 블록 유효성 검사
/*
    1. 데이터가 바뀐적이 없는지?
    2. 블록의 모든 배열 확인
*/
function isValidBlock(Blocks){
    if (JSON.stringify(Blocks[0]) !== JSON.stringify(createGenesisBlock())){
        console.log(`genesis error`);
        return false;
    }

    let tempBlocks = [Blocks[0]];
    for (let i = 1; i < Blocks.length; i++){
        if (isValidNewBlock(Blocks[i], Blocks[i - 1])){
            tempBlocks.push(Blocks[i]);
        } else{
            return false;
        }
    }
    return true;
}

// console.log(Blocks);

module.exports = {
    getBlocks,
    getLastBlock,
    addBlock,
    getVersion,
    createHash,
    replaceBlock,
    mineBlock,
}

/*
    blockchain Network

    P2P // 탈 중앙화, 양 방향 통신
    종류 : 프루나, 당나귀, 소리바다, WebSocket

    Client <--> Server
    HTTP, TCP로 통신

    socket.io   // 기본 기능 외 여러 기능 포함
    ws          // 접속에 대한 기능만 포함 ex) broadcast, to
*/
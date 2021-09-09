// npm install elliptic
const ecdsa = require('elliptic');
// console.log(ecdsa);
const fs = require('fs');

const ec = ecdsa.ec('secp256k1'); // 블록체인에서 많이 사용하는 key값 생성기
// console.log(ec.genKeyPair().getPrivate());
// console.log(ec.genKeyPair().getPrivate().toString(16).toUpperCase());

// 상수로 내가 만들 폴더명과 파일명을 미리 설정
const privateKeyLocation = "wallet/"+(process.env.PRIVATE_KEY || "default");
const privateFile = `${privateKeyLocation}/private_key`;

/*
    1. SHA256 -> 복호화가 안되는 단방향 암호화, A -> 0100, B -> 0110
    2. elliptic : 로또 생성기처럼 랜덤한 key값을 반환
    * 중복 될 수 있는 가능성? -> 안겹질 수는 없으나 희박
*/

function generatorPrivateKey(){
    const KeyPair = ec.genKeyPair();
    const privateKey = KeyPair.getPrivate();

    return privateKey.toString(16).toUpperCase();
}

console.log(generatorPrivateKey());

function initWallet(){
    // existsSync() 메서드 -> 인자값 == 경로, 파일이 있으면 true, 없으면 false를 반환
    // console.log(fs.existsSync("wallet/"));
    if (!fs.existsSync("wallet/")){
        fs.mkdirSync("wallet/"); // 폴더 생성
    }
    if (!fs.existsSync(privateKeyLocation)){
        fs.mkdirSync(privateKeyLocation);
    }

    if (!fs.existsSync(privateFile)){
        console.log(`주소값의 key값을 생성 중입니다..`);
        const newPrivateKey = generatorPrivateKey();

        /*
            writeFileSync();
            첫번쨰 인자값 : 경로 + 파일명
            두번째 인자값 : 파일 내용
        */
        fs.writeFileSync(privateFile, newPrivateKey);
        console.log(`개인 key값 생성이 완료 되었습니다.`);
    }
}

initWallet();

function getPrivateFromWallet(){
    // readFileSync(); -> 인자값 : 파일 경로
    const buffer = fs.readFileSync(privateFile);
    // console.log(buffer.toString());
    return buffer.toString();
}

function getPublicFromWallet(){
    const privateKey = getPrivateFromWallet();
    const key = ec.keyFromPrivate(privateKey, "hex");

    return key.getPublic().encode("hex");
}

getPrivateFromWallet();

// console.log('private : ', getPrivateFromWallet());
// console.log('public : ', getPublicFromWallet());


/*
    node server.js
    -> http:localhost://3000/address
    -> generatorPrivateKey();
    -> 특정 폴더 내 특정 파일에 함수 실행의 결과값 텍스트가 생성

    1. 특정 폴더가 있는지? // ex) 폴더명 wallet
    2.1. 있으면 진행 X
    2.2. 없으면 진행 O -> 폴더 생성
*/

/*
    id      // F055F5F01B8BD99EBC27E2B40BD0DE60005A4C1D7223A0C8C60F60158362A61D
    content // 
    date    // 
*/

module.exports = {
    initWallet,
    getPublicFromWallet,
}
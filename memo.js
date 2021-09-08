// class 문법
// node 환경에서

// 블록체인이란?
// 체인 블록 노드

/*
    // 암호
    // 알고리즘
    // 통신(탈중앙)
    객체(Genesis Block) // 최상위 객체
    {
        name: ingoo,
        id: web7722,
        key: 0,
        address: ,
    },
    {
        name: name,
        id: id,
        key: key,
        address: ,
    },
    {
        name: name,
        id: id,
        key: key,
        address: ,
    },
*/

// 정해진 형식이 있는게 아닌, 많이 사용하는 형식
// 제네시스 블록은 자동 생성이 아닌 하드코딩
const block = {
    MagicNumber: "0xD9B4BEF9",
    BlockSize: "4mb",
    header:{
        version: "1.0.0",
        HashPrevBlock: 0x00000000000,
        HashMerkleRoot: `SHA256`,
        timestamp: `시간`,
        bits: `작업증명 난이도를 정하는`,
        Nonce: `난수`, // 4byte, 숫자, 양수
    },
    // 객체 또는 배열
    body:[
        "hello world",
    ],
}
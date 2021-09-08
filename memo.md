# 블록체인

1. 네트워크 : http, socket
2. 분산원장 : 데이터를 저장하는 코드(블록)
    - Hash sha256 -> JWT
    - 단방향 암호화 -> 자리수 고정 // a -> 64암호화
                                    abc -> 64
3. 머클(Merkle) : 데이터 연결을 쉽게 찾기 위해
    - Merkle ---> hash1234 ---> hash12
              |              -> hash34
              --> hash5678 ---> hash56
                             -> hash78
4. 작업증명(pow)
    - 마이닝(Mining) // 채굴

// 정해진 형식이 있는게 아닌, 많이 사용하는 형식
// 제네시스 블록은 자동 생성이 아닌 하드코딩
const block = {
    MagicNumber: "0xD9B4BEF9",
    BlockSize: "4mb",
    header:{
        version: "1.0.0",
        HashPrevBlock: 0x00000000000,
        HashMerkleRoot: `SHA256`,
        timestamp: `시간`, // 유닉스 기준일 1970년 1월 1일 자정부터 0초 현재까지 총 몇초인가?
        bits: `작업증명 난이도를 정하는`,
        Nonce: `난수`, // 4byte, 숫자, 양수
    },
    // 객체 또는 배열
    body:[
        "hello world",
    ],
}
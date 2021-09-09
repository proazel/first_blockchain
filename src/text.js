const CryptoJs = require('crypto-js');

let a = '0000helloworld!';

/*
    javascript String 메서드
    startsWith() == 인자값과 비교하여 boolean 출력
    toUpperCase() == 소문자를 대문자로
*/
// console.log(a.startsWith('0010')); // false
// console.log(a.startsWith('0000')); // true
console.log(CryptoJs.SHA256(a).toString().toUpperCase());
// -> 1314042ECF8C8A7702AABA1C82D560B5A262FF3E922BB117FA81F2B002FC37B9
// 변수 -> SHA256(16진수) -> 2진수

// 첫 글자가 0이 4개가 되었을 때 블록을 생성 할 수 있도록 작업

// 0: 0000
// 1: 0001
// 2: 0010
// 3: 0011
// 4: 0100
// 5: 0101
// 6: 0110
// 7: 0111
// 8: 1000
// 9: 1001
// A: 1010
// B: 1011
// C: 1100
// D: 1101
/*
    Install List

    npm install merkletreejs
    npm install crypto-js
    npm install merkle
*/

// 변수명 색에 따라 데이터 타입 확인 가능
// 초록색 == Class, 노란색 == 함수
const { MerkleTree } = require('merkletreejs');
const SHA256 = require('crypto-js/sha256');

// console.log( SHA256('check').toString() );

const testSet = ['a','b','c'].map(v => SHA256(v));
// console.log(testSet);

const tree = new MerkleTree(testSet, SHA256);
// console.log(tree);

const root = tree.getRoot().toString('hex'); // utf8 안됨
// console.log(root);

const testRoot = 'a';
const leaf = SHA256(testRoot);
const proof = tree.getProof(leaf);
console.log( tree.verify(proof, leaf, root) ); // 비교
console.log( tree.toString() );
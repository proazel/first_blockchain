const txt = '1314042ECF8C8A7702AABA1C82D560B5A262FF3E922BB117FA81F2B002FC37B9';

function hexToBinary(v){
    const lookup = {
        "0": "0000", "1": "0001", "2": "0010", "3": "0011",
        "4": "0100", "5": "0101", "6": "0110", "7": "0111",
        "8": "1000", "9": "1001",
        "A": "1010", "B": "1011", "C": "1100", "D": "1101",
        "E": "1110", "F": "1111",
    }
    // console.log(v);
    // console.log(v.length); // 64

    let rst = '';
    for (let i = 0; i < v.length; i++){
        if (lookup[v[i]] === undefined) return null;
        console.log(lookup[v[i]]);
        rst += lookup[v[i]];
    }
    return rst;
}

module.exports = {
    hexToBinary,
}
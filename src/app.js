const MinifiedNumber = require("./MinifiedNumber.js");
let dividend ,divisor;

function gcd(a,b){
    return b==0?a:gcd(b,a%b);
}

function minify(dividend,divisor){
    let n = gcd(dividend,divisor);
    console.log(dividend/n+"/"+divisor/n);
}

// minify(60,40);
// let n = new MinifiedNumber(78,16);
// console.log((n+"")+" = ");
// n.minify();
// console.log(n+"");
// let t = n.add(new MinifiedNumber(1,8));
// console.log(t+"");
// t.minify();
// console.log(t+"");
// console.log(t.add(8)+"");
// console.log(t+" "+t.divide(new MinifiedNumber(2,5))+"");

let a = [new MinifiedNumber(10),new MinifiedNumber(2),new MinifiedNumber(-1),new MinifiedNumber(100)];
// let b = new MinifiedNumber(0);
let d = [1,2,-3,-4];
console.log(d.reduce((a,b)=>Math.min(a,b)));
console.log(a.reduce((a,c)=>a.min(a,c))+""+a);
let q = new MinifiedNumber(4,8);
console.log(q+"");
q = q.multiply(10);
q = q.divide(5);
console.log(q+"");
console.log(""+(new MinifiedNumber(2,-1)));
console.log(new MinifiedNumber(1).min(q,Infinity)+"");
console.log(q.min(new MinifiedNumber(1,-2),Infinity)+"");
// console.log([new MinifiedNumber(1,-2),new MinifiedNumber(2),new MinifiedNumber(0),new MinifiedNumber(3,4),new MinifiedNumber(0)]+"");
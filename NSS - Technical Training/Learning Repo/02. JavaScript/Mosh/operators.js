// Artihmetic operators

let x = 10;
let y = 3;

// console.log(x + y);
// console.log(x - y);
// console.log(x * y);
// console.log(x / y);
// console.log(x % y);
console.log(x ** y);

// Increement
console.log(++x);
console.log(x++);
console.log(x);

// Assignment Operator 
let o = 10
o = o + 5;
o += 5;

o = o * 3;
o *= 3;


// comparison Operator 

// Relational operators
let p = 1;
console.log(p > 0);
console.log(p >= 1);
console.log(p < 1);
console.log(p <= 1);

// Equality operators

// Strict Equality (Type + value)
console.log(p === 1);

// lose Equality (value)
console.log(p == 1);

// ternary operator
// If a customer has more than 100 points
// they are a gold customer, otherwise,
// they are a silveer customer.

let points = 110;
let type = points > 100 ? "gold" : "silver";
console.log(type);

 
// Exercise

function maxOfTwo(a,b){
    return a > b ? a : b ;
}
console.log(maxOfTwo(10,4));

function potriate(width,hieght){
    return (width > hieght) ? "Landscape" : "poraite" ;
}
console.log(potriate(10,44));

function fizzBuzz(input) {
    return 
    
}
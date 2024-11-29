// let name = "Derrick"
// console.log(name);

// Cannot be a reserved kryword
// Should be meaningful
// Cannot start with a number (eg. 1ame)
// Cannot contain a space or hyphen (-)

// let firstName;
// let lastName;

// *** Constants ***///
// const interestRate = 0.3;
// interestRate = 1;  //Error cannot reassign a constant
// console.log(interestRate);

// **** Premitive Types ****//
// String
// Number
// Boolean
// undefined
// null

let name = "Derrick"; //String Literal
let age = 30; //Number Literal
let isApproved = true; //Boolean
let firstName = undefined; 
let selectedColor = null


// ***Dynamic  Typing ****//
let greet = "moring";
console.log(typeof greet);
greet = 1000;
console.log(typeof greet);

// ****Reference Types ***///
// Object
// Array
// Function

// OBJECTS

let person = {
    name: "John",
    age: 16,
};

// accessing propertires in objects

person.name = "John" //Dot Notation

person ['name'] = 'John'; //Bracket notation
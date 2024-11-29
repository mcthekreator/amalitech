let age: number | string  = 21;

age = 24;
age = "23";

type Point = {
    x: number;
    y: number;
};

type Loc = {
    lat: number;
    long: number;
};

let coordinates: Point | Loc = {x: 1, y: 34}
coordinates = {lat: 321.233, long:23.223}

// Union Types fuctions

function printAge (age: number | string): void{
    console.log(`You are ${age} years old`);
    
}

function calculateTax (price: number | string, tax: number){
    if (typeof price === "string"){
        price = parseFloat(price.replace("$", ""))
    }
       return price * tax
    
}


// Union Types Arrays

const stuff: (number | string) [] = [1,2,3, "das"]

// making type annotation

type mynumber = {
    num1 : number;
    num2 : number;
    num3: number
}
type mynames = {
    name1: string;
    name2: string;
    name3: string;
}
const techStuff: (mynumber | mynames) [] = []
techStuff.push({name1: "derrick", name2: "ben", name3: "fred"})
techStuff.push({num1: 23, num2: 32, num3: 43})


// Literal Types

let zero: 0 = 0;
let mood: "Happy" | "sad" = "Happy";
mood = "sad"

type DayOfWeek = 
| "Monday"
| "Tuesday"
| "Wednesday"
| "Thursday"
| "friday"
| "Saturday"
| "sunday" 

let today: DayOfWeek = "Wednesday"
interface Point{
    x: number;
    y: number;
}
const pt: Point = {x: 123, y: 4433};

interface Person {
    readonly id :number
    first: string;
    last: string;
    nickname?: string;
    sayHi : ()=> string; //Method
}
const thomas: Person = {id: 212, first: "Thomas", last: "Dsane", nickname: "tom", sayHi: ()=>{return "Hi"}} 

interface Product {
    name: string;
    price: number;
    applydiscount(discount: number):number;
}

const shoes: Product = {
    name: "Blue Shoes",
    price: 100,
    applydiscount(amount: number){
        const newprice = this.price * (1 - amount);
        this.price = newprice;
        return this.price; 
    }
}
// Reopening interface

interface Dog {
    name: string;
    age:number
 }

interface Dog {
    breed: string;
    bark():string
 }
 const elton: Dog = {
    name: "Elton",
    age: 0.5,
    breed: "Australian sharped",
    bark(){
        return "WOOf WOOf"
    }
 }

//  Extending interface

interface serviceDog extends Dog {
    job: "drug sniffer" | "bomb" | "guide dog";
}

const chewy : serviceDog = {
    name: "Chewy",
    age: 4.5,
    breed: "Lab",
    bark(){
        return "Bark"
    },
    job: "bomb"
}

// multiple inheritance

interface student{
    name: string
}

interface employee{
    readonly id: number,
    email: string
}

interface Engineer extends student,employee{
    level: string,
    languages: string[]
}
const john: Engineer = {
    name: "John",
    id: 28282,
    email: "ufhehe",
    level: "200",
    languages: ["English", "spaniish"]
}
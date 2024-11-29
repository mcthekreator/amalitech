// function square (num: number){
//     return num * num;
// }
// square(3)

// function greet (person: string){
//     return `hi there, ${person}`
// }
// greet("Derrick")

const doSomething = (person: string  , age: number, isFunny: boolean)=>{

}
doSomething("big head",76, true) 


function greet (person: string = "Stranger"){
    return `hi there, ${person}`
}
greet( )


const square = (num: number):number =>{
    return num * num;
}
square(3)



// Anonmymous Functions
const colors = ["red", "orange", "yellow"];
colors.map((color:string) =>{
    return color.toUpperCase()

})

// Void
function printTwice(msg: string): void{
    console.log(msg);
    console.log(msg);
    
    // return msg  Error
}


// Never Type
function makeError (msg: string): never{
    throw new Error(msg)
    // return msg  Error
}

let x = [1,2,3]
let y = x.map((num) => num.toString())
let z = y.join("-")
console.log(z);

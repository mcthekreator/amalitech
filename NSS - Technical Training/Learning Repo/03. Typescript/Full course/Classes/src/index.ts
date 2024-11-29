// Classes Type Annotation
class Player{
    first: string;
    last: string;
    constructor(first: string, last:string){
        this.first = first;
        this.last = last
    }
}
const elton = new Player("Elton", "Steele")
console.log(elton);

// Class fileds

class Player{
    first: string;
    last: string;
    score: number = 0
    constructor(first: string, last:string){
        this.first = first;
        this.last = last
    }
}
const elton = new Player("Elton", "Steele")
console.log(elton);


// Readonly Classes 

class Player{
    readonly first: string;
    readonly last: string;
    score: number = 0
    constructor(first: string, last:string){
        this.first = first;
        this.last = last
    }
}
// const elton = new Player("Elton", "Steele")
// // elton.first = "Derrick"   Error
// console.log(elton); 

// Public & Private Modifier

// class Player{
//     readonly first: string;
//     public readonly last: string;
//     private score: number = 0

//     constructor(first: string, last:string){
//         this.first = first;
//         this.last = last
//     }

//    private secretMethod(){
//         console.log("SECRET METHOD");
        
//     }
// }
// const elton = new Player("Elton", "Steele")
// // elton.secretMethod();  Error
// // elton.score   Error



// Parameter Properties Shorthand 

// class Player{
//     // private score: number = 0
//     constructor(
//         public first: string,
//         public  last:string,
//         private score: number = 0
//         ){}
//    private secretMethod(){
//         console.log("SECRET METHOD");  
//     }
// }
// const elton = new Player("Elton", "Steele")





// Getters and Setters

// class Player{
//     // private score: number = 0
//     constructor(
//         public first: string,
//         public  last:string,
//         private _score: number,
//         ){}
//    private secretMethod(){
//         console.log("SECRET METHOD");  
//     }
//     get fullName (): string{
//         return `${this.first} ${this.last}`
//     }
//     get score ():number{
//         return this._score;
//     }
//     set score (newScore: number) {
//         if(newScore < 0){
//             throw new Error ("Score cannot be negative")
//         }
//         this._score = newScore;
//     }
// }
// const elton = new Player("Elton", "Steele", 100)
// elton.fullName;
// elton.score = 99;




// The Protected Modifier 


class Player{
    // private score: number = 0
    constructor(
        public first: string,
        public  last:string,
        private _score: number,
        ){}
   private secretMethod(){
        console.log("SECRET METHOD");  
    }
    get fullName (): string{
        return `${this.first} ${this.last}`
    }
    get score ():number{
        return this._score;
    }
    set score (newScore: number) {
        if(newScore < 0){
            throw new Error ("Score cannot be negative")
        }
        this._score = newScore;
    }
}



const elton = new Player("Elton", "Steele", 100)
elton.fullName;
elton.score = 99;


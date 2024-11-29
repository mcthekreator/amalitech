// function printName(person:{first: string, last: string}): void{
//     console.log(`${person.first} ${person.last}`);
    

// }
// printName({first: "tony", last: "dsane"});


// printName({first: "tony", last: "dsane", age: 473})
// const singer = {first: "Mick", last: "jaggar", age: 737, isAlive: true}
// printName(singer)



// let coordinate: {x: number, y:number} = {x: 43, y:469}

//  function randomCoordinate(): {x: number, y: number}{
//     return {x:Math.random(), y: Math.random()}
//  }

  

// Aliases 

// type Point = {
//     x: number;
//     y: number;
// }
// function doublePoint(point : Point): Point{
//     return {x: point.x * 2, y: point.y * 2 };
// }


// Nested Objects

type Song = {
    title: string;
    artist: string; 
    numStreams: number;
    credits: { producer: string; writer: string;
    }
};

function calculatePayout(mysong:Song):number{

        return mysong.numStreams * 0.033
}
function printSong(song: Song): void{
    console.log(`${song.title} - ${song.artist}`);
    
}

const mySong: Song = {
    title: "Unchained Melody",
    artist: "Sarkodie",
    numStreams: 29232992,
    credits: {
        producer: "Kayso",
        writer: "Michael Owusus"
    }
}

// optional propertie;s
type Point = {
    x: number;
    y: number;
    z?: number
};
const myPoint: Point = {x:1, y:3}  


// readonly modifier
 type User = {
    readonly id: number;
    username: string;
 };
 const user: User = {
    id: 3838,
    username: "catgurl"
 }
 console.log(user.id);
//  user.id = 233   Error
 

// intersection types

type circle = {
    radius: number;
}
type Colorful = {
    color: string;
}
type ColorfulCircle = circle & Colorful;

const happyFace: ColorfulCircle = {
    radius: 4,
    color: "yellow"
}

type Cat = {
    numLives: number;
};
type Dog = {
    breed: string;
};

type CatDog = Cat & Dog & {
    age: number;
};
const christy: CatDog = {
    numLives: 7,
    breed: "huskuy",
    age: 9
}
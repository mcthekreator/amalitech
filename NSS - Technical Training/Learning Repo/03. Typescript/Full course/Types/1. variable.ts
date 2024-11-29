let movieTitle: string = "Tenet";
movieTitle = "Amadeus";
// movieTitle = 9;   Error
movieTitle.toUpperCase();

let numCatLives: number = 9;
numCatLives += 1;
// numCatLives = "zero"  Error

let gameOver: boolean = false;
gameOver = true;
// gameOver = "true"  Error


// Type Inference

let tvShow = "Power";
tvShow = "Snowfall"; 
// tvShow = false   Error


// The any type

let thing: any = "hello";
thing = 1;
thing = false;
thing ();
thing.toUpperCase; 


// When any is needed
const movies = ["power","snowfall","Tenest"]
let foundMovie;

for (let movie of movies){
    if (movie === "power"){
        foundMovie = "power"
    }
}
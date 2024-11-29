// function f(req, opt1, opt2){
//     opt1 = (typeof opt1 !== "undefined") ? opt1 : "no value";
//     opt2 = (typeof opt2 !== "undefined") ? opt2 : "no value";
//     console.log("req: "+req+"\nopt1: "+opt1+ "\nopt2: "+ opt2);
// }

// f(3,10,5)

// Rest operator

// function maximuim (...values){
//     let max = values[0];
//     values.forEach(function(element){
//         if (values[i] > max)
//         max = argumets[i];
//     });
//     console.log('Max is: '+ max);
// }
// maximuim(10,20,3)

// finding the max
// const values = [0,4,4,2,5,5,,9,3,5]
// console.log(Math.max(...values));

// function displayName(name1, name2, name3){
//     console.log("Name1: "+ name1+ "\nName2: "+name2+ "\nName3: "+ name3);
// }
// const names = ["Britney", "Michael", "Alice", "Derrick"]
// displayName(...names)

// function displayName(name1, name2, ...other){
//     console.log("Name1: "+ name1+ "\nName2: "+name2 + other);
// }
// const names = ["Britney", "Michael", "Alice", "Derrick"]
// displayName(...names)

// arrow fuctions
// const getValue = (m) => 10 * m;

// getValue(5);

// this keyword

// var employee = {
//     id: 1,
//     greet: function(){
//         setTimeout(()=>{
//             console.log(this.id);
//         },1000)
//     }
// };
// employee.greet();




function derrick(hello){
    hello("Hello")
}

function helloFunc (word){
    console.log("Hello" + word)
}

// derrick(helloFunc);

// let promise1 = Promise.resolve(3);
// let promise2 = 42;
// let promise3 = new Promise((resolve, reject) => {
//   setTimeout(resolve, 100, 'foo');
// });

// Promise.all([promise1, promise2, promise3]).then(values => {
//   console.log(values); // [3, 42, "foo"]
// });



var name = "Hello"
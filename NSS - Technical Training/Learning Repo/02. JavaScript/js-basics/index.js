// Objects

// OOP
// const circle = {
//     reduis: 1,
//     location: {
//         x: 1,
//         y: 1
//     },
//     isVisible: true,
//     draw: ()=>{
//         console.log("draw");
//     }
// }
//  //draw id not a fuction but a method

// Factory Function
// function createCircle(radius) {
//   return {
//     radius,
//     draw() {
//       console.log("draw");
//     },
//   };
// }
// const circle1 = createCircle(1);
// console.log(circle1);

// const circle2 = createCircle(2);
// console.log(circle2.constructor);

// // constructor fuction
// function Circle(radius) {
//   this.radius = radius;
//   this.draw = function () {
//     console.log("draw");
//   };
// }
// const circle3 = new Circle(1);
// console.log(circle3.constructor);
// 3
// Dynamic Nautre and Objects
// const circle = {
//     radius: 1
// }
// circle.color = 'yellow';
// circle.draw = f (){}

// delete circle.color;
// delete circle.draw;

// console.log(circle);

// construct;

// function Circle(radius){
//     this.raduis = radius;
//     this.draw = function(){
//         console.log('draw');
//     }
// }
// Circle.apply({},[1,2,3]);
// const circ = new Circle(1)

// console.log(circ);



// function myfunction(hello){
//         hello('World!');

// }

// function helloFunc (word){
//     console.log("hello" + word)
// }

// myfunction(helloFunc);
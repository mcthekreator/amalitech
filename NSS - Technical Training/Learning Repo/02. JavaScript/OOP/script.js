// Object Oreineted Programming

// This is procedure programming
let baseSalary = 30.0;
let overTime = 10.0;
let rate = 20;
function getWage(baseSalary, overTime, rate) {
  return baseSalary + overTime * rate;
}

// This is encapsulation in OOP
let employee = {
  baseSalary: 30.0,
  overTime: 10.0,
  rate: 20,
  getWage: function () {
    return this.baseSalary + this.overTime * this.rate;
  },
};

// Object Literals
const circle = {
  radius: 1,
  location: {
    x: 1,
    y: 1,
  },
  draw: function () {
    console.log("draw");
  },
};

// and object with one or more methods is said to have behaviour
// Behaviour is the actions and operations that an object can perform

// factory function
function createCircle(radius) {
  return {
    radius,
    draw() {
      console.log("draw");
    },
  };
}

const circle1 = createCircle(1);
circle.draw();

// Constructor function
function Circle(radius) {
  this.radius = radius;
  this.draw = function () {
    console.log("draw" + radius);
  };
}
const another = new Circle(1);

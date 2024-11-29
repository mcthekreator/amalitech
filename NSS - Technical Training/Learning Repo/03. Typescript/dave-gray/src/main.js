// let username: string = "Dave";
// console.log(username);
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// let a = 12
// let b = '6'
// let c = 2
// function classDecorator (constrcture: Function ){
//     console.log("Class Decorator")
// }
// @classDecorator
// class MyClass {
//     constructor (){
//         console.log("My constructre called ")
//     }
// }
// @Logger
// class User{
//     name: string = "user";
//     age: number =  23
//     constructor(){
//         console.log("User constructor called");
//     }
// }
// const u = new User();
// function Logger(target: Function){
//     console.log('Logging....');
//     console.log(target);
// }
// //Decorator for Dom elelemts
// function Template(template:string, elementId: string){
//     return function(target: Function){
//         const u = new target();
//         const container = document.getElementById(elementId) as HTMLElement;
//         if(container){
//             container.innerHTML = template;
//         }
//     }
// } 
// // @Logger
// class User{
//     name: string = "user";
//     age: number =  23
//     constructor(){
//         console.log("User constructor called");
//     }
// }
// Property Decorator
// function Capitaliz(){
//     console.log("Cap");
// }
// class Property{
//     @Capitaliz
//     name: string;
//     price: number;
//     constructor(name: string, price: number){
//         this.name = name;
//         this.price = price;
//     }
// }
// User interface to define the user object
// interface User {
//     isAdmin: boolean;
//   }
//   // Method decorator to check admin access
//   function CheckAdminAccess(
//     target: any,
//     propertyKey: string,
//     descriptor: PropertyDescriptor
//   ) {
//     const originalMethod = descriptor.value;
//     descriptor.value = function (...args: any[]) {
//       const user: User = { isAdmin: false }; // Set to true or false to test
//       if (user.isAdmin) {
//         console.log("Directing to dashboard");
//         return originalMethod.apply(this, args);
//       } else {
//         console.log("Access denied");
//       }
//     };
//     return descriptor;
//   }
//   class Dashboard {
//     @CheckAdminAccess()
//     showDashboard() {
//       console.log("Welcome to the dashboard!");
//     }
//   }
//   // Testing the class component
//   const dashboard = new Dashboard();
//   dashboard.showDashboard();
// Method Decorators 
// Let see how we can enchance out methods using decorators
// function Log(target: any, methodName: string, descriptor: PropertyDescriptor): void | PropertyDescriptor {
//     const originalMethod = descriptor.value;
//     descriptor.value = function (...args: any[]) {
//         console.log("Before method:", methodName, "with arguments:", args);
//         const result = originalMethod.apply(); // Call the original method
//         console.log("After method:", methodName);
//         return result; // Return the result of the original method
//     };
//     return descriptor; // Return the modified descriptor
// }
// class Person {
//     @Log
//     say() {
//         console.log("Person says: ");
//     }
// }
// const mike = new Person();
// mike.say();
// //What are Decorators
// // They are function that allows you to add metadata or behaviour to class, class properties and or method parameters
// no its besically a function that is called at runtime and is applied using the @ symbol
// Methods Decorator
// target: This refers to the prototype of the class for an instance method or the constructor for a static method 
// Propertykey: The name of the method decorated 
// Descriptor: A property descriptor object that defines the properties of the method, such as ist value, wheather it is writable, enumerable and configurable. 
// The descriptor allows the decorator to modify the mrthod‘s behavoir 
// It is a function that takes specific parameters and can modify the behavior of the method it decorates
// The method decorator can return either void or a modified PropertyDescriptor.
// If you return a new PropertyDescriptor, it replaces the original descriptor, allowing you to modify the behavior of the method.
// Class Decorators
// A class decorator can be used to add functionality to a class, wrap the class with additional logic, 
// or modify its behavior by modifying the constructor or adding new properties and methods. 
// A class decorator is a function that is applied to the constructor of the class, 
// and it can either modify the class or replace it with a new one.
// Property Decorators
// target: This is the prototype of the class for instance properties, 
// or the constructor function for static properties.
// Propertykey: This is the name of the property being decorated,  
// which is either a string or symbol.  The read only decorator 
// sets the eritable property of the descriptor of false making the p
// roperty read-only. Any attempt to chnage ist value will ignored
// //  Breakdown of the Method Decorator Workflow
// // target: The class's prototype or constructor where the method is defined.
// // propertyKey: The name of the method being decorated, such as "greet".
// // descriptor: The metadata about the method, especially the value property that holds the method itself.
// Now every code and what do do
// so lets create a class called Person witha method
var Person = /** @class */ (function () {
    function Person() {
    }
    Person.prototype.say = function (message) {
        console.log("Person says " + message);
    };
    return Person;
}());
//  so now lets craete a decorator and apply on this method 
function Log() {
}
// So to apply this on  a method we need 3 parameters 
// the first parameter if the object that owns the target method
function Log(target) {
}
// and the 3rd parameter is the descriptor object or the target object 
// Every proper in an object has a descriptor object that describes that property
// so the descriptors object has a property value that refrence the target object 
function Log(target, methodName, descriptor) {
}
// so mow we will set a new function to replace the original metho 
function Log(target, methodName, descriptor) {
    descriptor.value = function () {
    };
}
// so now lets make refrenece to the original method 
function Log(target, methodName, descriptor) {
    var originalMethod = descriptor.value;
    descriptor.value = function () {
    };
}
// so before we make refenrence to the methos we can use the type assertion to tell the typescript complier that this is a function 
function Log(target, methodName, descriptor) {
    var originalMethod = descriptor.value;
    descriptor.value = function () {
        originalMethod.call();
    };
}
// so now if we create an instance of the person object 
var person = new Person();
// and we call the method 
person.say("Hello");
// using the rest operator, we allow the methos to make multiple parameters 
function Log(target, methodName, descriptor) {
    var originalMethod = descriptor.value;
    descriptor.value = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        originalMethod.call();
    };
}
// using the spread operator when calling the function also allows us to pass the agument one by one to the original method 
function Log(target, methodName, descriptor) {
    var originalMethod = descriptor.value;
    descriptor.value = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        originalMethod.call.apply(originalMethod, __spreadArray([this], args, false));
    };
}
// New Using an arrow function we will get a compliation error because arrows function doesnt define their own this keyword. 
// Now lets see how decorators can be applied to classes 
// so lets create a function called componenets
function Componenets() {
}
// so since we are going to apply this on a class we will have a single parameters that representas out constructor function 
// and if the type is a function the runtime assumes that we are going to apply this decorator on a class 
function Componenets(callingonstructor) {
}
// so now we can take out contructor and go to its prototype
// so i will define a function and simply log something in the console 
function Componenet(constructor) {
    constructor.prototype.uniqueId = Date.now();
    constructor.prototype.intersetInDom = function () {
        console.log("inserting in the dom ");
    };
}
// so now evey instance of class will have these memebers  
// we can also achieve that be inhierentance usinf the extends keyword
// now lets create a profile componenets
var ProfileComponent = function () {
    var _classDecorators = [Componenet];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ProfileComponent = _classThis = /** @class */ (function () {
        function ProfileComponent_1() {
        }
        return ProfileComponent_1;
    }());
    __setFunctionName(_classThis, "ProfileComponent");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProfileComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProfileComponent = _classThis;
}();
// now the decorator is still going to execute even tho we didnt create any instances of the compnents. 
// Property Decorators 
// Lets craete a propert decorator that checks the lenght of a password 
var User = /** @class */ (function () {
    function User(password) {
        this.password = password;
    }
    return User;
}());
//  so now lets create out decorator 
function MinLength(length) {
    return function (target, propertyKey) {
    };
}
// now im gonna define a property descriptor for the target property 
function MinLength(length) {
    return function (target, propertyKey) {
        var descriptor = {};
        return descriptor;
    };
}
// now i will define a setter that take the new value as a string and check if the length alings with out condition
function MinLength(length) {
    return function (target, propertyName) {
        var descriptor = {
            set: function (newValue) {
                if (newValue.length >= length) {
                    throw new Error("".concat(propertyName, " Should be at least ").concat(length, " characters long"));
                }
                else {
                    throw new Error("Password length should be at least " + length);
                }
            }
        };
        return descriptor;
    };
}
// now if the legnth is valid then we assign the valie to a ne value and use the getter to return it 
function MinLength(length) {
    return function (target, propertyName) {
        var value;
        var descriptor = {
            set: function (newValue) {
                if (newValue.length >= length)
                    throw new Error("".concat(propertyName, " Should be at least ").concat(length, " characters long"));
                value = newValue;
            }
        };
        return descriptor;
    };
}
function MinLength(length) {
    return function (target, propertyName) {
        var value;
        var descriptor = {
            get: function () { return value; },
            set: function (newValue) {
                if (newValue.length >= length)
                    throw new Error("".concat(propertyName, " Should be at least ").concat(length, " characters long"));
                value = newValue;
            }
        };
    };
}
// now we assigned it to the target property 
function MinLength(length) {
    return function (target, propertyName) {
        var value;
        var descriptor = {
            get: function () { return value; },
            set: function (newValue) {
                if (newValue.length >= length)
                    throw new Error("".concat(propertyName, " Should be at least ").concat(length, " characters long"));
                value = newValue;
            }
        };
        Object.defineProperty(target, propertyName, descriptor);
    };
}
// now lets create a instance of the user class 
var user = new User("1234");
console.log(user.password);

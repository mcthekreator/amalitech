// // let username: string = "Dave";
// // console.log(username);

// // let a = 12
// // let b = '6'
// // let c = 2



// // function classDecorator (constrcture: Function ){
// //     console.log("Class Decorator")
// // }

// // @classDecorator
// // class MyClass {
// //     constructor (){
// //         console.log("My constructre called ")
// //     }
// // }


// // @Logger
// // class User{
// //     name: string = "user";
// //     age: number =  23

// //     constructor(){
// //         console.log("User constructor called");

// //     }
// // }

// // const u = new User();

// // function Logger(target: Function){
// //     console.log('Logging....');
// //     console.log(target);


// // }


// // //Decorator for Dom elelemts
// // function Template(template:string, elementId: string){
// //     return function(target: Function){
// //         const u = new target();
// //         const container = document.getElementById(elementId) as HTMLElement;
// //         if(container){
// //             container.innerHTML = template;
// //         }

// //     }
// // } 

// // // @Logger
// // class User{
// //     name: string = "user";
// //     age: number =  23

// //     constructor(){
// //         console.log("User constructor called");

// //     }
// // }






// // Property Decorator

// // function Capitaliz(){
// //     console.log("Cap");

// // }


// // class Property{
// //     @Capitaliz
// //     name: string;
// //     price: number;

// //     constructor(name: string, price: number){
// //         this.name = name;
// //         this.price = price;
// //     }
// // }

// // User interface to define the user object
// // interface User {
// //     isAdmin: boolean;
// //   }

// //   // Method decorator to check admin access
// //   function CheckAdminAccess(
// //     target: any,
// //     propertyKey: string,
// //     descriptor: PropertyDescriptor
// //   ) {
// //     const originalMethod = descriptor.value;

// //     descriptor.value = function (...args: any[]) {
// //       const user: User = { isAdmin: false }; // Set to true or false to test

// //       if (user.isAdmin) {
// //         console.log("Directing to dashboard");
// //         return originalMethod.apply(this, args);
// //       } else {
// //         console.log("Access denied");
// //       }
// //     };

// //     return descriptor;
// //   }

// //   class Dashboard {
// //     @CheckAdminAccess()
// //     showDashboard() {
// //       console.log("Welcome to the dashboard!");
// //     }
// //   }

// //   // Testing the class component
// //   const dashboard = new Dashboard();
// //   dashboard.showDashboard();










// // Method Decorators 
// // Let see how we can enchance out methods using decorators



// // function Log(target: any, methodName: string, descriptor: PropertyDescriptor): void | PropertyDescriptor {
// //     const originalMethod = descriptor.value;

// //     descriptor.value = function (...args: any[]) {
// //         console.log("Before method:", methodName, "with arguments:", args);
// //         const result = originalMethod.apply(); // Call the original method
// //         console.log("After method:", methodName);
// //         return result; // Return the result of the original method
// //     };

// //     return descriptor; // Return the modified descriptor
// // }

// // class Person {
// //     @Log
// //     say() {
// //         console.log("Person says: ");
// //     }
// // }

// // const mike = new Person();
// // mike.say();







// // //What are Decorators
// // // They are function that allows you to add metadata or behaviour to class, class properties and or method parameters
// // no its besically a function that is called at runtime and is applied using the @ symbol




// // Methods Decorator
// // target: This refers to the prototype of the class for an instance method or the constructor for a static method 
// // Propertykey: The name of the method decorated 
// // Descriptor: A property descriptor object that defines the properties of the method, such as ist value, whether it is writable, enumerable and configurable.
// // The descriptor allows the decorator to modify the method‘s behaviour
// // It is a function that takes specific parameters and can modify the behavior of the method it decorates
// // The method decorator can return either void or a modified PropertyDescriptor.
// // If you return a new PropertyDescriptor, it replaces the original descriptor, allowing you to modify the behavior of the method.



// // Class Decorators
// // A class decorator can be used to add functionality to a class, wrap the class with additional logic, 
// // or modify its behavior by modifying the constructor or adding new properties and methods. 

// // A class decorator is a function that is applied to the constructor of the class, 
// // and it can either modify the class or replace it with a new one.


// // Property Decorators
// // target: This is the prototype of the class for instance properties, 
// // or the constructor function for static properties.

// // Propertykey: This is the name of the property being decorated,  
// // which is either a string or symbol.  The read only decorator 
// // sets the eritable property of the descriptor of false making the p
// // roperty read-only. Any attempt to chnage ist value will ignored



// // //  Breakdown of the Method Decorator Workflow
// // // target: The class's prototype or constructor where the method is defined.
// // // propertyKey: The name of the method being decorated, such as "greet".
// // // descriptor: The metadata about the method, especially the value property that holds the method itself.





// class Person {
//     say(message: string){
//         console.log("Person says "+ message);
        
//     }
// }

// function Log(){

// }
// function Log(target: any){

// }
// function Log(targ:any, methodName:string, )


// function Log(target: any, methodName: string, descriptor: PropertyDescriptor  ){

// }

// function Log(target: any, methodName: string, descriptor: PropertyDescriptor  ){
//     descriptor.value = function (){

//     }

// }

// function Log(target: any, methodName: string, descriptor: PropertyDescriptor  ){
//     const originalMethod = descriptor.value;
//     descriptor.value = function (){

//     }
// }


// function Log(target: any, methodName: string, descriptor: PropertyDescriptor  ){
//     const originalMethod = descriptor.value as Function;
//     descriptor.value = function (){
//         originalMethod.call()

//     }
// }


// let person = new Person()
// person.say("Hello")


// function Log(target: any, methodName: string, descriptor: PropertyDescriptor  ){
//     const originalMethod = descriptor.value as Function;
//     descriptor.value = function (...args: any[]){
//         originalMethod.call()

//     }
// }

// function Log(target: any, methodName: string, descriptor: PropertyDescriptor  ){
//     const originalMethod = descriptor.value as Function;
//     descriptor.value = function (...args: any[]){
//         originalMethod.call(this, ...args)

//     }
// } 



// function Componenets(){
// } 

// function Componenets(callingonstructor:Function  ){


// }

  
//     constructor.prototype.uniqueId = Date.now()
//     constructor.prototype.intersetInDom = () =>{
//         console.log("inserting in the dom ");
        
//     }


// @Componenet
// class ProfileComponent{

// }

//  class User{
//     password: string

//     constructor(password: string){
//         this.password = password
//     }
//  }

// function MinLength(length: number){
//     return  (target: any, propertyKey: string) =>{
     
//     }       
// }
// function MinLength(length: number){
//     return  (target: any, propertyKey: string) =>{
//         const descriptor: PropertyDescriptor = {
           
//         }
//         return descriptor;
     
//     }       
// function MinLength(length: number){
//     return  (target: any, propertyName: string) =>{
//         const descriptor: PropertyDescriptor = {
//             set(newValue: string){
//                 if(newValue.length >= length){
//                   throw new Error (`${propertyName} Should be at least ${length} characters long`)
//                 }else{
//                     throw new Error("Password length should be at least " + length)
//                 }
//             }
           
//         }
//         return descriptor;
     
//     }       
// }

// function MinLength(length: number){
//     return  (target: any, propertyName: string) =>{
//         let value: string;
//         const descriptor: PropertyDescriptor = {
        
//             set(newValue: string){
//                 if(newValue.length >= length)
//                   throw new Error (`${propertyName} Should be at least ${length} characters long`)
//                 value = newValue
                
//             }
           
//         }
//         return descriptor;
     
//     }       
// }

// function MinLength(length: number){
//     return  (target: any, propertyName: string) =>{
//         let value: string;
//         const descriptor: PropertyDescriptor = {
//             get(){return value}
//             set(newValue: string){
//                 if(newValue.length >= length)
//                   throw new Error (`${propertyName} Should be at least ${length} characters long`)
//                 value = newValue
                
//             }
           
//         }
        
     
//     }       
// }

// // now we assigned it to the target property 

// function MinLength(length: number){
//     return  (target: any, propertyName: string) =>{
//         let value: string;
//         const descriptor: PropertyDescriptor = {
//             get(){return value}
//             set(newValue: string){
//                 if(newValue.length >= length)
//                   throw new Error (`${propertyName} Should be at least ${length} characters long`)
//                 value = newValue
                
//             }
           
//         }
        
//         Object.defineProperty(target, propertyName, descriptor);
     
//     }       
// }
// let user = new User("1234")
// console.log(user.password);

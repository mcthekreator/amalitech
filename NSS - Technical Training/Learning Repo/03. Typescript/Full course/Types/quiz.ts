type Person = {
    name: string;
    age : number;
    username : string;
    email : string;

}

function User (user : Person):void{
    console.log(`${user.name} \n ${user.email} \n ${user.age} \n ${user.username}`);
}

let person : Person = {
    name : "Daniel",
    age : 12,
    username : "pr.estt",
    email: "jdssdn@dsjj"
}
User(person);
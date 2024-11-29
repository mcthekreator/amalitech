// Arrays

const activeUsers : string [] = []
activeUsers.push ("tony");
const mynumbers : number [] = []
mynumbers.push (377) 

// Array types


type Points = {
    x: number;
    y: number;
}
const coordinates : Points [] = [];
coordinates.push({x: 330, y:3728})


// two dimensional array

const board: string [][] = [
    ["X", "0", "X"],
    ["X", "0", "X"],
    ["X", "0", "X"],
]



// type inteface
interface Todo {
    text: string;
    completed: boolean;
}
const input = document.getElementById("todo-input") as HTMLInputElement;
const form = document.querySelector("form") as HTMLFormElement;
const list = document.getElementById("todo-list") as HTMLElement

// todo container
const todolist: Todo[] = readTodos();
todolist.forEach(createTodo)

function readTodos(): Todo []{
    const todolistJSON = localStorage.getItem("todolist");
    if (todolistJSON === null) return [];
    return JSON.parse(todolistJSON);
}


// adding to the container
form.addEventListener("submit", (e: SubmitEvent)=>{
    e.preventDefault()
    const newTodo: Todo = {
        text: input.value,
        completed: false,
    };
    todolist.push(newTodo)
    createTodo(newTodo)

    localStorage.setItem("todolist", JSON.stringify(todolist))


    input.value = "";
})

// from container to html element

function createTodo(todo:Todo){

    const newLi = document.createElement("li") as HTMLElement;
    const checkbox = document.createElement("input") as HTMLInputElement;
    checkbox.type = "checkbox";
    newLi.append(todo.text);
    newLi.append(checkbox);
    list.append(newLi)

}


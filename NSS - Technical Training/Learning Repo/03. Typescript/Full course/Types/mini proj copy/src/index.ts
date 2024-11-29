const form = document.getElementById("todo-form") as HTMLFormElement;
const inputText = document.getElementById("todo-input") as HTMLInputElement;
const todoList = document.getElementById("todo-list") as HTMLElement;

interface Todo {
    text: string;
    completed: boolean;
}

// array thats gonna store the todos getting its data from the local storage
const todos : Todo [] = readTodos()
todos.forEach(createTodo)

function readTodos():Todo[]{ //now the function is goona return an array of the todo
    const todosJSON  = localStorage.getItem("todos"); //looking for todos in local storge using the key "todos"
   if (todosJSON == null)return [];
   return  JSON.parse(todosJSON) // now if it finds it, it should return it to todosJSON

}
function  saveTodos (){
    localStorage.setItem("todos",JSON.stringify(todos)) //adding the array containing data to the local storage

}


function hundleSubmit(e: SubmitEvent){
    e.preventDefault()

    // creating a data structue in memory thats gonna push our input in to the array
    const newTodo: Todo = {
        text: inputText.value, 
        completed: false,
    }
    createTodo(newTodo) //adding the data structure as a parameter to the output fuction
    todos.push(newTodo); //adding the data structure to an array

    saveTodos();
}

// this fuction is taking the input from the data structure and outputting it in the HTML
function createTodo(todo: Todo): void{
    const newElement = document.createElement("li") as HTMLElement
    const checkbx = document.createElement("input") as HTMLInputElement
    checkbx.type= "checkbox";
    checkbx.checked = todo.completed
    checkbx.addEventListener("change", ()=>{
        todo.completed = checkbx.checked
        saveTodos();
    });
    newElement.append(todo.text)
    todoList.append(newElement)
    todoList.append(checkbx)
    inputText.value = "";
}

form.addEventListener("submit", hundleSubmit) 



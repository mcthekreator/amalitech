const form = document.getElementById("todo-form") as HTMLFormElement;
const inputText = document.getElementById("todo-input") as HTMLInputElement;
const todoList = document.getElementById("todo-list") as HTMLElement;

interface todoTypes {
    task: string,
    status: boolean,
}


function handleSubmit(e: SubmitEvent){
    e.preventDefault();
    
const todoItems:todoTypes [] = (saveTodo)
const saveTodo: todoTypes ={
    task: inputText.value,
    status: false
}




localStorage.setItem("todokey", JSON.stringify(todoItems))
const todoJSON = localStorage.getItem("todokey")
if (todoJSON == null) []
else JSON.parse(todoJSON);
console.log(todoItems);


const li =  document.createElement("li")
todoList.append(li)
todoItems.forEach(element => {
    li.append(element.task)
    
});


}

form.addEventListener("submit", handleSubmit)
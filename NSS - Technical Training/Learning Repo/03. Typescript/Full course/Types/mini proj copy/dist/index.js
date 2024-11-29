"use strict";
var form = document.getElementById("todo-form");
var inputText = document.getElementById("todo-input");
var todoList = document.getElementById("todo-list");
// array thats gonna store the todos getting its data from the local storage
var todos = readTodos();
todos.forEach(createTodo);
function readTodos() {
    var todosJSON = localStorage.getItem("todos"); //looking for todos in local storge using the key "todos"
    if (todosJSON == null)
        return [];
    return JSON.parse(todosJSON); // now if it finds it i should return it to todosJSON
}
function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos)); //adding then array containing data to the local storage
}
function hundleSubmit(e) {
    e.preventDefault();
    // creating a data structue in memory thats gonna push our input in to the array
    var newTodo = {
        text: inputText.value,
        completed: false,
    };
    createTodo(newTodo); //adding the data structure as a parameter to the output fuction
    todos.push(newTodo); //adding the data structure to an array
    saveTodos();
}
// this fuction is taking the input from the data structure and outputting it in the HTML
function createTodo(todo) {
    var newElement = document.createElement("li");
    var checkbx = document.createElement("input");
    checkbx.type = "checkbox";
    checkbx.checked = todo.completed;
    checkbx.addEventListener("change", function () {
        todo.completed = checkbx.checked;
        saveTodos();
    });
    newElement.append(todo.text);
    todoList.append(newElement);
    todoList.append(checkbx);
    inputText.value = "";
}
form.addEventListener("submit", hundleSubmit);
// const TodoContainer: Todos[] = [];
// TodoContainer.push({ title: inputText.value, completed: false })
// const li = document.createElement("li") as HTMLElement
// let deletebtn = document.createElement("button") as HTMLButtonElement
// deletebtn.textContent = "Delete"
// todoList.append(li)
// li.append(inputText.value)
// li.append(deletebtn)
// inputText.value = ""
// localStorage.setItem("todolist", JSON.stringify(TodoContainer))
// deletebtn.addEventListener("click", ()=>{
//     li.remove();
// })
// const todoListJSON = localStorage.getItem("todolist");
// if(todoListJSON == null) return [];
// return JSON.parse(todoListJSON)

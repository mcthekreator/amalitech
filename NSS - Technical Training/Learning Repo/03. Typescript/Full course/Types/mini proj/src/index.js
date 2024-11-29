var form = document.getElementById("todo-form");
var inputText = document.getElementById("todo-input");
var todoList = document.getElementById("todo-list");
function handleSubmit(e) {
    e.preventDefault();
    var todoItems = [];
    var saveTodo = {
        task: inputText.value,
        status: false
    };
    localStorage.setItem("todokey", JSON.stringify(todoItems));
    var todoJSON = localStorage.getItem("todokey");
    if (todoJSON == null)
        [];
    else
        JSON.parse(todoJSON);
    console.log(todoItems);
    var li = document.createElement("li");
    todoList.append(li);
    todoItems.forEach(function (element) {
        li.append(element.task);
    });
}
form.addEventListener("submit", handleSubmit);

var form = document.getElementById("todo-form");
var inputText = document.getElementById("todo-input");
var todoList = document.getElementById("todo-list");
form.addEventListener("submit", function (e) {
    e.preventDefault();
    mytodos.push({ title: inputText.value, completed: true });
    localStorage.setItem("todokey", JSON.stringify(mytodos));
    var todoJSON = localStorage.getItem("todokey");
    console.log(todoJSON);
});
var mytodos = [];

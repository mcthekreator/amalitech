// const btn = document.querySelector("button");
// const body = document.querySelector("body");
// const colors = ["red","blue","green","grey","yellow", "pink"]

// body.style.background = "violet"

// btn.addEventListener("click", ()=>{
//     const colorIndex = parseInt(Math.random()*colors.length)
//     body.style.background = colors[colorIndex];
// })



(function(){
    const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const message = document.querySelector("#message")
    const feedback = document.querySelector("h5")
    const messageContent = document.querySelector(".messagecontent")

    feedback.styl

    if(message.value ===""){
        feedback.classList.add('show')
        setTimeout(function() {
            feedback.classList.remove('show')}, 4000)
    }
        else{
            messageContent.textContent = message.value
            message.value = "";
        }

})



})()
  


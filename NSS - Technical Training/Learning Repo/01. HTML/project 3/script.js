// const buttons = document.querySelectorAll('.counterBtn')
// let count = 0;


// for (let i = 0; i < buttons.length; i++) {
//     const button = buttons[i];
    
//    button.addEventListener('click', ()=>{

//     if(button.classList.contains('prevBtn')){
//         count--
//     }else if(button.classList.contains('nextBtn')){
//         count++
//     }

//     const counter = document.querySelector('#counter')
//     counter.textContent = count;
//    })
// }


// let count =  [1,65,56,54,45,43,345,6,7,86,867,6];
// const mycounts = (Math.random()* count.length)
// for (let i = 0; i < buttons.length; i++) {
//     const button = buttons[i];
//     button.addEventListener('click', ()=>{
//         if(button.classList.contains('prevBtn')){
           
//             mycounts + 1
//         }else if (button.classList.contains('nextBtn')){
            
//             mycounts - 1
//         }
//         const counter = document.querySelector('#counter')
//     counter.textContent = mycounts;

//     })
    
// }


const form = document.querySelector("form")

form.addEventListener("submit", (e)=>{
    e.preventDefault();
})
let add =document.querySelector("form button");
let section = document.querySelector("section");
add.addEventListener("click",e =>{
// prevent form from being submmited
    e.preventDefault();
    //get the input values
    console.log(e.target.parentElement);
    let form = e.target.parentElement;
    let todoText = form.children[0].value;
    let todoMonth = form.children[1].value;
    let todoDate = form.children[2].value;
    if (todoText === ""){
        alert("Please enter some text");
        return;
    }
    //create and todo item
    let todo = document.createElement("div");
    todo.classList.add("todo");
    let text = document.createElement("p");
    todo.classList.add("todo-text");
    text.innerText = todoText;
    let time = document.createElement("p");
    time.classList.add("todo-time");
    time.innerText = todoMonth + " / " + todoDate;
    todo.appendChild(text);
    todo.appendChild(time);
    //create check and trash can
    let completeButton = document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
    completeButton.addEventListener("click",e =>{
        let todoitem = e.target.parentElement;
        todoitem.classList.toggle("done"); //增加一個新的div
    })
    let trashButton = document.createElement("button");
    trashButton.classList.add("trash");
    trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    trashButton.addEventListener("click", e =>{
        let todoitem = e.target.parentElement;
        todoitem.addEventListener("animationend",() =>{
             //remove from localStorage
             let text = todoitem.children[0].innerText;
             let mylistArray = JSON.parse(localStorage.getItem("list"));
             mylistArray.forEach((item,index) =>{
                 if(item.todoText == text){
                     mylistArray.splice(index, 1);
                     localStorage.setItem("list", JSON.stringify(mylistArray));
                 }
             })
            todoitem.remove();
        })
        todoitem.style.animation = "scaledown 0.3s forwards"
    })
    todo.appendChild(completeButton);
    todo.appendChild(trashButton);
    todo.style.animation = "scaleup 0.5s forwards"

    //create an object
    let myTodo ={
        todoText: todoText,
        todoMonth: todoMonth,
        todoDate: todoDate
    }

    //store data into an array
    let myList = localStorage.getItem("list");
    if(myList == null){
        localStorage.setItem("list",JSON.stringify([]));
    }else{
        let mylistArray = JSON.parse(myList);
        mylistArray.push(myTodo);
        localStorage.setItem("list", JSON.stringify(mylistArray));
    }
    console.log(JSON.parse(localStorage.getItem("list")));
    form.children[0].value = ""; //clear the text
    section.appendChild(todo);
})
loadData();
function loadData(){
    let myList = localStorage.getItem("list");
if(myList !== null){
    let mylistArray =JSON.parse(myList);
    mylistArray.forEach(item =>{
        //create a todo
        let todo = document.createElement("div");
        todo.classList.add("todo");
        let text = document.createElement("p");
        text.classList.add("todo-text");
        text.innerText = item.todoText;
        let time = document.createElement("p");
        time.classList.add("todo-time");
        time.innerText = item.todoMonth + " / " + item.todoDate;
        todo.appendChild(text);
        todo.appendChild(time);
        //create check and trash can
        let completeButton = document.createElement("button");
        completeButton.classList.add("complete");
        completeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
        completeButton.addEventListener("click",e =>{
            let todoitem = e.target.parentElement;
            todoitem.classList.toggle("done"); //增加一個新的div
        })
        let trashButton = document.createElement("button");
        trashButton.classList.add("trash");
        trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
        trashButton.addEventListener("click", e =>{
            let todoitem = e.target.parentElement;
            todoitem.addEventListener("animationend",() =>{
                //remove from localStorage
                let text = todoitem.children[0].innerText;
                let mylistArray = JSON.parse(localStorage.getItem("list"));
                mylistArray.forEach((item,index) =>{
                    if(item.todoText == text){
                        mylistArray.splice(index, 1);
                        localStorage.setItem("list", JSON.stringify(mylistArray));
                    }
                })
                todoitem.remove();
            })
            todoitem.style.animation = "scaledown 0.3s forwards"
        })
        todo.appendChild(completeButton);
        todo.appendChild(trashButton);
        section.appendChild(todo);
    })

}
}

function mergeTime(arr1,arr2){
    let result = [];
    let i = 0;
    let j = 0;
    while(i < arr1.length && j < arr2.length){
        if(Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)){
            result.push(arr2[j]);
            j++;
        }else if(Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)){
            result.push(arr1[i]);
            i++;
        }else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)){
            if(Number(arr1[i].todoDate) > Number(arr2[j].todoDate)){
                result.push(arr2[j]);
                j++;
            }else{
                result.push(arr1[i]);
                i++;
            }
        }
    }
    while(i < arr1.length){
        result.push(arr1[i]);
        i++
    }
    while(j < arr2.length){
        result.push(arr2[j]);
        j++;
    }
   
    return result;
}
function mergeSort(arr){
    if(arr.length === 1){
        return arr;
    }else{
        let middle = Math.floor(arr.length/2);
        let right = arr.slice(0,middle);
        let left = arr.slice(middle,arr.length);
        return mergeTime(mergeSort(right),mergeSort(left));
    }
}
console.log(mergeSort(JSON.parse(localStorage.getItem("list"))));
let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () =>{
    // sort data
    let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
    localStorage.setItem("list",JSON.stringify(sortedArray));
    // remove data
    let len =section.children.length;
    for(let i = 0;i<len;i++){
        section.children[0].remove();
    }
    // load data
    loadData();
})
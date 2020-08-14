const form = document.querySelector(".js-todoform");
const toDoInput = document.querySelector("#usertodo");
const toDoList = document.querySelector(".js-todolist");

const TODO_LIST_LS = "toDoList";

function handlerSubmit(event){
    event.preventDefault();

    const curInput = toDoInput.value;
    toDoInput.value = "";
    
    saveTodo(curInput);
    
}

function handlerDelete(event){

}

function paintToDo(text){

    const li = document.createElement("li");
    const delBtn = document.createElement("button");
    const span = document.createElement("span");

    delBtn.innerText = "X";
    span.innerText = text;

    li.appendChild(span);
    li.appendChild(delBtn);

    toDoList.appendChild(li);
}

function delToDo(target){
    localStorage.removeItem(TODO_LIST_LS);
    loadToDo()
}

function saveTodo(input){
    localStorage.setItem(TODO_LIST_LS, input);
    loadToDo();
}

function loadToDo(){
    const todos = localStorage.getItem(TODO_LIST_LS);

    if(todos !== null){
        // exist todo
        paintToDo(todos);
    }
    else{
        // do not exist todo
    }
}

function init(){
    loadToDo();

    form.addEventListener("submit", handlerSubmit);

}

init();
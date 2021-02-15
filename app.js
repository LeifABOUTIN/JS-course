//Let's grab
const todoInput = document.querySelector('.todo-input')
const todoButton = document.querySelector('.todo-button')
const todoList = document.querySelector('.todo-list')
const filterOption = document.querySelector('.filter-todo')

//Lets Listen
document.addEventListener('DOMContentLoaded', getTodosFromLS)
todoButton.addEventListener('click', addTodo)
todoList.addEventListener('click', deleteCheck)
filterOption.addEventListener('click', filterTodo)

//Let's do
function addTodo(e){
    e.preventDefault()
    //Creating the div for the todos
    const todoDiv = document.createElement('div')
    todoDiv.classList.add("todo")
    //creating the LIs
    const newTodo = document.createElement('li')
    newTodo.innerText = todoInput.value
    newTodo.classList.add('todo-item')
    todoDiv.appendChild(newTodo)
    //saving to localstorage
    saveLocalstorage(todoInput.value)
    //adding the completed button
    const completedButton = document.createElement('button')
    completedButton.innerHTML = '<i class="fas fa-check"></i>'
    completedButton.classList.add('complete-btn')
    todoDiv.appendChild(completedButton)
    //adding the delete button
    const trashButton = document.createElement('button')
    trashButton.innerHTML = '<i class="fas fa-trash"></i>'
    trashButton.classList.add('trash-btn')
    todoDiv.appendChild(trashButton)
    //append to list in html
    todoList.appendChild(todoDiv)
    //emptying input
    todoInput.value = ""
}

function deleteCheck(e){
    const item = e.target
    //delete item
    if(item.classList[0] === "trash-btn"){
        const todo = item.parentElement
        todo.classList.add('fall')
        removeTodosFromLS(todo)
        todo.addEventListener('transitionend', function() {
            todo.remove()
        })
    }
    //check the item
    if(item.classList[0] === "complete-btn"){
        const todo = item.parentElement
        todo.classList.toggle('completed')
    }
}

function filterTodo(e){
    const todos = todoList.childNodes
    console.log(todos)
    todos.forEach(function(todo){
        switch(e.target.value){
            case "all":
                todo.style.display = 'flex'
                break
            case "checked":
                if(todo.classList.contains('completed')){
                    todo.style.display = 'flex'
                }else{
                    todo.style.display = 'none'
                }
                break
            case "unchecked":
                if(!todo.classList.contains('completed')){
                    todo.style.display = 'flex'
                }else{
                    todo.style.display = 'none'
                }
                break
        }
    })
}

//localstorage storing

function saveLocalstorage(todo){
    //is there a localstorage already?
    let todos;
    if(localStorage.getItem('todos') === null){
        todos = []
    }
    else{
        todos = JSON.parse(localStorage.getItem('todos'))
    }
    todos.push(todo)
    localStorage.setItem('todos', JSON.stringify(todos))
}
//localstorage get the todos from ls
function getTodosFromLS(){
    let todos
    //lets check if localstorage is empty or not
    if (localStorage.getItem('todos') === null){
        todos = []
    }
    else{
        todos = JSON.parse(localStorage.getItem('todos'))
    }
    todos.forEach(function(todo){
         //Creating the div for the todos
        const todoDiv = document.createElement('div')
        todoDiv.classList.add("todo")
        //creating the LIs
        const newTodo = document.createElement('li')
        newTodo.innerText = todo
        newTodo.classList.add('todo-item')
        todoDiv.appendChild(newTodo)
        //adding the completed button   
        const completedButton = document.createElement('button')
        completedButton.innerHTML = '<i class="fas fa-check"></i>'
        completedButton.classList.add('complete-btn')
        todoDiv.appendChild(completedButton)
        //adding the delete button
        const trashButton = document.createElement('button')
        trashButton.innerHTML = '<i class="fas fa-trash"></i>'
        trashButton.classList.add('trash-btn')
        todoDiv.appendChild(trashButton)
        //append to list in html
        todoList.appendChild(todoDiv)
    })
}

function removeTodosFromLS(todo){
    let todos
    //lets check if localstorage is empty or not
    if (localStorage.getItem('todos') === null){
        todos = []
    }
    else{
        todos = JSON.parse(localStorage.getItem('todos'))
    }
    const todoIndex = todo.children[0].innerText
    todos.splice(todos.indexOf(todoIndex), 1)
    localStorage.setItem('todos', JSON.stringify(todos))
}

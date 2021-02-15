//Let's grab
const todoInput = document.querySelector('.todo-input')
const todoButton = document.querySelector('.todo-button')
const todoList = document.querySelector('.todo-list')

//Lets Listen
todoButton.addEventListener('click', addTodo)
todoList.addEventListener('click', deleteCheck)

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
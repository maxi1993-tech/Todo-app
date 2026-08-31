const todos = [
    { id: 1, text: "Complete online JavaScript course", done: true },
    { id: 2, text: "Jog around the park 3x", done: false }
]

let currentFilter = "all"

let nextId = 3

function renderTodos(todos) {

    const todoContainer = document.querySelector(".todo")

    todoContainer.replaceChildren()

    const todoTemplate = document.querySelector("#todo-template")
    const fragment = document.createDocumentFragment()

    todos.forEach(todo => {

        const todoClone = todoTemplate.content.cloneNode(true)

        const liClone = todoClone.querySelector("li")
        const inputClone = todoClone.querySelector("input")
        const labelClone = todoClone.querySelector("label")

        labelClone.textContent = todo.text
        inputClone.checked = todo.done
        liClone.dataset.todoId = todo.id

        const uniqueId = `todo-${todo.id}`

        inputClone.id = uniqueId
        labelClone.htmlFor = uniqueId

        fragment.appendChild(todoClone)
    })

    todoContainer.appendChild(fragment)
}

renderTodos(todos)

function addNewTodo(todos) {

    const formTodo = document.querySelector(".todo-form")
    const valueNewTodo = document.querySelector(".todo-form__input")

    formTodo.addEventListener("submit", (event) => {

        event.preventDefault()

        const value = valueNewTodo.value.trim()

        if (!value) {
            return
        }

        const newTodo = { id: nextId++, text: value, done: false }

        todos.push(newTodo)
        valueNewTodo.value = ""
        renderTodos(todos)
    })
}
addNewTodo(todos)

function markAsComplete(todos) {
    const todoContainer = document.querySelector(".todo")

    todoContainer.addEventListener("change", (event) => {
        const item = event.target.closest(".todo__item")

        if (!item) return
        const todo = todos.find(t => t.id === Number(item.dataset.todoId))

        if (todo) {
            todo.done = event.target.checked
            renderTodos(todos)
        }
    })
}
markAsComplete(todos)

function deleteTask(todos) {

    const todoContainer = document.querySelector(".todo")

    todoContainer.addEventListener("click", (event) => {

        const taskDelete = event.target.closest(".todo__delete")

        if (!taskDelete) return

        const item = event.target.closest(".todo__item")
        const id = Number(item.dataset.todoId)

        const positionTaskDelete = todos.findIndex(todo => todo.id === id)

        todos.splice(positionTaskDelete, 1)
        renderTodos(todos)
    })
}
deleteTask(todos)

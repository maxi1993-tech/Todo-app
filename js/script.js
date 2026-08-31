const todos = [
    { id: 1, text: "Complete online JavaScript course", done: true },
    { id: 2, text: "Jog around the park 3x", done: false }
]

let currentFilter = "all"

function renderTodos() {

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

renderTodos()

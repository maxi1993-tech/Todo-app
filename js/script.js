let todos = []

let currentFilter = "all"

function renderTodos() {

    const todoContainer = document.querySelector(".todo")

    todoContainer.replaceChildren()

    const todoTemplate = document.querySelector("#todo-template")
    const fragment = document.createDocumentFragment()

    let visibleTodos

    if (currentFilter === "active") {
        visibleTodos = todos.filter(todo => todo.done === false)
    } else if (currentFilter === "completed") {
        visibleTodos = todos.filter(todo => todo.done === true)
    } else {
        visibleTodos = todos
    }

    visibleTodos.forEach(todo => {

        const todoClone = todoTemplate.content.cloneNode(true)

        const liClone = todoClone.querySelector("li")
        const inputClone = todoClone.querySelector("input")
        const labelClone = todoClone.querySelector("label")
        const deleteButton = todoClone.querySelector(".todo__delete")

        labelClone.textContent = todo.text
        inputClone.checked = todo.done
        liClone.dataset.todoId = todo.id
        deleteButton.ariaLabel = `Delete ${todo.text}`

        const uniqueId = `todo-${todo.id}`

        inputClone.id = uniqueId
        labelClone.htmlFor = uniqueId

        fragment.appendChild(todoClone)
    })

    todoContainer.appendChild(fragment)

    const filterButtons = document.querySelectorAll(".toolbar__filter")

    filterButtons.forEach(button => {
        button.classList.toggle("toolbar__filter--active", button.dataset.filter === currentFilter)
    })

    const toolbarNumber = document.querySelector(".toolbar__number")

    toolbarNumber.textContent = todos.filter(todo => todo.done === false).length
}


function addNewTodo() {

    const formTodo = document.querySelector(".todo-form")
    const valueNewTodo = document.querySelector(".todo-form__input")

    formTodo.addEventListener("submit", (event) => {

        event.preventDefault()

        const value = valueNewTodo.value.trim()

        if (!value) {
            return
        }

        const newTodo = { id: crypto.randomUUID(), text: value, done: false }

        todos.push(newTodo)
        valueNewTodo.value = ""
        saveTodos()
        renderTodos()
    })
}


function markAsComplete() {
    const todoContainer = document.querySelector(".todo")

    todoContainer.addEventListener("change", (event) => {
        const item = event.target.closest(".todo__item")

        if (!item) return
        const todo = todos.find(t => t.id === item.dataset.todoId)

        if (todo) {
            todo.done = event.target.checked
            saveTodos()
            renderTodos()
        }
    })
}


function deleteTask() {

    const todoContainer = document.querySelector(".todo")

    todoContainer.addEventListener("click", (event) => {

        const taskDelete = event.target.closest(".todo__delete")

        if (!taskDelete) return

        const item = event.target.closest(".todo__item")
        const id = item.dataset.todoId

        const positionTaskDelete = todos.findIndex(todo => todo.id === id)

        todos.splice(positionTaskDelete, 1)
        saveTodos()
        renderTodos()
    })
}


function handleFilters() {

    const filters = document.querySelector(".toolbar__filters")

    filters.addEventListener("click", (event) => {

        const filterSelected = event.target.closest(".toolbar__filter")

        if (!filterSelected) return

        currentFilter = filterSelected.dataset.filter

        renderTodos()
    })
}


function clearCompleted() {

    const clearButton = document.querySelector(".toolbar__clear-button")

    clearButton.addEventListener("click", () => {


        todos = todos.filter(todo => todo.done === false)
        saveTodos()
        renderTodos()
    })
}


function handleDarkMode() {

    const headerMode = document.querySelector(".header__mode")
    const headerIcon = document.querySelector(".header__icon")

    headerMode.addEventListener("click", () => {

        const stateDarkMode = document.documentElement.getAttribute("data-theme")

        if (stateDarkMode === null) {
            document.documentElement.setAttribute("data-theme", "dark")
            headerIcon.src = "./images/icon-sun.svg"
            headerMode.ariaLabel = "Activate light mode"
            localStorage.setItem("theme", "dark")
        } else {
            document.documentElement.removeAttribute("data-theme")
            headerIcon.src = "./images/icon-moon.svg"
            headerMode.ariaLabel = "Activate dark mode"
            localStorage.setItem("theme", "light")
        }
    })
}


function loadTheme() {
    const headerMode = document.querySelector(".header__mode")
    const headerIcon = document.querySelector(".header__icon")

    const storage = localStorage.getItem("theme")

    if (storage === "dark") {
        document.documentElement.setAttribute("data-theme", "dark")
        headerIcon.src = "./images/icon-sun.svg"
        headerMode.ariaLabel = "Activate light mode"
    }
}


function saveTodos() {

    localStorage.setItem("todos", JSON.stringify(todos))
}

function loadTodos() {

    const storage = localStorage.getItem("todos")

    if (storage !== null) {
        todos = JSON.parse(storage)
    }
}

function drag() {

    let dragged = null

    const source = document.querySelector(".todo")

    source.addEventListener("dragstart", (event) => {
        event.target.classList.add("dragging")
        dragged = event.target
    })

    source.addEventListener("dragend", (event) => {
        event.target.classList.remove("dragging")
    })

    source.addEventListener("dragover", (event) => {
        event.preventDefault()
    })

    source.addEventListener("drop", (event) => {
        event.preventDefault()
        const item = event.target.closest(".todo__item")
        if (!item) return

        const movedTaskId = dragged.dataset.todoId
        const targetTaskId = item.dataset.todoId

        const indexStart = todos.findIndex(todo => todo.id === movedTaskId)
        const indexEnd = todos.findIndex(todo => todo.id === targetTaskId)

        const elementMoved = todos.splice(indexStart, 1)[0]

        todos.splice(indexEnd, 0, elementMoved)
        saveTodos()
        renderTodos()
    })
}


function init() {

    loadTheme()
    loadTodos()
    renderTodos()
    addNewTodo()
    markAsComplete()
    deleteTask()
    handleFilters()
    clearCompleted()
    handleDarkMode()
    drag()
}

init()

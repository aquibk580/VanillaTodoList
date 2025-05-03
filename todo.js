const todoList = document.getElementById("todoList");
const addTodoBtn = document.getElementById("addTodoBtn");
const todoInput = document.getElementById("todoInput");
const clear = document.getElementById("clear");

function getInitialTodos() {
  const todos = getTodos();

  if (todos.length === 0) {
    setTodos([]);
    addEmptyMessage();
    return;
  }

  for (let i = 0; i < todos.length; i++) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = todos[i].text;
    span.className = "todo-text";
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    li.appendChild(span);
    li.appendChild(deleteBtn);
    li.dataset.todoId = todos[i].id;
    todoList.appendChild(li);
  }
}

getInitialTodos();

function addTodo() {
  if (todoInput.value !== "") {
    const li = document.createElement("li");
    const todos = getTodos();
    const newTodoId = String(Date.now());
    setTodos([...todos, { id: newTodoId, text: todoInput.value }]);
    li.dataset.todoId = newTodoId;
    const span = document.createElement("span");
    span.textContent = todoInput.value;
    span.className = "todo-text";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";

    li.appendChild(span);
    li.appendChild(deleteBtn);

    todoList.appendChild(li);
    todoInput.value = "";
    const emptyMessage = document.getElementById("empty-message");
    if (emptyMessage) {
      emptyMessage.remove();
    }
  } else {
    alert("Enter something to add todo");
  }
}

addTodoBtn.addEventListener("click", (event) => {
  addTodo();
});

todoInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTodo();
  }
});

todoList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const li = event.target.closest("li");
    if (li) {
      const todoId = li.dataset.todoId;
      const todos = getTodos();
      const updatedTodos = todos.filter((todo) => todo.id !== todoId);
      setTodos(updatedTodos);
      todoList.removeChild(li);
      if (updatedTodos.length === 0) {
        addEmptyMessage();
      }
    }
  }

  if (event.target.classList.contains("todo-text")) {
    const li = event.target.closest("li");
    if (li) {
      event.target.outerHTML = `<input type="text" value="${event.target.textContent}" class="edit-todo-input" />`;
    }
  }
});

todoList.addEventListener("keydown", (event) => {
  if (
    event.key === "Enter" &&
    event.target.classList.contains("edit-todo-input")
  ) {
    editTodo(event);
  }
});

todoList.addEventListener(
  "blur",
  (event) => {
    if (event.target.classList.contains("edit-todo-input")) {
      console.log("first");
      editTodo(event);
    }
  },
  true
);

clear.addEventListener("click", (event) => {
  setTodos([]);
  todoList.innerHTML = "";
  addEmptyMessage();
});

function addEmptyMessage() {
  const message = document.createElement("h3");
  message.id = "empty-message";
  message.textContent = "No Todos available";
  todoList.appendChild(message);
}

function setTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function getTodos() {
  return JSON.parse(localStorage.getItem("todos")) || [];
}

function editTodo(event) {
  if (event.target.classList.contains("edit-todo-input")) {
    const li = event.target.closest("li");
    if (li) {
      const todos = getTodos();
      const todoId = li.dataset.todoId;
      const newTodoInput = event.target.value.trim();
      const updatedTodos = todos.map((todo) => {
        if (todo.id === todoId) {
          return { id: todoId, text: newTodoInput };
        }

        return todo;
      });
      setTodos(updatedTodos);
      event.target.outerHTML = `<span class="todo-text">${newTodoInput}</span>`;
    }
  }
}

const Storage = (() => {
  const KEY = "todoAppData";

  const save = (data) => {
    localStorage.setItem(KEY, JSON.stringify(data));
  };

  const load = () => {
    const data = localStorage.getItem(KEY);

    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  };

  return {
    save,
    load,
  };
})();

function generateId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;
}

function createTodo(
  title,
  description = "",
  dueDate = "",
  priority = "medium",
  completed = false,
) {
  return {
    id: generateId(),
    title,
    description,
    dueDate,
    priority,
    completed,
  };
}

function createProject(name) {
  return {
    id: generateId(),
    name,
    todos: [],
  };
}

const App = (() => {
  let projects = [];

  let currentProjectId = null;

  let editingTodoId = null;

  const projectList = document.getElementById("projectList");

  const todoList = document.getElementById("todoList");

  const projectTitle = document.getElementById("projectTitle");

  const todoCount = document.getElementById("todoCount");

  const todoDialog = document.getElementById("todoDialog");

  const todoForm = document.getElementById("todoForm");

  const todoDialogTitle = document.getElementById("todoDialogTitle");

  const todoTitle = document.getElementById("todoTitle");

  const todoDesc = document.getElementById("todoDesc");

  const todoDue = document.getElementById("todoDue");

  const todoPriority = document.getElementById("todoPriority");

  const todoCompleted = document.getElementById("todoCompleted");

  const todoSubmit = document.getElementById("todoSubmitBtn");

  const todoCancel = document.getElementById("todoCancelBtn");

  const projectDialog = document.getElementById("projectDialog");

  const projectForm = document.getElementById("projectForm");

  const projectName = document.getElementById("projectName");

  const projectCancel = document.getElementById("projectCancelBtn");

  const currentProject = () =>
    projects.find((project) => project.id === currentProjectId);

  const saveState = () => {
    Storage.save({
      projects,
    });
  };

  const loadState = () => {
    const data = Storage.load();

    if (data?.projects?.length) {
      projects = data.projects;

      currentProjectId = projects[0].id;

      return;
    }

    const project = createProject("Default");

    project.todos.push(
      createTodo("Welcome", "Create your first task", "", "medium", false),
    );

    projects.push(project);

    currentProjectId = project.id;

    saveState();
  };

  const renderProjects = () => {
    projectList.innerHTML = projects
      .map((project) => {
        const active = project.id === currentProjectId ? "active" : "";

        const count = project.todos.filter((todo) => !todo.completed).length;

        return `

          <div
            class="project-item ${active}"
            data-id="${project.id}"
          >

            <span>${project.name}</span>

            <span class="badge">
              ${count}
            </span>

          </div>

        `;
      })
      .join("");

    projectList.querySelectorAll(".project-item").forEach((item) => {
      item.onclick = () => {
        currentProjectId = item.dataset.id;

        renderAll();
      };
    });

    const project = currentProject();

    if (project) {
      projectTitle.textContent = project.name;

      const total = project.todos.length;

      const done = project.todos.filter((todo) => todo.completed).length;

      todoCount.textContent = `${done}/${total} completed`;
    }
  };

  const renderTodos = () => {
    const project = currentProject();

    if (!project) {
      todoList.innerHTML = `<div class="empty-state">
          No project selected
        </div>`;

      return;
    }

    if (!project.todos.length) {
      todoList.innerHTML = `<div class="empty-state">
          No tasks available
        </div>`;

      return;
    }

    todoList.innerHTML = project.todos
      .map(
        (todo) => `


      <div
        class="todo-item ${todo.completed ? "completed" : ""}"
        data-id="${todo.id}"
      >


        <div class="priority priority-${todo.priority}">
        </div>


        <div class="info">

          <span class="title">
            ${escapeHtml(todo.title)}
          </span>


          <span class="desc">
            ${escapeHtml(todo.description)}
          </span>


        </div>



        <span class="due">
          ${todo.dueDate || "No date"}
        </span>



        <div class="actions">


          <button class="toggle-btn">
            ${todo.completed ? "Undo" : "✓"}
          </button>


          <button class="edit-btn">
            Edit
          </button>


          <button class="delete-btn">
            Del
          </button>


        </div>


      </div>


      `,
      )
      .join("");

    attachTodoEvents();
  };

  const attachTodoEvents = () => {
    todoList.querySelectorAll(".toggle-btn").forEach((button) => {
      button.onclick = (e) => {
        const id = e.target.closest(".todo-item").dataset.id;

        toggleTodo(id);
      };
    });

    todoList.querySelectorAll(".edit-btn").forEach((button) => {
      button.onclick = (e) => {
        openEditTodo(e.target.closest(".todo-item").dataset.id);
      };
    });

    todoList.querySelectorAll(".delete-btn").forEach((button) => {
      button.onclick = (e) => {
        deleteTodo(e.target.closest(".todo-item").dataset.id);
      };
    });
  };

  const renderAll = () => {
    renderProjects();

    renderTodos();
  };

  const addTodo = (data) => {
    currentProject()?.todos.push(createTodo(...data));

    saveState();

    renderAll();
  };

  const updateTodo = (id, data) => {
    const todo = currentProject()?.todos.find((item) => item.id === id);

    if (!todo) return;

    Object.assign(todo, createTodo(...data));

    todo.id = id;

    saveState();

    renderAll();
  };

  const deleteTodo = (id) => {
    const project = currentProject();

    project.todos = project.todos.filter((todo) => todo.id !== id);

    saveState();

    renderAll();
  };

  const toggleTodo = (id) => {
    const todo = currentProject()?.todos.find((item) => item.id === id);

    if (!todo) return;

    todo.completed = !todo.completed;

    saveState();

    renderAll();
  };

  const addProject = (name) => {
    const project = createProject(name);

    projects.push(project);

    currentProjectId = project.id;

    saveState();

    renderAll();
  };

  function openEditTodo(id) {
    const todo = currentProject()?.todos.find((item) => item.id === id);

    if (!todo) return;

    editingTodoId = id;

    todoDialogTitle.textContent = "Edit Todo";

    todoTitle.value = todo.title;

    todoDesc.value = todo.description;

    todoDue.value = todo.dueDate;

    todoPriority.value = todo.priority;

    todoCompleted.checked = todo.completed;

    todoSubmit.textContent = "Update";

    todoDialog.showModal();
  }

  const init = () => {
    loadState();

    renderAll();

    document.getElementById("addTodoBtn").onclick = () => {
      editingTodoId = null;

      todoForm.reset();

      todoDialog.showModal();
    };

    todoForm.onsubmit = (e) => {
      e.preventDefault();

      const data = [
        todoTitle.value.trim(),

        todoDesc.value.trim(),

        todoDue.value,

        todoPriority.value,

        todoCompleted.checked,
      ];

      editingTodoId ? updateTodo(editingTodoId, data) : addTodo(data);

      todoDialog.close();
    };

    todoCancel.onclick = () => todoDialog.close();

    document.getElementById("addProjectBtn").onclick = () =>
      projectDialog.showModal();

    projectForm.onsubmit = (e) => {
      e.preventDefault();

      addProject(projectName.value.trim());

      projectDialog.close();

      projectForm.reset();
    };

    projectCancel.onclick = () => projectDialog.close();
  };

  const escapeHtml = (text) => {
    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
  };

  return {
    init,
  };
})();

document.addEventListener("DOMContentLoaded", App.init);

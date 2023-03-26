import Projects from "./projects";
import taskController from "./taskController";
import ToDo from "./toDo";
import generateTaskComponent from "./toDoComponent";
import generateToDoFromComponent from "./toDoFormComponent";
import { projectComponent, editProjectComponent } from "./projectComponent";

const screenController = () => {
  const mainNav = document.getElementById("mainNav");
  const toggleNavBtn = document.querySelector(".toggle-nav-btn");
  const projectsContainer = document.getElementById("projects");
  const inboxProject = document.querySelector('[data-project="Inbox"]');
  const defaultFolders = [...document.querySelectorAll("[data-folder]")];
  const tasksContainer = document.querySelector(".tasks");
  const pageTitle = document.querySelector(".page-title");
  const taskForm = document.querySelector(".task-form");
  const projectForm = document.getElementById("projectForm");
  const projectAddBtn = document.getElementById("addProjectBtn");
  const cancelProjectFormBtn = document.querySelector(".cancel-project-btn");
  let currentProject;
  let currentTask;

  const renderTask = (task) => {
    const taskComponent = generateTaskComponent(task);
    tasksContainer.appendChild(taskComponent);
  };

  const generateNewTask = (e) => {
    e.preventDefault();
    const newTask = ToDo(
      taskForm.taskTitle.value,
      taskForm.dueDate.value,
      taskForm.priority.value
    );
    const newTaskContainer = generateTaskComponent(newTask);
    newTaskContainer.dataset.state = "adding";
    tasksContainer.appendChild(newTaskContainer);

    newTaskContainer.addEventListener(
      "animationend",
      () => {
        newTaskContainer.dataset.state = "added";
      },
      { once: true }
    );
    currentProject.addTask(newTask);
    Projects.updateLocalDataProjects();
    taskForm.reset();
  };

  const editTask = (e) => {
    const taskElement = getTasksElement(e);
    currentTask = taskElement.activeTask;

    // replace task with task edit form
    const toDoEditForm = generateToDoFromComponent(currentTask);
    taskElement.taskContainer.replaceWith(toDoEditForm);

    focusInputElement("newTaskTitle");
    projectFormClose();
  };

  const saveEditedTask = (e) => {
    e.preventDefault();
    const taskEditForm = document.querySelector(".edit-form");
    currentTask.priority = taskEditForm.priority.value;
    currentTask.title = taskEditForm.newTaskTitle.value;
    if (taskEditForm.dueDate.valueAsDate) {
      currentTask.dueDate = taskEditForm.dueDate.valueAsDate;
    }
    renderEditedTask();
    Projects.updateLocalDataProjects();
  };

  const removeTask = (e) => {
    const taskElement = getTasksElement(e);
    taskElement.taskContainer.remove();
    taskElement.tasksProject.removeTask(taskElement.tasksId);
    Projects.updateLocalDataProjects();
  };

  const renderProject = (project) => {
    projectsContainer.appendChild(projectComponent(project));
  };

  const addProject = (e) => {
    e.preventDefault();
    const newProjectTitle = projectForm.projectInput.value;

    if (Projects.checkForDuplicateProjects(newProjectTitle)) {
      return;
    }

    Projects.addProject(newProjectTitle);
    Projects.updateLocalDataProjects();
    renderProject(newProjectTitle);
    switchLink(newProjectTitle);
    projectForm.reset();
    projectFormClose();
    navClose();
  };

  const editUserProject = (e) => {
    const projectContainer = e.target.closest(".project");
    const projectTitle =
      projectContainer.firstElementChild.getAttribute("data-project");
    currentProject = Projects.getProject(projectTitle);
    const newTaskForm = editProjectComponent(currentProject.title);

    projectContainer.style.display = "none";
    projectContainer.insertAdjacentElement("afterend", newTaskForm);

    focusInputElement("newProjectTitle");
    switchLink(currentProject.title);
  };

  const saveEditedProject = (e) => {
    e.preventDefault();
    const projectEditForm = document.querySelector(".edit-project-form");
    const projectEditFormValue = projectEditForm.newProjectTitle.value;

    if (Projects.checkForDuplicateProjects(projectEditFormValue)) {
      return;
    }

    currentProject.title = projectEditFormValue;
    refreshUserProjects();
    Projects.updateLocalDataProjects();
    switchLink(currentProject.title);
  };

  const removeProject = (e) => {
    const parentContainer = e.target.closest(".project");
    const projectsTitle =
      parentContainer.firstChild.getAttribute("data-project");

    Projects.removeProject(projectsTitle);
    Projects.updateLocalDataProjects();
    parentContainer.remove();

    // switch to default Inbox folder if active project was deleted
    if (parentContainer.classList.contains("active")) {
      currentProject = Projects.getProject("Inbox");
      switchLink(currentProject.title);
    }
  };

  const init = () => {
    Projects.checkLocalData();
    // default project on load
    currentProject = Projects.getProject("Inbox");
    renderAllTasks();
    renderUserProjects();
    noTasksAvailableSign();
  };

  // Event Listeners
  window.addEventListener("load", init);

  tasksContainer.addEventListener("animationend", () => {
    const tasks = [...document.querySelectorAll(".task")];
    tasks.forEach((task) => {
      task.dataset.state = "added";
    });
  });

  mainNav.addEventListener("click", (e) => {
    if (e.target.matches(".project-title")) {
      switchProject(e);
    }
  });

  mainNav.addEventListener("click", toggleNav);

  toggleNavBtn.addEventListener("click", () => {
    const NavBtnState = toggleNavBtn.getAttribute("aria-expanded") === "true";
    if (NavBtnState) {
      navClose();
    } else {
      navOpen();
    }
  });

  mainNav.addEventListener("click", (e) => {
    if (e.target.matches(".delete-btn")) {
      removeProject(e);
      refreshTasks();
    }
  });

  inboxProject.addEventListener("click", switchProject);

  defaultFolders.forEach((folder) => {
    folder.addEventListener("click", switchFolder);
  });
  taskForm.addEventListener("submit", (e) => {
    const noTasksSign = elementExists(".no-tasks-sign");

    if (noTasksSign) {
      noTasksSign.remove();
    }
    generateNewTask(e);
  });

  tasksContainer.addEventListener("submit", saveEditedTask);

  tasksContainer.addEventListener("click", (e) => {
    if (e.target.matches(".edit-btn")) {
      // check for existing task edit form
      if (elementExists(".edit-form")) {
        renderEditedTask();
      }
      editTask(e);
    }
  });

  tasksContainer.addEventListener("click", (e) => {
    if (e.target.matches(".delete-btn")) {
      const taskContainer = e.target.closest(".task");
      taskContainer.dataset.state = "removing";
      taskContainer.addEventListener(
        "transitionend",
        () => {
          removeTask(e);
          noTasksAvailableSign();
        },
        { once: true }
      );
    }
  });

  tasksContainer.addEventListener("click", (e) => {
    if (e.target.matches(".cancel-btn")) {
      renderEditedTask();
    }
  });

  tasksContainer.addEventListener("click", (e) => {
    if (e.target.type === "checkbox") {
      const taskElement = getTasksElement(e);

      if (e.target.checked) {
        changeTasksStatus(taskElement, "completed");
      } else {
        changeTasksStatus(taskElement, "uncompleted");
        if (currentProject === "Completed") {
          taskElement.taskContainer.remove();
        }
      }
      Projects.updateLocalDataProjects();
    }
  });
  projectAddBtn.addEventListener("click", projectFormOpen);
  projectForm.addEventListener("submit", addProject);
  cancelProjectFormBtn.addEventListener("click", () => {
    projectForm.reset();
    toggleProjectForm();
  });
  projectsContainer.addEventListener("submit", saveEditedProject);
  projectsContainer.addEventListener("click", (e) => {
    if (e.target.matches(".cancel-project-change")) {
      removeExistingProjectForms();
    }
  });
  projectsContainer.addEventListener("click", (e) => {
    if (e.target.matches(".edit-btn")) {
      removeExistingProjectForms();
      editUserProject(e);
    }
  });

  // Helper functions

  function renderEditedTask() {
    // saves changes or restores tasks if changes cancelled
    const currentEditForm = document.querySelector(".edit-form");
    const taskContainer = generateTaskComponent(currentTask);
    taskContainer.dataset.state = "added"; // disable entrance animation
    currentEditForm.replaceWith(taskContainer);
  }

  function getTasksElement(e) {
    const taskContainer = e.target.closest(".task");
    const tasksId = taskContainer.getAttribute("data-id");
    const tasksProject = Projects.getTasksProject(tasksId);
    const activeTask = tasksProject.getTask(tasksId);

    return { taskContainer, tasksId, tasksProject, activeTask };
  }

  function renderAllTasks() {
    taskController.getAllTasks().forEach((task) => {
      renderTask(task);
    });
  }

  function renderUserProjects() {
    // skip inbox project
    const allUserProjects = Projects.list.slice(1);
    allUserProjects.forEach((project) => {
      renderProject(project.title);
    });
  }

  function refreshTasks() {
    const defaultFolderFunctions = {
      Inbox: taskController.getAllTasks(),
      Today: taskController.getTodaysTasks(),
      Completed: taskController.getCompletedTasks(),
      "This Week": taskController.getThisWeeksTasks(),
    };

    const folderExists = Object.keys(defaultFolderFunctions).includes(
      currentProject
    );

    tasksContainer.textContent = "";

    if (currentProject.title === "Inbox") {
      renderAllTasks();
      return;
    }

    if (folderExists) {
      defaultFolderFunctions[currentProject].forEach((task) => {
        renderTask(task);
      });
      return;
    }

    currentProject.tasks.forEach((task) => {
      renderTask(task);
    });
  }

  function refreshUserProjects() {
    projectsContainer.textContent = "";
    renderUserProjects();
  }

  function switchLink(linkTitle) {
    currentProject = Projects.getProject(linkTitle) ?? linkTitle;
    refreshTasks();
    noTasksAvailableSign();
    changePageTitle(linkTitle);
    changeActiveLink();
    projectFormClose();
    taskForm.reset();
  }

  function switchLinkOnClick(e) {
    const linkContainer = e.target.closest("li");
    const linkTitle = linkContainer.firstElementChild.textContent;
    // close edit form on another project click
    if (elementExists(".edit-project-form")) {
      refreshUserProjects();
    }

    // return if active link is clicked
    if (linkContainer.classList.contains("active")) {
      return;
    }

    switchLink(linkTitle);
  }

  function switchProject(e) {
    switchLinkOnClick(e);
    taskFormOpen();
  }

  function switchFolder(e) {
    switchLinkOnClick(e);
    taskFormClose();
  }

  function changeActiveLink() {
    const currentProjectContainer =
      document.querySelector(`[data-folder='${currentProject}']`) ??
      document.querySelector(`[data-project='${currentProject.title}']`);
    const currentActiveLink = document.querySelector(".active");

    if (currentActiveLink) {
      currentActiveLink.classList.remove("active");
    }

    currentProjectContainer.closest("li").classList.add("active");
  }

  function focusInputElement(element) {
    const el = document.getElementById(element);
    el.focus();
  }

  function changePageTitle(title) {
    pageTitle.textContent = title;
  }

  function changeTasksStatus(el, value) {
    el.activeTask.status = value;
    el.taskContainer.dataset.status = value;
  }

  function noTasksAvailableSign() {
    if (tasksContainer.childElementCount <= 0) {
      const h2El = document.createElement("h2");

      h2El.textContent = "No Tasks Available";

      h2El.classList.add("no-tasks-sign");

      tasksContainer.appendChild(h2El);
    }
  }

  function taskFormOpen() {
    taskForm.dataset.state = "displayed";
  }

  function taskFormClose() {
    taskForm.dataset.state = "hidden";
  }

  function toggleProjectForm() {
    const projectFormState = projectForm.dataset.state;
    projectForm.dataset.state =
      projectFormState === "hidden" ? "displayed" : "hidden";
  }

  function projectFormOpen() {
    toggleProjectForm();
    removeExistingProjectForms();
    focusInputElement("projectInput");
  }

  function projectFormClose() {
    projectForm.dataset.state = "hidden";
  }

  function toggleNav(e) {
    const isProject = e.target.matches("[data-project");
    const isFolder = e.target.matches("[data-folder]");
    const isBody = e.target.matches(".main-nav");

    if (isProject || isFolder || isBody) {
      navClose();
    }
  }

  function navOpen() {
    toggleNavBtn.setAttribute("aria-expanded", "true");
    mainNav.dataset.state = "displayed";
  }

  function navClose() {
    toggleNavBtn.setAttribute("aria-expanded", "false");
    mainNav.dataset.state = "hidden";
  }

  function removeExistingProjectForms() {
    const projectEditForm = elementExists(".edit-project-form");

    if (projectEditForm) {
      projectEditForm.remove();
      document.querySelector(".active").style.display = "flex";
    }
  }

  function elementExists(elClass) {
    const el = document.querySelector(elClass);
    return el;
  }
};

export default screenController;

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
  const inboxFolder = document.querySelector('[data-project="Inbox"]');
  const completedTasksFolder = document.querySelector(
    '[data-folder="Completed"]'
  );
  const todayFolder = document.querySelector('[data-folder="Today"]');
  const thisWeeksFolder = document.querySelector('[data-folder="This Week"]');
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
    renderTask(newTask);
    currentProject.addTask(newTask);
    updateLocalData();
    taskForm.reset();
  };

  const editTask = (e) => {
    const taskElement = e.target.closest(".task");
    const taskId = taskElement.getAttribute("data-id");
    const tasksProject = Projects.getTasksProject(taskId);

    const task = tasksProject.getTask(taskId);
    currentTask = task;

    // replace task with task edit form
    const toDoEditForm = generateToDoFromComponent(currentTask);
    taskElement.replaceWith(toDoEditForm);
  };

  const saveEditedTask = (e) => {
    e.preventDefault();
    if (e.target.matches(".edit-form")) {
      currentTask.changePriority(e.target.priority.value);
      currentTask.changeTitle(e.target.newTaskTitle.value);
      currentTask.changeDueDate(e.target.dueDate.valueAsDate);
      const taskContainer = generateTaskComponent(currentTask);
      e.target.replaceWith(taskContainer);
      updateLocalData();
    }
  };

  const removeTask = (e) => {
    const parentContainer = e.target.closest(".task");
    const tasksId = parentContainer.getAttribute("data-id");
    const selectedProject = Projects.getTasksProject(tasksId);
    parentContainer.remove();
    selectedProject.removeTask(tasksId);
    updateLocalData();
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
    updateLocalData();
    renderProject(newProjectTitle);
    switchLink(newProjectTitle);
    projectForm.reset();
    toggleProjectForm();
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
    updateLocalData();
    switchLink(currentProject.title);
  };

  const removeProject = (e) => {
    const parentContainer = e.target.closest(".project");
    const projectsTitle =
      parentContainer.firstChild.getAttribute("data-project");

    Projects.removeProject(projectsTitle);
    updateLocalData();
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
  };

  // Event Listeners
  window.addEventListener("load", init);

  mainNav.addEventListener("click", (e) => {
    if (e.target.matches(".project-title")) {
      switchLinkOnClick(e);
    }
  });

  mainNav.addEventListener("click", toggleNav);

  toggleNavBtn.addEventListener("click", () => {
    const NavBtnState = toggleNavBtn.getAttribute("aria-expanded") === "true";

    NavBtnState ? navClose() : navOpen();
  });

  mainNav.addEventListener("click", (e) => {
    if (e.target.matches(".delete-btn")) {
      removeProject(e);
      refreshTasks();
    }
  });

  inboxFolder.addEventListener("click", switchLinkOnClick);
  completedTasksFolder.addEventListener("click", switchLinkOnClick);
  todayFolder.addEventListener("click", switchLinkOnClick);
  thisWeeksFolder.addEventListener("click", switchLinkOnClick);
  taskForm.addEventListener("submit", generateNewTask);
  tasksContainer.addEventListener("submit", saveEditedTask);
  tasksContainer.addEventListener("click", (e) => {
    if (e.target.matches(".edit-btn")) {
      // check for existing task edit form
      const formExist = document.querySelector(".edit-form");
      if (formExist) {
        formExist.replaceWith(generateTaskComponent(currentTask));
      }
      editTask(e);
      focusInputElement("newTaskTitle");
      projectForm.style.display = "none";
    }
  });
  tasksContainer.addEventListener("click", (e) => {
    if (e.target.matches(".delete-btn")) {
      removeTask(e);
    }
  });
  tasksContainer.addEventListener("click", (e) => {
    if (e.target.matches(".cancel-btn")) {
      refreshTasks();
    }
  });
  tasksContainer.addEventListener("click", (e) => {
    if (e.target.type === "checkbox") {
      const taskContainer = e.target.closest(".task");
      const tasksId = taskContainer.getAttribute("data-id");
      const tasksProject = Projects.getTasksProject(tasksId);
      const activeTask = tasksProject.getTask(tasksId);

      if (e.target.checked) {
        activeTask.changeStatus("checked");
      } else {
        activeTask.changeStatus("unchecked");
        if (currentProject === "Completed") {
          taskContainer.remove();
        }
      }
      updateLocalData();
    }
  });
  projectAddBtn.addEventListener("click", () => {
    refreshUserProjects();
    switchLink(currentProject.title);
    toggleProjectForm();
    focusInputElement("projectInput");
  });
  projectForm.addEventListener("submit", addProject);
  cancelProjectFormBtn.addEventListener("click", () => {
    projectForm.reset();
    toggleProjectForm();
  });
  projectsContainer.addEventListener("submit", saveEditedProject);
  projectsContainer.addEventListener("click", (e) => {
    if (e.target.matches(".cancel-project-change")) {
      refreshUserProjects();
      switchLink(currentProject.title);
    }
  });
  projectsContainer.addEventListener("click", (e) => {
    if (e.target.matches(".edit-btn")) {
      // remove previous edit form
      const editFormExists = document.querySelector(`.edit-project-form`);

      if (editFormExists) {
        editFormExists.replaceWith(projectComponent(currentProject.title));
      }

      editUserProject(e);
      projectForm.style.display = "none";
    }
  });

  // Helper functions

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
    changeActiveLink();
    changePageTitle(linkTitle);
  }

  function switchLinkOnClick(e) {
    const linkContainer = e.target.closest("li");
    const linkTitle = linkContainer.firstElementChild.textContent;
    // close edit form on another project click
    const editFormExists = document.querySelector(`.edit-project-form`);
    if (editFormExists) {
      refreshUserProjects();
    }

    // return if active link is clicked
    if (linkContainer.classList.contains("active")) {
      return;
    }

    currentProject = Projects.getProject(linkTitle) ?? linkTitle;
    refreshTasks();
    changePageTitle(linkTitle);
    changeActiveLink();
    taskForm.reset();
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

  function toggleNav(e) {
    const isProject = e.target.matches("[data-project");
    const isFolder = e.target.matches("[data-folder]");
    const isBody = e.target.matches(".main-nav");

    if (isProject || isFolder || isBody) {
      navClose();
    }
  }

  function toggleProjectForm() {
    const ProjectFormDisplay = window.getComputedStyle(projectForm).display;
    projectForm.style.display =
      ProjectFormDisplay === "none" ? "block" : "none";
  }

  function updateLocalData() {
    localStorage.setItem("projects", JSON.stringify(Projects.list));
  }

  function focusInputElement(element) {
    const el = document.getElementById(element);
    el.focus();
  }

  function changePageTitle(title) {
    pageTitle.textContent = title;
  }

  function navOpen() {
    toggleNavBtn.setAttribute("aria-expanded", "true");
    mainNav.classList.add("show");
  }

  function navClose() {
    toggleNavBtn.setAttribute("aria-expanded", "false");
    mainNav.classList.remove("show");
  }
};

export default screenController;

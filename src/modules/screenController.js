import Projects from "./projects";
import taskController from "./taskController";
import ToDo from "./toDo";
import generateTaskComponent from "./toDoComponent";
import generateToDoFromComponent from "./toDoFormComponent";
import { projectComponent, editProjectComponent } from "./projectComponent";

const screenController = () => {
  const mainNav = document.getElementById("mainNav");
  const projectsContainer = document.getElementById("projects");
  const inboxFolder = document.querySelector('[data-project="Inbox"]');
  const completedTasksFolder = document.querySelector(
    '[data-folder="Completed"]'
  );
  const todayFolder = document.querySelector('[data-folder="Today"]');
  const thisWeeksFolder = document.querySelector('[data-folder="This Week"]');
  const tasksContainer = document.querySelector(".tasks");
  const taskForm = document.querySelector(".task-form");
  const projectForm = document.getElementById("projectForm");
  const projectAddBtn = document.getElementById("addProjectBtn");
  const cancelProjectFormBtn = document.querySelector(".cancel-project-btn");
  let currentProject = Projects.getProject("Inbox");
  let currentTask;

  const defaultFolderFunctions = () => ({
    Inbox: taskController.getAllTasks(),
    Today: taskController.getTodaysTasks(),
    Completed: taskController.getCompletedTasks(),
    "This Week": taskController.getThisWeeksTasks(),
  });

  const renderTask = (task) => {
    const taskComponent = generateTaskComponent(task);
    tasksContainer.appendChild(taskComponent);
  };

  const renderAllTasks = () => {
    taskController.getAllTasks().forEach((task) => {
      renderTask(task);
    });
  };

  const removeTask = (e) => {
    const parentContainer = e.target.closest(".task");
    const tasksId = parentContainer.getAttribute("data-id");
    const selectedProject = Projects.getTasksProject(tasksId);
    parentContainer.remove();
    selectedProject.removeTask(tasksId);
    updateLocalData();
  };

  const refreshTasks = () => {
    const defaultFolders = defaultFolderFunctions();
    const folderExists = Object.keys(defaultFolders).includes(currentProject);

    tasksContainer.textContent = "";

    if (currentProject.title === "Inbox") {
      renderAllTasks();
      return;
    }

    if (folderExists) {
      defaultFolders[currentProject].forEach((task) => {
        renderTask(task);
      });
      return;
    }

    currentProject.tasks.forEach((task) => {
      renderTask(task);
    });
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

  const renderUserProjects = () => {
    // skip inbox project
    const allUserProjects = Projects.list.slice(1);
    allUserProjects.forEach((project) => {
      projectsContainer.appendChild(projectComponent(project.title));
    });
  };

  const refreshUserProjects = () => {
    projectsContainer.textContent = "";
    renderUserProjects();
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

  const addProject = (e) => {
    e.preventDefault();
    const newProjectTitle = projectForm.projectInput.value;

    if (Projects.checkForDuplicateProjects(newProjectTitle)) {
      return;
    }

    const newProjectComponent = projectComponent(newProjectTitle);
    Projects.addProject(newProjectTitle);
    projectsContainer.appendChild(newProjectComponent);

    projectForm.reset();
    toggleProjectForm();
    updateLocalData();
    switchLink(newProjectTitle);
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

  // Event Listeners
  window.addEventListener("load", init);

  mainNav.addEventListener("click", (e) => {
    if (e.target.matches(".project-title")) {
      switchLinkOnClick(e);
    }
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
        refreshTasks();
      }
    }
  });
  projectAddBtn.addEventListener("click", () => {
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
    }
  });

  function switchLink(linkTitle) {
    currentProject = Projects.getProject(linkTitle) ?? linkTitle;
    refreshTasks();
    changeActiveLink();
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
    changeActiveLink();
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

  function toggleProjectForm() {
    const ProjectFormDisplay = window.getComputedStyle(projectForm).display;
    projectForm.style.display = ProjectFormDisplay === "none" ? "flex" : "none";
  }

  function init() {
    Projects.checkLocalData();
    renderAllTasks();
    renderUserProjects();
  }

  function updateLocalData() {
    localStorage.setItem("projects", JSON.stringify(Projects.list));
  }

  function focusInputElement(element) {
    const el = document.getElementById(element);
    el.focus();
  }
};

export default screenController;

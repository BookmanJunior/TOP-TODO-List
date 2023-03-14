import Projects from "./projects";
import taskController from "./taskController";
import ToDo from "./toDo";
import generateTaskComponent from "./toDoComponent";
import toDoFormComponent from "./toDoFormComponent";
import projectComponent from "./projectComponent";

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
  let activeTask;

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
  };

  const editTask = (e) => {
    if (e.target.matches(".edit-btn")) {
      const taskElement = e.target.closest(".task");
      const tasksProject = Projects.getTasksProject(
        taskElement.getAttribute("data-id")
      );
      const task = tasksProject.getTask(taskElement.getAttribute("data-id"));
      activeTask = task;
      const toDoForm = toDoFormComponent();
      toDoForm.priority.value = task.priority;
      toDoForm.taskTitle.value = task.title;
      toDoForm.dueDate.valueAsDate = new Date(task.dueDate);
      taskElement.replaceWith(toDoForm);
    }
  };

  const saveEditedTask = (e) => {
    e.preventDefault();
    if (e.target.matches(".edit-form")) {
      activeTask.changePriority(e.target.priority.value);
      activeTask.changeTitle(e.target.taskTitle.value);
      activeTask.changeDueDate(e.target.dueDate.valueAsDate);
      const taskContainer = generateTaskComponent(activeTask);
      e.target.replaceWith(taskContainer);
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
    taskForm.reset();
  };

  const renderUserProjects = () => {
    // skip inbox project
    const allUserProjects = Projects.list.slice(1);
    allUserProjects.forEach((project) => {
      projectsContainer.appendChild(projectComponent(project.title));
    });
  };

  const render = () => {
    renderAllTasks();
    renderUserProjects();
  };

  const changeActiveLink = (e) => {
    const linkContainer = e.target.closest("li");
    const currentActiveLink = document.querySelector(".active");

    // reset active link to inbox if current active project was deleted
    if (currentActiveLink === null) {
      inboxFolder.closest("li").classList.add("active");
      return;
    }

    currentActiveLink.classList.remove("active");
    linkContainer.classList.add("active");
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

  const switchProject = (e) => {
    const projectContainer = e.target.closest(".project");

    // return if active link is clicked
    if (projectContainer.classList.contains("active")) {
      return;
    }

    taskForm.style.display = "flex";
    const selectedProject = e.target.getAttribute("data-project") ?? "Inbox";
    currentProject = Projects.getProject(selectedProject);
    refreshTasks();
    changeActiveLink(e);
  };

  const switchFolder = (e) => {
    const currentFolder = e.target.closest(".menu-link");

    if (currentFolder.classList.contains("active")) {
      return;
    }

    taskForm.style.display = "none";
    currentProject =
      currentFolder.firstElementChild.getAttribute("data-folder");
    refreshTasks();
    changeActiveLink(e);
  };

  const removeProject = (e) => {
    const parentContainer = e.target.closest(".project");
    const projectsTitle =
      parentContainer.firstChild.getAttribute("data-project");

    Projects.removeProject(projectsTitle);
    parentContainer.remove();

    // switch to default Inbox folder if active project was deleted
    if (parentContainer.classList.contains("active")) {
      e.target.closest("li").classList.remove("active");
      switchProject(e);
    }
  };

  // Event Listeners
  window.addEventListener("load", render);

  mainNav.addEventListener("click", (e) => {
    if (e.target.matches(".project-title")) {
      switchProject(e);
    }
  });
  mainNav.addEventListener("click", (e) => {
    if (e.target.matches(".delete-btn")) {
      removeProject(e);
      refreshTasks();
    }
  });

  inboxFolder.addEventListener("click", (e) => {
    switchProject(e);
  });
  completedTasksFolder.addEventListener("click", (e) => {
    switchFolder(e);
  });
  todayFolder.addEventListener("click", (e) => {
    switchFolder(e);
  });
  thisWeeksFolder.addEventListener("click", (e) => {
    switchFolder(e);
  });
  taskForm.addEventListener("submit", generateNewTask);
  tasksContainer.addEventListener("submit", saveEditedTask);
  tasksContainer.addEventListener("click", (e) => {
    if (e.target.matches(".edit-btn")) {
      editTask(e);
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
      const currentTask = tasksProject.getTask(tasksId);

      if (e.target.checked) {
        currentTask.changeStatus("checked");
      } else {
        currentTask.changeStatus("unchecked");
        refreshTasks();
      }
    }
  });
  projectAddBtn.addEventListener("click", toggleProjectForm);

  projectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newProjectTitle = projectForm.projectInput.value;
    const newProjectComponent = projectComponent(newProjectTitle);
    Projects.addProject(newProjectTitle);
    projectsContainer.appendChild(newProjectComponent);

    projectForm.reset();
    toggleProjectForm();
  });

  cancelProjectFormBtn.addEventListener("click", () => {
    projectForm.reset();
    toggleProjectForm();
  });

  function toggleProjectForm() {
    const ProjectFormDisplay = window.getComputedStyle(projectForm).display;
    projectForm.style.display = ProjectFormDisplay === "none" ? "flex" : "none";
  }
};

export default screenController;

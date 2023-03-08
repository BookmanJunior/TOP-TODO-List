import Projects from "./projects";
import ToDo from "./toDo";
import toDoComponent from "./toDoComponent";
import toDoFormComponent from "./toDoFormComponent";
import projectComponent from "./projectComponent";

const screenController = () => {
  const mainNav = document.getElementById("mainNav");
  const projectsContainer = document.getElementById("projects");
  const inboxFolder = document.querySelector('[data-title="Inbox"]');
  const completedTasksFolder = document.querySelector(
    '[data-title="Completed"]'
  );
  const todayFolder = document.querySelector('[data-title="Today"]');
  const tasksContainer = document.querySelector(".tasks");
  const taskForm = document.querySelector(".task-form");
  let currentProject = Projects.getProject("Inbox");

  const renderTask = (task) => {
    const taskContainer = toDoComponent(
      task.title,
      task.dueDate,
      task.priority,
      task.status,
      task.id
    );
    tasksContainer.appendChild(taskContainer);
  };

  const renderAllTasks = () => {
    Projects.getAllTasks().forEach((task) => {
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

  const switchProject = (e) => {
    const projectContainer = e.target.closest(".project");

    if (projectContainer.classList.contains("active")) {
      return;
    }

    tasksContainer.textContent = "";
    changeActiveLink(e);
    const selectedProject = e.target.textContent;
    currentProject = Projects.getProject(selectedProject);
    currentProject.tasks.forEach((task) => {
      renderTask(task);
    });
  };

  const switchFolder = (e, fn) => {
    const currentFolder = e.target.closest("li");

    if (currentFolder.classList.contains("active")) {
      return;
    }

    tasksContainer.textContent = "";
    changeActiveLink(e);
    fn.forEach((task) => {
      renderTask(task);
    });
  };

  const removeProject = (e) => {
    const parentContainer = e.target.closest(".project");
    const projectsTitle = parentContainer.firstChild.getAttribute("data-title");

    // switch to default Inbox folder if active project was deleted
    if (parentContainer.classList.contains("active")) {
      e.target.closest("li").classList.remove("active");
      switchFolder(e, Projects.getAllTasks());
    }

    Projects.removeProject(projectsTitle);
    parentContainer.remove();
  };

  // Event Listeners
  window.addEventListener("load", render);

  mainNav.addEventListener("click", (e) => {
    if (e.target.matches(".task-title")) {
      switchProject(e);
    }
  });
  mainNav.addEventListener("click", (e) => {
    if (e.target.matches(".delete-btn")) {
      removeProject(e);
    }
  });

  inboxFolder.addEventListener("click", (e) => {
    switchFolder(e, Projects.getAllTasks());
    currentProject = Projects.getProject("Inbox");
  });
  completedTasksFolder.addEventListener("click", (e) => {
    switchFolder(e, Projects.getCompletedTasks());
  });
  todayFolder.addEventListener("click", (e) => {
    switchFolder(e, Projects.getTodaysTasks());
  });
  taskForm.addEventListener("submit", generateNewTask);
  tasksContainer.addEventListener("click", (e) => {
    if (e.target.matches(".edit-btn")) {
      const taskElement = e.target.closest(".task");
      taskElement.replaceWith(toDoFormComponent("edit-form"));
    }
  });
  tasksContainer.addEventListener("click", (e) => {
    if (e.target.matches(".delete-btn")) {
      removeTask(e);
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
      }
    }
  });
};

export default screenController;

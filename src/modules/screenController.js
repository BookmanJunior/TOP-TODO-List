import Projects from "./projects";
import ToDo from "./toDo";
import toDoComponent from "./toDoComponent";
import toDoFormComponent from "./toDoFormComponent";
import projectComponent from "./projectComponent";

const screenController = () => {
  const mainNav = document.getElementById("mainNav");
  const defaultProjectsContainer = [
    ...document.querySelectorAll(".default-project-title"),
  ];
  const projectsContainer = document.getElementById("projects");
  const inboxContainer = document
    .querySelector('[data-title="Inbox"]')
    .closest(".project");
  const completedTasksContainer = document
    .querySelector('[data-title="Completed"]')
    .closest(".project");
  const scheduledTasksContainer = document
    .querySelector('[data-title="Scheduled Tasks"]')
    .closest(".project");
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
    const allTasks = Projects.getAllTasks();
    allTasks.forEach((taskArray) => {
      // skip empty tasks
      if (taskArray[0]) {
        renderTask(taskArray[0]);
      }
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

  const getDefaultProjectsTitles = () =>
    defaultProjectsContainer.map((project) => project.textContent);

  const renderCustomProjects = () => {
    const allProjects = Projects.list;
    allProjects.forEach((project) => {
      // skip default projects
      if (!getDefaultProjectsTitles().includes(project.title)) {
        projectsContainer.appendChild(projectComponent(project.title));
      }
    });
  };

  const render = () => {
    renderAllTasks();
    renderCustomProjects();
  };

  const activeProjectIndicator = () => {
    const projectTitleContainer = document.querySelector(
      `[data-title="${currentProject.title}"]`
    );
    const projectsParent = projectTitleContainer.closest(".project");
    const activeProject = document.querySelector(".active");

    activeProject.classList.remove("active");
    projectsParent.classList.add("active");
  };

  const switchProject = (e) => {
    tasksContainer.textContent = "";
    const selectedProject = e.target.textContent;
    currentProject = Projects.getProject(selectedProject);
    currentProject.tasks.forEach((task) => {
      renderTask(task);
    });
    activeProjectIndicator();
  };

  const removeProject = (e) => {
    const parentContainer = e.target.closest(".project");
    const projectsTitle = parentContainer.firstChild.textContent;
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
  inboxContainer.addEventListener("click", () => {
    tasksContainer.textContent = "";
    currentProject = Projects.getProject(
      inboxContainer.firstElementChild.getAttribute("data-title")
    );
    activeProjectIndicator();
    renderAllTasks();
  });
  scheduledTasksContainer.addEventListener("click", (e) => {
    switchProject(e);
  });
  completedTasksContainer.addEventListener("click", (e) => {
    switchProject(e);
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
};

export default screenController;

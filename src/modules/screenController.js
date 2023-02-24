import { Projects, defaultProjects, userProjects } from "./projects";
import ToDo from "./toDo";
import toDoComponent from "./toDoComponent";
import toDoFormComponent from "./toDoFormComponent";
import projectComponent from "./projectComponent";

const screenController = () => {
  const mainNav = document.getElementById("mainNav");
  const projectsContainer = document.getElementById("projects");
  const inboxContainer = document.querySelector('[data-title="Inbox"]');
  const completedTasksContainer = document.querySelector(
    '[data-title="Completed"]'
  );
  const scheduledTasksContainer = document.querySelector(
    '[data-title="Scheduled Tasks"]'
  );
  const tasksContainer = document.querySelector(".tasks");
  const taskForm = document.querySelector(".task-form");
  let currentProject = defaultProjects.getProject("Inbox");

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
    const userTasks = userProjects.getAllTasks();
    userTasks.forEach((userTask) => {
      renderTask(userTask);
    });
  };

  const removeTask = (e) => {
    const parentContainer = e.target.closest(".task");
    const tasksId = parentContainer.getAttribute("data-id");
    const selectedProject =
      defaultProjects.getTasksProject(tasksId) ??
      userProjects.getTasksProject(tasksId);
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
    userProjects.projects.forEach((project) => {
      projectsContainer.appendChild(projectComponent(project.title));
    });
  };

  const render = () => {
    renderAllTasks();
    renderUserProjects();
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
    currentProject =
      defaultProjects.getProject(selectedProject) ??
      userProjects.getProject(selectedProject);
    currentProject.tasks.forEach((task) => {
      renderTask(task);
    });
    activeProjectIndicator();
  };

  const removeProject = (e) => {
    const parentContainer = e.target.closest(".project");
    const projectsTitle = parentContainer.firstChild.textContent;
    userProjects.removeProject(projectsTitle);
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
  inboxContainer.addEventListener("click", (e) => {
    switchProject(e);
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

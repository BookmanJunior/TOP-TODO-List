import Projects from "./projects";
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
    allTasks.forEach((task) => {
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
    const allProjects = Projects.list.slice(1);
    allProjects.forEach((project) => {
      projectsContainer.appendChild(projectComponent(project.title));
    });
  };

  const render = () => {
    renderAllTasks();
    renderUserProjects();
  };

  const activeLinkIndicator = (e) => {
    const linkContainer = e.target.closest("li");
    const currentActiveLink = document.querySelector(".active");

    currentActiveLink.classList.remove("active");
    linkContainer.classList.add("active");
  };

  const switchProject = (e) => {
    const projectContainer = e.target.closest(".project");
    if (projectContainer.classList.contains("active")) {
      console.log("returned");
      return;
    }
    tasksContainer.textContent = "";
    const selectedProject = e.target.textContent;
    currentProject = Projects.getProject(selectedProject);
    currentProject.tasks.forEach((task) => {
      renderTask(task);
    });
    activeLinkIndicator(e);
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

  inboxContainer.addEventListener("click", (e) => {
    tasksContainer.textContent = "";
    currentProject = Projects.getProject(
      inboxContainer.getAttribute("data-title")
    );
    activeLinkIndicator(e);
    renderAllTasks();
  });
  completedTasksContainer.addEventListener("click", (e) => {
    tasksContainer.textContent = "";
    activeLinkIndicator(e);
    Projects.getCompletedTasks().forEach((task) => {
      renderTask(task);
    });
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
    const taskContainer = e.target.closest(".task");
    const tasksId = taskContainer.getAttribute("data-id");
    const tasksProject = Projects.getTasksProject(tasksId);
    const currentTask = tasksProject.getTask(tasksId);

    if (e.target.checked) {
      currentTask.changeStatus("checked");
    } else {
      currentTask.changeStatus("unchecked");
    }
  });
};

export default screenController;

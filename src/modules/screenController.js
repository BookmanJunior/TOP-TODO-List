import Projects from "./projects";
import ToDo from "./toDo";
import toDoComponent from "./toDoComponent";
import toDoFormComponent from "./toDoFormComponent";

const screenController = () => {
  const tasksContainer = document.querySelector(".tasks");
  const taskForm = document.querySelector(".task-form");

  const generateTaskContainer = (task) => {
    const taskContainer = toDoComponent(
      task.title,
      task.dueDate,
      task.priority,
      task.id
    );
    tasksContainer.appendChild(taskContainer);
  };

  const renderTask = (task) => {
    generateTaskContainer(task);
  };

  const renderAllTasks = () => {
    const allTasks = Projects.getAllTasks();
    allTasks.forEach((taskArray) => {
      generateTaskContainer(taskArray[0]);
    });
  };

  const removeTask = (e) => {
    const parentContainer = e.target.closest(".task");
    const tasksId = parentContainer.getAttribute("data-id");
    const currentProject = Projects.getTasksProject(tasksId);
    parentContainer.remove();
    currentProject.removeTask(tasksId);
    console.log(Projects.list[0].tasks);
  };

  const generateNewTask = (e) => {
    e.preventDefault();

    const newTask = ToDo(
      taskForm.taskTitle.value,
      taskForm.dueDate.value,
      taskForm.priority.value
    );
    renderTask(newTask);
    taskForm.reset();
  };

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

  window.addEventListener("load", renderAllTasks);
};

export default screenController;

import Projects from "./projects";
import Project from "./project";
import ToDo from "./toDo";

function loadLocalData() {
  if (isLocalStorageAvailable()) {
    getLocalData();
  }
}

function updateLocalData() {
  if (isLocalStorageAvailable()) {
    localStorage.setItem("projects", JSON.stringify(Projects.list));
  }
}

function getLocalData() {
  const localData = JSON.parse(localStorage.getItem("projects"));
  if (localData) {
    // restore project and task functions from local data
    const restoredProjects = [];
    localData.forEach((project) => {
      const currentProject = Project(project.title);
      const currentProjectTasks = project.tasks;
      currentProjectTasks.forEach((task) => {
        const currentTask = ToDo(
          task.title,
          task.dueDate,
          task.priority,
          task.status,
          task.id
        );
        currentProject.addTask(currentTask);
      });
      restoredProjects.push(currentProject);
    });
    Projects.projectsList = restoredProjects;
    return;
  }
  // populate local storage if its empty
  localStorage.setItem("projects", JSON.stringify(Projects.list));
}

function isLocalStorageAvailable() {
  const test = "test";
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

export { loadLocalData, updateLocalData };

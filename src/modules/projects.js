import Project from "./project";
import ToDo from "./toDo";

const inbox = Project("Inbox"); // default project
const localDataSupport = ToDo(
  "Add local storage support",
  new Date("2023-03-25"),
  "high",
  "completed"
);
const statsTask = ToDo("Add stats update", new Date(), "high");
inbox.addTask(statsTask);
inbox.addTask(localDataSupport);
export default class Projects {
  static #projectsList = [inbox];

  static addProject(project) {
    const newProject = Project(project);
    this.#projectsList.push(newProject);
  }

  static removeProject(project) {
    const projectIndex = this.#getProjectsIndex(project);
    this.#projectsList.splice(projectIndex, 1);
  }

  static getProject(project) {
    return this.#projectsList.find((element) => element.title === project);
  }

  static getTasksProject(taskId) {
    return this.#projectsList.find((project) =>
      project.tasks.find((task) => task.id === taskId)
    );
  }

  static checkForDuplicateProjects(newProjectTitle) {
    return this.#projectsList.some(
      (project) => project.title.toLowerCase() === newProjectTitle.toLowerCase()
    );
  }

  static set projectsList(list) {
    this.#projectsList = list;
  }

  static get list() {
    return this.#projectsList;
  }

  static #getProjectsIndex(project) {
    return this.#projectsList.findIndex(
      (element) => element.title.toLowerCase() === project.toLowerCase()
    );
  }
}

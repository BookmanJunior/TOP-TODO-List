import Project from "./project";
import ToDo from "./toDo";

const inbox = Project("Inbox");

// For testing
const work = Project("Work");
const school = Project("School");

const test1 = ToDo("test", new Date("2023-05-16"), "high", "checked");
const test2 = ToDo("test2", new Date(), "medium");
const test3 = ToDo("test3", new Date("2023-04-12"), "low");

inbox.addTask(test1);
work.addTask(test2);
school.addTask(test3);
//

export default class Projects {
  static #projectsList = [inbox, work, school];

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

  static #getProjectsIndex(project) {
    return this.#projectsList.findIndex(
      (element) => element.title.toLowerCase() === project.toLowerCase()
    );
  }

  static get list() {
    return this.#projectsList;
  }
}

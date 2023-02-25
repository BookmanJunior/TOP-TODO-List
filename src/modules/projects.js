import Project from "./project";
import ToDo from "./toDo";

const inbox = Project("Inbox");

// For testing
const work = Project("Work");
const school = Project("School");

const test1 = ToDo("test", new Date("2023-02-16").toLocaleDateString(), "high");
const test2 = ToDo(
  "test2",
  new Date("2023-03-10").toLocaleDateString(),
  "medium"
);
const test3 = ToDo("test3", new Date("2023-04-12").toLocaleDateString(), "low");

inbox.addTask(test1);
work.addTask(test2);
school.addTask(test3);
//

export default class Projects {
  static #projectsList = [inbox, work, school];

  static addProject(project) {
    this.#projectsList.push(project);
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

  static getAllTasks() {
    return this.#projectsList.reduce((allTasks, project) => {
      // skip projects with empty tasks
      if (project.tasks) {
        allTasks.push(project.tasks[0]);
      }
      return allTasks;
    }, []);
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

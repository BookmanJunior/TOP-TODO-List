export default class Projects {
  static #projectsList = [];

  static addProject(project) {
    this.#projectsList.push(project);
  }

  static removeProject(project) {
    const projectIndex = this.#getProjectsIndex(project);
    this.#projectsList.splice(projectIndex, 1);
  }

  static #getProjectsIndex(project) {
    return this.#projectsList.findIndex((element) => element.title === project);
  }

  static get list() {
    return this.#projectsList;
  }
}

import { isSameDay, isSameWeek } from "date-fns";
import Projects from "./projects";

export default class taskController {
  static getAllTasks() {
    return Projects.list.reduce((tasks, project) => {
      tasks.push(project.tasks);
      return tasks.flat();
    }, []);
  }

  static getCompletedTasks() {
    return this.getAllTasks().filter((task) => task.status === "completed");
  }

  static getTodaysTasks() {
    const dateToCompare = new Date();
    const todaysTask = this.getAllTasks().filter((task) =>
      isSameDay(dateToCompare, new Date(task.dueDate))
    );
    return todaysTask;
  }

  static getThisWeeksTasks() {
    const dateToCompare = new Date();
    const thisWeeksTasks = this.getAllTasks().filter((task) =>
      isSameWeek(dateToCompare, new Date(task.dueDate))
    );
    return thisWeeksTasks;
  }
}

import Project from "./project";
import ToDo from "./toDo";

const inbox = Project("Inbox");
const scheduledTasks = Project("Scheduled Tasks");
const completedTasks = Project("Completed");

// For testing
const work = Project("Work");
const school = Project("School");
const gym = Project("Gym");

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

const defaultProjects = Projects();
const userProjects = Projects();

defaultProjects.addProject(inbox);
defaultProjects.addProject(scheduledTasks);
defaultProjects.addProject(completedTasks);
userProjects.addProject(work);
userProjects.addProject(school);
userProjects.addProject(gym);

function Projects() {
  const projectsList = [];

  const addProject = (project) => {
    projectsList.push(project);
  };

  const removeProject = (project) => {
    const projectsIndex = getProjectsIndex(project);
    projectsList.splice(projectsIndex, 1);
  };

  const getProject = (projectsName) =>
    projectsList.find((project) => project.title === projectsName);

  const getTasksProject = (taskId) =>
    projectsList.find((project) =>
      project.tasks.find((task) => task.id === taskId)
    );

  const getAllTasks = () =>
    projectsList.reduce((newArray, project) => {
      // skip empty tasks
      if (project.tasks[0]) {
        newArray.push(project.tasks[0]);
      }
      return newArray;
    }, []);

  function getProjectsIndex(project) {
    return projectsList.findIndex(
      (item) => item.title.toLowerCase() === project.toLowerCase()
    );
  }

  return {
    addProject,
    removeProject,
    getProject,
    getTasksProject,
    getAllTasks,
    get projects() {
      return projectsList;
    },
  };
}

export { Projects, defaultProjects, userProjects };

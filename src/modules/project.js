const Project = (name) => {
  const tasks = [];

  const addTask = (task) => {
    tasks.push(task);
  };

  const removeTask = (task) => {
    const tasksIndex = getTasksIndex(task);
    tasks.splice(tasksIndex, 1);
  };

  const getTask = (task) => tasks.find((element) => element.id === task);

  function getTasksIndex(task) {
    return tasks.findIndex((element) => element.id === task);
  }

  return {
    set title(value) {
      name = value;
    },
    get title() {
      return name;
    },
    get tasks() {
      return tasks;
    },
    addTask,
    removeTask,
    getTask,
  };
};

export default Project;

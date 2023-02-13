const Project = (name) => {
  const tasks = [];

  const addTask = (task) => {
    tasks.push(task);
  };

  const removeTask = (task) => {
    const tasksIndex = getTasksIndex(task);
    tasks.splice(tasksIndex, 1);
  };

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
  };
};

export default Project;

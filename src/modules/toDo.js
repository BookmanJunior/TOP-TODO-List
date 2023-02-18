import generateId from "./idGenerator";

export default function ToDo(
  title,
  dueDate,
  priority,
  status = "unchecked",
  id = generateId()
) {
  const changeTitle = (value) => {
    title = value;
  };

  const changeDueDate = (value) => {
    dueDate = value;
  };

  const changePriority = (value) => {
    priority = value;
  };

  const changeStatus = (value) => {
    if (value === "checked" || value === "unchecked") {
      status = value;
    }
  };

  return {
    changeTitle,
    changeDueDate,
    changePriority,
    changeStatus,
    get title() {
      return title;
    },
    get dueDate() {
      return dueDate;
    },
    get priority() {
      return priority;
    },
    get status() {
      return status;
    },
    get id() {
      return id;
    },
  };
}

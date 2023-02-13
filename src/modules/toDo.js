import generateId from "./idGenerator";

export default function ToDo(
  title,
  description,
  dueDate,
  priority,
  notes,
  status = "unchecked",
  id = generateId()
) {
  const changeTitle = (value) => {
    title = value;
  };

  const changeDescription = (value) => {
    description = value;
  };

  const changeDueDate = (value) => {
    dueDate = value;
  };

  const changePriority = (value) => {
    priority = value;
  };

  const changeNotes = (value) => {
    notes = value;
  };

  const changeStatus = (value) => {
    if (value === "checked" || value === "unchecked") {
      status = value;
    }
  };

  return {
    changeTitle,
    changeDescription,
    changeDueDate,
    changePriority,
    changeNotes,
    changeStatus,
    get title() {
      return title;
    },
    get description() {
      return description;
    },
    get dueDate() {
      return dueDate;
    },
    get priority() {
      return priority;
    },
    get notes() {
      return notes;
    },
    get status() {
      return status;
    },
    get id() {
      return id;
    },
  };
}

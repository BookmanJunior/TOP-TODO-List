import generateId from "./idGenerator";

export default function ToDo(
  title,
  dueDate,
  priority,
  status = "uncompleted",
  id = generateId()
) {
  return {
    get title() {
      return title;
    },
    set title(value) {
      title = value;
    },
    get dueDate() {
      return dueDate;
    },
    set dueDate(value) {
      dueDate = value;
    },
    get priority() {
      return priority;
    },
    set priority(value) {
      priority = value;
    },
    get status() {
      return status;
    },
    set status(value) {
      status = value;
    },
    get id() {
      return id;
    },
  };
}

import format from "date-fns/format";
import { deleteIcon, editIcon } from "./svgGenerator";

export default function generateTaskComponent(task) {
  const taskComponent = toDoComponent(
    task.title,
    task.dueDate,
    task.priority,
    task.status,
    task.id
  );
  return taskComponent;
}
function toDoComponent(title, dueDate, priority, status, id) {
  const task = document.createElement("div");

  task.classList.add("task");
  task.dataset.id = id;
  task.dataset.status = status;
  task.dataset.state = "entrance";

  const leftWrapper = leftSideWrapper(title, priority, status);
  const rightWrapper = rightSideWrapper(dueDate);

  task.append(leftWrapper, rightWrapper);

  return task;
}

function leftSideWrapper(title, priority, status) {
  const wrapper = document.createElement("div");

  wrapper.classList.add("left-wrapper");

  wrapper.append(checkboxElement(priority, status), taskTitleElement(title));

  return wrapper;
}

function rightSideWrapper(dueDate) {
  const wrapper = document.createElement("div");

  wrapper.classList.add("right-wrapper");

  wrapper.append(dueDateElement(dueDate), editBtnElement(), deleteBtnElement());

  return wrapper;
}

function taskTitleElement(title) {
  const taskTitle = document.createElement("span");
  taskTitle.classList.add("task-title");

  taskTitle.textContent = title;

  return taskTitle;
}

function dueDateElement(dueDate = "") {
  const dateComponent = document.createElement("span");

  dateComponent.classList.add("due-date");

  // convert to readable date
  dateComponent.textContent = dueDate
    ? format(new Date(dueDate), "MMM do")
    : "No Due Date";

  return dateComponent;
}

function editBtnElement() {
  const editBtn = document.createElement("button");

  editBtn.classList.add("edit-btn");
  editBtn.setAttribute("aria-label", "edit task button");

  editBtn.appendChild(editIcon());

  return editBtn;
}

function deleteBtnElement() {
  const deleteBtn = document.createElement("button");

  deleteBtn.classList.add("delete-btn");
  deleteBtn.setAttribute("aria-label", "delete task button");

  deleteBtn.appendChild(deleteIcon());

  return deleteBtn;
}

function checkboxElement(priority, status = "uncompleted") {
  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.classList.add("task-checkbox", `${priority}-priority`);
  checkBox.setAttribute("title", priority);

  if (status === "completed") {
    checkBox.checked = true;
  }

  return checkBox;
}

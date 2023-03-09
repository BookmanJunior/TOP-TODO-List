import format from "date-fns/format";

export default function toDoComponent(title, dueDate, priority, status, id) {
  const task = document.createElement("div");

  task.classList.add("task");
  task.dataset.id = id;

  const leftWrapper = leftSideWrapper(title, priority, status);
  const rightWrapper = rightSideWrapper(dueDate);

  task.append(leftWrapper, rightWrapper);

  return task;
}

function leftSideWrapper(title, priority, status) {
  const wrapper = document.createElement("div");

  wrapper.classList.add("left-wrapper");

  wrapper.append(
    checkBoxComponent(priority, status),
    taskTitleComponent(title)
  );

  return wrapper;
}

function rightSideWrapper(dueDate) {
  const wrapper = document.createElement("div");

  wrapper.classList.add("right-wrapper");

  wrapper.append(
    dueDateComponent(dueDate),
    editBtnComponent(),
    deleteBtnComponent()
  );

  return wrapper;
}

function taskTitleComponent(title) {
  const taskTitle = document.createElement("span");
  taskTitle.classList.add("task-title");

  taskTitle.textContent = title;

  return taskTitle;
}

function dueDateComponent(dueDate) {
  const dateComponent = document.createElement("span");

  dateComponent.classList.add("due-date");

  // convert to readable date
  dateComponent.textContent = format(new Date(dueDate), "MMM do");

  return dateComponent;
}

function editBtnComponent() {
  const editBtn = document.createElement("button");

  editBtn.classList.add("edit-btn");

  editBtn.textContent = "Edit";

  return editBtn;
}

function deleteBtnComponent() {
  const deleteBtn = document.createElement("button");

  deleteBtn.classList.add("delete-btn");

  deleteBtn.textContent = "Delete";

  return deleteBtn;
}

function checkBoxComponent(priority, status = "unchecked") {
  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.classList.add("task-checkbox", `${priority}-priority`);
  checkBox.setAttribute("title", priority);

  if (status === "checked") {
    checkBox.checked = true;
  }

  return checkBox;
}

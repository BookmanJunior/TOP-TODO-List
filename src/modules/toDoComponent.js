export default function toDoComponent(title, dueDate, priority, id) {
  const task = document.createElement("div");

  task.classList.add("task");
  task.dataset.id = id;

  const leftWrapper = leftSideWrapper(title, priority);
  const rightWrapper = rightSideWrapper(dueDate);

  task.append(leftWrapper, rightWrapper);

  return task;
}

function leftSideWrapper(title, priority) {
  const wrapper = document.createElement("div");

  wrapper.classList.add("left-wrapper");

  wrapper.append(priorityComponent(priority), taskTitleComponent(title));

  return wrapper;
}

function rightSideWrapper(dueDate) {
  const wrapper = document.createElement("div");

  wrapper.classList.add("right-wrapper");

  wrapper.append(
    dueDateComponent(dueDate),
    editBtnComponent(),
    deleteBtnComponent(),
    checkBoxComponent()
  );

  return wrapper;
}

function priorityComponent(priority) {
  const prioritySpan = document.createElement("span");
  prioritySpan.classList.add(`${priority}-priority`, "priority-btn");
  prioritySpan.setAttribute("title", priority);

  return prioritySpan;
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

  dateComponent.textContent = dueDate;

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

function checkBoxComponent() {
  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";

  checkBox.classList.add("task-checkbox");

  return checkBox;
}

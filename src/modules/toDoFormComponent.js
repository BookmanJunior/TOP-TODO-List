import { addIcon, cancelIcon } from "./svgGenerator";

export default function generateToDoFromComponent(task) {
  const toDoEditForm = toDoFormComponent();
  toDoEditForm.priority.value = task.priority;
  toDoEditForm.newTaskTitle.value = task.title;
  toDoEditForm.dueDate.valueAsDate = new Date(task.dueDate);

  return toDoEditForm;
}

function toDoFormComponent() {
  const taskForm = document.createElement("form");

  taskForm.classList.add("edit-form");

  taskForm.append(leftSideWrapper(), rightSideWrapper());

  return taskForm;
}

function leftSideWrapper() {
  const wrapper = document.createElement("div");
  const priorityBtns = document.createElement("div");
  const highPriorityBtn = priorityBtn("high");
  const midPriorityBtn = priorityBtn("medium");
  const lowPriorityBtn = priorityBtn("low");

  priorityBtns.classList.add("priority-btns");
  wrapper.classList.add("left-wrapper");

  priorityBtns.append(
    highPriorityBtn.radioBtn,
    midPriorityBtn.radioBtn,
    lowPriorityBtn.radioBtn
  );
  wrapper.append(priorityBtns, taskNameField());

  return wrapper;
}

function rightSideWrapper() {
  const wrapper = document.createElement("div");

  wrapper.classList.add("right-wrapper");

  const addBtn = btnFactory("save-btn", addIcon());
  const cancelBtn = btnFactory("cancel-btn", cancelIcon());
  cancelBtn.btn.type = "button";

  wrapper.append(datePicker(), addBtn.btn, cancelBtn.btn);

  return wrapper;
}

function priorityBtn(priority) {
  const radioBtn = document.createElement("input");
  radioBtn.type = "radio";
  radioBtn.name = "priority";
  radioBtn.value = priority;
  radioBtn.classList.add(`${priority}-priority`);
  radioBtn.required = "true";

  return { radioBtn };
}

function taskNameField() {
  const taskNameInput = document.createElement("input");
  taskNameInput.type = "text";
  taskNameInput.name = "task-title";
  taskNameInput.id = "newTaskTitle";
  taskNameInput.placeholder = "What is your next task?";
  taskNameInput.required = "true";

  return taskNameInput;
}

function datePicker() {
  const date = document.createElement("input");
  date.type = "date";
  date.name = "due-date";
  date.id = "dueDate";

  return date;
}

function btnFactory(className, icon) {
  const btn = document.createElement("button");
  btn.appendChild(icon);
  btn.classList.add(className);

  return { btn };
}

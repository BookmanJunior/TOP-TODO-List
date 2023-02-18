export default function toDoFormComponent(elementClass) {
  const taskForm = document.createElement("form");

  taskForm.classList.add(elementClass);

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

  wrapper.append(datePicker(), addBtn());

  return wrapper;
}

function priorityBtn(priority) {
  const radioBtn = document.createElement("input");
  radioBtn.type = "radio";
  radioBtn.name = "priority";
  radioBtn.value = priority;
  radioBtn.required = "true";

  return { radioBtn };
}

function taskNameField() {
  const taskNameInput = document.createElement("input");
  taskNameInput.type = "text";
  taskNameInput.name = "task-title";
  taskNameInput.id = "taskTitle";
  taskNameInput.placeholder = "What is your next task?";
  taskNameInput.required = "true";

  return taskNameInput;
}

function datePicker() {
  const date = document.createElement("input");
  date.type = "date";
  date.name = "due-date";
  date.id = "dueDate";
  date.required = "true";

  return date;
}

function addBtn() {
  const btn = document.createElement("input");
  btn.type = "submit";
  btn.classList.add("add-btn");
  btn.value = "+";

  return btn;
}

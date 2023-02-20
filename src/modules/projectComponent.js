export default function projectComponent(projectTitle) {
  const li = document.createElement("li");
  const title = document.createElement("span");
  const taskCounter = document.createElement("span");
  const btnContainer = document.createElement("div");
  const deleteBtn = document.createElement("button");
  const editBtn = document.createElement("button");

  li.classList.add("project");
  title.classList.add("task-title");
  taskCounter.classList.add("task-counter");
  btnContainer.classList.add("btn-container");

  title.textContent = projectTitle;
  deleteBtn.textContent = "Delete";
  editBtn.textContent = "Edit";

  btnContainer.append(editBtn, deleteBtn);
  li.append(title, taskCounter, btnContainer);

  return li;
}

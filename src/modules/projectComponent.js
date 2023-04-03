import { deleteIcon, editIcon } from "./svgGenerator";

function projectComponent(projectTitle) {
  const li = document.createElement("li");
  const title = document.createElement("span");
  const btnContainer = document.createElement("div");
  const deleteBtn = document.createElement("button");
  const editBtn = document.createElement("button");

  li.classList.add("project");
  title.classList.add("project-title");
  btnContainer.classList.add("btn-container");
  deleteBtn.classList.add("delete-btn");
  editBtn.classList.add("edit-btn");

  title.textContent = projectTitle;

  deleteBtn.appendChild(deleteIcon());
  editBtn.appendChild(editIcon());

  title.dataset.project = projectTitle;

  btnContainer.append(editBtn, deleteBtn);
  li.append(title, btnContainer);

  return li;
}

function editProjectComponent(projectTitle) {
  const container = document.createElement("form");
  const textInput = document.createElement("input");
  const btnContainer = document.createElement("div");
  const saveBtn = document.createElement("input");
  const cancelBtn = document.createElement("input");

  textInput.type = "text";
  saveBtn.type = "submit";
  cancelBtn.type = "button";

  textInput.required = true;

  container.classList.add("edit-project-form");
  textInput.value = projectTitle;
  saveBtn.value = "Save";
  cancelBtn.value = "Cancel";

  textInput.id = "newProjectTitle";
  textInput.classList.add("edit-project-title");
  btnContainer.classList.add("btn-container");
  saveBtn.classList.add("save-project-change");
  cancelBtn.classList.add("cancel-project-change");

  btnContainer.append(saveBtn, cancelBtn);
  container.append(textInput, btnContainer);

  return container;
}

export { projectComponent, editProjectComponent };

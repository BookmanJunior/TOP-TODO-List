import generateId from "./idGenerator";

const projects = [];

const project = (name, id = generateId()) => ({
  set name(value) {
    name = value;
  },
  get name() {
    return name;
  },
  get id() {
    return id;
  },
});

export { projects, project };

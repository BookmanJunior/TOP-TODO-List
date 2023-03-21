function svgGenerator(drawPath, className = "") {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const svgPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );

  svg.classList.add(className);

  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("viewBox", "0 96 960 960");
  svg.setAttribute("width", "24px");
  svg.setAttribute("height", "24px");

  svgPath.setAttribute("d", drawPath);
  svgPath.setAttribute("fill", "#717082");

  svg.appendChild(svgPath);

  return { svg };
}

const deleteIcon = () => {
  const path =
    "M261 936q-24.75 0-42.375-17.625T201 876V306h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438V306ZM367 790h60V391h-60v399Zm166 0h60V391h-60v399ZM261 306v570-570Z";
  const icon = svgGenerator(path, "delete-icon");

  return icon.svg;
};

const editIcon = () => {
  const path =
    "M180 1044q-24 0-42-18t-18-42V384q0-24 18-42t42-18h405l-60 60H180v600h600V636l60-60v408q0 24-18 42t-42 18H180Zm300-360Zm182-352 43 42-285 284v86h85l286-286 42 42-303 304H360V634l302-302Zm171 168L662 332l100-100q17-17 42.311-17T847 233l84 85q17 18 17 42.472T930 402l-97 98Z";
  const icon = svgGenerator(path, "edit-icon");

  return icon.svg;
};

export { svgGenerator, deleteIcon, editIcon };

const addMenu = () => {
  const items = document.querySelectorAll(".itemModule.list a");
  for (const item of items) {
    const partID = item?.getAttribute("href")?.replace(/[^0-9]/g, "");

    const a = document.createElement("a");
    a.innerText = "コメントを表示しながら再生";
    a.setAttribute("href", "sc_d_pc?partId=" + partID);
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener noreferrer");
    a.setAttribute(
      "style",
      "font-family:inherit;font-size:12px;color: rgb(51 51 51); background-color: rgb(255 255 255);height:24px;text-align:center;"
    );
    item.parentElement?.parentElement?.appendChild(a);
  }
};

export default addMenu;

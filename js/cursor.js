// Custom cursor — a small orange diamond that follows the pointer and
// shrinks/turns white over interactive elements.

export function initCursor() {
  const dot = document.createElement("div");
  dot.id = "cursor-dot";
  document.body.appendChild(dot);

  const move = (e) => {
    dot.style.left = e.clientX + "px";
    dot.style.top = e.clientY + "px";
  };
  const over = (e) => {
    if (e.target.closest("a, button, [data-hover]")) dot.classList.add("hovering");
    else dot.classList.remove("hovering");
  };

  document.addEventListener("mousemove", move);
  document.addEventListener("mouseover", over);

  return () => {
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseover", over);
    if (document.body.contains(dot)) document.body.removeChild(dot);
  };
}

export default initCursor;

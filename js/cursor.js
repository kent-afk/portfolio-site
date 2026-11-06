// Custom cursor — a small orange diamond that follows the pointer and
// shrinks/turns white over interactive elements. Movement is batched with
// requestAnimationFrame to avoid layout work on every pointer event.

export function initCursor() {
  if (!window.matchMedia("(pointer: fine)").matches) return () => {};

  const dot = document.createElement("div");
  dot.id = "cursor-dot";
  document.body.appendChild(dot);

  let frame = 0;
  let x = -100;
  let y = -100;

  const move = (e) => {
    x = e.clientX;
    y = e.clientY;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(45deg)`;
      frame = 0;
    });
  };
  const over = (e) => {
    if (e.target.closest("a, button, [data-hover]")) dot.classList.add("hovering");
    else dot.classList.remove("hovering");
  };

  document.addEventListener("pointermove", move, { passive: true });
  document.addEventListener("pointerover", over, { passive: true });

  return () => {
    if (frame) cancelAnimationFrame(frame);
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerover", over);
    if (document.body.contains(dot)) document.body.removeChild(dot);
  };
}

export default initCursor;

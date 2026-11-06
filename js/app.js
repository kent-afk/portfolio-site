import { initCursor } from "./cursor.js";
import { initAudioToggle } from "./audio-toggle.js";
import { initIntro } from "./intro.js";
import { startRouter } from "./router.js";

initCursor();
initAudioToggle();
initIntro();
startRouter(document.getElementById("root"));

// Cache the shell and static assets for faster repeat visits and offline use.
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  // The first install claims this page too; only reload for later updates.
  let hadController = !!navigator.serviceWorker.controller;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").then((registration) => {
      registration.update();
    }).catch(() => {
      /* service workers are optional */
    });
  });

  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController) {
      hadController = true;
      return;
    }
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}

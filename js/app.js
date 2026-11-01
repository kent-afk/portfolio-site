import { initCursor } from "./cursor.js";
import { initAudioToggle } from "./audio-toggle.js";
import { startRouter } from "./router.js";

initCursor();
initAudioToggle();
startRouter(document.getElementById("root"));

import { startAR } from "./ar/startAR";

// Do NOT call initPanelUI() because the UI already exists in scan.html
startAR().catch((err) => {
  console.error(err);
  const fallbackMessage =
    err?.message ||
    (err == null
      ? "Camera permission was denied or the camera is unavailable on this device."
      : String(err));
  const title = document.getElementById("cardTitle");
  const facts = document.getElementById("cardFacts");
  const status = document.getElementById("cardStatus");
  if (title) title.textContent = "AR failed to start";
  if (facts) facts.textContent = fallbackMessage;
  if (status) status.textContent = "Error";
});

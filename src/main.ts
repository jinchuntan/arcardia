import { startAR } from "./ar/startAR";
import { initHome } from "./ui/home";

initHome(() => {
  startAR().catch((err) => {
    console.error(err);

    const title = document.getElementById("cardTitle");
    const facts = document.getElementById("cardFacts");
    const status = document.getElementById("cardStatus");

    if (title) title.textContent = "AR failed to start";
    if (facts) facts.textContent = err?.message || String(err);
    if (status) status.textContent = "Error";
  });
});

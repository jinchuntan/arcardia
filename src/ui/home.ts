export function initHome(onStart: () => void) {
    const home = document.getElementById("home");
    const arUI = document.getElementById("ar-ui");
    const btn = document.getElementById("btnStart") as HTMLButtonElement | null;
  
    if (!home || !arUI || !btn) return;
  
    btn.addEventListener("click", () => {
      // Hide home, show AR UI
      home.style.display = "none";
      arUI.style.display = "block";
  
      onStart();
    });
  }
  
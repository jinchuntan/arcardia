type CardDef = {
    id: string;
    name: string;
    category?: string;
    facts?: string[];
  };
  
  let currentCard: CardDef | null = null;
  let currentFacts: string[] = [];
  let factIndex = 0;
  
  function el<T extends HTMLElement>(id: string): T | null {
    return document.getElementById(id) as T | null;
  }
  
  function setText(id: string, text: string) {
    const node = el<HTMLElement>(id);
    if (node) node.textContent = text;
  }
  
  function setDisabled(id: string, disabled: boolean) {
    const btn = el<HTMLButtonElement>(id);
    if (btn) btn.disabled = disabled;
  }
  
  function renderFact() {
    if (!currentFacts.length) {
      setText("cardFacts", "No facts for this card yet.");
      return;
    }
    setText("cardFacts", currentFacts[factIndex]);
  }
  
  export function initPanelUI() {
    // Buttons are clickable (pointer-events enabled on panel)
    const btnPrev = el<HTMLButtonElement>("btnPrev");
    const btnNext = el<HTMLButtonElement>("btnNext");
    const btnCollect = el<HTMLButtonElement>("btnCollect");
  
    btnPrev?.addEventListener("click", () => {
      if (!currentFacts.length) return;
      factIndex = (factIndex - 1 + currentFacts.length) % currentFacts.length;
      renderFact();
    });
  
    btnNext?.addEventListener("click", () => {
      if (!currentFacts.length) return;
      factIndex = (factIndex + 1) % currentFacts.length;
      renderFact();
    });
  
    btnCollect?.addEventListener("click", () => {
      if (!currentCard) return;
  
      const key = "arcardia_collected";
      const raw = localStorage.getItem(key);
      const set = new Set<string>(raw ? JSON.parse(raw) : []);
      set.add(currentCard.id);
      localStorage.setItem(key, JSON.stringify(Array.from(set)));
  
      setText("cardStatus", `Collected ✅ (${set.size} total)`);
    });
  
    // Start state
    clearPanel();
  }
  
  export function showCardInPanel(card: CardDef) {
    currentCard = card;
  
    setText("cardTitle", card.name);
    setText("cardCategory", card.category ?? "");
    setText("cardStatus", "Target detected ✅");
  
    currentFacts = card.facts ?? [];
    factIndex = 0;
    renderFact();
  
    const hasFacts = currentFacts.length > 1;
    setDisabled("btnPrev", !hasFacts);
    setDisabled("btnNext", !hasFacts);
    setDisabled("btnCollect", false);
  }
  
  export function clearPanel() {
    currentCard = null;
    currentFacts = [];
    factIndex = 0;
  
    setText("cardTitle", "Point at your card…");
    setText("cardCategory", "");
    setText("cardFacts", "Waiting for target…");
    setText("cardStatus", "Waiting for target…");
  
    setDisabled("btnPrev", true);
    setDisabled("btnNext", true);
    setDisabled("btnCollect", true);
  }
  
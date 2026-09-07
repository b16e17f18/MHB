class DialogueManager {
  constructor() {
    this.npcs = new Map();
    this.dialogues = new Map();
    this.dialoguesById = new Map();
    this.elements = {};
    this.active = false;
    this.resolveClose = null;
    this.previousFocus = null;
    this.currentNpcId = "";
    this.currentDialogueId = "";
    this.startDialogueId = "";
    this.visitedDialogueIds = new Set();
    this.onComplete = null;
    this.boundKeydown = (event) => this.handleKeydown(event);
  }

  mount(elements) {
    this.elements = elements;
    this.elements.overlay?.addEventListener("click", () => this.advanceOrClose());
    document.addEventListener("keydown", this.boundKeydown, true);
  }

  async load(npcText) {
    this.npcs.clear();
    this.dialogues.clear();
    this.dialoguesById.clear();

    const npcs = rowsFromCsv(npcText)
      .map(normalizeNpc)
      .filter((npc) => npc.npc_id);

    for (const npc of npcs) {
      this.npcs.set(npc.npc_id, npc);
    }

    const dialogueResults = await Promise.allSettled(
      npcs.map(async (npc) => ({
        npc,
        text: await loadOptionalCsvText(
          `dialogue:${npc.npc_id}`,
          `${DIALOGUE_DATA_DIRECTORY}/${npc.npc_id}_dialogue.csv`,
        ),
      })),
    );

    for (const result of dialogueResults) {
      if (result.status !== "fulfilled" || !result.value.text) continue;
      const { npc, text } = result.value;
      for (const dialogue of rowsFromCsv(text).map((row) => normalizeDialogue(row, npc.npc_id))) {
        if (dialogue.dialogue_id) {
          if (this.dialoguesById.has(dialogue.dialogue_id)) {
            console.warn("[Dialogue] duplicate dialogue_id skipped", {
              dialogueId: dialogue.dialogue_id,
              npcId: dialogue.npc_id,
            });
            continue;
          }
          this.dialogues.set(this.dialogueKey(dialogue.npc_id, dialogue.dialogue_id), dialogue);
          this.dialoguesById.set(dialogue.dialogue_id, dialogue);
        }
      }
    }
  }

  dialogueKey(npcId, dialogueId) {
    return `${safeText(npcId)}:${safeText(dialogueId)}`;
  }

  show(npcId, dialogueId, options = {}) {
    const normalizedNpcId = safeText(npcId);
    const normalizedDialogueId = safeText(dialogueId);
    const dialogue =
      this.dialoguesById.get(normalizedDialogueId) ||
      this.dialogues.get(this.dialogueKey(normalizedNpcId, normalizedDialogueId));
    const npc = this.npcs.get(dialogue?.npc_id || normalizedNpcId);
    if (!npc || !dialogue || !this.elements.overlay) {
      return Promise.resolve(false);
    }

    this.close({ silent: true });
    this.active = true;
    this.previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    this.currentNpcId = dialogue.npc_id;
    this.currentDialogueId = dialogue.dialogue_id;
    this.startDialogueId = dialogue.dialogue_id;
    this.visitedDialogueIds = new Set([dialogue.dialogue_id]);
    this.onComplete = typeof options.onComplete === "function" ? options.onComplete : null;

    this.renderDialogue(dialogue);
    this.elements.overlay.classList.remove("is-hidden");
    this.elements.overlay.focus({ preventScroll: true });

    return new Promise((resolve) => {
      this.resolveClose = resolve;
    });
  }

  renderDialogue(dialogue) {
    const npc = this.npcs.get(dialogue?.npc_id);
    if (!npc || !dialogue) return false;

    if (this.elements.portrait) {
      this.elements.portrait.src = npcImagePath(npc.image);
      this.elements.portrait.alt = npc.name || npc.npc_id;
    }
    if (this.elements.text) {
      this.elements.text.textContent = dialogue.text;
    }
    if (this.elements.windowFrame) {
      this.elements.windowFrame.src = DIALOGUE_WINDOW_IMAGE;
    }
    return true;
  }

  advanceOrClose() {
    if (!this.active) return;
    const current = this.dialoguesById.get(this.currentDialogueId);
    const nextId = safeText(current?.next_id);
    if (!nextId) {
      this.close({ completed: true });
      return;
    }
    if (this.visitedDialogueIds.has(nextId)) {
      console.warn("[Dialogue] circular next_id detected", {
        dialogueId: this.currentDialogueId,
        nextId,
      });
      this.close();
      return;
    }

    const nextDialogue = this.dialoguesById.get(nextId);
    if (nextDialogue) {
      this.visitedDialogueIds.add(nextId);
      this.currentNpcId = nextDialogue.npc_id;
      this.currentDialogueId = nextId;
      this.renderDialogue(nextDialogue);
      return;
    }
    console.warn("[Dialogue] next_id not found", {
      dialogueId: this.currentDialogueId,
      nextId,
    });
    this.close();
  }

  close({ silent = false, completed = false } = {}) {
    if (!this.active && !this.resolveClose) return;
    const startDialogueId = this.startDialogueId;
    const onComplete = this.onComplete;
    this.active = false;
    this.elements.overlay?.classList.add("is-hidden");
    if (this.elements.text) {
      this.elements.text.textContent = "";
    }
    if (this.elements.portrait) {
      this.elements.portrait.removeAttribute("src");
      this.elements.portrait.alt = "";
    }

    const resolve = this.resolveClose;
    this.resolveClose = null;
    this.currentNpcId = "";
    this.currentDialogueId = "";
    this.startDialogueId = "";
    this.visitedDialogueIds = new Set();
    this.onComplete = null;
    if (completed && startDialogueId) {
      onComplete?.(startDialogueId);
    }
    resolve?.(!silent);
    if (!silent) {
      this.previousFocus?.focus?.({ preventScroll: true });
    }
  }

  getDialogue(dialogueId) {
    return this.dialoguesById.get(safeText(dialogueId)) ?? null;
  }

  conditionalStartDialogues(npcId) {
    const id = safeText(npcId);
    if (!id) return [];
    return [...this.dialoguesById.values()].filter((dialogue) =>
      dialogue.npc_id === id && Boolean(dialogue.condition_type),
    );
  }

  handleKeydown(event) {
    if (!this.active) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    if (event.key === "Enter") {
      this.advanceOrClose();
    }
  }
}

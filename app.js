const DATA_PATHS = {
  characters: "./data/character.csv",
  skills: "./data/skill.csv",
  powerRules: "./data/power_rule.csv",
  battleEffects: "./data/battle_effect.csv",
  effects: "./data/effect.csv",
  hitTypes: "./data/hit_type.csv",
  animations: "./data/animation.csv",
  bgm: "./data/bgm.csv",
  rankBattles: "./data/rank_battle.csv",
  enemyParties: "./data/enemy_party.csv",
  shopItems: "./data/shop_item.csv",
  encyclopediaBooks: "./data/encyclopedia_book.csv",
  equipment: "./data/equipment.csv",
  species: "./data/species.csv",
  npcs: "./data/dialogue/npc.csv",
};

const STORY_MAP_PATHS = [
  "./assets/Map_data/Map002.mps",
  "./assets/Map_data/Map002_1.mps",
  "./assets/Map_data/Map002_2.mps",
  "./assets/Map_data/Map002_3.mps",
  "./assets/Map_data/Map002_4.mps",
];
const STORY_PLAYER_SHEET = "./assets/character_chip/ミヤサコ.png";
const STORY_FRAME_WIDTH = 20;
const STORY_FRAME_HEIGHT = 28;
const STORY_SHEET_COLUMNS = 6;
const STORY_TILE_SIZE = 36;
const STORY_INITIAL_PLAYER = { x: 7, y: 13 };
const STORY_DIRECTION_ROWS = {
  down: 0,
  left: 1,
  right: 2,
  up: 3,
};
const STORY_RANK_BATTLE_FALLBACKS = {
  battle_f_1: {
    name: "道外れたハンター",
    enemyCharacterIds: ["character_002", "character_003"],
  },
};

const STORY_RANK_ORDER = ["f", "F", "e", "E", "d", "D", "c", "C", "b", "B", "a", "A", "s", "S", "SS"];
const STORY_RANK_BUTTON_AREAS = {
  f: { left: 8.8, top: 9.7, width: 21, height: 17 },
  F: { left: 8.8, top: 27.4, width: 21, height: 10.5 },
  e: { left: 31, top: 5.8, width: 19.2, height: 13 },
  E: { left: 31, top: 23, width: 19.2, height: 12.5 },
  d: { left: 51, top: 8, width: 19.3, height: 13 },
  D: { left: 51, top: 23, width: 19.3, height: 12.5 },
  c: { left: 76.2, top: 6, width: 19.5, height: 29 },
  C: { left: 73.5, top: 36.2, width: 19.3, height: 28.5 },
  b: { left: 3.8, top: 73.6, width: 20.8, height: 20.2 },
  B: { left: 25, top: 70.8, width: 18, height: 19 },
  a: { left: 48.5, top: 39.8, width: 19.4, height: 28.2 },
  A: { left: 27.7, top: 40, width: 19.4, height: 28 },
  s: { left: 44.2, top: 70.6, width: 29.2, height: 11.3 },
  S: { left: 44, top: 82.2, width: 29.2, height: 11.8 },
  SS: { left: 74.6, top: 66.5, width: 20.8, height: 27.5 },
};
const STORY_RANK_ORDER_INDEX = new Map(STORY_RANK_ORDER.map((rank, index) => [rank, index]));
const INITIAL_STORY_RANK_BATTLE_IDS = new Set(["battle_f_1", "arena_g_1"]);
const ARENA_STAGE_AREAS = [
  { id: "G1", left: 3.1, top: 15, width: 18.5, height: 31.8 },
  { id: "X1", left: 1.2, top: 48.2, width: 16.4, height: 26 },
  { id: "G2", left: 25.5, top: 34.4, width: 16.7, height: 30.1 },
  { id: "G3", left: 19.7, top: 65.9, width: 17.5, height: 30.3 },
  { id: "G4", left: 45.7, top: 4.9, width: 18, height: 28.5 },
  { id: "G5", left: 70.8, top: 3.3, width: 17, height: 28 },
  { id: "G6", left: 58.3, top: 33.6, width: 16.8, height: 27.7 },
  { id: "G7", left: 82.1, top: 31.4, width: 17.7, height: 27.2 },
  { id: "M1", left: 40.5, top: 66.1, width: 19.8, height: 33.4 },
  { id: "M2", left: 75.9, top: 59.9, width: 22.2, height: 37.4 },
];
const ARENA_BATTLE_MAP = {
  G1: "arena_g_1",
  X1: "arena_x_1",
  G2: "arena_g_2",
  G3: "arena_g_3",
  G4: "arena_g_4",
  G5: "arena_g_5",
  G6: "arena_g_6",
  G7: "arena_g_7",
  M1: "arena_m_1",
  M2: "arena_m_2",
};
const ARENA_BATTLE_ENTRANCE_BY_ID = Object.fromEntries(
  Object.entries(ARENA_BATTLE_MAP).map(([entranceId, rankBattleId]) => [rankBattleId, entranceId]),
);
const ARENA_UNAVAILABLE_MESSAGE = "\u307e\u3060\u5bfe\u6226\u3067\u304d\u306a\u3044\u3088\u3046\u3060";
const TIME_OF_DAY_SEQUENCE = ["morning", "afternoon", "night"];
const DEFAULT_TIME_OF_DAY = "morning";
const TIME_OF_DAY_SET = new Set(TIME_OF_DAY_SEQUENCE);
const STORY_TRAVEL_BACKGROUND_PATHS = {
  travel: {
    morning: "./assets/移動画面.png",
    afternoon: "./assets/移動画面（夕方）.png",
    night: "./assets/移動画面（夜）.png",
  },
  travel2: {
    morning: "./assets/移動画面2.png",
    afternoon: "./assets/移動画面2（夕方）.png",
    night: "./assets/移動画面2（夜）.png",
  },
};
const STORY_ISLAND_BGM_IDS = {
  morning: "island_morning",
  afternoon: "island_afternoon",
  night: "island_night",
};

const MANUAL_SAVE_STORAGE_KEYS = ["mhb_save_1", "mhb_save_2", "mhb_save_3"];
const BGM_VOLUME = 0.65;
const BATTLE_BGM_AUDIBLE_DELAY_MS = 2000;
const INITIAL_MONEY = 1500;
const BUSINESS_SHOP_ID = "business";
const BUSINESS2_SHOP_ID = "business2";
const DIALOGUE_DATA_DIRECTORY = "./data/dialogue";
const NPC_IMAGE_DIRECTORY = "./assets/npc_image";
const DIALOGUE_WINDOW_IMAGE = "./assets/dialogue_window.png";
const DIALOGUE_CONDITION_ALWAYS = "always";
const DIALOGUE_CONDITION_BATTLE_AVAILABLE = "battle_available";
const DIALOGUE_CONDITION_BATTLE_CLEARED = "battle_cleared";
const STORY_LOCATION_TAP_LABEL_MS = 700;
const NPC_DEFAULT_DIALOGUE_IDS = {
  guide: "guide_welcome1",
  merchant: "merchant_welcome",
  blacksmith: "blacksmith_welcome",
  battlemaster: "battlemaster_welcome",
  chief: "chief_welcome",
};
const SHOP_ITEM_FILTER_BOOK = "book";
const SHOP_ITEM_FILTER_MONSTER = "monster";
const SHOP_ITEM_FILTER_EQUIPMENT = "equipment";
const INITIAL_PLAYER_CHARACTER_IDS = ["character_001", "character_004"];
const INITIAL_PARTY_VERSION = 1;
const EQUIPMENT_TYPE_ACCESSORY = "accessory";
const EQUIPMENT_ITEM_TYPES = new Set(["equip", "equipment"]);
const SPECIES_LABELS = {
  all: "全員",
  bird_wyvern: "鳥竜種",
  brute_wyvern: "獣竜種",
  elder_dragon: "古龍種",
  fanged_beast: "牙獣種",
  fanged_wyvern: "牙竜種",
  flying_wyvern: "飛竜種",
  piscine_wyvern: "魚竜種",
};

const ELEMENT_LABELS = {
  none: "無",
  fire: "火",
  water: "水",
  thunder: "雷",
  ice: "氷",
  dragon: "龍",
};

const ELEMENT_TYPES = ["fire", "water", "thunder", "ice", "dragon"];
const TEMP_WEAK_MOD_MIN = -50;
const TEMP_WEAK_MOD_MAX = 50;
const DISAPPEAR_POSITION_EFFECT_ID = "ghost_phase";
const DEFAULT_POSITION_ANIMATIONS = {
  fly: {
    position_class: "position-fly",
    animation_name: "",
    animation_duration_ms: 0,
    surface_color: "",
  },
  underground: {
    position_class: "position-underground",
    animation_name: "",
    animation_duration_ms: 0,
    surface_color: "",
  },
  underwater: {
    position_class: "position-underwater",
    animation_name: "",
    animation_duration_ms: 0,
    surface_color: "",
  },
  ghost_phase: {
    position_class: "position-ghost_phase",
    animation_name: "mhbGhostFade",
    animation_duration_ms: 520,
    surface_color: "",
  },
};
let POSITION_EFFECT_IDS = Object.keys(DEFAULT_POSITION_ANIMATIONS);
const ACTION_RETURN_POSITION_IDS = new Set(["underground"]);
let TWO_TURN_BATTLE_EFFECT_IDS = new Set([
  "fly",
  "underground",
  "underwater",
  "ghost_phase",
  "charge_attack",
]);
const DELAYED_ATTACK_SETUP_ONLY_EFFECT_IDS = new Set([
  "future_blast",
  "future_blast2",
  "future_blast3",
  "future_blast4",
  "future_blast5",
  "future_blast6",
  "future_blast7",
  "future_blast8",
  "future_blast9",
]);
const STUN_BATTLE_EFFECT_ID = "stun";
const DELAYED_HEAL_BATTLE_EFFECT_GROUP = "delayed_heal";
const SWITCH_PERSISTENT_BATTLE_EFFECT_IDS = new Set();
const BATTLE_MESSAGE_DURATION = 1400;
const BATTLE_TEXT_SPEED_SCALE = 2;
const ANIMATION_FRAME_WIDTH = 250;
const ANIMATION_FRAME_HEIGHT = 43;
const BATTLE_ANIMATION_SCALE = 1.52;
const TEAM_SLOT_LIMIT = 5;
const RANK_BATTLE_TURN_LIMIT = 20;
const RANK_BATTLE_TURN_LIMIT_EXCLUDED_IDS = new Set(["battle_ss_2", "arena_m_2"]);
const START_ENERGY = 1;
const BATTLE_SAVE_ENERGY_ENABLED = false;
const LAB_MEMBER_DISPLAY_LIMIT = TEAM_SLOT_LIMIT;
const ENEMY_AI_CONFIG = {
  DEBUG: false,
  AVERAGE_DAMAGE_VARIANCE: 0.975,
  WAITING_PENALTY: 25,
  MIN_FUTURE_GAIN: 20,
  ENERGY_COST_PENALTY: 3,
  EMPTY_ENERGY_PENALTY: 8,
  LOW_HP_DAMAGE_RATIO: 0.7,
  SAVE_BLOCK_PENALTY: 10000,
  NEAR_BEST_RANDOM_RANGE: 0.1,
  NEAR_BEST_MIN_RANGE: 5,
  CANDIDATE_MIN_WEIGHT: 1,
  CANDIDATE_WEIGHT_OFFSET: 1,
  KO_BONUS: 1000,
  LEGACY_FALLBACK_SCORE_RATIO: 0.94,
};
const ENEMY_AI_TYPE_CONFIGS = {
  balanced: {},
  aggressive: {
    WAITING_PENALTY: 40,
  },
  patient: {
    WAITING_PENALTY: 10,
  },
};
const STAT_GRAPH_MAX = {
  hp: 999,
  phy_atk: 500,
  phy_def: 500,
  sp_atk: 500,
  sp_def: 500,
  speed: 500,
  regen_value: 105,
};

const STAT_LABELS = {
  hp: "体力",
  phy_atk: "物理攻撃",
  phy_def: "物理防御",
  sp_atk: "特殊攻撃",
  sp_def: "特殊防御",
  speed: "敏捷",
  regen_value: "回復力",
};

const STAT_MOD_KEYS = ["phy_atk", "phy_def", "sp_atk", "sp_def", "speed", "regen_value"];
const STAT_STAGE_MOD_KEYS = ["phy_atk", "phy_def", "sp_atk", "sp_def", "speed"];
const STAT_STAGE_MOD_KEY_SET = new Set(STAT_STAGE_MOD_KEYS);

const GENERATED_SKILLS = {
  basic_strike: {
    skill_id: "basic_strike",
    name: "体当たり",
    category: "attack",
    power: 60,
    element: "none",
    attack_type: "physical",
    hit_type: "normal",
    effect1: "none",
    effect_target1: "enemy",
    effect_chance1: 0,
    effect2: "none",
    effect_target2: "enemy",
    effect_chance2: 0,
    effect3: "none",
    effect_target3: "enemy",
    effect_chance3: 0,
    battle_effect1: "none",
    battle_effect_chance1: 0,
    battle_effect2: "none",
    battle_effect_chance2: 0,
    target: "enemy",
    priority: 0,
    cost: 0,
    text: "",
    generated: true,
  },
  fire_strike: null,
  water_strike: null,
  thunder_strike: null,
  ice_strike: null,
  dragon_strike: null,
};

for (const element of ELEMENT_TYPES) {
  GENERATED_SKILLS[`${element}_strike`] = {
    ...GENERATED_SKILLS.basic_strike,
    skill_id: `${element}_strike`,
    name: `${ELEMENT_LABELS[element]}の一撃`,
    power: 78,
    element,
    attack_type: "special",
    cost: 1,
  };
}

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

const dialogueManager = new DialogueManager();

const state = {
  characters: [],
  characterMap: new Map(),
  skills: new Map(),
  powerRules: new Map(),
  effects: new Map(),
  battleEffects: new Map(),
  hitTypes: new Map(),
  animations: new Map(),
  animationDefinitions: new Map(),
  bgmMap: new Map(),
  rankBattles: new Map(),
  enemyParties: new Map(),
  shopItems: [],
  encyclopediaBooks: new Map(),
  equipment: [],
  equipmentMap: new Map(),
  speciesMap: new Map(),
  saveData: createSaveData(),
  shop: createShopState(),
  myHouse: {
    selectedBookId: null,
    selectedBookCharacterId: null,
    selectedOwnedId: null,
    accessoryEditorOwnedId: null,
    detailMode: "owned",
    activeSection: null,
  },
  myParty: {
    selectedOwnedId: null,
  },
  labInterior: {
    selectedMemberSlotIndex: null,
    selectedMemberOwnedId: null,
    selectedLabOwnedId: null,
    selectedLabOwnedIds: [],
    detailOwnedId: null,
    message: "",
    messageIsError: false,
  },
  hasUnsavedChanges: false,
  selectedIds: [],
  selectedEnemyIds: [],
  setupSide: "player",
  playerTeam: [],
  enemyTeam: [],
  playerActiveIndex: 0,
  enemyActiveIndex: 0,
  commandMode: "fight",
  battleInspectSide: "enemy",
  log: [],
  battleMessage: {
    text: "",
    visible: false,
  },
  battleAnimation: null,
  turn: 1,
  busy: false,
  gameOver: false,
  pendingSwitchSide: null,
  battleWinner: null,
  exchange: createExchangeState(),
  fieldEffects: createFieldEffectsState(),
  nextFieldEffectId: 1,
  detailCharacterId: null,
  dex: {
    open: false,
    characterId: null,
  },
  story: {
    active: false,
    timeOfDay: DEFAULT_TIME_OF_DAY,
    map: null,
    player: {
      ...STORY_INITIAL_PLAYER,
      direction: "down",
      frame: 0,
    },
    walkTimer: null,
    walkToken: 0,
    pendingRankBattleId: null,
    currentRankBattleId: null,
    currentArenaBattleId: null,
    lastDefeatedEnemyId: null,
    selectedArenaEntranceId: null,
    selectedArenaBattleId: null,
    clearedRankBattleIds: new Set(),
    disabledRankBattleIds: new Set(),
  },
};

const els = {};
const storyLocationLabelTimers = new WeakMap();
let battleMessageTimer = null;
let gameOverReturnTimer = null;
let gameDataPromise = null;
let saveStatusTimer = null;
let shopMessageTimer = null;
const animationSheetMetaCache = new Map();
const transparentAnimationCache = new Map();
const bgmRuntime = {
  audio: null,
  currentBgmId: "",
  pendingBgmId: "",
  volumeTimer: null,
};

function createExchangeState() {
  return {
    playerIndices: [],
    enemyIndex: null,
    completed: false,
    cancelled: false,
    storyDecision: null,
    storyLabCapture: null,
    storyLabCaptureCompleted: false,
  };
}

function createFieldEffectsState() {
  return {
    player: [],
    enemy: [],
  };
}

function getBgmById(bgmId) {
  return state.bgmMap.get(safeText(bgmId)) ?? null;
}

function playBgm(bgmId, options = {}) {
  const id = safeText(bgmId);
  if (!id) return false;
  const audibleDelayMs = normalizeBgmAudibleDelayMs(options?.audibleDelayMs);

  const bgm = getBgmById(id);
  if (!bgm) {
    console.warn("[BGM] bgm_id not found", { bgmId: id });
    return false;
  }

  if (!bgm.bgm_path) {
    if (bgmRuntime.audio) stopBgm();
    console.warn("[BGM] bgm_path is empty", { bgmId: id });
    return false;
  }

  if (
    bgmRuntime.currentBgmId === id &&
    bgmRuntime.audio &&
    (bgmRuntime.pendingBgmId === id || !bgmRuntime.audio.paused)
  ) {
    return true;
  }

  if (bgmRuntime.audio) stopBgm();
  else clearBgmVolumeTimer();

  const audio = createBgmAudio(bgm.bgm_path, id);
  if (!audio) return false;
  if (audibleDelayMs > 0) {
    audio.volume = 0;
  }

  bgmRuntime.audio = audio;
  bgmRuntime.currentBgmId = id;
  bgmRuntime.pendingBgmId = id;

  let playResult = null;
  try {
    playResult = audio.play();
  } catch (error) {
    handleBgmPlayRejected(audio, id, error);
    return false;
  }

  if (playResult && typeof playResult.then === "function") {
    playResult
      .then(() => {
        handleBgmPlayStarted(audio, id, audibleDelayMs);
      })
      .catch((error) => {
        handleBgmPlayRejected(audio, id, error);
      });
  } else {
    handleBgmPlayStarted(audio, id, audibleDelayMs);
  }

  return true;
}

function stopBgm() {
  clearBgmVolumeTimer();
  const audio = bgmRuntime.audio;
  bgmRuntime.audio = null;
  bgmRuntime.currentBgmId = "";
  bgmRuntime.pendingBgmId = "";

  if (!audio) return;

  try {
    audio.pause();
    audio.currentTime = 0;
  } catch (error) {
    console.warn("[BGM] stop failed", error);
  }
}

function normalizeBgmAudibleDelayMs(value) {
  const delayMs = Number(value);
  return Number.isFinite(delayMs) ? Math.max(0, Math.floor(delayMs)) : 0;
}

function handleBgmPlayStarted(audio, bgmId, audibleDelayMs) {
  if (bgmRuntime.audio !== audio || bgmRuntime.currentBgmId !== bgmId) return;

  bgmRuntime.pendingBgmId = "";
  if (audibleDelayMs > 0) {
    scheduleBgmVolumeRestore(audio, bgmId, audibleDelayMs);
  }
}

function scheduleBgmVolumeRestore(audio, bgmId, delayMs) {
  clearBgmVolumeTimer();
  const volumeTimer = window.setTimeout(() => {
    if (bgmRuntime.volumeTimer === volumeTimer) {
      bgmRuntime.volumeTimer = null;
    }
    if (bgmRuntime.audio === audio && bgmRuntime.currentBgmId === bgmId) {
      audio.volume = BGM_VOLUME;
    }
  }, delayMs);
  bgmRuntime.volumeTimer = volumeTimer;
}

function clearBgmVolumeTimer() {
  if (bgmRuntime.volumeTimer == null) return;
  window.clearTimeout(bgmRuntime.volumeTimer);
  bgmRuntime.volumeTimer = null;
}

function createBgmAudio(path, bgmId) {
  if (typeof Audio !== "function") {
    console.warn("[BGM] Audio API is unavailable", { bgmId });
    return null;
  }

  try {
    const audio = new Audio(path);
    audio.loop = true;
    audio.volume = BGM_VOLUME;
    return audio;
  } catch (error) {
    console.warn("[BGM] Audio creation failed", { bgmId, error });
    return null;
  }
}

function handleBgmPlayRejected(audio, bgmId, error) {
  if (bgmRuntime.audio === audio && bgmRuntime.currentBgmId === bgmId) {
    clearBgmVolumeTimer();
    bgmRuntime.audio = null;
    bgmRuntime.currentBgmId = "";
    bgmRuntime.pendingBgmId = "";
  }
  console.warn("[BGM] playback was blocked or failed", { bgmId, error });
}

function createSaveData() {
  return {
    money: INITIAL_MONEY,
    ownedBooks: new Set(),
    ownedMonsters: [],
    partyOwnedIds: [],
    ownedEquipment: new Map(),
    shopStock: new Map(),
    purchasedShopEntries: new Set(),
    seenDialogueIds: new Set(),
    nextOwnedMonsterNumber: 1,
    initialMoneyVersion: 1,
    initialPartyVersion: INITIAL_PARTY_VERSION,
  };
}

function createShopState() {
  return {
    open: false,
    currentShopId: BUSINESS_SHOP_ID,
    itemFilter: "",
    confirmEntryId: null,
    exchangeEntryId: null,
    offerOwnedIds: [],
  };
}

document.addEventListener("DOMContentLoaded", () => {
  Object.assign(els, {
    titleView: document.querySelector("#titleView"),
    storyView: document.querySelector("#storyView"),
    setupView: document.querySelector("#setupView"),
    battleView: document.querySelector("#battleView"),
    storyModeButton: document.querySelector("#storyModeButton"),
    battleModeButton: document.querySelector("#battleModeButton"),
    titleMessage: document.querySelector("#titleMessage"),
    storyTravelStage: document.querySelector("#storyTravelStage"),
    storyTravelImage: document.querySelector("#storyTravelStage .story-location-image"),
    storyTravel2Stage: document.querySelector("#storyTravel2Stage"),
    storyTravel2Image: document.querySelector("#storyTravel2Stage .story-location-image"),
    travelBackButton: document.querySelector("#travelBackButton"),
    travelMyHouseButton: document.querySelector("#travelMyHouseButton"),
    travelBusinessButton: document.querySelector("#travelBusinessButton"),
    travelBusiness2Button: document.querySelector("#travelBusiness2Button"),
    travelArenaButton: document.querySelector("#travelArenaButton"),
    travelGuideButton: document.querySelector("#travelGuideButton"),
    travelSecondMapButton: document.querySelector("#travelSecondMapButton"),
    travel2BackTunnelButton: document.querySelector("#travel2BackTunnelButton"),
    travel2ChiefButton: document.querySelector("#travel2ChiefButton"),
    travel2LabButton: document.querySelector("#travel2LabButton"),
    travelMainButton: document.querySelector("#travelMainButton"),
    storyBackButton: document.querySelector("#storyBackButton"),
    storyMainStage: document.querySelector("#storyMainStage"),
    storyMyPartyButton: document.querySelector("#storyMyPartyButton"),
    storyRankBattleButtons: document.querySelector("#storyRankBattleButtons"),
    storyBattleConfirmOverlay: document.querySelector("#storyBattleConfirmOverlay"),
    storyBattleConfirmLayout: document.querySelector("#storyBattleConfirmOverlay .story-confirm-layout"),
    storyBattleConfirmText: document.querySelector("#storyBattleConfirmText"),
    storyBattleOpponentList: document.querySelector("#storyBattleOpponentList"),
    storyBattleOpponentPanel: document.querySelector("#storyBattleOpponentList")?.closest(".story-opponent-panel"),
    storyBattleConfirmYesButton: document.querySelector("#storyBattleConfirmYesButton"),
    storyBattleConfirmNoButton: document.querySelector("#storyBattleConfirmNoButton"),
    storyMap: document.querySelector("#storyMap"),
    storyTiles: document.querySelector("#storyTiles"),
    storyPlayer: document.querySelector("#storyPlayer"),
    businessScreen: document.querySelector("#businessScreen"),
    businessBackButton: document.querySelector("#businessBackButton"),
    businessBookButton: document.querySelector("#businessBookButton"),
    businessMonsterButton: document.querySelector("#businessMonsterButton"),
    business2Screen: document.querySelector("#business2Screen"),
    business2BackButton: document.querySelector("#business2BackButton"),
    business2ChangeEquipmentButton: document.querySelector("#business2ChangeEquipmentButton"),
    business2EquipmentButton: document.querySelector("#business2EquipmentButton"),
    arenaScreen: document.querySelector("#arenaScreen"),
    arenaBackButton: document.querySelector("#arenaBackButton"),
    arenaHotspots: document.querySelector("#arenaHotspots"),
    arenaMessage: document.querySelector("#arenaMessage"),
    arenaConfirmPanel: document.querySelector("#arenaConfirmPanel"),
    arenaConfirmContent: document.querySelector("#arenaConfirmContent"),
    arenaChallengeButton: document.querySelector("#arenaChallengeButton"),
    arenaConfirmCloseButton: document.querySelector("#arenaConfirmCloseButton"),
    labScreen: document.querySelector("#labScreen"),
    labBackButton: document.querySelector("#labBackButton"),
    labEntranceButton: document.querySelector("#labEntranceButton"),
    labInteriorScreen: document.querySelector("#labInteriorScreen"),
    labInteriorPanel: document.querySelector("#labInteriorPanel"),
    labMembersList: document.querySelector("#labMembersList"),
    labStorageList: document.querySelector("#labStorageList"),
    labActionPanel: document.querySelector("#labActionPanel"),
    labSwapButton: document.querySelector("#labSwapButton"),
    labRemoveButton: document.querySelector("#labRemoveButton"),
    labLeadButton: document.querySelector("#labLeadButton"),
    labEditMessage: document.querySelector("#labEditMessage"),
    labUnsavedNotice: document.querySelector("#labUnsavedNotice"),
    labDetailOverlay: document.querySelector("#labDetailOverlay"),
    labDetailPanel: document.querySelector("#labDetailPanel"),
    labInteriorBackButton: document.querySelector("#labInteriorBackButton"),
    guideHouseScreen: document.querySelector("#guideHouseScreen"),
    guideHouseBackButton: document.querySelector("#guideHouseBackButton"),
    guideBookButton: document.querySelector("#guideBookButton"),
    guideMenuPanel: document.querySelector("#guideMenuPanel"),
    chiefHouseScreen: document.querySelector("#chiefHouseScreen"),
    chiefHouseBackButton: document.querySelector("#chiefHouseBackButton"),
    businessShopPanel: document.querySelector("#businessShopPanel"),
    businessShopBackButton: document.querySelector("#businessShopBackButton"),
    businessShopTitle: document.querySelector("#businessShopTitle"),
    businessShopMoney: document.querySelector("#businessShopMoney"),
    businessShopSlots: document.querySelector("#businessShopSlots"),
    businessShopMessage: document.querySelector("#businessShopMessage"),
    businessShopItems: document.querySelector("#businessShopItems"),
    businessShopExchangePanel: document.querySelector("#businessShopExchangePanel"),
    myPartyPanel: document.querySelector("#myPartyPanel"),
    myPartyBackButton: document.querySelector("#myPartyBackButton"),
    myPartyMonsterList: document.querySelector("#myPartyMonsterList"),
    myPartyDetailPanel: document.querySelector("#myPartyDetailPanel"),
    myHouseScreen: document.querySelector("#myHouseScreen"),
    myHouseScreenBackButton: document.querySelector("#myHouseScreenBackButton"),
    myHouseSaveLoadButton: document.querySelector("#myHouseSaveLoadButton"),
    myHouseBookButton: document.querySelector("#myHouseBookButton"),
    myHousePartyButton: document.querySelector("#myHousePartyButton"),
    myHousePanel: document.querySelector("#myHousePanel"),
    myHouseBackButton: document.querySelector("#myHouseBackButton"),
    myHouseMonsterList: document.querySelector("#myHouseMonsterList"),
    myHouseBookList: document.querySelector("#myHouseBookList"),
    myHouseBookContent: document.querySelector("#myHouseBookContent"),
    myHouseDetailPanel: document.querySelector("#myHouseDetailPanel"),
    myHouseSaveSlots: document.querySelector("#myHouseSaveSlots"),
    myHouseLoadSlots: document.querySelector("#myHouseLoadSlots"),
    myHouseSaveStatus: document.querySelector("#myHouseSaveStatus"),
    setupPanelTitle: document.querySelector("#setupPanelTitle"),
    setupPlayerModeButton: document.querySelector("#setupPlayerModeButton"),
    setupEnemyModeButton: document.querySelector("#setupEnemyModeButton"),
    selectedSlots: document.querySelector("#selectedSlots"),
    rosterGrid: document.querySelector("#rosterGrid"),
    randomTeamButton: document.querySelector("#randomTeamButton"),
    randomBattleButton: document.querySelector("#randomBattleButton"),
    clearTeamButton: document.querySelector("#clearTeamButton"),
    startButton: document.querySelector("#startButton"),
    enemyHud: document.querySelector("#enemyHud"),
    playerHud: document.querySelector("#playerHud"),
    enemySprite: document.querySelector("#enemySprite"),
    playerSprite: document.querySelector("#playerSprite"),
    battleAnimationLayer: document.querySelector("#battleAnimationLayer"),
    battleLog: document.querySelector("#battleLog"),
    fightTab: document.querySelector("#fightTab"),
    switchTab: document.querySelector("#switchTab"),
    restartButton: document.querySelector("#restartButton"),
    dexButton: document.querySelector("#dexButton"),
    glossaryButton: document.querySelector("#glossaryButton"),
    glossaryPanel: document.querySelector("#glossaryPanel"),
    commandLights: document.querySelector("#commandLights"),
    battleStatusPanel: document.querySelector("#battleStatusPanel"),
    moveGrid: document.querySelector("#moveGrid"),
    switchGrid: document.querySelector("#switchGrid"),
    enemyInfoPanel: document.querySelector("#enemyInfoPanel"),
    exchangePanel: document.querySelector("#exchangePanel"),
    detailOverlay: document.querySelector("#detailOverlay"),
    detailPanel: document.querySelector("#detailPanel"),
    dexOverlay: document.querySelector("#dexOverlay"),
    dexPanel: document.querySelector("#dexPanel"),
    dialogueOverlay: document.querySelector("#dialogueOverlay"),
    dialogueWindowFrame: document.querySelector("#dialogueWindowFrame"),
    dialogueNpcImage: document.querySelector("#dialogueNpcImage"),
    dialogueText: document.querySelector("#dialogueText"),
  });

  dialogueManager.mount({
    overlay: els.dialogueOverlay,
    windowFrame: els.dialogueWindowFrame,
    portrait: els.dialogueNpcImage,
    text: els.dialogueText,
  });
  bindEvents();
  gameDataPromise = loadGameData();
});

function bindEvents() {
  els.storyModeButton.addEventListener("click", startStoryMode);
  els.battleModeButton.addEventListener("click", showBattleSetup);
  els.storyTravelStage?.addEventListener("pointerdown", handleStoryLocationLabelPointerDown);
  els.storyTravel2Stage?.addEventListener("pointerdown", handleStoryLocationLabelPointerDown);
  els.travelBackButton?.addEventListener("click", showTitleView);
  els.travelMyHouseButton?.addEventListener("click", showMyHouse);
  els.travelBusinessButton?.addEventListener("click", showBusinessShop);
  els.travelBusiness2Button?.addEventListener("click", showBusiness2);
  els.travelArenaButton?.addEventListener("click", showArena);
  els.travelGuideButton?.addEventListener("click", showGuideHouse);
  els.travelSecondMapButton?.addEventListener("click", showStoryTravel2);
  els.travel2BackTunnelButton?.addEventListener("click", showStoryTravel);
  els.travel2ChiefButton?.addEventListener("click", showChiefHouse);
  els.travel2LabButton?.addEventListener("click", showLab);
  els.travelMainButton?.addEventListener("click", showStoryMain);
  els.storyBackButton.addEventListener("click", showStoryTravel);
  els.storyMyPartyButton?.addEventListener("click", showMyParty);
  els.myPartyBackButton?.addEventListener("click", hideMyParty);
  els.storyMainStage?.addEventListener("click", handleStoryMainStageClick);
  els.businessBackButton?.addEventListener("click", leaveBusinessShop);
  els.businessBookButton?.addEventListener("click", () => openBusinessShop(SHOP_ITEM_FILTER_BOOK));
  els.businessMonsterButton?.addEventListener("click", () => openBusinessShop(SHOP_ITEM_FILTER_MONSTER));
  els.business2BackButton?.addEventListener("click", leaveBusiness2);
  els.business2ChangeEquipmentButton?.addEventListener("click", openBusiness2EquipmentChange);
  els.business2EquipmentButton?.addEventListener("click", openBusiness2Shop);
  els.businessShopBackButton?.addEventListener("click", closeBusinessShopPanel);
  els.arenaBackButton?.addEventListener("click", hideArena);
  els.arenaHotspots?.addEventListener("click", handleArenaHotspotClick);
  els.arenaChallengeButton?.addEventListener("click", handleArenaChallengeClick);
  els.arenaConfirmCloseButton?.addEventListener("click", hideArenaBattleConfirm);
  els.labBackButton?.addEventListener("click", showStoryTravel2);
  els.labEntranceButton?.addEventListener("click", showLabInterior);
  els.labMembersList?.addEventListener("click", handleLabMemberSelect);
  els.labStorageList?.addEventListener("click", handleLabStorageSelect);
  els.labSwapButton?.addEventListener("click", handleLabSwapClick);
  els.labRemoveButton?.addEventListener("click", handleLabRemoveClick);
  els.labLeadButton?.addEventListener("click", handleLabLeadClick);
  els.labDetailOverlay?.addEventListener("click", handleLabDetailOverlayClick);
  els.labInteriorBackButton?.addEventListener("click", showLab);
  els.guideHouseBackButton?.addEventListener("click", hideGuideHouse);
  els.guideBookButton?.addEventListener("click", toggleGuideMenu);
  els.guideMenuPanel?.addEventListener("click", handleGuideMenuClick);
  els.chiefHouseBackButton?.addEventListener("click", hideChiefHouse);
  document.addEventListener("keydown", handleLabDetailKeydown);
  els.myHouseScreenBackButton?.addEventListener("click", hideMyHouse);
  els.myHouseSaveLoadButton?.addEventListener("click", () => showMyHouseSection("save"));
  els.myHouseBookButton?.addEventListener("click", () => showMyHouseSection("books"));
  els.myHousePartyButton?.addEventListener("click", () => showMyHouseSection("party"));
  els.myHouseBackButton?.addEventListener("click", hideMyHousePanel);
  els.myHouseSaveSlots?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-manual-save-slot]");
    if (!button || !els.myHouseSaveSlots.contains(button)) return;
    event.preventDefault();
    handleManualSave(Number(button.dataset.manualSaveSlot));
  });
  els.myHouseLoadSlots?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-load-save-key]");
    if (!button || !els.myHouseLoadSlots.contains(button) || button.disabled) return;
    event.preventDefault();
    handleSaveLoad(button.dataset.loadSaveKey, button.dataset.loadSaveLabel || "");
  });
  els.storyRankBattleButtons?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-rank-battle-id]");
    if (!button || !els.storyRankBattleButtons.contains(button)) return;
    event.preventDefault();
    const rankBattleId = button.dataset.rankBattleId;
    if (!rankBattleId || isStoryRankBattleDisabled(rankBattleId)) return;
    showRankBattleConfirm(rankBattleId);
  });
  els.storyBattleConfirmYesButton?.addEventListener("click", confirmRankBattleStart);
  els.storyBattleConfirmNoButton?.addEventListener("click", () => hideRankBattleConfirm({ restoreFocus: true }));
  els.storyBattleConfirmOverlay?.addEventListener("click", (event) => {
    if (event.target === els.storyBattleConfirmOverlay) {
      hideRankBattleConfirm({ restoreFocus: true });
    }
  });
  document.addEventListener("keydown", handleStoryKeydown);

  els.setupPlayerModeButton?.addEventListener("click", () => setSetupSide("player"));
  els.setupEnemyModeButton?.addEventListener("click", () => setSetupSide("enemy"));

  els.randomTeamButton.addEventListener("click", () => {
    setSetupSelectionIds(
      buildSlotTeam(state.characters, TEAM_SLOT_LIMIT, true).map((character) => character.character_id),
    );
    renderSetup();
  });

  els.randomBattleButton.addEventListener("click", startRandomBattle);

  els.clearTeamButton.addEventListener("click", () => {
    setSetupSelectionIds([]);
    renderSetup();
  });

  els.startButton.addEventListener("click", startBattle);

  els.fightTab.addEventListener("click", () => {
    if (state.busy || state.gameOver || state.pendingSwitchSide) return;
    state.commandMode = "fight";
    renderBattle();
  });

  els.switchTab.addEventListener("click", () => {
    if (state.busy || state.gameOver) return;
    state.commandMode = state.commandMode === "switch" ? "fight" : "switch";
    renderBattle();
  });

  els.dexButton.addEventListener("click", () => {
    openDex();
  });

  els.glossaryButton.addEventListener("click", () => {
    els.glossaryPanel?.classList.toggle("is-hidden");
  });

  els.glossaryPanel?.addEventListener("click", () => {
    els.glossaryPanel.classList.add("is-hidden");
  });

  els.restartButton.addEventListener("click", () => {
    returnToSetup();
  });
}

function handleStoryLocationLabelPointerDown(event) {
  const button = event.target.closest(".story-location-button[data-location-label]");
  if (!button || !event.currentTarget.contains(button)) return;
  showStoryLocationTapLabel(button);
}

function showStoryLocationTapLabel(button) {
  button.classList.add("is-label-visible");
  const previousTimer = storyLocationLabelTimers.get(button);
  if (previousTimer) {
    clearTimeout(previousTimer);
  }
  const timer = setTimeout(() => {
    button.classList.remove("is-label-visible");
    storyLocationLabelTimers.delete(button);
  }, STORY_LOCATION_TAP_LABEL_MS);
  storyLocationLabelTimers.set(button, timer);
}

function showTitleView() {
  clearGameOverReturnTimer();
  state.story.active = false;
  state.shop.open = false;
  hideBusinessShop({ restoreTravel: false });
  hideMyHouse({ restoreTravel: false });
  hideBusiness2({ restoreTravel: false });
  clearStoryWalkTimer();
  hideRankBattleConfirm();
  state.story.currentRankBattleId = null;
  state.story.currentArenaBattleId = null;
  els.battleView.classList.add("is-hidden");
  els.setupView.classList.add("is-hidden");
  els.storyView.classList.add("is-hidden");
  setStoryStage("travel");
  els.titleView.classList.remove("is-hidden");
  clearTitleMessage();
}

function showStoryPreparing() {
  state.story.active = false;
  state.shop.open = false;
  hideBusinessShop({ restoreTravel: false });
  hideMyHouse({ restoreTravel: false });
  hideBusiness2({ restoreTravel: false });
  clearStoryWalkTimer();
  els.setupView.classList.add("is-hidden");
  els.battleView.classList.add("is-hidden");
  els.storyView.classList.add("is-hidden");
  setStoryStage("travel");
  els.titleView.classList.remove("is-hidden");
  els.titleMessage.classList.remove("is-hidden");
}

function showBattleSetup() {
  state.story.active = false;
  state.shop.open = false;
  hideBusinessShop({ restoreTravel: false });
  hideMyHouse({ restoreTravel: false });
  hideBusiness2({ restoreTravel: false });
  clearStoryWalkTimer();
  hideRankBattleConfirm();
  state.story.currentRankBattleId = null;
  state.story.currentArenaBattleId = null;
  clearTitleMessage();
  els.titleView.classList.add("is-hidden");
  els.storyView.classList.add("is-hidden");
  setStoryStage("travel");
  els.battleView.classList.add("is-hidden");
  els.setupView.classList.remove("is-hidden");
  state.setupSide = "player";
  renderSetup();
}

function clearTitleMessage() {
  els.titleMessage?.classList.add("is-hidden");
}

async function startStoryMode() {
  state.story.active = false;
  state.shop.open = false;
  hideBusinessShop({ restoreTravel: false });
  hideMyHouse({ restoreTravel: false });
  hideBusiness2({ restoreTravel: false });
  clearStoryWalkTimer();
  hideRankBattleConfirm();
  clearTitleMessage();
  els.titleView.classList.add("is-hidden");
  els.setupView.classList.add("is-hidden");
  els.battleView.classList.add("is-hidden");
  els.storyView.classList.remove("is-hidden");
  showStoryTravel({ focus: true });
}

function setStoryStage(stage) {
  els.storyTravelStage?.classList.toggle("is-hidden", stage !== "travel");
  els.storyTravel2Stage?.classList.toggle("is-hidden", stage !== "travel2");
  els.travelBackButton?.classList.toggle("is-hidden", stage !== "travel");
  els.storyMainStage?.classList.toggle("is-hidden", stage !== "main");
  els.storyBackButton?.classList.toggle("is-hidden", stage !== "main");
  els.myPartyPanel?.classList.toggle("is-hidden", stage !== "myParty");
  els.businessScreen?.classList.toggle("is-hidden", stage !== "business");
  els.business2Screen?.classList.toggle("is-hidden", stage !== "business2");
  els.arenaScreen?.classList.toggle("is-hidden", stage !== "arena");
  els.labScreen?.classList.toggle("is-hidden", stage !== "lab");
  els.labInteriorScreen?.classList.toggle("is-hidden", stage !== "labInterior");
  els.guideHouseScreen?.classList.toggle("is-hidden", stage !== "guideHouse");
  els.chiefHouseScreen?.classList.toggle("is-hidden", stage !== "chiefHouse");
  els.myHouseScreen?.classList.toggle("is-hidden", stage !== "myHouse");
  if (stage !== "guideHouse") {
    hideGuideMenu();
  }
}

function showStoryFrame() {
  clearTitleMessage();
  els.titleView.classList.add("is-hidden");
  els.setupView.classList.add("is-hidden");
  els.battleView.classList.add("is-hidden");
  els.storyView.classList.remove("is-hidden");
}

function normalizeTimeOfDay(timeOfDay) {
  const normalized = safeText(timeOfDay);
  return TIME_OF_DAY_SET.has(normalized) ? normalized : DEFAULT_TIME_OF_DAY;
}

function storyTravelBackgroundPath(stage, timeOfDay = state.story.timeOfDay) {
  const stageKey = stage === "travel2" ? "travel2" : "travel";
  const normalizedTimeOfDay = normalizeTimeOfDay(timeOfDay);
  return STORY_TRAVEL_BACKGROUND_PATHS[stageKey][normalizedTimeOfDay];
}

function storyIslandBgmId(timeOfDay = state.story.timeOfDay) {
  return STORY_ISLAND_BGM_IDS[normalizeTimeOfDay(timeOfDay)];
}

function rankBattleBgmId(rankBattleId) {
  const id = safeText(rankBattleId);
  if (!id) return "";
  for (const bgm of state.bgmMap.values()) {
    if (bgm.name === id) {
      return bgm.bgm_id;
    }
  }
  return "";
}

function playRankBattleBgm(rankBattleId) {
  const bgmId = rankBattleBgmId(rankBattleId);
  if (bgmId) playBgm(bgmId, { audibleDelayMs: BATTLE_BGM_AUDIBLE_DELAY_MS });
}

function advanceTimeOfDay() {
  const currentTimeOfDay = normalizeTimeOfDay(state.story.timeOfDay);
  const currentIndex = TIME_OF_DAY_SEQUENCE.indexOf(currentTimeOfDay);
  const nextIndex = (currentIndex + 1) % TIME_OF_DAY_SEQUENCE.length;
  state.story.timeOfDay = TIME_OF_DAY_SEQUENCE[nextIndex];
  return state.story.timeOfDay;
}

function updateStoryTravelBackgrounds() {
  const normalizedTimeOfDay = normalizeTimeOfDay(state.story.timeOfDay);
  state.story.timeOfDay = normalizedTimeOfDay;
  if (els.storyTravelImage) {
    els.storyTravelImage.src = storyTravelBackgroundPath("travel", normalizedTimeOfDay);
  }
  if (els.storyTravel2Image) {
    els.storyTravel2Image.src = storyTravelBackgroundPath("travel2", normalizedTimeOfDay);
  }
}

function showStoryTravel({ focus = true } = {}) {
  state.story.active = false;
  state.shop.open = false;
  state.shop.confirmEntryId = null;
  state.shop.exchangeEntryId = null;
  state.shop.offerOwnedIds = [];
  clearStoryWalkTimer();
  hideRankBattleConfirm();
  els.businessShopPanel?.classList.add("is-hidden");
  els.myHousePanel?.classList.add("is-hidden");
  els.myPartyPanel?.classList.add("is-hidden");
  hideArenaBattleConfirm({ clearSelection: true, focus: false });
  if (els.arenaMessage) els.arenaMessage.textContent = "";
  showStoryFrame();
  updateStoryTravelBackgrounds();
  playBgm(storyIslandBgmId());
  setStoryStage("travel");
  if (focus) els.travelBackButton?.focus({ preventScroll: true });
}

function showStoryTravel2({ focus = true } = {}) {
  state.story.active = false;
  state.shop.open = false;
  state.shop.confirmEntryId = null;
  state.shop.exchangeEntryId = null;
  state.shop.offerOwnedIds = [];
  clearStoryWalkTimer();
  hideRankBattleConfirm();
  els.businessShopPanel?.classList.add("is-hidden");
  els.myHousePanel?.classList.add("is-hidden");
  els.myPartyPanel?.classList.add("is-hidden");
  hideArenaBattleConfirm({ clearSelection: true, focus: false });
  if (els.arenaMessage) els.arenaMessage.textContent = "";
  showStoryFrame();
  updateStoryTravelBackgrounds();
  playBgm(storyIslandBgmId());
  setStoryStage("travel2");
  if (focus) els.travel2BackTunnelButton?.focus({ preventScroll: true });
}

function showLab({ focus = true } = {}) {
  state.story.active = false;
  state.shop.open = false;
  state.shop.confirmEntryId = null;
  state.shop.exchangeEntryId = null;
  state.shop.offerOwnedIds = [];
  clearStoryWalkTimer();
  hideRankBattleConfirm();
  els.businessShopPanel?.classList.add("is-hidden");
  els.myHousePanel?.classList.add("is-hidden");
  els.myPartyPanel?.classList.add("is-hidden");
  hideArenaBattleConfirm({ clearSelection: true, focus: false });
  if (els.arenaMessage) els.arenaMessage.textContent = "";
  showStoryFrame();
  closeLabOwnedMonsterDetail({ restoreFocus: false });
  setStoryStage("lab");
  if (focus) els.labBackButton?.focus({ preventScroll: true });
}

async function showLabInterior({ focus = true } = {}) {
  if (gameDataPromise) {
    await gameDataPromise;
  }

  state.story.active = false;
  state.shop.open = false;
  initializeSaveDataParty({ persist: false });
  clearStoryWalkTimer();
  hideRankBattleConfirm();
  els.businessShopPanel?.classList.add("is-hidden");
  els.myHousePanel?.classList.add("is-hidden");
  els.myPartyPanel?.classList.add("is-hidden");
  hideArenaBattleConfirm({ clearSelection: true, focus: false });
  showStoryFrame();
  setStoryStage("labInterior");
  renderLabInterior();
  if (focus) els.labInteriorBackButton?.focus({ preventScroll: true });
}

async function showGuideHouse({ focus = true } = {}) {
  if (gameDataPromise) {
    await gameDataPromise;
  }

  state.story.active = false;
  state.shop.open = false;
  state.shop.confirmEntryId = null;
  state.shop.exchangeEntryId = null;
  state.shop.offerOwnedIds = [];
  clearStoryWalkTimer();
  hideRankBattleConfirm();
  els.businessShopPanel?.classList.add("is-hidden");
  els.myHousePanel?.classList.add("is-hidden");
  els.myPartyPanel?.classList.add("is-hidden");
  hideArenaBattleConfirm({ clearSelection: true, focus: false });
  if (els.arenaMessage) els.arenaMessage.textContent = "";
  hideGuideMenu();
  showStoryFrame();
  setStoryStage("guideHouse");
  if (focus) els.guideHouseBackButton?.focus({ preventScroll: true });
}

function hideGuideHouse() {
  hideGuideMenu();
  showStoryTravel();
}

function toggleGuideMenu() {
  els.guideMenuPanel?.classList.toggle("is-hidden");
}

function hideGuideMenu() {
  els.guideMenuPanel?.classList.add("is-hidden");
}

async function handleGuideMenuClick(event) {
  const button = event.target.closest("[data-guide-dialogue-id]");
  if (!button || !els.guideMenuPanel?.contains(button)) return;
  event.preventDefault();
  const dialogueId = button.dataset.guideDialogueId;
  hideGuideMenu();
  await showDialogue("guide", dialogueId);
  els.guideBookButton?.focus({ preventScroll: true });
}

async function showChiefHouse({ focus = true } = {}) {
  if (gameDataPromise) {
    await gameDataPromise;
  }

  state.story.active = false;
  state.shop.open = false;
  state.shop.confirmEntryId = null;
  state.shop.exchangeEntryId = null;
  state.shop.offerOwnedIds = [];
  clearStoryWalkTimer();
  hideRankBattleConfirm();
  els.businessShopPanel?.classList.add("is-hidden");
  els.myHousePanel?.classList.add("is-hidden");
  els.myPartyPanel?.classList.add("is-hidden");
  hideArenaBattleConfirm({ clearSelection: true, focus: false });
  if (els.arenaMessage) els.arenaMessage.textContent = "";
  showStoryFrame();
  setStoryStage("chiefHouse");
  if (focus) els.chiefHouseBackButton?.focus({ preventScroll: true });
  void showDialogue("chief", "chief_welcome");
}

async function hideChiefHouse() {
  await showDialogue("chief", "chief_goodbye");
  showStoryTravel2();
}

function renderLabInterior() {
  if (!els.labMembersList || !els.labStorageList) return;

  const entries = myHouseMonsterEntries();
  const entryByOwnedId = new Map(entries.map((entry) => [entry.ownedId, entry]));
  const partyOwnedIds = currentPartyOwnedIds();
  const memberSlots = Array.from({ length: LAB_MEMBER_DISPLAY_LIMIT }, (_, index) => {
    const ownedId = partyOwnedIds[index] || "";
    return {
      index,
      ownedId,
      entry: ownedId ? entryByOwnedId.get(ownedId) ?? null : null,
    };
  });
  const memberOwnedIds = new Set(partyOwnedIds);
  const labEntries = entries.filter((entry) => !memberOwnedIds.has(entry.ownedId));
  const selection = labInteriorRenderSelection(memberSlots, labEntries);

  els.labMembersList.innerHTML = memberSlots.map((slot) => renderLabMemberSlot(slot, selection)).join("");

  els.labStorageList.classList.toggle("is-single-item", labEntries.length === 1);
  els.labStorageList.innerHTML = labEntries.length
    ? labEntries.map((entry) => renderLabStorageCard(entry, selection)).join("")
    : `<div class="lab-empty lab-storage-empty">LABに保管中のモンスターはいません。</div>`;

  renderLabActionPanel(selection);

  if (state.labInterior.detailOwnedId) {
    renderLabOwnedMonsterDetail();
  }
}

function labInteriorRenderSelection(memberSlots, labEntries) {
  const selectedSlotIndex = Number(state.labInterior.selectedMemberSlotIndex);
  const hasSelectedSlot =
    Number.isInteger(selectedSlotIndex) &&
    selectedSlotIndex >= 0 &&
    selectedSlotIndex < LAB_MEMBER_DISPLAY_LIMIT;
  const selectedMemberOwnedId = safeText(state.labInterior.selectedMemberOwnedId);
  const selectedMemberSlot = selectedMemberOwnedId
    ? memberSlots.find((slot) => slot.ownedId === selectedMemberOwnedId) ?? null
    : hasSelectedSlot
      ? memberSlots.find((slot) => slot.index === selectedSlotIndex && !slot.entry) ?? null
      : null;
  const selectedLabOwnedIds = normalizeLabOwnedIdSelection(
    state.labInterior.selectedLabOwnedIds,
    state.labInterior.selectedLabOwnedId,
  ).filter((ownedId) => labEntries.some((entry) => entry.ownedId === ownedId));

  return {
    selectedMemberSlotIndex: selectedMemberSlot?.index ?? null,
    selectedMemberOwnedId: selectedMemberSlot?.entry ? selectedMemberSlot.ownedId : null,
    selectedLabOwnedId: selectedLabOwnedIds[0] ?? null,
    selectedLabOwnedIds,
  };
}

function normalizeLabOwnedIdSelection(ownedIds, fallbackOwnedId = null) {
  const rawIds = Array.isArray(ownedIds) && ownedIds.length ? ownedIds : [fallbackOwnedId];
  const normalized = [];
  for (const ownedId of rawIds) {
    const id = safeText(ownedId);
    if (!id || normalized.includes(id)) continue;
    normalized.push(id);
  }
  return normalized;
}

function renderLabMemberSlot(slot, selection) {
  if (!slot.entry) {
    const selected =
      selection.selectedMemberSlotIndex === slot.index &&
      !selection.selectedMemberOwnedId;
    return `
      <button class="lab-member-empty-slot ${selected ? "selected is-selected" : ""}" type="button" data-lab-member-slot-index="${slot.index}">
        <span>Member ${slot.index + 1}</span>
        <strong>空き枠</strong>
      </button>
    `;
  }

  return renderLabMemberCard(slot.entry, slot.index, selection);
}

function renderLabMemberCard(entry, slotIndex, selection) {
  return renderLabMonsterCard(entry, {
    area: "member",
    selected:
      slotIndex === selection.selectedMemberSlotIndex &&
      entry.ownedId === selection.selectedMemberOwnedId,
    dataAttribute: "data-lab-member-owned-id",
    extraAttributes: `data-lab-member-slot-index="${slotIndex}"`,
    showStats: true,
  });
}

function renderLabStorageCard(entry, selection) {
  return renderLabMonsterCard(entry, {
    area: "storage",
    selected:
      Array.isArray(selection.selectedLabOwnedIds) && selection.selectedLabOwnedIds.includes(entry.ownedId),
    dataAttribute: "data-lab-storage-owned-id",
    showStats: false,
  });
}

function renderLabMonsterCard(entry, options) {
  const character = entry.character;
  const equippedAccessory = equippedAccessoryForOwnedMonster(entry.ownedMonster, character);
  const displayedCharacter = applyEquipmentBonusesToCharacter(character, equippedAccessory);
  const selectedClass = options.selected ? "selected is-selected" : "";
  return `
    <div class="lab-monster-card-shell lab-${escapeHtml(options.area)}-card-shell">
      <button class="lab-monster-card lab-${escapeHtml(options.area)}-card ${selectedClass}" type="button" ${options.dataAttribute}="${escapeHtml(entry.ownedId)}" ${options.extraAttributes || ""}>
        <span class="lab-monster-image-frame">
          <img class="lab-monster-image" src="${escapeHtml(character.imageSrc)}" alt="${escapeHtml(character.name)}" />
        </span>
        <span class="lab-monster-info">
          <strong class="lab-monster-name">${escapeHtml(character.name)}</strong>
          <span class="lab-monster-meta">${elementPill(character.element)} <span>slot ${slotMarks(character.slot)}</span></span>
          ${options.showStats ? `
            <span class="lab-monster-stats">
              ${renderLabStat("HP", displayedCharacter.hp)}
              ${renderLabStat("物攻", displayedCharacter.phy_atk)}
              ${renderLabStat("物防", displayedCharacter.phy_def)}
              ${renderLabStat("特攻", displayedCharacter.sp_atk)}
              ${renderLabStat("特防", displayedCharacter.sp_def)}
              ${renderLabStat("敏捷", displayedCharacter.speed)}
            </span>
          ` : ""}
        </span>
      </button>
      <button class="detail-button lab-card-detail-button" type="button" data-lab-detail-owned-id="${escapeHtml(entry.ownedId)}">詳細</button>
    </div>
  `;
}

function handleLabCardDetailClick(event, container) {
  const detailButton = event.target.closest("[data-lab-detail-owned-id]");
  if (!detailButton || !container?.contains(detailButton)) return false;
  event.stopPropagation();
  openLabOwnedMonsterDetail(detailButton.dataset.labDetailOwnedId);
  return true;
}

function clearLabInteriorSelections() {
  state.labInterior.selectedMemberSlotIndex = null;
  state.labInterior.selectedMemberOwnedId = null;
  state.labInterior.selectedLabOwnedId = null;
  state.labInterior.selectedLabOwnedIds = [];
}

function renderLabActionPanel(selection = null) {
  const renderSelection = selection ?? {
    selectedMemberSlotIndex: state.labInterior.selectedMemberSlotIndex,
    selectedMemberOwnedId: state.labInterior.selectedMemberOwnedId,
    selectedLabOwnedId: state.labInterior.selectedLabOwnedId,
    selectedLabOwnedIds: state.labInterior.selectedLabOwnedIds,
  };
  const selectedLabOwnedIds = normalizeLabOwnedIdSelection(
    renderSelection.selectedLabOwnedIds,
    renderSelection.selectedLabOwnedId,
  );
  const selectedSlotIndex = Number(renderSelection.selectedMemberSlotIndex);
  const hasMemberSelection =
    Number.isInteger(selectedSlotIndex) &&
    selectedSlotIndex >= 0 &&
    selectedSlotIndex < LAB_MEMBER_DISPLAY_LIMIT;
  const hasLabSelection = selectedLabOwnedIds.length > 0;

  if (els.labSwapButton) {
    els.labSwapButton.disabled = !renderSelection.selectedMemberOwnedId || !hasLabSelection;
    els.labSwapButton.textContent = "入替";
  }

  if (els.labRemoveButton) {
    els.labRemoveButton.disabled = !renderSelection.selectedMemberOwnedId;
  }

  if (els.labLeadButton) {
    const partyIds = currentPartyOwnedIds();
    const selectedMemberIndex = renderSelection.selectedMemberOwnedId
      ? partyIds.indexOf(renderSelection.selectedMemberOwnedId)
      : -1;
    els.labLeadButton.disabled = selectedMemberIndex <= 0;
  }

  if (els.labEditMessage) {
    els.labEditMessage.textContent = state.labInterior.message || "";
    els.labEditMessage.classList.toggle("is-error", Boolean(state.labInterior.messageIsError));
  }

  renderUnsavedChangesNotice();
}

function renderLabStat(label, value) {
  return `<span class="lab-stat"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></span>`;
}

function handleLabMemberSelect(event) {
  if (handleLabCardDetailClick(event, els.labMembersList)) return;
  const button = event.target.closest("[data-lab-member-owned-id], [data-lab-member-slot-index]");
  if (!button || !els.labMembersList?.contains(button)) return;
  const slotIndex = button.hasAttribute("data-lab-member-slot-index")
    ? Number(button.dataset.labMemberSlotIndex)
    : null;
  state.labInterior.selectedMemberSlotIndex =
    Number.isInteger(slotIndex) && slotIndex >= 0 ? slotIndex : null;
  state.labInterior.selectedMemberOwnedId = button.dataset.labMemberOwnedId || null;
  setLabEditMessage("");
  if (normalizeLabOwnedIdSelection(state.labInterior.selectedLabOwnedIds, state.labInterior.selectedLabOwnedId).length) {
    const result = applyLabPartyEdit();
    setLabEditMessage(result.message, { isError: !result.ok });
  }
  renderLabInterior();
}

function handleLabStorageSelect(event) {
  if (handleLabCardDetailClick(event, els.labStorageList)) return;
  const button = event.target.closest("[data-lab-storage-owned-id]");
  if (!button || !els.labStorageList?.contains(button)) return;
  const ownedId = safeText(button.dataset.labStorageOwnedId);
  const selectedLabOwnedIds = normalizeLabOwnedIdSelection(
    state.labInterior.selectedLabOwnedIds,
    state.labInterior.selectedLabOwnedId,
  );
  const existingIndex = selectedLabOwnedIds.indexOf(ownedId);
  if (existingIndex >= 0) {
    selectedLabOwnedIds.splice(existingIndex, 1);
  } else if (ownedId) {
    selectedLabOwnedIds.push(ownedId);
  }
  state.labInterior.selectedLabOwnedIds = selectedLabOwnedIds;
  state.labInterior.selectedLabOwnedId = selectedLabOwnedIds.at(-1) ?? null;
  setLabEditMessage("");
  renderLabInterior();
}

function handleLabSwapClick() {
  const result = applyLabPartyEdit();
  setLabEditMessage(result.message, { isError: !result.ok });
  renderLabInterior();
}

function handleLabRemoveClick() {
  const result = removeSelectedLabMemberFromParty();
  setLabEditMessage(result.message, { isError: !result.ok });
  renderLabInterior();
}

function handleLabLeadClick() {
  const result = swapPartyMemberWithLead(state.labInterior.selectedMemberOwnedId);
  setLabEditMessage(result.message, { isError: !result.ok });
  renderLabInterior();
}

function applyLabPartyEdit() {
  const selectedSlotIndex = Number(state.labInterior.selectedMemberSlotIndex);
  const selectedLabOwnedIds = normalizeLabOwnedIdSelection(
    state.labInterior.selectedLabOwnedIds,
    state.labInterior.selectedLabOwnedId,
  );
  const selectedMemberOwnedId = safeText(state.labInterior.selectedMemberOwnedId);
  const currentPartyIds = currentPartyOwnedIds();

  if (
    !Number.isInteger(selectedSlotIndex) ||
    selectedSlotIndex < 0 ||
    selectedSlotIndex >= LAB_MEMBER_DISPLAY_LIMIT
  ) {
    return { ok: false, message: "Membersの枠を選択してください" };
  }

  if (!selectedLabOwnedIds.length) {
    return { ok: false, message: "LAB側のモンスターを選択してください" };
  }

  const nextPartyOwnedIds = [...currentPartyIds];
  const labMonsters = selectedLabOwnedIds.map((ownedId) => ownedMonsterByOwnedId(ownedId));
  if (labMonsters.some((monster, index) => !monster || currentPartyIds.includes(selectedLabOwnedIds[index]))) {
    return { ok: false, message: "LAB側のモンスターを選択してください" };
  }
  const labCharacters = labMonsters.map((monster) => state.characterMap.get(monster.characterId));
  if (labCharacters.some((character) => !character)) {
    return { ok: false, message: "選択したモンスターのデータが見つかりません" };
  }
  const labNames = labCharacters.map((character) => character.name).join("、");

  let message = `${labNames}をMembersに編成しました`;
  if (selectedMemberOwnedId) {
    const memberIndex = nextPartyOwnedIds.indexOf(selectedMemberOwnedId);
    if (memberIndex < 0) {
      return { ok: false, message: "Members側のモンスターを選択してください" };
    }
    const memberMonster = ownedMonsterByOwnedId(selectedMemberOwnedId);
    const memberCharacter = state.characterMap.get(memberMonster?.characterId);
    nextPartyOwnedIds.splice(memberIndex, 1, ...selectedLabOwnedIds);
    message = `${memberCharacter?.name || "モンスター"}と${labNames}を入れ替えました`;
  } else {
    if (nextPartyOwnedIds[selectedSlotIndex]) {
      return { ok: false, message: "空き枠を選択してください" };
    }
    if (nextPartyOwnedIds.length + selectedLabOwnedIds.length > LAB_MEMBER_DISPLAY_LIMIT) {
      return { ok: false, message: "Membersは5枠までです" };
    }
    nextPartyOwnedIds.splice(Math.min(selectedSlotIndex, nextPartyOwnedIds.length), 0, ...selectedLabOwnedIds);
  }

  if (!nextPartyOwnedIds.length) {
    return { ok: false, message: "Membersを0体にはできません" };
  }

  if (new Set(nextPartyOwnedIds).size !== nextPartyOwnedIds.length) {
    return { ok: false, message: "同じ個体を複数枠へ配置できません" };
  }

  if (nextPartyOwnedIds.length > LAB_MEMBER_DISPLAY_LIMIT) {
    return { ok: false, message: "Membersは5枠までです" };
  }

  if (partySlotTotalForOwnedIds(nextPartyOwnedIds) > TEAM_SLOT_LIMIT) {
    return { ok: false, message: "編成可能なslot上限を超えています" };
  }

  state.saveData.partyOwnedIds = nextPartyOwnedIds;
  syncOwnedMonsterStorageFromParty();
  syncSelectedIdsFromOwnedMonsters();
  markUnsavedChanges();
  clearLabInteriorSelections();
  closeLabOwnedMonsterDetail({ restoreFocus: false });
  if (els.myHousePanel && !els.myHousePanel.classList.contains("is-hidden")) {
    ensureMyHouseSelection();
    renderMyHouse();
  }
  if (els.myPartyPanel && !els.myPartyPanel.classList.contains("is-hidden")) {
    ensureMyPartySelection();
    renderMyParty();
  }

  return { ok: true, message };
}

function removeSelectedLabMemberFromParty() {
  const selectedMemberOwnedId = safeText(state.labInterior.selectedMemberOwnedId);
  const currentPartyIds = currentPartyOwnedIds();

  if (!selectedMemberOwnedId || !currentPartyIds.includes(selectedMemberOwnedId)) {
    return { ok: false, message: "外すMembersを選択してください" };
  }

  if (currentPartyIds.length <= 1) {
    return { ok: false, message: "Membersを0体にはできません" };
  }

  const memberMonster = ownedMonsterByOwnedId(selectedMemberOwnedId);
  const memberCharacter = state.characterMap.get(memberMonster?.characterId);
  state.saveData.partyOwnedIds = currentPartyIds.filter((ownedId) => ownedId !== selectedMemberOwnedId);
  syncOwnedMonsterStorageFromParty();
  syncSelectedIdsFromOwnedMonsters();
  markUnsavedChanges();
  clearLabInteriorSelections();
  closeLabOwnedMonsterDetail({ restoreFocus: false });
  if (els.myHousePanel && !els.myHousePanel.classList.contains("is-hidden")) {
    ensureMyHouseSelection();
    renderMyHouse();
  }
  if (els.myPartyPanel && !els.myPartyPanel.classList.contains("is-hidden")) {
    ensureMyPartySelection();
    renderMyParty();
  }

  return { ok: true, message: `${memberCharacter?.name || "モンスター"}をLABへ送りました` };
}

function setLabEditMessage(message, { isError = false } = {}) {
  state.labInterior.message = message || "";
  state.labInterior.messageIsError = Boolean(isError);
}

function openLabOwnedMonsterDetail(ownedId) {
  const entry = labOwnedMonsterEntryByOwnedId(ownedId);
  if (!entry) return;
  state.labInterior.detailOwnedId = entry.ownedId;
  renderLabOwnedMonsterDetail();
  els.labDetailOverlay?.classList.remove("is-hidden");
  els.labDetailPanel?.querySelector("[data-lab-detail-close]")?.focus({ preventScroll: true });
}

function closeLabOwnedMonsterDetail({ restoreFocus = true } = {}) {
  const previousOwnedId = state.labInterior.detailOwnedId;
  state.labInterior.detailOwnedId = null;
  els.labDetailOverlay?.classList.add("is-hidden");
  if (els.labDetailPanel) {
    els.labDetailPanel.innerHTML = "";
  }
  if (restoreFocus && previousOwnedId) {
    labCardButtonByOwnedId(previousOwnedId)?.focus({ preventScroll: true });
  }
}

function handleLabDetailOverlayClick(event) {
  if (event.target === els.labDetailOverlay || event.target.closest("[data-lab-detail-close]")) {
    closeLabOwnedMonsterDetail();
  }
}

function handleLabDetailKeydown(event) {
  if (event.key !== "Escape") return;
  if (!state.labInterior.detailOwnedId || els.labDetailOverlay?.classList.contains("is-hidden")) return;
  event.preventDefault();
  closeLabOwnedMonsterDetail();
}

function labOwnedMonsterEntryByOwnedId(ownedId) {
  const id = safeText(ownedId);
  if (!id) return null;
  return myHouseMonsterEntries().find((entry) => entry.ownedId === id) ?? null;
}

function labCardButtonByOwnedId(ownedId) {
  const id = safeText(ownedId);
  const escapedOwnedId = window.CSS?.escape ? window.CSS.escape(id) : id.replace(/"/g, '\\"');
  return (
    els.labMembersList?.querySelector(`[data-lab-member-owned-id="${escapedOwnedId}"]`) ||
    els.labStorageList?.querySelector(`[data-lab-storage-owned-id="${escapedOwnedId}"]`) ||
    null
  );
}

function renderLabOwnedMonsterDetail() {
  if (!els.labDetailPanel) return;
  const entry = labOwnedMonsterEntryByOwnedId(state.labInterior.detailOwnedId);
  if (!entry) {
    els.labDetailOverlay?.classList.add("is-hidden");
    els.labDetailPanel.innerHTML = "";
    return;
  }
  els.labDetailPanel.innerHTML = renderLabOwnedMonsterDetailContent(entry);
}

function renderLabOwnedMonsterDetailContent(entry) {
  const character = entry.character;
  const ownedMonster = entry.ownedMonster;
  const equippedAccessory = equippedAccessoryForOwnedMonster(ownedMonster, character);
  const displayedCharacter = applyEquipmentBonusesToCharacter(character, equippedAccessory);
  const storageLabel = labStorageLabel(ownedMonster);
  return `
    <div class="lab-detail-header">
      <div>
        <div id="labDetailTitle" class="detail-title">${escapeHtml(character.name || "－")}</div>
        <div class="detail-subtitle">${characterSubtitle(character)}</div>
      </div>
      <button class="small-button lab-detail-close-button" type="button" data-lab-detail-close>閉じる</button>
    </div>
    <div class="lab-detail-content">
      <div class="detail-profile-column">
        <div class="detail-image-frame lab-detail-image-frame">
          <img class="detail-image" src="${escapeHtml(character.imageSrc)}" alt="${escapeHtml(character.name || "モンスター")}" />
        </div>
        <div class="detail-summary lab-detail-summary">
          ${renderLabDetailRow("個体ID", entry.ownedId)}
          ${renderLabDetailRow("属性", elementPill(character.element), { html: true })}
          ${renderLabDetailRow("種族", speciesLabel(character.species_id) || "－")}
          ${renderLabDetailRow("rank", characterRankLabel(character))}
          ${renderLabDetailRow("slot", slotMarks(character.slot), { html: true })}
          ${renderLabDetailRow("EN回復", energyBadge(displayedCharacter.energy_charge), { html: true })}
          ${renderLabDetailRow("保管場所", storageLabel)}
        </div>
        ${renderLabAccessorySummary(equippedAccessory)}
      </div>
      <div class="detail-stats lab-detail-stats">
        ${renderLabDetailStat("HP", "hp", character.hp, displayedCharacter.hp)}
        ${renderLabDetailStat("物理攻撃", "phy_atk", character.phy_atk, displayedCharacter.phy_atk)}
        ${renderLabDetailStat("物理防御", "phy_def", character.phy_def, displayedCharacter.phy_def)}
        ${renderLabDetailStat("特殊攻撃", "sp_atk", character.sp_atk, displayedCharacter.sp_atk)}
        ${renderLabDetailStat("特殊防御", "sp_def", character.sp_def, displayedCharacter.sp_def)}
        ${renderLabDetailStat("敏捷", "speed", character.speed, displayedCharacter.speed)}
        ${renderLabDetailStat("回復力", "regen_value", displayedCharacter.regen_value, character.regen_value)}
      </div>
      <div class="detail-skills">
        <div class="detail-section-title">技</div>
        ${movesForCharacter(character)
          .map((move) => renderSkillDetail(move))
          .join("")}
      </div>
      <div class="detail-resistances">
        <div class="detail-section-title">属性耐性</div>
        <div class="resistance-grid">
          ${ELEMENT_TYPES.map((element) => resistanceCell(displayedCharacter, element)).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderLabDetailRow(label, value, options = {}) {
  const displayValue = value == null || value === "" ? "－" : value;
  const valueHtml = options.html ? displayValue : escapeHtml(displayValue);
  return `<div class="dex-data-row"><span>${escapeHtml(label)}</span><strong>${valueHtml}</strong></div>`;
}

function renderLabDetailStat(label, statKey, baseValue, displayValue) {
  const base = number(baseValue);
  const displayed = number(displayValue);
  const diff = displayed - base;
  const breakdown = diff
    ? `<div class="lab-detail-stat-breakdown">${escapeHtml(displayed)}（基礎${escapeHtml(base)}${diff > 0 ? "＋" : "－"}装備${escapeHtml(Math.abs(diff))}）</div>`
    : "";
  return `
    <div class="lab-detail-stat-item">
      ${detailStat(label, displayed, statKey, { baseValue: base })}
      ${breakdown}
    </div>
  `;
}

function renderLabAccessorySummary(equipment) {
  if (!equipment) {
    return `
      <div class="my-house-accessory-panel lab-detail-accessory-panel">
        <div class="my-house-accessory-header">
          <div>
            <div class="my-house-accessory-label">アクセサリー</div>
            <strong>なし</strong>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="my-house-accessory-panel lab-detail-accessory-panel">
      <div class="my-house-accessory-header">
        <div>
          <div class="my-house-accessory-label">アクセサリー</div>
          <strong>${escapeHtml(equipment.name || "－")}</strong>
          ${renderEquipmentBonusList(equipment)}
          ${equipment.text ? `<span class="accessory-description">${escapeHtml(equipment.text)}</span>` : ""}
        </div>
      </div>
    </div>
  `;
}

function labStorageLabel(ownedMonster) {
  return partyOwnedIdSet().has(ownedMonster?.ownedId) ? "Members" : "LAB";
}

function characterRankLabel(character) {
  return safeText(character?.rank ?? character?.rank_id ?? character?.rankId, "－");
}

async function showStoryMain({ focus = true } = {}) {
  if (gameDataPromise) {
    await gameDataPromise;
  }

  state.story.active = false;
  state.shop.open = false;
  state.shop.confirmEntryId = null;
  state.shop.exchangeEntryId = null;
  state.shop.offerOwnedIds = [];
  clearStoryWalkTimer();
  hideRankBattleConfirm();
  els.businessShopPanel?.classList.add("is-hidden");
  els.myHousePanel?.classList.add("is-hidden");
  els.myPartyPanel?.classList.add("is-hidden");
  showStoryFrame();
  playBgm(storyIslandBgmId());
  setStoryStage("main");
  updateStoryRankBattleButtons();
  if (focus) els.storyBackButton.focus({ preventScroll: true });
}

async function showMyParty() {
  if (gameDataPromise) {
    await gameDataPromise;
  }

  state.story.active = false;
  state.shop.open = false;
  state.shop.confirmEntryId = null;
  state.shop.exchangeEntryId = null;
  state.shop.offerOwnedIds = [];
  initializeSaveDataParty({ persist: false });
  ensureMyPartySelection();
  hideRankBattleConfirm();
  showStoryFrame();
  setStoryStage("myParty");
  renderMyParty();
  els.myPartyBackButton?.focus({ preventScroll: true });
}

function hideMyParty() {
  els.myPartyPanel?.classList.add("is-hidden");
  showStoryMain();
}

async function showBusinessShop() {
  if (gameDataPromise) {
    await gameDataPromise;
  }

  state.story.active = false;
  hideMyHouse({ restoreTravel: false });
  hideBusiness2({ restoreTravel: false });
  initializeSaveDataParty({ persist: false });
  attachBusinessShopPanel(els.businessScreen);
  state.shop.open = false;
  state.shop.currentShopId = BUSINESS_SHOP_ID;
  state.shop.itemFilter = "";
  state.shop.confirmEntryId = null;
  state.shop.exchangeEntryId = null;
  state.shop.offerOwnedIds = [];
  hideRankBattleConfirm();
  showStoryFrame();
  setStoryStage("business");
  els.businessShopPanel?.classList.add("is-hidden");
  els.businessBackButton?.focus({ preventScroll: true });
  void showNpcDialogue("merchant");
}

async function openBusinessShop(itemFilter) {
  if (gameDataPromise) {
    await gameDataPromise;
  }

  attachBusinessShopPanel(els.businessScreen);
  state.shop.open = true;
  state.shop.currentShopId = BUSINESS_SHOP_ID;
  state.shop.itemFilter = itemFilter;
  state.shop.confirmEntryId = null;
  state.shop.exchangeEntryId = null;
  state.shop.offerOwnedIds = [];
  els.businessShopPanel?.classList.remove("is-hidden");
  renderBusinessShop();
  els.businessShopBackButton?.focus({ preventScroll: true });
}

function hideBusinessShop({ restoreTravel = true } = {}) {
  state.shop.open = false;
  state.shop.itemFilter = "";
  state.shop.confirmEntryId = null;
  state.shop.exchangeEntryId = null;
  state.shop.offerOwnedIds = [];
  els.businessShopPanel?.classList.add("is-hidden");
  if (restoreTravel) showStoryTravel();
}

async function leaveBusinessShop() {
  state.shop.open = false;
  state.shop.itemFilter = "";
  state.shop.confirmEntryId = null;
  state.shop.exchangeEntryId = null;
  state.shop.offerOwnedIds = [];
  els.businessShopPanel?.classList.add("is-hidden");
  await showDialogue("merchant", "merchant_goodbye");
  showStoryTravel();
}

async function showBusiness2() {
  if (gameDataPromise) {
    await gameDataPromise;
  }

  state.story.active = false;
  hideBusinessShop({ restoreTravel: false });
  hideMyHouse({ restoreTravel: false });
  attachBusinessShopPanel(els.business2Screen);
  initializeSaveDataParty({ persist: false });
  state.shop.open = false;
  state.shop.currentShopId = BUSINESS2_SHOP_ID;
  state.shop.itemFilter = SHOP_ITEM_FILTER_EQUIPMENT;
  state.shop.confirmEntryId = null;
  state.shop.exchangeEntryId = null;
  state.shop.offerOwnedIds = [];
  clearStoryWalkTimer();
  hideRankBattleConfirm();
  showStoryFrame();
  setStoryStage("business2");
  els.businessShopPanel?.classList.add("is-hidden");
  els.business2BackButton?.focus({ preventScroll: true });
  void showNpcDialogue("blacksmith");
}

async function openBusiness2Shop() {
  if (gameDataPromise) {
    await gameDataPromise;
  }

  attachBusinessShopPanel(els.business2Screen);
  hideMyHousePanel({ focus: false });
  state.shop.open = true;
  state.shop.currentShopId = BUSINESS2_SHOP_ID;
  state.shop.itemFilter = SHOP_ITEM_FILTER_EQUIPMENT;
  state.shop.confirmEntryId = null;
  state.shop.exchangeEntryId = null;
  state.shop.offerOwnedIds = [];
  els.businessShopPanel?.classList.remove("is-hidden");
  renderBusinessShop();
  els.businessShopBackButton?.focus({ preventScroll: true });
}

async function openBusiness2EquipmentChange() {
  if (gameDataPromise) {
    await gameDataPromise;
  }

  attachMyHousePanel(els.business2Screen);
  state.story.active = false;
  state.shop.open = false;
  state.shop.confirmEntryId = null;
  state.shop.exchangeEntryId = null;
  state.shop.offerOwnedIds = [];
  els.businessShopPanel?.classList.add("is-hidden");
  initializeSaveDataParty({ persist: false });
  showMyHouseSection("party");
}

function hideBusiness2({ restoreTravel = true } = {}) {
  state.shop.open = false;
  state.shop.itemFilter = "";
  state.shop.confirmEntryId = null;
  state.shop.exchangeEntryId = null;
  state.shop.offerOwnedIds = [];
  els.businessShopPanel?.classList.add("is-hidden");
  hideMyHousePanel({ focus: false });
  if (restoreTravel) showStoryTravel();
}

async function leaveBusiness2() {
  state.shop.open = false;
  state.shop.itemFilter = "";
  state.shop.confirmEntryId = null;
  state.shop.exchangeEntryId = null;
  state.shop.offerOwnedIds = [];
  els.businessShopPanel?.classList.add("is-hidden");
  hideMyHousePanel({ focus: false });
  await showDialogue("blacksmith", "blacksmith_goodbye");
  showStoryTravel();
}

function closeBusinessShopPanel() {
  const shopId = currentShopId();
  state.shop.open = false;
  state.shop.confirmEntryId = null;
  state.shop.exchangeEntryId = null;
  state.shop.offerOwnedIds = [];
  els.businessShopPanel?.classList.add("is-hidden");
  if (shopId === BUSINESS2_SHOP_ID) {
    els.business2BackButton?.focus({ preventScroll: true });
  } else {
    els.businessBackButton?.focus({ preventScroll: true });
  }
}

function attachBusinessShopPanel(container) {
  if (!container || !els.businessShopPanel) return;
  if (els.businessShopPanel.parentElement !== container) {
    container.appendChild(els.businessShopPanel);
  }
}

function attachMyHousePanel(container) {
  if (!container || !els.myHousePanel) return;
  if (els.myHousePanel.parentElement !== container) {
    container.appendChild(els.myHousePanel);
  }
}

async function showArena() {
  if (gameDataPromise) {
    await gameDataPromise;
  }

  state.story.active = false;
  state.shop.open = false;
  hideBusinessShop({ restoreTravel: false });
  hideBusiness2({ restoreTravel: false });
  hideMyHouse({ restoreTravel: false });
  clearStoryWalkTimer();
  hideRankBattleConfirm();
  renderArenaHotspots();
  showStoryFrame();
  setStoryStage("arena");
  playBgm("arena");
  hideArenaBattleConfirm({ clearSelection: true, focus: false });
  if (els.arenaMessage) els.arenaMessage.textContent = "";
  els.arenaBackButton?.focus({ preventScroll: true });
  void showDialogue("battlemaster", "battlemaster_welcome");
}

async function hideArena() {
  hideArenaBattleConfirm({ clearSelection: true, focus: false });
  if (els.arenaMessage) els.arenaMessage.textContent = "";
  await showDialogue("battlemaster", "battlemaster_goodbye");
  showStoryTravel();
}

function renderArenaHotspots() {
  if (!els.arenaHotspots) return;
  els.arenaHotspots.innerHTML = ARENA_STAGE_AREAS.map((area) => {
    const style = `left: ${area.left}%; top: ${area.top}%; width: ${area.width}%; height: ${area.height}%;`;
    return `
      <button
        class="story-location-button arena-hotspot-button"
        type="button"
        data-arena-id="${area.id}"
        style="${style}"
        aria-label="${area.id}"
        title="${area.id}"
      ></button>
    `;
  }).join("");
}

async function handleArenaHotspotClick(event) {
  const button = event.target.closest("[data-arena-id]");
  if (!button || !els.arenaHotspots?.contains(button)) return;
  event.preventDefault();
  await showArenaBattleConfirm(button.dataset.arenaId);
}

async function showArenaBattleConfirm(entranceId) {
  const arenaEntranceId = safeText(entranceId);
  if (gameDataPromise) {
    await gameDataPromise;
  }

  const details = resolveArenaBattleDetails(arenaEntranceId);
  if (!details.ok) {
    hideArenaBattleConfirm({ clearSelection: true, focus: false });
    if (details.missing !== "locked") warnArenaDataMissing(details);
    showArenaMessage(ARENA_UNAVAILABLE_MESSAGE, { isError: true });
    return;
  }

  state.story.selectedArenaEntranceId = arenaEntranceId;
  state.story.selectedArenaBattleId = details.rankBattleId;
  renderArenaBattleConfirm(details);
  showArenaMessage("");
  els.arenaConfirmPanel?.classList.remove("is-hidden");
  els.arenaChallengeButton?.focus({ preventScroll: true });
}

function resolveArenaBattleDetails(entranceId) {
  const rankBattleId = ARENA_BATTLE_MAP[entranceId];
  if (!rankBattleId) {
    return { ok: false, entranceId, missing: "ARENA_BATTLE_MAP" };
  }

  const rankBattle = state.rankBattles.get(rankBattleId);
  if (!rankBattle) {
    return { ok: false, entranceId, rankBattleId, missing: "rank_battle.csv" };
  }

  if (isStoryRankBattleDisabled(rankBattleId)) {
    return { ok: false, entranceId, rankBattleId, missing: "locked" };
  }

  const enemyPartyId = safeText(rankBattle.enemy_party_id);
  if (!enemyPartyId) {
    return { ok: false, entranceId, rankBattleId, missing: "enemy_party_id" };
  }

  const enemyParty = state.enemyParties.get(enemyPartyId);
  if (!enemyParty) {
    return { ok: false, entranceId, rankBattleId, enemyPartyId, missing: "enemy_party.csv" };
  }

  const missingCharacterIds = [];
  const enemies = enemyParty.characterIds
    .map((characterId) => {
      const character = state.characterMap.get(characterId);
      if (!character) missingCharacterIds.push(characterId);
      return character;
    })
    .filter(Boolean);

  if (missingCharacterIds.length || !enemies.length) {
    return {
      ok: false,
      entranceId,
      rankBattleId,
      enemyPartyId,
      missing: "character.csv",
      missingCharacterIds,
    };
  }

  return {
    ok: true,
    entranceId,
    rankBattleId,
    rankBattle,
    enemyPartyId,
    enemyParty,
    enemies,
  };
}

function renderArenaBattleConfirm(details) {
  if (!els.arenaConfirmContent) return;
  els.arenaConfirmContent.innerHTML = renderRankBattleConfirmContent(details);
}

function renderRankBattleConfirmContent(details) {
  const opponentName = safeText(details.rankBattle?.name, "\uFF1F\uFF1F\uFF1F");
  const rewardMoney = Math.max(0, Math.floor(number(details.rankBattle?.reward_money)));
  const badgeLabel = safeText(details.entranceId ?? details.rankBattle?.rank, details.rankBattleId);
  return `
    <div class="arena-confirm-header">
      <div>
        <div class="arena-confirm-entrance">${escapeHtml(badgeLabel)}</div>
        <div class="arena-confirm-title">${escapeHtml(opponentName)}</div>
      </div>
      <div class="arena-confirm-reward">&#x5831;&#x916C; ${escapeHtml(rewardMoney)}z</div>
    </div>
    <div class="arena-confirm-party-title">&#x6575;&#x30D1;&#x30FC;&#x30C6;&#x30A3;</div>
    <div class="arena-confirm-party">
      ${details.enemies.map(renderArenaEnemyCard).join("")}
    </div>
    ${renderArenaUnlockBattles(details.rankBattle)}
    ${renderRankBattleUnlockShopItems(details.rankBattleId)}
  `;
}

function renderArenaUnlockBattles(rankBattle) {
  const unlockBattleIds = Array.isArray(rankBattle.unlockBattleIds) ? rankBattle.unlockBattleIds : [];
  if (!unlockBattleIds.length) return "";

  return `
    <div class="arena-unlock-section">
      <div class="arena-unlock-title">\u89e3\u653e\u3055\u308c\u308b\u5bfe\u6226</div>
      <div class="arena-unlock-list">
        ${unlockBattleIds.map(renderArenaUnlockBattleBadge).join("")}
      </div>
    </div>
  `;
}

function renderArenaUnlockBattleBadge(rankBattleId) {
  const rankBattle = state.rankBattles.get(rankBattleId);
  if (!rankBattle) {
    console.warn("[Arena] unlock battle data not found", { rankBattleId });
  }

  return `<span class="arena-unlock-battle">${escapeHtml(rankBattleUnlockLabel(rankBattleId))}</span>`;
}

function rankBattleUnlockLabel(rankBattleId) {
  const id = safeText(rankBattleId);
  const arenaEntranceId = ARENA_BATTLE_ENTRANCE_BY_ID[id];
  if (arenaEntranceId) return arenaEntranceId;

  const rankBattle = state.rankBattles.get(id);
  return safeText(rankBattle?.rank, "\uFF1F\uFF1F\uFF1F");
}

function renderRankBattleUnlockShopItems(rankBattleId) {
  const items = shopItemsUnlockedByRankBattle(rankBattleId);
  if (!items.length) return "";

  return `
    <div class="arena-shop-unlock-section">
      <div class="arena-shop-unlock-title">\u89e3\u653e\u3055\u308c\u308b\u30e9\u30a4\u30bb\u30f3\u30b9</div>
      <div class="arena-shop-unlock-list">
        ${items.map(renderRankBattleUnlockShopItem).join("")}
      </div>
    </div>
  `;
}

function shopItemsUnlockedByRankBattle(rankBattleId) {
  const id = safeText(rankBattleId);
  if (!id) return [];
  return state.shopItems
    .filter((item) => safeText(item.unlock_condition) === id)
    .filter((item) => shopContentExists(item))
    .sort((a, b) => a.display_order - b.display_order || a.shop_entry_id.localeCompare(b.shop_entry_id));
}

function renderRankBattleUnlockShopItem(item) {
  return `<span class="arena-shop-unlock-item">${escapeHtml(rankBattleUnlockShopItemName(item))}</span>`;
}

function rankBattleUnlockShopItemName(item) {
  if (item.item_type !== "book") return shopItemName(item);

  const bookName = state.encyclopediaBooks.get(item.content_id)?.name || item.content_id;
  return encyclopediaBookUnlockDisplayName(bookName);
}

function encyclopediaBookUnlockDisplayName(name) {
  const text = safeText(name);
  if (!text || text.includes("図鑑")) return text;

  const volumeMatch = text.match(/^(.*?種)(・(?:上巻|中巻|下巻))$/);
  if (volumeMatch) {
    return `${volumeMatch[1]}図鑑${volumeMatch[2]}`;
  }

  return `${text}図鑑`;
}

function renderArenaEnemyCard(character) {
  const characterName = safeText(character.name, "\uFF1F\uFF1F\uFF1F");
  return `
    <article class="arena-enemy-card">
      <span class="arena-enemy-image-frame">
        <img class="arena-enemy-image" src="${escapeHtml(character.imageSrc)}" alt="${escapeHtml(characterName)}" />
      </span>
      <span class="arena-enemy-info">
        <strong class="arena-enemy-name">${escapeHtml(characterName)}</strong>
        <span class="arena-enemy-meta">
          ${elementPill(character.element)}
          <span class="arena-enemy-slots">${slotMarks(character.slot)}</span>
        </span>
      </span>
    </article>
  `;
}

function hideArenaBattleConfirm(options = {}) {
  const clearSelection = options?.clearSelection ?? true;
  const focus = options?.focus ?? true;
  els.arenaConfirmPanel?.classList.add("is-hidden");
  if (els.arenaConfirmContent) els.arenaConfirmContent.innerHTML = "";
  if (clearSelection) {
    state.story.selectedArenaEntranceId = null;
    state.story.selectedArenaBattleId = null;
  }
  showArenaMessage("");
  if (focus) els.arenaBackButton?.focus({ preventScroll: true });
}

async function handleArenaChallengeClick() {
  const rankBattleId = state.story.selectedArenaBattleId;
  if (!rankBattleId) {
    showArenaMessage(ARENA_UNAVAILABLE_MESSAGE, { isError: true });
    console.warn("[Arena] challenge requested without selectedArenaBattleId");
    return;
  }

  const entranceId = state.story.selectedArenaEntranceId || ARENA_BATTLE_ENTRANCE_BY_ID[rankBattleId];
  const details = resolveArenaBattleDetails(entranceId);
  if (!details.ok) {
    if (details.missing !== "locked") warnArenaDataMissing(details);
    showArenaMessage(ARENA_UNAVAILABLE_MESSAGE, { isError: true });
    return;
  }

  hideArenaBattleConfirm({ clearSelection: false, focus: false });
  showArenaMessage("");
  await startRankBattle(rankBattleId);
}

function showArenaMessage(message, { isError = false } = {}) {
  if (!els.arenaMessage) return;
  els.arenaMessage.textContent = message;
  els.arenaMessage.classList.toggle("is-error", isError);
}

function warnArenaDataMissing(details) {
  console.warn("[Arena] battle data not found", {
    entranceId: details.entranceId,
    rankBattleId: details.rankBattleId,
    enemyPartyId: details.enemyPartyId,
    missing: details.missing,
    missingCharacterIds: details.missingCharacterIds,
  });
}

function showDialogue(npcId, dialogueId, options = {}) {
  return dialogueManager.show(npcId, dialogueId, options);
}

function markDialogueSeenOnComplete(dialogueId) {
  const id = safeText(dialogueId);
  const dialogue = dialogueManager.getDialogue(id);
  if (!id || !dialogue?.once || state.saveData.seenDialogueIds.has(id)) return;
  state.saveData.seenDialogueIds.add(id);
  markUnsavedChanges();
  saveGameData();
}

function dialogueConditionMatches(dialogue) {
  const conditionType = safeText(dialogue?.condition_type).toLowerCase();
  const conditionValue = safeText(dialogue?.condition_value);
  if (!conditionType) return false;
  if (conditionType === DIALOGUE_CONDITION_ALWAYS) return true;
  if (!conditionValue) return false;
  if (conditionType === DIALOGUE_CONDITION_BATTLE_AVAILABLE) {
    return isStoryRankBattleUnlocked(conditionValue) && !isStoryRankBattleCleared(conditionValue);
  }
  if (conditionType === DIALOGUE_CONDITION_BATTLE_CLEARED) {
    return isStoryRankBattleCleared(conditionValue);
  }
  console.warn("[Dialogue] unknown condition_type", {
    dialogueId: dialogue?.dialogue_id,
    conditionType,
  });
  return false;
}

function selectNpcConditionalDialogue(npcId, options = {}) {
  const conditionType = safeText(options.conditionType).toLowerCase();
  const conditionValue = safeText(options.conditionValue);
  const candidates = dialogueManager.conditionalStartDialogues(npcId)
    .filter((dialogue) => !conditionType || dialogue.condition_type === conditionType)
    .filter((dialogue) => !conditionValue || dialogue.condition_value === conditionValue)
    .filter(dialogueConditionMatches)
    .sort((a, b) => b.priority - a.priority);

  const selected = candidates[0] ?? null;
  if (!selected) return null;
  if (selected.once && state.saveData.seenDialogueIds.has(selected.dialogue_id)) {
    return null;
  }
  return selected;
}

async function showNpcDialogue(npcId, options = {}) {
  const selected = selectNpcConditionalDialogue(npcId, options);
  const fallbackId = safeText(options.fallbackId, NPC_DEFAULT_DIALOGUE_IDS[safeText(npcId)] || "");
  const fallback = options.allowFallback === false ? null : dialogueManager.getDialogue(fallbackId);
  const dialogue = selected || fallback;
  if (!dialogue) return false;
  return showDialogue(dialogue.npc_id, dialogue.dialogue_id, {
    onComplete: markDialogueSeenOnComplete,
  });
}

function showNpcConditionalDialogue(npcId, options = {}) {
  return showNpcDialogue(npcId, { ...options, allowFallback: false });
}

async function showRankBattleVictoryDialogues(rankBattleId) {
  const id = safeText(rankBattleId);
  if (!id) return;
  await showNpcConditionalDialogue("guide", {
    conditionType: DIALOGUE_CONDITION_BATTLE_CLEARED,
    conditionValue: id,
  });
  await showNpcConditionalDialogue("chief", {
    conditionType: DIALOGUE_CONDITION_BATTLE_CLEARED,
    conditionValue: id,
  });
}

async function showMyHouse() {
  if (gameDataPromise) {
    await gameDataPromise;
  }

  attachMyHousePanel(els.myHouseScreen);
  hideBusinessShop({ restoreTravel: false });
  hideBusiness2({ restoreTravel: false });
  initializeSaveDataParty({ persist: false });
  ensureMyHouseSelection();
  state.myHouse.activeSection = null;
  hideRankBattleConfirm();
  showStoryFrame();
  setStoryStage("myHouse");
  hideMyHousePanel({ focus: false });
  els.myHouseScreenBackButton?.focus({ preventScroll: true });
}

function hideMyHouse({ restoreTravel = true } = {}) {
  state.myHouse.activeSection = null;
  els.myHousePanel?.classList.add("is-hidden");
  if (restoreTravel) showStoryTravel();
}

function hideMyHousePanel({ focus = true } = {}) {
  state.myHouse.activeSection = null;
  state.myHouse.accessoryEditorOwnedId = null;
  els.myHousePanel?.classList.add("is-hidden");
  if (focus) {
    const fallbackFocus = els.business2Screen && !els.business2Screen.classList.contains("is-hidden")
      ? els.business2BackButton
      : els.myHouseScreenBackButton;
    fallbackFocus?.focus({ preventScroll: true });
  }
}

function showMyHouseSection(section) {
  const nextSection = ["save", "books", "party"].includes(section) ? section : "party";
  state.myHouse.activeSection = nextSection;
  if (nextSection === "books") {
    state.myHouse.detailMode = "book";
  } else if (nextSection === "party") {
    state.myHouse.detailMode = "owned";
  }
  ensureMyHouseSelection();
  els.myHousePanel?.classList.remove("is-hidden");
  renderMyHouse();
  els.myHouseBackButton?.focus({ preventScroll: true });
}

function renderMyHouse() {
  if (!els.myHousePanel) return;

  ensureMyHouseSelection();
  const activeSection = state.myHouse.activeSection || "party";
  if (activeSection === "books") {
    state.myHouse.detailMode = "book";
  } else if (activeSection === "party") {
    state.myHouse.detailMode = "owned";
  }
  els.myHousePanel.classList.toggle("my-house-mode-save", activeSection === "save");
  els.myHousePanel.classList.toggle("my-house-mode-books", activeSection === "books");
  els.myHousePanel.classList.toggle("my-house-mode-party", activeSection === "party");

  const monsterEntries = myPartyMonsterEntries();
  const ownedBooks = myHouseOwnedBooks();
  const encyclopediaCharacters = myHouseEncyclopediaCharacters();
  const selectedMonster = monsterEntries.find((entry) => entry.ownedId === state.myHouse.selectedOwnedId);
  const selectedBookCharacter = encyclopediaCharacters.find(
    (character) => character.character_id === state.myHouse.selectedBookCharacterId,
  );
  const detailCharacter = state.myHouse.detailMode === "owned" ? selectedMonster?.character : null;
  const detailOwnedMonster = state.myHouse.detailMode === "owned" ? selectedMonster?.ownedMonster : null;

  els.myHouseMonsterList.innerHTML = monsterEntries.length
    ? monsterEntries.map((entry, index) => renderMyHousePartyMonsterCard(entry, index)).join("")
    : `<div class="shop-empty">手持ちモンスターはいません。</div>`;

  els.myHouseBookList.innerHTML = encyclopediaCharacters.length
    ? encyclopediaCharacters.map(renderMyHouseEncyclopediaCharacterButton).join("")
    : `<div class="shop-empty">登録モンスターがありません。</div>`;

  els.myHouseBookContent.innerHTML = renderMyHouseEncyclopediaContent(encyclopediaCharacters, ownedBooks);

  els.myHouseDetailPanel.innerHTML =
    state.myHouse.detailMode === "book"
      ? selectedBookCharacter
        ? renderMyHouseEncyclopediaDetail(selectedBookCharacter)
        : `<div class="my-house-book-empty">モンスターを選択してください。</div>`
      : detailCharacter
        ? renderMyHouseMonsterDetail(detailCharacter, detailOwnedMonster)
        : `<div class="my-house-book-empty">モンスターを選択してください。</div>`;

  renderMyHouseSaveControls();

  for (const button of els.myHouseMonsterList.querySelectorAll("[data-my-house-owned-id]")) {
    button.addEventListener("click", () => {
      state.myHouse.selectedOwnedId = button.dataset.myHouseOwnedId;
      state.myHouse.detailMode = "owned";
      if (state.myHouse.accessoryEditorOwnedId !== state.myHouse.selectedOwnedId) {
        state.myHouse.accessoryEditorOwnedId = null;
      }
      renderMyHouse();
    });
  }

  for (const button of els.myHouseMonsterList.querySelectorAll("[data-party-lead-swap]")) {
    button.addEventListener("click", () => {
      if (button.disabled) return;
      const result = swapPartyMemberWithLead(button.dataset.partyLeadSwap);
      showSaveStatus(result.message, { isError: !result.ok });
    });
  }

  for (const button of els.myHouseBookList.querySelectorAll("[data-my-house-book-character-id]")) {
    button.addEventListener("click", () => {
      state.myHouse.selectedBookCharacterId = button.dataset.myHouseBookCharacterId;
      state.myHouse.detailMode = "book";
      state.myHouse.accessoryEditorOwnedId = null;
      renderMyHouse();
    });
  }

  for (const button of els.myHouseDetailPanel.querySelectorAll("[data-my-house-accessory-change]")) {
    button.addEventListener("click", () => {
      state.myHouse.accessoryEditorOwnedId =
        state.myHouse.accessoryEditorOwnedId === button.dataset.myHouseAccessoryChange
          ? null
          : button.dataset.myHouseAccessoryChange;
      renderMyHouse();
    });
  }

  for (const button of els.myHouseDetailPanel.querySelectorAll("[data-my-house-accessory-id]")) {
    button.addEventListener("click", () => {
      if (button.disabled) return;
      updateOwnedMonsterAccessory(button.dataset.myHouseOwnedId, button.dataset.myHouseAccessoryId || "");
    });
  }
}

function renderMyParty() {
  if (!els.myPartyPanel) return;

  ensureMyPartySelection();

  const monsterEntries = myPartyMonsterEntries();
  const selectedMonster = monsterEntries.find((entry) => entry.ownedId === state.myParty.selectedOwnedId);

  els.myPartyMonsterList.innerHTML = monsterEntries.length
    ? monsterEntries.map((entry, index) => renderMyPartyMonsterCard(entry, index)).join("")
    : `<div class="shop-empty">手持ちモンスターはいません。</div>`;

  els.myPartyDetailPanel.innerHTML = selectedMonster
    ? renderMyHouseMonsterDetail(selectedMonster.character, selectedMonster.ownedMonster)
    : `<div class="my-house-book-empty">モンスターを選択してください。</div>`;

  for (const button of els.myPartyMonsterList.querySelectorAll("[data-my-party-owned-id]")) {
    button.addEventListener("click", () => {
      state.myParty.selectedOwnedId = button.dataset.myPartyOwnedId;
      state.myHouse.selectedOwnedId = state.myParty.selectedOwnedId;
      state.myHouse.detailMode = "owned";
      if (state.myHouse.accessoryEditorOwnedId !== state.myParty.selectedOwnedId) {
        state.myHouse.accessoryEditorOwnedId = null;
      }
      renderMyParty();
    });
  }

  for (const button of els.myPartyMonsterList.querySelectorAll("[data-party-lead-swap]")) {
    button.addEventListener("click", () => {
      if (button.disabled) return;
      swapPartyMemberWithLead(button.dataset.partyLeadSwap);
    });
  }

  for (const button of els.myPartyDetailPanel.querySelectorAll("[data-my-house-accessory-change]")) {
    button.addEventListener("click", () => {
      state.myHouse.accessoryEditorOwnedId =
        state.myHouse.accessoryEditorOwnedId === button.dataset.myHouseAccessoryChange
          ? null
          : button.dataset.myHouseAccessoryChange;
      renderMyParty();
    });
  }

  for (const button of els.myPartyDetailPanel.querySelectorAll("[data-my-house-accessory-id]")) {
    button.addEventListener("click", () => {
      if (button.disabled) return;
      updateOwnedMonsterAccessory(button.dataset.myHouseOwnedId, button.dataset.myHouseAccessoryId || "");
    });
  }
}

function ensureMyHouseSelection() {
  const monsterEntries = myPartyMonsterEntries();
  if (!monsterEntries.some((entry) => entry.ownedId === state.myHouse.selectedOwnedId)) {
    state.myHouse.selectedOwnedId = monsterEntries[0]?.ownedId ?? null;
  }

  const ownedBooks = myHouseOwnedBooks();
  if (!ownedBooks.some((book) => book.book_id === state.myHouse.selectedBookId)) {
    state.myHouse.selectedBookId = ownedBooks[0]?.book_id ?? null;
  }

  const encyclopediaCharacters = myHouseEncyclopediaCharacters();
  if (!encyclopediaCharacters.some((character) => character.character_id === state.myHouse.selectedBookCharacterId)) {
    state.myHouse.selectedBookCharacterId = encyclopediaCharacters[0]?.character_id ?? null;
  }

  if (state.myHouse.detailMode === "book" && !state.myHouse.selectedBookCharacterId) {
    state.myHouse.detailMode = state.myHouse.selectedOwnedId ? "owned" : "book";
  }
}

function ensureMyPartySelection() {
  const monsterEntries = myPartyMonsterEntries();
  if (!monsterEntries.some((entry) => entry.ownedId === state.myParty.selectedOwnedId)) {
    state.myParty.selectedOwnedId = monsterEntries[0]?.ownedId ?? null;
  }
  state.myHouse.selectedOwnedId = state.myParty.selectedOwnedId;
  state.myHouse.detailMode = "owned";
}

function myPartyMonsterEntries() {
  return partyOwnedMonsterEntries()
    .map((entry) => ({
      ownedId: entry.ownedId,
      ownedMonster: entry,
      character: state.characterMap.get(entry.characterId),
    }))
    .filter((entry) => entry.ownedId && entry.character);
}

function myHouseMonsterEntries() {
  return state.saveData.ownedMonsters
    .map((entry) => ({
      ownedId: entry.ownedId,
      ownedMonster: entry,
      character: state.characterMap.get(entry.characterId),
    }))
    .filter((entry) => entry.ownedId && entry.character);
}

function myHouseOwnedBooks() {
  return [...state.saveData.ownedBooks]
    .map((bookId) => state.encyclopediaBooks.get(bookId))
    .filter(Boolean);
}

function myHouseBookCharacters(book) {
  return (book?.characterIds ?? [])
    .map((characterId) => state.characterMap.get(characterId))
    .filter(Boolean);
}

function myHouseEncyclopediaCharacters() {
  return charactersByDisplayOrder();
}

function storyBattleEncyclopediaCharacterIds() {
  const characterIds = new Set();
  for (const bookId of state.saveData.ownedBooks) {
    const book = state.encyclopediaBooks.get(bookId);
    if (!book) continue;
    for (const characterId of book.characterIds) {
      characterIds.add(characterId);
    }
  }
  return characterIds;
}

function canViewPurchasedEncyclopediaCharacter(characterId) {
  const id = safeText(characterId);
  return id ? storyBattleEncyclopediaCharacterIds().has(id) : false;
}

function canViewStoryBattleEncyclopedia(characterId) {
  const id = safeText(characterId);
  if (!id) return false;
  if (!state.story.currentRankBattleId && !state.story.currentArenaBattleId) return true;
  return storyBattleEncyclopediaCharacterIds().has(id);
}

function renderMyHouseMonsterCard(entry) {
  const character = entry.character;
  const selected = state.myHouse.detailMode === "owned" && entry.ownedId === state.myHouse.selectedOwnedId;
  const isFirst = currentPartyOwnedIds()[0] === entry.ownedId;
  return `
    <div class="my-house-monster-row">
      <button class="my-house-monster-card ${selected ? "is-selected" : ""}" type="button" data-my-house-owned-id="${escapeHtml(entry.ownedId)}">
        <span class="my-house-monster-image-frame">
          <img class="my-house-monster-image" src="${escapeHtml(character.imageSrc)}" alt="${escapeHtml(character.name)}" />
        </span>
        <span class="my-house-monster-info">
          <strong class="my-house-monster-name">${escapeHtml(character.name)}</strong>
          <span class="my-house-monster-meta">${elementPill(character.element)} <span>slot ${slotMarks(character.slot)}</span></span>
          <span class="my-house-mini-stats">
            <span>HP ${escapeHtml(character.hp)}</span>
            <span>攻 ${escapeHtml(character.phy_atk)}</span>
            <span>防 ${escapeHtml(character.phy_def)}</span>
            <span>特攻 ${escapeHtml(character.sp_atk)}</span>
            <span>特防 ${escapeHtml(character.sp_def)}</span>
            <span>速 ${escapeHtml(character.speed)}</span>
          </span>
        </span>
      </button>
      <button class="small-button my-house-first-button" type="button" data-party-lead-swap="${escapeHtml(entry.ownedId)}" ${isFirst ? "disabled" : ""}>
        先頭と入替
      </button>
    </div>
  `;
}

function renderMyHousePartyMonsterCard(entry, index) {
  const character = entry.character;
  const selected = state.myHouse.detailMode === "owned" && entry.ownedId === state.myHouse.selectedOwnedId;
  const isFirst = index === 0;
  return `
    <div class="my-house-monster-row">
      <button class="my-house-monster-card ${selected ? "is-selected" : ""}" type="button" data-my-house-owned-id="${escapeHtml(entry.ownedId)}">
        <span class="my-house-monster-image-frame">
          <img class="my-house-monster-image" src="${escapeHtml(character.imageSrc)}" alt="${escapeHtml(character.name)}" />
        </span>
        <span class="my-house-monster-info">
          <strong class="my-house-monster-name">Member ${index + 1}: ${escapeHtml(character.name)}</strong>
          <span class="my-house-monster-meta">${elementPill(character.element)} <span>slot ${slotMarks(character.slot)}</span></span>
          <span class="my-house-mini-stats">
            <span>HP ${escapeHtml(character.hp)}</span>
            <span>攻 ${escapeHtml(character.phy_atk)}</span>
            <span>防 ${escapeHtml(character.phy_def)}</span>
            <span>特攻 ${escapeHtml(character.sp_atk)}</span>
            <span>特防 ${escapeHtml(character.sp_def)}</span>
            <span>敏捷 ${escapeHtml(character.speed)}</span>
          </span>
        </span>
      </button>
      <button class="small-button my-house-first-button" type="button" data-party-lead-swap="${escapeHtml(entry.ownedId)}" ${isFirst ? "disabled" : ""}>
        先頭と入替
      </button>
    </div>
  `;
}

function renderMyPartyMonsterCard(entry, index) {
  const character = entry.character;
  const selected = entry.ownedId === state.myParty.selectedOwnedId;
  const isFirst = index === 0;
  return `
    <div class="my-house-monster-row">
      <button class="my-house-monster-card ${selected ? "is-selected" : ""}" type="button" data-my-party-owned-id="${escapeHtml(entry.ownedId)}">
        <span class="my-house-monster-image-frame">
          <img class="my-house-monster-image" src="${escapeHtml(character.imageSrc)}" alt="${escapeHtml(character.name)}" />
        </span>
        <span class="my-house-monster-info">
          <strong class="my-house-monster-name">Member ${index + 1}: ${escapeHtml(character.name)}</strong>
          <span class="my-house-monster-meta">${elementPill(character.element)} <span>slot ${slotMarks(character.slot)}</span></span>
          <span class="my-house-mini-stats">
            <span>HP ${escapeHtml(character.hp)}</span>
            <span>攻 ${escapeHtml(character.phy_atk)}</span>
            <span>防 ${escapeHtml(character.phy_def)}</span>
            <span>特攻 ${escapeHtml(character.sp_atk)}</span>
            <span>特防 ${escapeHtml(character.sp_def)}</span>
            <span>敏捷 ${escapeHtml(character.speed)}</span>
          </span>
        </span>
      </button>
      <button class="small-button my-house-first-button" type="button" data-party-lead-swap="${escapeHtml(entry.ownedId)}" ${isFirst ? "disabled" : ""}>
        先頭と入替
      </button>
    </div>
  `;
}

function moveOwnedMonsterToFront(ownedId) {
  return swapPartyMemberWithLead(ownedId);
}

function swapPartyMemberWithLead(ownedId) {
  const targetOwnedId = safeText(ownedId);
  const partyIds = currentPartyOwnedIds();
  const targetIndex = partyIds.indexOf(targetOwnedId);

  if (!targetOwnedId || targetIndex < 0) {
    return { ok: false, message: "Members側のモンスターを選択してください" };
  }

  if (targetIndex === 0) {
    return { ok: false, message: "すでに先頭です" };
  }

  const leadOwnedId = partyIds[0];
  if (!leadOwnedId) {
    return { ok: false, message: "先頭メンバーが見つかりません" };
  }

  const nextPartyIds = [...partyIds];
  nextPartyIds[0] = targetOwnedId;
  nextPartyIds[targetIndex] = leadOwnedId;
  state.saveData.partyOwnedIds = nextPartyIds;
  syncOwnedMonsterStorageFromParty();
  syncSelectedIdsFromOwnedMonsters();
  markUnsavedChanges();

  state.myHouse.selectedOwnedId = targetOwnedId;
  state.myParty.selectedOwnedId = targetOwnedId;
  state.myHouse.detailMode = "owned";
  state.myHouse.accessoryEditorOwnedId = null;
  state.labInterior.selectedMemberSlotIndex = 0;
  state.labInterior.selectedMemberOwnedId = targetOwnedId;

  const targetMonster = ownedMonsterByOwnedId(targetOwnedId);
  const leadMonster = ownedMonsterByOwnedId(leadOwnedId);
  const targetName = state.characterMap.get(targetMonster?.characterId)?.name || "モンスター";
  const leadName = state.characterMap.get(leadMonster?.characterId)?.name || "先頭メンバー";
  const message = `${targetName}と${leadName}を入れ替えました`;

  renderSetup();
  if (els.myHousePanel && !els.myHousePanel.classList.contains("is-hidden")) {
    ensureMyHouseSelection();
    renderMyHouse();
  }
  if (els.myPartyPanel && !els.myPartyPanel.classList.contains("is-hidden")) {
    ensureMyPartySelection();
    renderMyParty();
  }
  if (els.labInteriorScreen && !els.labInteriorScreen.classList.contains("is-hidden")) {
    renderLabInterior();
  }

  return { ok: true, message };
}

function renderMyHouseMonsterDetail(character, ownedMonster = null) {
  return renderMyHouseCompleteMonsterDetail(character, ownedMonster);
}

function renderMyHouseCompleteMonsterDetail(character, ownedMonster = null) {
  const equippedAccessory = ownedMonster ? equippedAccessoryForOwnedMonster(ownedMonster, character) : null;
  const displayedCharacter = applyEquipmentBonusesToCharacter(character, equippedAccessory);
  return `
    <div class="my-house-detail-header">
      <div>
        <div class="my-house-detail-title">${escapeHtml(character.name)}</div>
        <div class="detail-subtitle">${characterSubtitle(character)}</div>
      </div>
      <div class="my-house-detail-slot">slot ${slotMarks(character.slot)}</div>
    </div>
    <div class="detail-body my-house-detail-body">
      <div class="detail-profile-column">
        <div class="detail-image-frame my-house-detail-image-frame">
          <img class="detail-image" src="${escapeHtml(character.imageSrc)}" alt="${escapeHtml(character.name)}" />
        </div>
        <div class="detail-summary">
          <div class="dex-data-row"><span>スロット</span><strong>${slotMarks(character.slot)}</strong></div>
          <div class="dex-data-row"><span>EN回復</span><strong>${energyBadge(displayedCharacter.energy_charge)}</strong></div>
          <div class="dex-data-row"><span>弱点</span><strong>${renderWeaknessBadges(displayedCharacter)}</strong></div>
        </div>
        ${ownedMonster ? renderOwnedMonsterAccessorySection(ownedMonster, character) : ""}
      </div>
      <div class="detail-stats my-house-detail-stats">
        ${detailStat("HP", displayedCharacter.hp, "hp", { baseValue: character.hp })}
        ${detailStat("物理攻撃", displayedCharacter.phy_atk, "phy_atk", { baseValue: character.phy_atk })}
        ${detailStat("物理防御", displayedCharacter.phy_def, "phy_def", { baseValue: character.phy_def })}
        ${detailStat("特殊攻撃", displayedCharacter.sp_atk, "sp_atk", { baseValue: character.sp_atk })}
        ${detailStat("特殊防御", displayedCharacter.sp_def, "sp_def", { baseValue: character.sp_def })}
        ${detailStat("敏捷", displayedCharacter.speed, "speed", { baseValue: character.speed })}
        ${detailStat("回復力", displayedCharacter.regen_value, "regen_value", { baseValue: character.regen_value })}
      </div>
      <div class="detail-skills">
        <div class="detail-section-title">技</div>
        ${movesForCharacter(character)
          .map((move) => renderSkillDetail(move))
          .join("")}
      </div>
      <div class="detail-resistances">
        <div class="detail-section-title">属性耐性</div>
        <div class="resistance-grid">
          ${ELEMENT_TYPES.map((element) => resistanceCell(displayedCharacter, element)).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderOwnedMonsterAccessorySection(ownedMonster, character) {
  const accessoryId = safeText(ownedMonster.equipment?.accessory);
  const equipment = accessoryId ? state.equipmentMap.get(accessoryId) : null;
  const isEditorOpen = state.myHouse.accessoryEditorOwnedId === ownedMonster.ownedId;
  return `
    <div class="my-house-accessory-panel">
      <div class="my-house-accessory-header">
        <div>
          <div class="my-house-accessory-label">アクセサリー</div>
          <strong>${escapeHtml(equipment?.name || "装備なし")}</strong>
          ${equipment ? renderEquipmentBonusList(equipment) : ""}
          ${equipment?.text ? `<span class="accessory-description">${escapeHtml(equipment.text)}</span>` : ""}
        </div>
        <button class="small-button" type="button" data-my-house-accessory-change="${escapeHtml(ownedMonster.ownedId)}">変更</button>
      </div>
      ${isEditorOpen ? renderAccessoryChooser(ownedMonster, character) : ""}
    </div>
  `;
}

function renderAccessoryChooser(ownedMonster, character) {
  const rows = [`<button class="accessory-option" type="button" data-my-house-owned-id="${escapeHtml(ownedMonster.ownedId)}" data-my-house-accessory-id="">
    <span>装備しない</span>
    <strong>${ownedMonster.equipment?.accessory ? "解除" : "選択中"}</strong>
  </button>`];

  for (const [equipmentId, count] of state.saveData.ownedEquipment) {
    if (count <= 0) continue;
    const equipment = state.equipmentMap.get(equipmentId);
    if (!isAccessoryEquipment(equipment)) continue;
    rows.push(renderAccessoryOption(ownedMonster, character, equipment, count));
  }

  if (rows.length === 1) {
    rows.push(`<div class="accessory-empty">所持アクセサリーがありません。</div>`);
  }

  return `<div class="accessory-options">${rows.join("")}</div>`;
}

function renderAccessoryOption(ownedMonster, character, equipment, ownedCount) {
  const equipStatus = accessoryEquipStatus(equipment, character);
  const availableCount = availableAccessoryCount(equipment.equipment_id, ownedMonster.ownedId);
  const selected = safeText(ownedMonster.equipment?.accessory) === equipment.equipment_id;
  const disabledReason = !equipStatus.canEquip
    ? equipStatus.reason
    : availableCount <= 0 && !selected
      ? "使用可能数 0"
      : "";
  return `
    <button class="accessory-option ${selected ? "is-selected" : ""}" type="button"
      data-my-house-owned-id="${escapeHtml(ownedMonster.ownedId)}"
      data-my-house-accessory-id="${escapeHtml(equipment.equipment_id)}"
      ${disabledReason ? "disabled" : ""}>
      <span>${escapeHtml(equipment.name)}</span>
      <strong>使用可能 ${escapeHtml(availableCount)} / 所持 ${escapeHtml(ownedCount)}</strong>
      ${renderEquipmentBonusList(equipment)}
      ${equipment.text ? `<span class="accessory-description">${escapeHtml(equipment.text)}</span>` : ""}
      ${disabledReason ? `<em>${escapeHtml(disabledReason)}</em>` : ""}
    </button>
  `;
}

function updateOwnedMonsterAccessory(ownedId, accessoryId) {
  const ownedMonster = state.saveData.ownedMonsters.find((entry) => entry.ownedId === ownedId);
  const character = ownedMonster ? state.characterMap.get(ownedMonster.characterId) : null;
  if (!ownedMonster || !character) return;

  const nextAccessoryId = safeText(accessoryId);
  if (nextAccessoryId) {
    const equipment = state.equipmentMap.get(nextAccessoryId);
    const equipStatus = accessoryEquipStatus(equipment, character);
    if (!isAccessoryEquipment(equipment) || !equipStatus.canEquip) return;
    if (availableAccessoryCount(nextAccessoryId, ownedId) <= 0) return;
  }

  ownedMonster.equipment = normalizeOwnedMonsterEquipment(ownedMonster.equipment);
  ownedMonster.equipment.accessory = nextAccessoryId;
  state.myHouse.accessoryEditorOwnedId = ownedId;
  saveGameData();
  if (els.myHousePanel && !els.myHousePanel.classList.contains("is-hidden")) renderMyHouse();
  if (els.myPartyPanel && !els.myPartyPanel.classList.contains("is-hidden")) renderMyParty();
}

function availableAccessoryCount(equipmentId, selectedOwnedId = "") {
  const ownedCount = ownedEquipmentCount(equipmentId);
  const equippedByOthers = state.saveData.ownedMonsters.filter((entry) =>
    entry.ownedId !== selectedOwnedId &&
    safeText(entry.equipment?.accessory) === equipmentId,
  ).length;
  return Math.max(0, ownedCount - equippedByOthers);
}

function ownedEquipmentCount(equipmentId) {
  return Math.max(0, Math.floor(number(state.saveData.ownedEquipment.get(equipmentId))));
}

function accessoryEquipStatus(equipment, character) {
  if (!isAccessoryEquipment(equipment)) {
    return { canEquip: false, reason: "装備できません" };
  }

  const requiredCharacterId = safeText(equipment.character_id);
  if (requiredCharacterId) {
    const canEquip = requiredCharacterId === character.character_id;
    const requiredCharacter = state.characterMap.get(requiredCharacterId);
    return {
      canEquip,
      reason: canEquip ? "" : `${requiredCharacter?.name || requiredCharacterId}専用`,
    };
  }

  const requiredSpeciesId = safeText(equipment.species_id);
  if (!requiredSpeciesId || requiredSpeciesId === "all") {
    return { canEquip: true, reason: "" };
  }

  const canEquip = requiredSpeciesId === safeText(character.species_id);
  return {
    canEquip,
    reason: canEquip ? "" : `${speciesLabel(requiredSpeciesId)}のみ装備可能`,
  };
}

function speciesLabel(speciesId) {
  const id = safeText(speciesId);
  return state.speciesMap.get(id)?.name || SPECIES_LABELS[id] || id;
}

function accessoryRequirementText(equipment) {
  const characterId = safeText(equipment?.character_id);
  if (characterId) {
    const character = state.characterMap.get(characterId);
    return `${character?.name || characterId}専用`;
  }
  const speciesId = safeText(equipment?.species_id);
  if (!speciesId || speciesId === "all") return "全モンスター装備可能";
  return `${speciesLabel(speciesId)}のみ装備可能`;
}

function renderEquipmentBonusList(equipment) {
  const entries = equipmentBonusEntries(equipment);
  if (!entries.length) {
    return `<span class="accessory-bonus-list"><span class="accessory-bonus is-neutral">増減なし</span></span>`;
  }
  return `
    <span class="accessory-bonus-list">
      ${entries.map((entry) => `
        <span class="accessory-bonus ${entry.value > 0 ? "is-up" : "is-down"}">
          ${entry.element ? `<span class="accessory-bonus-element-square element-${escapeHtml(elementClass(entry.element))}" aria-hidden="true"></span>` : ""}
          ${escapeHtml(entry.label)}（${entry.value > 0 ? "+" : ""}${escapeHtml(entry.value)}）
        </span>
      `).join("")}
    </span>
  `;
}

function equipmentBonusEntries(equipment) {
  const statEntries = [
    ["HP", equipment?.hp_bonus],
    ["物理攻撃", equipment?.phy_atk_bonus],
    ["物理防御", equipment?.phy_def_bonus],
    ["特殊攻撃", equipment?.sp_atk_bonus],
    ["特殊防御", equipment?.sp_def_bonus],
    ["敏捷", equipment?.speed_bonus],
    ["回復力", equipment?.regen_value_bonus],
    ["EN回復", equipment?.cost_charge_bonus],
  ]
    .map(([label, value]) => ({ label, value: number(value), element: "" }))
    .filter((entry) => entry.value !== 0);

  const resistanceEntries = ELEMENT_TYPES
    .map((element) => ({
      label: `${elementName(element)}耐性`,
      value: number(equipment?.[`weak_${element}_bonus`]),
      element,
    }))
    .filter((entry) => entry.value !== 0);

  return [...statEntries, ...resistanceEntries];
}

function equippedAccessoryForOwnedMonster(ownedMonster, character) {
  const accessoryId = safeText(ownedMonster?.equipment?.accessory);
  if (!accessoryId) return null;
  const equipment = state.equipmentMap.get(accessoryId);
  if (!isAccessoryEquipment(equipment)) return null;
  return accessoryEquipStatus(equipment, character).canEquip ? equipment : null;
}

function applyEquipmentBonusesToCharacter(character, equipment) {
  if (!character || !isAccessoryEquipment(equipment)) return character;
  return {
    ...character,
    hp: adjustedEquipmentStat(character.hp, equipment.hp_bonus),
    phy_atk: adjustedEquipmentStat(character.phy_atk, equipment.phy_atk_bonus),
    phy_def: adjustedEquipmentStat(character.phy_def, equipment.phy_def_bonus),
    sp_atk: adjustedEquipmentStat(character.sp_atk, equipment.sp_atk_bonus),
    sp_def: adjustedEquipmentStat(character.sp_def, equipment.sp_def_bonus),
    speed: adjustedEquipmentStat(character.speed, equipment.speed_bonus),
    regen_value: adjustedEquipmentNonNegativeStat(character.regen_value, equipment.regen_value_bonus),
    energy_charge: adjustedEquipmentNonNegativeStat(character.energy_charge, equipment.cost_charge_bonus),
    weaknesses: adjustedEquipmentWeaknesses(character.weaknesses, equipment),
  };
}

function adjustedEquipmentStat(baseValue, bonusValue) {
  return Math.max(1, Math.round(number(baseValue, 1) + number(bonusValue)));
}

function adjustedEquipmentNonNegativeStat(baseValue, bonusValue) {
  return Math.max(0, Math.round(number(baseValue) + number(bonusValue)));
}

function adjustedEquipmentWeaknesses(baseWeaknesses = {}, equipment) {
  return Object.fromEntries(
    ELEMENT_TYPES.map((element) => [
      element,
      Math.max(0, number(baseWeaknesses[element], 1) - number(equipment?.[`weak_${element}_bonus`]) / 100),
    ]),
  );
}

function isAccessoryEquipment(equipment) {
  return Boolean(equipment) && equipment.equipment_type === EQUIPMENT_TYPE_ACCESSORY;
}

function renderMyHouseEncyclopediaCharacterButton(character) {
  const canViewCharacter = canViewPurchasedEncyclopediaCharacter(character.character_id);
  const selected =
    state.myHouse.detailMode === "book" &&
    character.character_id === state.myHouse.selectedBookCharacterId;
  return `
    <button class="my-house-book-button ${selected ? "is-selected" : ""}" type="button" data-my-house-book-character-id="${escapeHtml(character.character_id)}">
      <strong>${escapeHtml(canViewCharacter ? character.name : "？？？？？")}</strong>
      <span class="my-house-monster-meta">
        ${canViewCharacter ? `${elementPill(character.element)} <span>slot ${slotMarks(character.slot)}</span>` : "未解放"}
      </span>
    </button>
  `;
}

function renderMyHouseEncyclopediaContent(characters, ownedBooks) {
  const unlockedCount = characters.filter((character) => canViewPurchasedEncyclopediaCharacter(character.character_id)).length;
  return `
    <div class="my-house-book-detail">
      <div class="my-house-book-title">図鑑</div>
      <div class="my-house-book-description">解放済み ${escapeHtml(unlockedCount)} / ${escapeHtml(characters.length)}</div>
      <div class="my-house-book-description">購入済み ${escapeHtml(ownedBooks.length)}冊</div>
    </div>
  `;
}

function renderMyHouseEncyclopediaDetail(character) {
  if (canViewPurchasedEncyclopediaCharacter(character.character_id)) {
    return renderMyHouseMonsterDetail(character);
  }

  return `
    <div class="my-house-detail-header">
      <div>
        <div class="my-house-detail-title">？？？？？</div>
        <div class="detail-subtitle">対応する図鑑を購入すると情報を確認できます</div>
      </div>
      <div class="my-house-detail-slot">slot ？</div>
    </div>
    <div class="detail-body my-house-detail-body">
      <div class="detail-profile-column">
        <div class="detail-image-frame my-house-detail-image-frame">
          <img class="detail-image" src="${escapeHtml(character.imageSrc)}" alt="？？？？？" />
        </div>
        <div class="detail-summary">
          <div class="dex-data-row"><span>能力値</span><strong>？？？</strong></div>
          <div class="command-note">対応する図鑑を購入すると情報を確認できます</div>
        </div>
      </div>
    </div>
  `;
}

function renderMyHouseBookButton(book) {
  const selected = book.book_id === state.myHouse.selectedBookId;
  return `
    <button class="my-house-book-button ${selected ? "is-selected" : ""}" type="button" data-my-house-book-id="${escapeHtml(book.book_id)}">
      <strong>${escapeHtml(book.name)}</strong>
      <span>${escapeHtml(book.description)}</span>
    </button>
  `;
}

function renderMyHouseBookContent(book) {
  const monsters = myHouseBookCharacters(book);

  return `
    <div class="my-house-book-detail">
      <div class="my-house-book-title">${escapeHtml(book.name)}</div>
      <div class="my-house-book-description">${escapeHtml(book.description)}</div>
      <div class="my-house-book-monsters">
        ${
          monsters.length
            ? monsters.map(renderMyHouseBookMonster).join("")
            : `<div class="shop-empty">登録モンスターがありません。</div>`
        }
      </div>
    </div>
  `;
}

function renderMyHouseBookMonster(character) {
  const selected =
    state.myHouse.detailMode === "book" &&
    character.character_id === state.myHouse.selectedBookCharacterId;
  return `
    <button class="my-house-book-monster ${selected ? "is-selected" : ""}" type="button" data-my-house-book-character-id="${escapeHtml(character.character_id)}">
      <img class="my-house-book-monster-image" src="${escapeHtml(character.imageSrc)}" alt="${escapeHtml(character.name)}" />
      <div>
        <strong>${escapeHtml(character.name)}</strong>
        <div class="my-house-monster-meta">${elementPill(character.element)} <span>slot ${slotMarks(character.slot)}</span></div>
      </div>
    </button>
  `;
}

function renderMyHouseSaveControls() {
  if (!els.myHouseSaveSlots || !els.myHouseLoadSlots) return;

  els.myHouseSaveSlots.innerHTML = MANUAL_SAVE_STORAGE_KEYS
    .map((key, index) => renderManualSaveSlotButton(index + 1, key))
    .join("");

  const loadSlots = MANUAL_SAVE_STORAGE_KEYS
    .map((key, index) => ({ key, label: `セーブ${index + 1}` }));

  els.myHouseLoadSlots.innerHTML = loadSlots
    .map((slot) => renderLoadSaveSlotButton(slot))
    .join("");
}

function renderManualSaveSlotButton(slotNumber, key) {
  const info = readSaveSlotInfo(key);
  return `
    <button class="my-house-save-button ${info.invalid ? "is-invalid" : ""}" type="button" data-manual-save-slot="${slotNumber}">
      <strong>セーブ${slotNumber}</strong>
      <span>${escapeHtml(info.label)}</span>
    </button>
  `;
}

function renderLoadSaveSlotButton(slot) {
  const info = readSaveSlotInfo(slot.key);
  return `
    <button
      class="my-house-save-button ${info.invalid ? "is-invalid" : ""}"
      type="button"
      data-load-save-key="${escapeHtml(slot.key)}"
      data-load-save-label="${escapeHtml(slot.label)}"
      ${info.exists ? "" : "disabled"}
    >
      <strong>${escapeHtml(slot.label)}</strong>
      <span>${escapeHtml(info.label)}</span>
    </button>
  `;
}

function readSaveSlotInfo(key) {
  const raw = readStorageValue(key);
  if (!raw) {
    return { exists: false, invalid: false, label: "データなし" };
  }

  try {
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") {
      return { exists: true, invalid: true, label: "データ破損" };
    }
    return {
      exists: true,
      invalid: false,
      label: formatSaveTimestamp(safeText(data.saved_at ?? data.savedAt)),
    };
  } catch {
    return { exists: true, invalid: true, label: "データ破損" };
  }
}

function formatSaveTimestamp(value) {
  if (!value) return "保存日時なし";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "保存日時不明";
  return date.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function renderBusinessShop() {
  if (!els.businessShopPanel) return;

  const shopId = currentShopId();
  const shopTitle = businessShopTitle(shopId, currentShopItemFilter());
  if (els.businessShopTitle) {
    els.businessShopTitle.textContent = shopTitle;
  }
  els.businessShopPanel.setAttribute("aria-label", shopTitle);
  els.businessShopMoney.textContent = `${state.saveData.money}`;
  els.businessShopSlots.textContent = `${ownedPartySlotTotal()} / ${TEAM_SLOT_LIMIT}`;

  const items = availableShopItems(shopId);
  els.businessShopItems.innerHTML = items.length
    ? items.map(renderShopItem).join("")
    : `<div class="shop-empty">現在購入できる商品はありません。</div>`;

  for (const button of els.businessShopItems.querySelectorAll("[data-shop-entry-id]")) {
    button.addEventListener("click", () => handleShopPurchase(button.dataset.shopEntryId));
  }

  renderShopExchangePanel();
}

function currentShopId() {
  return safeText(state.shop.currentShopId) || BUSINESS_SHOP_ID;
}

function currentShopItemFilter() {
  return safeText(state.shop.itemFilter);
}

function businessShopTitle(shopId, itemFilter) {
  if (shopId === BUSINESS2_SHOP_ID) return "工房";
  if (itemFilter === SHOP_ITEM_FILTER_BOOK) return "図鑑の購入";
  return "モンスター取引所";
}

function availableShopItems(shopId) {
  const itemFilter = currentShopItemFilter();
  return state.shopItems
    .filter((item) => item.shop_id === shopId)
    .filter((item) => item.item_type && item.content_id)
    .filter((item) => item.item_type === "book" || item.item_type === "monster" || EQUIPMENT_ITEM_TYPES.has(item.item_type))
    .filter((item) => shopItemMatchesFilter(item, itemFilter))
    .filter((item) => shopContentExists(item))
    .filter((item) => shopUnlockMet(item.unlock_condition))
    .sort((a, b) => a.display_order - b.display_order);
}

function shopItemMatchesFilter(item, itemFilter) {
  if (!itemFilter) return true;
  if (itemFilter === SHOP_ITEM_FILTER_EQUIPMENT) return EQUIPMENT_ITEM_TYPES.has(item.item_type);
  return item.item_type === itemFilter;
}

function shopContentExists(item) {
  if (item.item_type === "book") return state.encyclopediaBooks.has(item.content_id);
  if (item.item_type === "monster") return state.characterMap.has(item.content_id);
  if (EQUIPMENT_ITEM_TYPES.has(item.item_type)) return isAccessoryEquipment(state.equipmentMap.get(item.content_id));
  return false;
}

function shopUnlockMet(unlockCondition) {
  const condition = safeText(unlockCondition);
  if (!condition || condition === "none") return true;
  return state.story.clearedRankBattleIds.has(condition);
}

function renderShopItem(item) {
  const stock = currentShopStock(item);
  const name = shopItemName(item);
  const isEquipmentItem = EQUIPMENT_ITEM_TYPES.has(item.item_type);
  const typeLabel = item.item_type === "book" ? "図鑑" : isEquipmentItem ? "アクセサリー" : "モンスター";
  const monster = item.item_type === "monster" ? state.characterMap.get(item.content_id) : null;
  const book = item.item_type === "book" ? state.encyclopediaBooks.get(item.content_id) : null;
  const equipment = isEquipmentItem ? state.equipmentMap.get(item.content_id) : null;
  const disabledReason = shopDisabledReason(item);
  const description =
    book?.description ||
    (monster ? `${monster.name}を仲間にします。` : "") ||
    (equipment ? equipment.text || accessoryRequirementText(equipment) : "");
  const stockLabel = `在庫 ${stock}`;

  return `
    <article class="shop-item">
      <div class="shop-item-main">
        <div class="shop-item-topline">
          <strong class="shop-item-name">${escapeHtml(name)}</strong>
          <span class="shop-item-type">${escapeHtml(typeLabel)}</span>
        </div>
        ${description ? `<div class="shop-item-description">${escapeHtml(description)}</div>` : ""}
        <div class="shop-item-meta">
          <span>価格 ${escapeHtml(item.price)}z</span>
          <span>${escapeHtml(stockLabel)}</span>
          ${monster ? `<span>slot ${slotMarks(monster.slot)}</span>` : ""}
        </div>
      </div>
      <button class="primary-button shop-buy-button" type="button" data-shop-entry-id="${escapeHtml(item.shop_entry_id)}" ${disabledReason ? "disabled" : ""}>
        ${disabledReason ? escapeHtml(disabledReason) : "購入"}
      </button>
    </article>
  `;
}

function shopItemName(item) {
  if (item.item_type === "book") {
    return state.encyclopediaBooks.get(item.content_id)?.name || item.content_id;
  }
  if (item.item_type === "monster") {
    return state.characterMap.get(item.content_id)?.name || item.content_id;
  }
  if (EQUIPMENT_ITEM_TYPES.has(item.item_type)) {
    return state.equipmentMap.get(item.content_id)?.name || item.content_id;
  }
  return item.content_id;
}

function shopDisabledReason(item) {
  if (currentShopStock(item) <= 0) return item.item_type === "book" ? "購入済み" : "在庫なし";
  if (state.saveData.money < item.price) return "所持金不足";
  if (item.item_type === "book" && state.saveData.ownedBooks.has(item.content_id)) return "購入済み";
  if (item.item_type === "monster") {
    const monster = state.characterMap.get(item.content_id);
    if (!monster || monster.slot > TEAM_SLOT_LIMIT) return "購入不可";
  }
  return "";
}

function currentShopStock(item) {
  if (state.saveData.shopStock.has(item.shop_entry_id)) {
    return state.saveData.shopStock.get(item.shop_entry_id);
  }
  if (EQUIPMENT_ITEM_TYPES.has(item.item_type) && state.saveData.purchasedShopEntries.has(item.shop_entry_id)) {
    return Math.max(0, item.stock - 1);
  }
  return item.stock;
}

function setShopStock(item, stock) {
  state.saveData.shopStock.set(item.shop_entry_id, Math.max(0, Math.floor(number(stock))));
}

function handleShopPurchase(shopEntryId) {
  const item = availableShopItems(currentShopId()).find((entry) => entry.shop_entry_id === shopEntryId);
  if (!item) return;
  const disabledReason = shopDisabledReason(item);
  if (disabledReason) {
    showShopMessage(disabledReason, { isError: true });
    return;
  }

  if (item.item_type === "book") {
    state.shop.confirmEntryId = null;
    state.shop.exchangeEntryId = null;
    state.shop.offerOwnedIds = [];
    purchaseBook(item);
    return;
  }

  beginShopPurchaseConfirm(item);
}

function purchaseBook(item) {
  if (shopDisabledReason(item)) return;
  state.saveData.money -= item.price;
  state.saveData.ownedBooks.add(item.content_id);
  state.saveData.purchasedShopEntries.add(item.shop_entry_id);
  setShopStock(item, currentShopStock(item) - 1);
  saveGameData();
  showShopMessage(`${shopItemName(item)}を購入しました。`);
  renderBusinessShop();
}

function beginShopPurchaseConfirm(item) {
  if (!item || (item.item_type !== "monster" && !EQUIPMENT_ITEM_TYPES.has(item.item_type))) return;
  state.shop.confirmEntryId = item.shop_entry_id;
  state.shop.exchangeEntryId = null;
  state.shop.offerOwnedIds = [];
  renderBusinessShop();
}

function confirmShopPurchase(item) {
  if (!item) return;
  state.shop.confirmEntryId = null;
  state.shop.exchangeEntryId = null;
  state.shop.offerOwnedIds = [];

  if (EQUIPMENT_ITEM_TYPES.has(item.item_type)) {
    purchaseEquipment(item);
    return;
  }

  beginMonsterPurchase(item);
}

function purchaseEquipment(item) {
  const disabledReason = shopDisabledReason(item);
  if (disabledReason) {
    showShopMessage(disabledReason, { isError: true });
    return;
  }

  const equipment = state.equipmentMap.get(item.content_id);
  if (!isAccessoryEquipment(equipment)) return;

  state.saveData.money -= item.price;
  state.saveData.ownedEquipment.set(
    equipment.equipment_id,
    ownedEquipmentCount(equipment.equipment_id) + 1,
  );
  state.saveData.purchasedShopEntries.add(item.shop_entry_id);
  setShopStock(item, currentShopStock(item) - 1);
  saveGameData();
  showShopMessage(`${equipment.name}を購入しました。`);
  state.shop.confirmEntryId = null;
  if (els.myHousePanel && !els.myHousePanel.classList.contains("is-hidden")) renderMyHouse();
  renderBusinessShop();
}

function beginMonsterPurchase(item) {
  const monster = state.characterMap.get(item.content_id);
  if (!monster || shopDisabledReason(item)) return;

  state.shop.confirmEntryId = null;
  state.shop.exchangeEntryId = null;
  state.shop.offerOwnedIds = [];
  completeMonsterPurchase(item);
}

function renderShopPurchaseConfirm(item) {
  const name = shopItemName(item);
  const disabledReason = shopDisabledReason(item);
  const isMonster = item.item_type === "monster";
  const isEquipmentItem = EQUIPMENT_ITEM_TYPES.has(item.item_type);
  const monster = isMonster ? state.characterMap.get(item.content_id) : null;
  const equipment = isEquipmentItem ? state.equipmentMap.get(item.content_id) : null;
  const note = isMonster
    ? "購入後、研究所（LAB）へ送られます。"
    : "購入してよろしいですか？";

  return `
    <div class="shop-confirm-dialog-card">
      <div class="shop-exchange-header">
        <div>
          <div class="shop-exchange-title">${escapeHtml(name)}を購入しますか？</div>
          <div class="shop-exchange-note">${escapeHtml(note)}</div>
        </div>
      </div>
      <div class="shop-exchange-summary">
        <span>価格 ${escapeHtml(item.price)}z</span>
        <span>所持金 ${escapeHtml(state.saveData.money)}z</span>
        <span>在庫 ${escapeHtml(currentShopStock(item))}</span>
      </div>
      ${monster ? renderShopMonsterConfirmDetail(monster) : ""}
      ${equipment ? renderShopEquipmentConfirmDetail(equipment) : ""}
      <div class="shop-confirm-actions">
        <button class="primary-button shop-confirm-button" type="button" data-shop-confirm-action="confirm" ${disabledReason ? "disabled" : ""}>
          ${disabledReason ? escapeHtml(disabledReason) : "はい"}
        </button>
        <button class="small-button shop-confirm-button" type="button" data-shop-confirm-action="cancel">いいえ</button>
      </div>
    </div>
  `;
}

function renderShopMonsterConfirmDetail(monster) {
  return `
    <div class="shop-confirm-detail">
      <div class="shop-confirm-detail-title">${escapeHtml(monster.name)}のステータス</div>
      <div class="shop-confirm-monster-topline">
        ${elementPill(monster.element)}
        <span>slot ${slotMarks(monster.slot)}</span>
      </div>
      <div class="shop-confirm-stat-grid">
        <span>HP <strong>${escapeHtml(monster.hp)}</strong></span>
        <span>物理攻撃 <strong>${escapeHtml(monster.phy_atk)}</strong></span>
        <span>物理防御 <strong>${escapeHtml(monster.phy_def)}</strong></span>
        <span>特殊攻撃 <strong>${escapeHtml(monster.sp_atk)}</strong></span>
        <span>特殊防御 <strong>${escapeHtml(monster.sp_def)}</strong></span>
        <span>敏捷 <strong>${escapeHtml(monster.speed)}</strong></span>
      </div>
    </div>
  `;
}

function renderShopEquipmentConfirmDetail(equipment) {
  return `
    <div class="shop-confirm-detail">
      <div class="shop-confirm-detail-title">${escapeHtml(equipment.name)}の効果</div>
      ${equipment.text ? `<div class="shop-confirm-description">${escapeHtml(equipment.text)}</div>` : ""}
      <div class="shop-confirm-description">${escapeHtml(accessoryRequirementText(equipment))}</div>
      ${renderEquipmentBonusList(equipment)}
    </div>
  `;
}

function renderShopExchangePanel() {
  if (!els.businessShopExchangePanel) return;

  const confirmItem = availableShopItems(currentShopId()).find(
    (entry) => entry.shop_entry_id === state.shop.confirmEntryId,
  );
  if (confirmItem) {
    els.businessShopExchangePanel.classList.remove("is-hidden");
    els.businessShopExchangePanel.classList.add("is-shop-confirm-dialog");
    els.businessShopExchangePanel.setAttribute("role", "dialog");
    els.businessShopExchangePanel.setAttribute("aria-modal", "true");
    els.businessShopExchangePanel.setAttribute("aria-label", "購入確認");
    els.businessShopExchangePanel.innerHTML = renderShopPurchaseConfirm(confirmItem);
    const cancelButton = els.businessShopExchangePanel.querySelector("[data-shop-confirm-action='cancel']");
    cancelButton?.addEventListener("click", () => {
      state.shop.confirmEntryId = null;
      renderBusinessShop();
    });
    els.businessShopExchangePanel.querySelector("[data-shop-confirm-action='confirm']")?.addEventListener("click", () => {
      confirmShopPurchase(confirmItem);
    });
    cancelButton?.focus({ preventScroll: true });
    return;
  }
  state.shop.confirmEntryId = null;
  els.businessShopExchangePanel.classList.remove("is-shop-confirm-dialog");
  els.businessShopExchangePanel.removeAttribute("role");
  els.businessShopExchangePanel.removeAttribute("aria-modal");
  els.businessShopExchangePanel.removeAttribute("aria-label");

  const item = availableShopItems(currentShopId()).find(
    (entry) => entry.shop_entry_id === state.shop.exchangeEntryId,
  );
  const monster = item ? state.characterMap.get(item.content_id) : null;

  if (!item || !monster) {
    els.businessShopExchangePanel.classList.add("is-hidden");
    els.businessShopExchangePanel.innerHTML = "";
    return;
  }

  const preview = shopExchangePreview(item);
  els.businessShopExchangePanel.classList.remove("is-hidden");
  els.businessShopExchangePanel.innerHTML = `
    <div class="shop-exchange-header">
      <div>
        <div class="shop-exchange-title">${escapeHtml(monster.name)}を購入</div>
        <div class="shop-exchange-note">手放すモンスターを選んでください。</div>
      </div>
      <button class="small-button shop-exchange-cancel" type="button">キャンセル</button>
    </div>
    <div class="shop-exchange-summary">
      <span>購入対象 slot ${slotMarks(monster.slot)}</span>
      <span>交換後 ${escapeHtml(preview.nextSlotTotal)} / ${TEAM_SLOT_LIMIT}</span>
    </div>
    <div class="shop-exchange-list">
      ${state.saveData.ownedMonsters.map(renderShopExchangeCandidate).join("")}
    </div>
    <button class="primary-button shop-exchange-confirm" type="button" ${preview.canConfirm ? "" : "disabled"}>
      購入確定
    </button>
  `;

  for (const button of els.businessShopExchangePanel.querySelectorAll("[data-shop-offer-owned-id]")) {
    button.addEventListener("click", () => toggleShopOfferOwnedId(button.dataset.shopOfferOwnedId));
  }

  els.businessShopExchangePanel.querySelector(".shop-exchange-cancel")?.addEventListener("click", () => {
    state.shop.exchangeEntryId = null;
    state.shop.offerOwnedIds = [];
    renderBusinessShop();
  });

  els.businessShopExchangePanel.querySelector(".shop-exchange-confirm")?.addEventListener("click", () => {
    completeMonsterPurchase(item, state.shop.offerOwnedIds);
  });
}

function renderShopExchangeCandidate(ownedMonster) {
  const character = state.characterMap.get(ownedMonster.characterId);
  if (!character) return "";
  const selected = state.shop.offerOwnedIds.includes(ownedMonster.ownedId);
  return `
    <button class="shop-exchange-candidate ${selected ? "is-selected" : ""}" type="button" data-shop-offer-owned-id="${escapeHtml(ownedMonster.ownedId)}">
      <span>${escapeHtml(character.name)}</span>
      <strong>slot ${slotMarks(character.slot)}</strong>
    </button>
  `;
}

function toggleShopOfferOwnedId(ownedId) {
  const index = state.shop.offerOwnedIds.indexOf(ownedId);
  if (index >= 0) {
    state.shop.offerOwnedIds.splice(index, 1);
  } else {
    state.shop.offerOwnedIds.push(ownedId);
  }
  renderBusinessShop();
}

function shopExchangePreview(item) {
  const monster = state.characterMap.get(item.content_id);
  const offeredCharacters = state.shop.offerOwnedIds
    .map((ownedId) => state.saveData.ownedMonsters.find((entry) => entry.ownedId === ownedId))
    .filter(Boolean)
    .map((entry) => state.characterMap.get(entry.characterId))
    .filter(Boolean);
  const nextSlotTotal = ownedPartySlotTotal() - slotTotal(offeredCharacters) + (monster?.slot ?? 0);
  return {
    nextSlotTotal,
    canConfirm:
      Boolean(monster) &&
      currentShopStock(item) > 0 &&
      state.saveData.money >= item.price &&
      nextSlotTotal <= TEAM_SLOT_LIMIT,
  };
}

function completeMonsterPurchase(item) {
  const monster = state.characterMap.get(item.content_id);
  if (!monster || shopDisabledReason(item)) return;

  state.saveData.money -= item.price;
  setShopStock(item, currentShopStock(item) - 1);
  state.saveData.purchasedShopEntries.add(item.shop_entry_id);
  const purchasedMonster = createOwnedMonster(monster.character_id, {
    equipment: {},
    storage: "lab",
  });
  state.saveData.ownedMonsters.push(purchasedMonster);
  syncOwnedMonsterStorageFromParty(state.saveData, { fallbackToOwnedMonsters: false });
  syncSelectedIdsFromOwnedMonsters();
  markUnsavedChanges();
  state.shop.confirmEntryId = null;
  state.shop.exchangeEntryId = null;
  state.shop.offerOwnedIds = [];
  saveGameData();
  renderSetup();
  showShopMessage(`${monster.name}を購入しました。研究所（LAB）へ送りました。`);
  renderBusinessShop();
}

function handleStoryKeydown(event) {
  if (!state.story.active) return;

  const moves = {
    ArrowUp: { dx: 0, dy: -1, direction: "up" },
    ArrowDown: { dx: 0, dy: 1, direction: "down" },
    ArrowLeft: { dx: -1, dy: 0, direction: "left" },
    ArrowRight: { dx: 1, dy: 0, direction: "right" },
  };
  const move = moves[event.key];
  if (!move) return;

  event.preventDefault();
  moveStoryPlayer(move);
}

function moveStoryPlayer({ dx, dy, direction }) {
  const storyMap = state.story.map ?? fallbackStoryMap();
  const nextX = clamp(state.story.player.x + dx, 0, storyMap.width - 1);
  const nextY = clamp(state.story.player.y + dy, 0, storyMap.height - 1);
  const moved = nextX !== state.story.player.x || nextY !== state.story.player.y;
  state.story.player = {
    ...state.story.player,
    x: nextX,
    y: nextY,
    direction,
    frame: moved ? 1 : 0,
  };
  renderStoryPlayer();
  if (!moved) return;
  playStoryWalkAnimation();
}

async function loadStoryMap() {
  const results = await Promise.allSettled(STORY_MAP_PATHS.map(loadStoryMapLayer));
  const layers = results
    .filter((result) => result.status === "fulfilled" && result.value)
    .map((result) => result.value);

  if (!layers.length) return fallbackStoryMap();
  const base = layers[0];
  return {
    width: base.width,
    height: base.height,
    layers: layers.filter((layer) => layer.width === base.width && layer.height === base.height),
  };
}

async function loadStoryMapLayer(path) {
  const url = `${path}${path.includes("?") ? "&" : "?"}v=${Date.now()}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Map load failed: ${path}`);
  return parseStoryMapLayer(await response.arrayBuffer());
}

function parseStoryMapLayer(buffer) {
  const view = new DataView(buffer);
  if (view.byteLength < 50) return fallbackStoryMap().layers[0];

  const width = Math.max(1, view.getUint32(38, true));
  const height = Math.max(1, view.getUint32(42, true));
  const cellCount = width * height;
  const cells = [];
  const startOffset = 46;
  for (let index = 0; index < cellCount; index += 1) {
    const offset = startOffset + index * 4;
    cells.push(offset + 4 <= view.byteLength ? view.getUint32(offset, true) : 0);
  }

  return { width, height, cells };
}

function fallbackStoryMap() {
  return {
    width: 15,
    height: 15,
    layers: [
      {
        width: 15,
        height: 15,
        cells: Array.from({ length: 15 * 15 }, (_, index) => index),
      },
    ],
  };
}

function renderStoryMap() {
  const storyMap = state.story.map ?? fallbackStoryMap();
  els.storyMap.style.setProperty("--story-map-width", storyMap.width);
  els.storyMap.style.setProperty("--story-map-height", storyMap.height);
  els.storyMap.style.setProperty("--story-tile-size", `${STORY_TILE_SIZE}px`);
  els.storyMap.style.width = `${storyMap.width * STORY_TILE_SIZE}px`;
  els.storyMap.style.height = `${storyMap.height * STORY_TILE_SIZE}px`;
  els.storyTiles.style.setProperty("--story-map-width", storyMap.width);
  els.storyTiles.style.setProperty("--story-map-height", storyMap.height);
  els.storyTiles.style.setProperty("--story-tile-size", `${STORY_TILE_SIZE}px`);
  els.storyTiles.innerHTML = Array.from({ length: storyMap.width * storyMap.height }, (_, index) => {
    const tileValue = storyTileValue(storyMap, index);
    return `<div class="story-tile story-tile-${storyTilePalette(tileValue)}"></div>`;
  }).join("");
  renderStoryPlayer();
}

function renderStoryPlayer() {
  const player = state.story.player;
  const row = STORY_DIRECTION_ROWS[player.direction] ?? STORY_DIRECTION_ROWS.down;
  const column = Math.max(0, Math.min(STORY_SHEET_COLUMNS - 1, player.frame));
  els.storyPlayer.style.left = `${(player.x + 0.5) * STORY_TILE_SIZE}px`;
  els.storyPlayer.style.top = `${(player.y + 1) * STORY_TILE_SIZE}px`;
  els.storyPlayer.style.setProperty("--story-frame-x", `${-column * STORY_FRAME_WIDTH}px`);
  els.storyPlayer.style.setProperty("--story-frame-y", `${-row * STORY_FRAME_HEIGHT}px`);
  els.storyPlayer.style.backgroundImage = `url("${STORY_PLAYER_SHEET}")`;
}

function storyTileValue(storyMap, index) {
  for (let layerIndex = storyMap.layers.length - 1; layerIndex >= 0; layerIndex -= 1) {
    const value = storyMap.layers[layerIndex]?.cells?.[index] ?? 0;
    if (value !== 0) return value;
  }
  return 0;
}

function storyTilePalette(value) {
  if (!value) return 0;
  return Math.abs(((value >>> 0) ^ (value >>> 8) ^ (value >>> 16))) % 8;
}

function playStoryWalkAnimation() {
  clearStoryWalkTimer();
  const token = state.story.walkToken + 1;
  state.story.walkToken = token;
  const frames = [1, 2, 3, 4, 5, 0];
  let frameIndex = 0;

  const step = () => {
    if (state.story.walkToken !== token || !state.story.active) return;
    state.story.player.frame = frames[frameIndex] ?? 0;
    renderStoryPlayer();
    frameIndex += 1;
    if (frameIndex >= frames.length) return;
    state.story.walkTimer = window.setTimeout(step, 70);
  };

  step();
}

function clearStoryWalkTimer() {
  state.story.walkToken += 1;
  if (!state.story.walkTimer) return;
  window.clearTimeout(state.story.walkTimer);
  state.story.walkTimer = null;
}

function clearGameOverReturnTimer() {
  if (!gameOverReturnTimer) return;
  window.clearTimeout(gameOverReturnTimer);
  gameOverReturnTimer = null;
}

function scheduleGameOverReturnToTitle() {
  clearGameOverReturnTimer();
  gameOverReturnTimer = window.setTimeout(() => {
    gameOverReturnTimer = null;
    stopBgm();
    showTitleView();
  }, 1400);
}

function returnToSetup() {
  clearGameOverReturnTimer();
  state.story.active = false;
  state.shop.open = false;
  hideBusinessShop({ restoreTravel: false });
  hideMyHouse({ restoreTravel: false });
  hideBusiness2({ restoreTravel: false });
  clearStoryWalkTimer();
  els.titleView.classList.add("is-hidden");
  els.storyView.classList.add("is-hidden");
  els.battleView.classList.add("is-hidden");
  els.setupView.classList.remove("is-hidden");
  state.commandMode = "fight";
  state.busy = false;
  state.gameOver = false;
  state.pendingSwitchSide = null;
  state.battleWinner = null;
  state.battleAnimation = null;
  state.exchange = createExchangeState();
  state.fieldEffects = createFieldEffectsState();
  state.nextFieldEffectId = 1;
  state.battleInspectSide = "enemy";
  state.detailCharacterId = null;
  state.story.currentRankBattleId = null;
  state.story.currentArenaBattleId = null;
  hideBattleMessage();
  state.dex = {
    open: false,
    characterId: null,
  };
  renderDexPanel();
  renderSetup();
}

async function loadGameData() {
  try {
    const [
      characterText,
      skillText,
      powerRuleText,
      battleEffectText,
      effectText,
      hitTypeText,
      animationText,
      bgmText,
      rankBattleText,
      enemyPartyText,
      shopItemText,
      encyclopediaBookText,
      equipmentText,
      speciesText,
      npcText,
    ] = await Promise.all([
      loadCsvText("characters", DATA_PATHS.characters),
      loadCsvText("skills", DATA_PATHS.skills),
      loadOptionalCsvText("powerRules", DATA_PATHS.powerRules),
      loadCsvText("battleEffects", DATA_PATHS.battleEffects),
      loadCsvText("effects", DATA_PATHS.effects),
      loadCsvText("hitTypes", DATA_PATHS.hitTypes),
      loadCsvText("animations", DATA_PATHS.animations),
      loadOptionalCsvText("bgm", DATA_PATHS.bgm),
      loadOptionalCsvText("rankBattles", DATA_PATHS.rankBattles),
      loadOptionalCsvText("enemyParties", DATA_PATHS.enemyParties),
      loadOptionalCsvText("shopItems", DATA_PATHS.shopItems),
      loadOptionalCsvText("encyclopediaBooks", DATA_PATHS.encyclopediaBooks),
      loadOptionalCsvText("equipment", DATA_PATHS.equipment),
      loadOptionalCsvText("species", DATA_PATHS.species),
      loadOptionalCsvText("npcs", DATA_PATHS.npcs),
    ]);

    state.characters = rowsFromCsv(characterText)
      .map(normalizeCharacter)
      .filter((character) => character.character_id && character.name);
    state.characterMap = new Map(
      state.characters.map((character) => [character.character_id, character]),
    );

    state.bgmMap.clear();
    for (const bgm of rowsFromCsv(bgmText).map(normalizeBgm)) {
      if (bgm.bgm_id) {
        state.bgmMap.set(bgm.bgm_id, bgm);
      }
    }

    for (const skill of rowsFromCsv(skillText).map(normalizeSkill)) {
      if (skill.skill_id && skill.name && skill.category) {
        state.skills.set(skill.skill_id, skill);
      }
    }

    for (const skill of Object.values(GENERATED_SKILLS)) {
      state.skills.set(skill.skill_id, skill);
    }

    state.powerRules.clear();
    for (const powerRule of rowsFromCsv(powerRuleText).map(normalizePowerRule)) {
      if (!powerRule.power_rule_id || !powerRule.power_rule_group) continue;
      const rules = state.powerRules.get(powerRule.power_rule_group) ?? [];
      rules.push(powerRule);
      state.powerRules.set(powerRule.power_rule_group, rules);
    }

    for (const effect of rowsFromCsv(effectText).map(normalizeEffect)) {
      if (effect.effect_id && effect.name) {
        state.effects.set(effect.effect_id, effect);
      }
    }

    for (const battleEffect of rowsFromCsv(battleEffectText).map(normalizeBattleEffect)) {
      if (battleEffect.battle_effect_id && battleEffect.name) {
        state.battleEffects.set(battleEffect.battle_effect_id, battleEffect);
      }
    }

    for (const hitType of rowsFromCsv(hitTypeText).map(normalizeHitType)) {
      if (hitType.hit_type_id && hitType.name) {
        state.hitTypes.set(hitType.hit_type_id, hitType);
      }
    }

    state.rankBattles.clear();
    for (const rankBattle of rowsFromCsv(rankBattleText).map(normalizeRankBattle)) {
      if (rankBattle.rank_battle_id) {
        state.rankBattles.set(rankBattle.rank_battle_id, rankBattle);
      }
    }

    state.enemyParties.clear();
    for (const enemyParty of rowsFromCsv(enemyPartyText).map(normalizeEnemyParty)) {
      if (enemyParty.enemy_party_id) {
        state.enemyParties.set(enemyParty.enemy_party_id, enemyParty);
      }
    }

    state.encyclopediaBooks.clear();
    for (const book of rowsFromCsv(encyclopediaBookText).map(normalizeEncyclopediaBook)) {
      if (book.book_id) {
        state.encyclopediaBooks.set(book.book_id, book);
      }
    }

    state.shopItems = rowsFromCsv(shopItemText)
      .map(normalizeShopItem)
      .filter((item) => item.shop_entry_id);

    state.equipment = rowsFromCsv(equipmentText)
      .map(normalizeEquipment)
      .filter((equipment) => equipment.equipment_id);
    state.equipmentMap = new Map(
      state.equipment.map((equipment) => [equipment.equipment_id, equipment]),
    );

    state.speciesMap.clear();
    for (const species of rowsFromCsv(speciesText).map(normalizeSpecies)) {
      if (species.species_id) {
        state.speciesMap.set(species.species_id, species);
      }
    }

    await dialogueManager.load(npcText);

    state.animations.clear();
    state.animationDefinitions.clear();
    for (const animation of rowsFromCsv(animationText).map(normalizeAnimation)) {
      if (animation.animation_id) {
        state.animationDefinitions.set(animation.animation_id, animation);
      }

      const battleEffect = state.battleEffects.get(animation.battle_effect_id);
      const isPositionAnimation =
        battleEffect?.battle_effect_group === "position" ||
        Boolean(DEFAULT_POSITION_ANIMATIONS[animation.battle_effect_id]);
      if (
        isPositionAnimation &&
        animation.battle_effect_id &&
        animation.position_class &&
        animation.animation_name
      ) {
        state.animations.set(animation.battle_effect_id, animation);
      }
    }
    applyAnimationConfig();

    loadSaveData();
    initializeSaveDataParty({ persist: false });
    renderSetup();
  } catch (error) {
    els.rosterGrid.innerHTML = `<div class="selected-slot is-filled">CSVを読み込めませんでした。</div>`;
    console.error(error);
  }
}

async function loadCsvText(key, path) {
  if (window.location.protocol === "file:" && window.MHB_CSV?.[key]) {
    return window.MHB_CSV[key];
  }

  try {
    const url = `${path}${path.includes("?") ? "&" : "?"}v=${Date.now()}`;
    const response = await fetch(url, { cache: "no-store" });
    if (response.ok) {
      const text = await response.text();
      return text;
    }
  } catch {
    // File URLs and some preview panes block fetch; the inline CSV keeps the app playable.
  }

  if (window.MHB_CSV?.[key]) {
    return window.MHB_CSV[key];
  }

  throw new Error(`CSV load failed: ${key}`);
}

async function loadOptionalCsvText(key, path) {
  try {
    return await loadCsvText(key, path);
  } catch {
    return "";
  }
}

function rowsFromCsv(text) {
  const rows = parseCsv(text.replace(/^\uFEFF/, ""));
  if (rows.length === 0) return [];
  const headers = rows.shift();
  const mappedHeaders = headers
    .map((header, index) => ({ header: header.trim(), index }))
    .filter((item) => item.header);

  return rows
    .filter((row) => row.some((cell) => cell.trim()))
    .map((row) => {
      const record = {};
      for (const { header, index } of mappedHeaders) {
        const value = row[index] ?? "";
        record[header] = header === "text" ? value : value.trim();
      }
      return record;
    });
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        field += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") index += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function normalizeCharacter(row) {
  const element = safeText(row.element, "none");
  const characterId = safeText(row.character_id);
  return {
    character_id: characterId,
    battleNo: safeText(row.battleno ?? row.battle_no ?? row.battleNo ?? row.no),
    rank: safeText(row.rank ?? row.rank_id ?? row.rankId),
    species_id: safeText(row.species_id),
    name: row.name,
    hp: number(row.hp, 1),
    phy_atk: number(row.phy_atk),
    phy_def: number(row.phy_def),
    sp_atk: number(row.sp_atk),
    sp_def: number(row.sp_def),
    speed: number(row.speed),
    regen_value: number(row.regen_value ?? row.regen ?? row.recovery),
    energy_charge: Math.max(1, number(row.cost_charge ?? row.energy_charge, 1)),
    slot: number(row.slot, 1),
    ai_type: safeText(row.ai_type, "balanced"),
    element,
    weaknesses: {
      fire: number(row.weak_fire, 100) / 100,
      water: number(row.weak_water, 100) / 100,
      thunder: number(row.weak_thunder, 100) / 100,
      ice: number(row.weak_ice, 100) / 100,
      dragon: number(row.weak_dragon, 100) / 100,
    },
    imageSrc: characterImagePath(characterId, row.image),
    transparentColor: safeText(row.transparent_color),
    transparencyTolerance: number(row.tolerance),
    renderOffsetX: number(row.render_offset_x),
    renderOffsetY: number(row.render_offset_y),
    display_order: number(row.display_order, 9999),
    skillIds: [row.skill_1, row.skill_2, row.skill_3, row.skill_4, row.skill_5]
      .map((skillId) => safeText(skillId))
      .filter(Boolean),
  };
}

function normalizeSkill(row) {
  return {
    skill_id: safeText(row.skill_id),
    name: safeText(row.name),
    category: safeText(row.category),
    power: number(row.power),
    element: safeText(row.element, "none"),
    attack_type: safeText(row.attack_type, "none"),
    hit_type: safeText(row.hit_type, "normal"),
    effect1: safeText(row.effect1, "none"),
    effect_target1: normalizeEffectTarget(row.effect_target1),
    effect_chance1: number(row.effect_chance1),
    effect2: safeText(row.effect2, "none"),
    effect_target2: normalizeEffectTarget(row.effect_target2),
    effect_chance2: number(row.effect_chance2),
    effect3: safeText(row.effect3, "none"),
    effect_target3: normalizeEffectTarget(row.effect_target3),
    effect_chance3: number(row.effect_chance3),
    battle_effect1: safeText(row.battle_effect1, "none"),
    battle_effect_chance1: number(row.battle_effect_chance1),
    battle_effect2: safeText(row.battle_effect2, "none"),
    battle_effect_chance2: number(row.battle_effect_chance2),
    target: safeText(row.target, "enemy"),
    priority: number(row.priority),
    cost: number(row.cost),
    text: csvText(row.text),
    animation_id: safeText(row.animation_id),
    animation: animationAssetName(row.animation),
    animation_duration_ms: Math.max(0, number(row.animation_duration_ms)),
    repeat_count: Math.max(0, Math.floor(number(row.repeat_count, 1))),
    power_rule: safeText(row.power_rule),
    power_cap: optionalNumber(row.power_cap),
  };
}

function normalizePowerRule(row) {
  return {
    power_rule_id: safeText(row.power_rule_id),
    power_rule_group: safeText(row.power_rule_group),
    min_ratio: number(row.min_ratio),
    max_ratio: optionalNumber(row.max_ratio),
    power_multiplier: number(row.power_multiplier, 1),
  };
}

function normalizeEffect(row) {
  return {
    effect_id: safeText(row.effect_id),
    name: safeText(row.name),
    effect_group: safeText(row.effect_group),
    damage_type: safeText(row.damage_type, "none"),
    damage_value: number(row.damage_value),
    turn: Math.max(0, number(row.turn, 1)),
    can_move: parseBoolean(row.can_move),
    target_stat: safeText(row.target_stat, "none"),
  };
}

function normalizeBattleEffect(row) {
  return {
    battle_effect_id: safeText(row.battle_effect_id),
    name: safeText(row.name),
    battle_effect_group: safeText(row.battle_effect_group),
    damage_type: safeText(row.damage_type, "none"),
    damage_value: number(row.damage_value),
    turn: Math.max(1, number(row.turn, 1)),
    can_move: parseBoolean(row.can_move),
    guard_type: safeText(row.guard_type, "none"),
    weak_hit_type: safeText(row.weak_hit_type, "none"),
    damage_cut: number(row.damage_cut),
    animation: animationAssetName(row.animation),
    animation_duration_ms: Math.max(0, number(row.animation_duration_ms)),
  };
}

function normalizeHitType(row) {
  return {
    hit_type_id: safeText(row.hit_type_id),
    name: safeText(row.name),
    description: safeText(row.description),
  };
}

function normalizeAnimation(row) {
  const animationId = safeText(row.animation_id);
  const battleEffectId = safeText(row.battle_effect_id);
  const fallback = DEFAULT_POSITION_ANIMATIONS[battleEffectId] ?? {};
  const animationName =
    battleEffectId === DISAPPEAR_POSITION_EFFECT_ID
      ? cssToken(row.animation_name, fallback.animation_name ?? "")
      : "";
  const frameCount = Math.max(1, Math.floor(number(row.frame_count, 1)));
  const columns = Math.max(1, Math.floor(number(row.columns, 1)));
  const rows = Math.max(1, Math.floor(number(row.rows, Math.ceil(frameCount / columns))));
  return {
    animation_id: animationId,
    name: safeText(row.name, animationId),
    image_path: safeText(row.image_path),
    frame_width: Math.max(1, number(row.frame_width, ANIMATION_FRAME_WIDTH)),
    frame_height: Math.max(1, number(row.frame_height, ANIMATION_FRAME_HEIGHT)),
    columns,
    rows,
    frame_count: frameCount,
    frame_order: parseFrameOrder(row.frame_order, frameCount),
    fps: Math.max(1, number(row.fps, 30)),
    loop: parseBoolean(row.loop),
    repeat_count: Math.max(1, Math.floor(number(row.repeat_count, 1))),
    battle_effect_id: battleEffectId,
    position_class: cssToken(row.position_class, fallback.position_class ?? `position-${battleEffectId}`),
    animation_name: animationName,
    animation_duration_ms: animationName
      ? Math.max(1, number(row.animation_duration_ms, fallback.animation_duration_ms ?? 520))
      : 0,
    surface_color: safeText(row.surface_color, fallback.surface_color ?? ""),
  };
}

function normalizeBgm(row) {
  return {
    bgm_id: safeText(row.bgm_id),
    name: safeText(row.name),
    bgm_path: safeText(row.bgm_path),
  };
}

function normalizeRankBattle(row) {
  return {
    rank_battle_id: safeText(row.rank_battle_id),
    rank: safeText(row.rank),
    name: safeText(row.name),
    enemy_party_id: safeText(row.enemy_party_id),
    reward_money: number(row.reward_money),
    unlockBattleIds: [
      row.unlock_battle_id1,
      row.unlock_battle_id2,
      row.unlock_battle_id3,
      row.unlock_battle_id4,
    ]
      .map((rankBattleId) => safeText(rankBattleId))
      .filter((rankBattleId) => rankBattleId && rankBattleId !== "none"),
  };
}

function normalizeEnemyParty(row) {
  return {
    enemy_party_id: safeText(row.enemy_party_id),
    characterIds: [row.character_id_1, row.character_id_2, row.character_id_3]
      .map((characterId) => safeText(characterId))
      .filter((characterId) => characterId && characterId !== "none"),
  };
}

function normalizeShopItem(row) {
  return {
    shop_id: safeText(row.shop_id),
    shop_entry_id: safeText(row.shop_entry_id),
    item_type: safeText(row.item_type).toLowerCase(),
    content_id: safeText(row.content_id),
    price: Math.max(0, Math.floor(number(row.price))),
    can_sell: parseBoolean(row.can_sell),
    stock: Math.max(0, Math.floor(number(row.stock))),
    unlock_condition: safeText(row.unlock_condition),
    display_order: number(row.display_order, 9999),
  };
}

function normalizeEquipment(row) {
  return {
    equipment_id: safeText(row.equipment_id),
    name: safeText(row.name),
    equipment_type: safeText(row.equipment_type).toLowerCase(),
    text: safeText(row.text),
    hp_bonus: number(row.hp_bonus),
    phy_atk_bonus: number(row.phy_atk_bonus ?? row.atk_bonus),
    phy_def_bonus: number(row.phy_def_bonus ?? row.def_bonus),
    sp_atk_bonus: number(row.sp_atk_bonus),
    sp_def_bonus: number(row.sp_def_bonus),
    speed_bonus: number(row.speed_bonus),
    regen_value_bonus: number(row.regen_value_bonus),
    cost_charge_bonus: number(row.cost_charge_bonus),
    weak_fire_bonus: number(row.weak_fire_bonus),
    weak_water_bonus: number(row.weak_water_bonus),
    weak_thunder_bonus: number(row.weak_thunder_bonus),
    weak_ice_bonus: number(row.weak_ice_bonus),
    weak_dragon_bonus: number(row.weak_dragon_bonus),
    species_id: safeText(row.species_id),
    character_id: safeText(row.character_id),
  };
}

function normalizeSpecies(row) {
  return {
    species_id: safeText(row.species_id),
    name: safeText(row.name),
  };
}

function normalizeNpc(row) {
  return {
    npc_id: safeText(row.npc_id),
    name: safeText(row.name),
    image: safeText(row.image),
  };
}

function normalizeDialogue(row, fallbackNpcId = "") {
  return {
    dialogue_id: safeText(row.dialogue_id),
    npc_id: safeText(row.npc_id, fallbackNpcId),
    text: csvText(row.text),
    next_id: safeText(row.next_id),
    condition_type: safeText(row.condition_type).toLowerCase(),
    condition_value: safeText(row.condition_value),
    priority: number(row.priority),
    once: parseBoolean(row.once),
  };
}

function normalizeEncyclopediaBook(row) {
  return {
    book_id: safeText(row.book_id),
    name: safeText(row.name),
    description: safeText(row.description),
    detail_level: Math.max(0, Math.floor(number(row.detail_level))),
    characterIds: [row.character_id1, row.character_id2, row.character_id3, row.character_id4]
      .map((characterId) => safeText(characterId))
      .filter((characterId) => characterId && characterId !== "none"),
  };
}

function applyAnimationConfig() {
  POSITION_EFFECT_IDS = [...new Set([...Object.keys(DEFAULT_POSITION_ANIMATIONS), ...state.animations.keys()])];
  TWO_TURN_BATTLE_EFFECT_IDS = new Set([...POSITION_EFFECT_IDS, "charge_attack"]);
}

function characterImagePath(characterId, imageName = "") {
  const fileName = safeText(imageName, characterId ? `${characterId}.png` : "");
  return fileName ? `./assets/character_image_transparent/${fileName}` : "";
}

function npcImagePath(imageName = "") {
  const image = safeText(imageName);
  if (!image) return "";
  if (/^(?:https?:|data:|\.?\/)/i.test(image)) return image;
  return `${NPC_IMAGE_DIRECTORY}/${image}`;
}

function safeText(value, fallback = "") {
  const text = `${value ?? ""}`.replace(/^\uFEFF/, "").trim();
  return text || fallback;
}

function csvText(value) {
  return `${value ?? ""}`;
}

function animationAssetName(value) {
  const text = safeText(value);
  return text && text !== "none" ? text : "";
}

function parseFrameOrder(value, frameCount) {
  const fallback = Array.from({ length: Math.max(1, frameCount) }, (_, index) => index);
  const text = safeText(value);
  if (!text) return fallback;

  const order = text
    .split(/[-\s|>]+/)
    .map((cellIndex) => Math.floor(number(cellIndex, -1)))
    .filter((cellIndex) => cellIndex >= 0 && cellIndex < frameCount);
  return order.length ? order : fallback;
}

function cssToken(value, fallback = "") {
  const token = safeText(value).replace(/[^a-zA-Z0-9_-]/g, "");
  return token || fallback;
}

function number(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function optionalNumber(value) {
  const text = safeText(value);
  if (!text) return null;
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseBoolean(value) {
  return `${value}`.toLowerCase() === "true";
}

function renderSetup() {
  const playerSlots = selectedSlotTotal();
  const enemySlots = selectedEnemySlotTotal();
  const activeLabel = setupSideLabel(state.setupSide);
  if (els.setupPanelTitle) {
    els.setupPanelTitle.textContent = `${activeLabel}チーム`;
  }
  els.setupPlayerModeButton?.classList.toggle("is-active", state.setupSide === "player");
  els.setupEnemyModeButton?.classList.toggle("is-active", state.setupSide === "enemy");
  els.setupPlayerModeButton?.setAttribute("aria-pressed", state.setupSide === "player" ? "true" : "false");
  els.setupEnemyModeButton?.setAttribute("aria-pressed", state.setupSide === "enemy" ? "true" : "false");
  renderSelectedSlots();
  renderRoster();
  renderDetailPanel();
  els.startButton.disabled =
    playerSlots <= 0 ||
    playerSlots > TEAM_SLOT_LIMIT ||
    enemySlots > TEAM_SLOT_LIMIT;
  els.randomBattleButton.disabled = state.characters.length <= 0;
}

function renderSelectedSlots() {
  els.selectedSlots.innerHTML = `
    ${renderSetupPartySlots("player", "自分", selectedCharactersForSetup())}
    ${renderSetupPartySlots("enemy", "相手", selectedEnemyCharactersForSetup())}
  `;

  for (const button of els.selectedSlots.querySelectorAll("[data-setup-side]")) {
    button.addEventListener("click", () => setSetupSide(button.dataset.setupSide));
  }
}

function renderSetupPartySlots(side, label, selectedCharacters) {
  const usedSlots = slotTotal(selectedCharacters);
  const emptySlots = Math.max(0, TEAM_SLOT_LIMIT - usedSlots);
  const selectedHtml = selectedCharacters
    .map(
      (character) => `
        <div class="selected-slot is-filled">
          <div class="slot-name">${escapeHtml(character.name)}</div>
          <div class="slot-meta">${elementPill(character.element)} スロット ${slotMarks(character.slot)}</div>
        </div>
      `,
    )
    .join("");
  const emptyHtml = selectedCharacters.length
    ? `<div class="selected-slot"><div class="slot-name">EMPTY</div><div class="slot-meta">残り ${emptySlots}/${TEAM_SLOT_LIMIT}</div></div>`
    : `<div class="selected-slot"><div class="slot-name">${side === "enemy" ? "未指定" : "EMPTY"}</div><div class="slot-meta">${side === "enemy" ? "未指定ならランダム" : "モンスターを選択"}</div></div>`;

  return `
    <section class="setup-party-slots ${state.setupSide === side ? "is-active" : ""}">
      <button class="team-slot-summary" type="button" data-setup-side="${side}">
        <span>${label}チーム</span>
        <strong>${usedSlots}/${TEAM_SLOT_LIMIT}</strong>
      </button>
      ${selectedHtml}${emptyHtml}
    </section>
  `;
}

function renderRoster() {
  const activeSelectedIds = setupSelectionIds();
  const otherSide = state.setupSide === "enemy" ? "player" : "enemy";
  const otherSelectedIds = setupSelectionIds(otherSide);
  const otherLabel = setupSideLabel(otherSide);
  els.rosterGrid.innerHTML = charactersByDisplayOrder()
    .map((character) => {
      const selected = activeSelectedIds.includes(character.character_id);
      const selectedByOtherSide = otherSelectedIds.includes(character.character_id);
      return `
        <article class="character-card ${selected ? "is-selected" : ""} ${selectedByOtherSide ? "is-other-side-selected" : ""}">
          <button class="card-select-button" type="button" data-character-id="${character.character_id}">
            <div class="card-topline">
              <span class="card-name">${escapeHtml(character.name)}</span>
              ${elementPill(character.element)}
            </div>
            <div class="card-image-frame">
              <img class="card-image" src="${escapeHtml(character.imageSrc)}" alt="${escapeHtml(character.name)}" />
            </div>
            <div class="card-slot-meta">スロット ${slotMarks(character.slot)}</div>
            ${selectedByOtherSide ? `<div class="card-side-note">${otherLabel}チーム選択中</div>` : ""}
          </button>
          <button class="detail-button" type="button" data-detail-id="${character.character_id}">詳細</button>
        </article>
      `;
    })
    .join("");

  for (const card of els.rosterGrid.querySelectorAll(".card-select-button")) {
    card.addEventListener("click", () => toggleCharacter(card.dataset.characterId));
  }

  for (const button of els.rosterGrid.querySelectorAll(".detail-button")) {
    button.addEventListener("click", () => {
      state.detailCharacterId = button.dataset.detailId;
      renderDetailPanel();
    });
  }
}

function renderDetailPanel() {
  const character = state.characterMap.get(state.detailCharacterId);
  els.detailOverlay.classList.toggle("is-hidden", !character);
  if (!character) {
    els.detailPanel.innerHTML = "";
    return;
  }

  els.detailPanel.innerHTML = `
    <div class="detail-header">
      <div>
        <div class="detail-title">${escapeHtml(character.name)}</div>
        <div class="detail-subtitle">${characterSubtitle(character)}</div>
      </div>
      <button class="small-button detail-close" type="button">閉じる</button>
    </div>
    <div class="detail-body">
      <div class="detail-profile-column">
        <div class="detail-image-frame">
          <img class="detail-image" src="${escapeHtml(character.imageSrc)}" alt="${escapeHtml(character.name)}" />
        </div>
        <div class="detail-summary">
          <div class="dex-data-row"><span>スロット</span><strong>${slotMarks(character.slot)}</strong></div>
          <div class="dex-data-row"><span>EN回復</span><strong>${energyBadge(character.energy_charge)}</strong></div>
          <div class="dex-data-row"><span>弱点</span><strong>${renderWeaknessBadges(character)}</strong></div>
        </div>
      </div>
      <div class="detail-stats">
        ${detailStat("体力", character.hp, "hp")}
        ${detailStat("物理攻撃", character.phy_atk, "phy_atk")}
        ${detailStat("物理防御", character.phy_def, "phy_def")}
        ${detailStat("特殊攻撃", character.sp_atk, "sp_atk")}
        ${detailStat("特殊防御", character.sp_def, "sp_def")}
        ${detailStat("敏捷", character.speed, "speed")}
        ${detailStat("回復力", character.regen_value, "regen_value")}
      </div>
      <div class="detail-skills">
        <div class="detail-section-title">技</div>
        ${movesForCharacter(character)
          .map((move) => renderSkillDetail(move))
          .join("")}
      </div>
      <div class="detail-resistances">
        <div class="detail-section-title">属性耐性</div>
        <div class="resistance-grid">
          ${ELEMENT_TYPES.map((element) => resistanceCell(character, element)).join("")}
        </div>
      </div>
    </div>
  `;

  els.detailPanel.querySelector(".detail-close").addEventListener("click", () => {
    state.detailCharacterId = null;
    renderDetailPanel();
  });
}

function detailStat(label, value, statKey, options = {}) {
  const barPercent = detailStatBarPercent(statKey, value);
  const baseBarPercent = options.baseValue == null
    ? barPercent
    : detailStatBarPercent(statKey, options.baseValue);
  const visibleBaseBarPercent = Math.min(baseBarPercent, barPercent);
  const displayValue = statKey === "hp" && value > STAT_GRAPH_MAX.hp ? "???" : value;
  const bonusPercent = Math.max(0, barPercent - visibleBaseBarPercent);
  const bonusBar = bonusPercent > 0 ? `<span class="detail-stat-bonus-fill"></span>` : "";
  return `
    <div class="detail-stat detail-stat-${statKey}" style="--bar-width: ${barPercent}%; --base-bar-width: ${visibleBaseBarPercent}%; --bonus-bar-width: ${bonusPercent}%">
      <span class="detail-stat-label">${escapeHtml(label)}</span>
      <div class="detail-stat-track"><span class="detail-stat-fill"></span>${bonusBar}</div>
      <strong class="detail-stat-value">${escapeHtml(displayValue)}</strong>
    </div>
  `;
}

function characterSubtitle(character) {
  const battleNo = characterBattleNo(character);
  return `${elementPill(character.element)}${battleNo ? ` <span>No.${escapeHtml(battleNo)}</span>` : ""}`;
}

function characterBattleNo(character) {
  const explicitBattleNo = safeText(character.battleNo);
  if (explicitBattleNo) return explicitBattleNo;

  const idMatch = safeText(character.character_id).match(/^character_(\d+)$/i);
  return idMatch ? idMatch[1] : "";
}

function detailStatBarPercent(statKey, value) {
  const maxStatValue = STAT_GRAPH_MAX[statKey] ?? 250;
  return Math.round(clamp(value / maxStatValue, 0, 1) * 100);
}

function renderSkillDetail(move) {
  const powerText = move.category === "attack" ? move.power : "-";
  const kindText = skillKindLabel(move);
  const elementText = elementName(move.element);
  return `
    <article class="detail-skill-card">
      <div class="detail-skill-top">
        <strong class="detail-skill-name">${escapeHtml(move.name)}</strong>
        <div class="detail-skill-meta" aria-label="${escapeHtml(move.name)}の技情報">
          <span class="detail-skill-chip detail-skill-power">威力 ${escapeHtml(powerText)}</span>
          <span class="detail-skill-cost">${energyBadge(move.cost)}</span>
          <span class="detail-skill-chip detail-skill-kind detail-skill-kind-${escapeHtml(skillKindClass(move))}">${escapeHtml(kindText)}</span>
          <span class="detail-skill-chip detail-skill-element element-${escapeHtml(elementClass(move.element))}">${escapeHtml(elementText)}</span>
        </div>
      </div>
      ${move.text ? `<div class="detail-skill-text">${escapeHtml(move.text)}</div>` : ""}
    </article>
  `;
}

function skillKindClass(move) {
  if (move.category !== "attack") return "status";
  if (move.attack_type === "special") return "special";
  if (move.attack_type === "physical") return "physical";
  return "status";
}

function skillKindLabel(move) {
  if (move.category === "attack" && move.attack_type === "physical") return "物理";
  if (move.category === "attack" && move.attack_type === "special") return "特殊";
  return "変化";
}

function openDex() {
  const activeId = activeEnemy()?.id || activePlayer()?.id || state.characters[0]?.character_id || null;
  state.dex.open = true;
  state.dex.characterId = state.dex.characterId || activeId;
  renderDexPanel();
}

function renderDexPanel() {
  if (!els.dexOverlay || !els.dexPanel) return;

  const dexCharacters = charactersByDisplayOrder();
  const fallbackId = activeEnemy()?.id || activePlayer()?.id || state.characters[0]?.character_id || null;
  const selectedId = state.dex.characterId || fallbackId;
  const character = state.characterMap.get(selectedId) || state.characters[0];
  els.dexOverlay.classList.toggle("is-hidden", !state.dex.open || !character);

  if (!state.dex.open || !character) {
    els.dexPanel.innerHTML = "";
    return;
  }

  const isStoryBattle = Boolean(state.story.currentRankBattleId || state.story.currentArenaBattleId);
  const canViewCharacter = !isStoryBattle || canViewStoryBattleEncyclopedia(character.character_id);
  const dexCharacterName = canViewCharacter ? character.name : "？？？？？";
  const dexCharacterSubtitle = canViewCharacter
    ? characterSubtitle(character)
    : "対応する図鑑を購入すると情報を確認できます";
  const dexProfileRows = canViewCharacter
    ? `
      <div class="dex-data-row"><span>スロット</span><strong>${slotMarks(character.slot)}</strong></div>
      <div class="dex-data-row"><span>EN回復</span><strong>${energyBadge(character.energy_charge)}</strong></div>
      <div class="dex-data-row"><span>回復力</span><strong>${escapeHtml(character.regen_value)}</strong></div>
    `
    : `
      <div class="dex-data-row"><span>能力値</span><strong>？？？</strong></div>
      <div class="command-note">対応する図鑑を購入すると情報を確認できます</div>
    `;
  const dexStatsSection = canViewCharacter
    ? `
      <div class="detail-section-title">パラメータ</div>
      <div class="detail-stats dex-stats">
        ${detailStat("体力", character.hp, "hp")}
        ${detailStat("物理攻撃", character.phy_atk, "phy_atk")}
        ${detailStat("物理防御", character.phy_def, "phy_def")}
        ${detailStat("特殊攻撃", character.sp_atk, "sp_atk")}
        ${detailStat("特殊防御", character.sp_def, "sp_def")}
        ${detailStat("敏捷", character.speed, "speed")}
        ${detailStat("回復力", character.regen_value, "regen_value")}
      </div>
    `
    : "";
  const dexResistanceSection = canViewCharacter
    ? `
      <div class="detail-section-title">属性耐性</div>
      <div class="resistance-grid">
        ${ELEMENT_TYPES.map((element) => resistanceCell(character, element)).join("")}
      </div>
    `
    : "";

  els.dexPanel.innerHTML = `
    <div class="detail-header">
      <div>
        <div class="detail-title">図鑑</div>
        <div class="detail-subtitle">Breederデータ</div>
      </div>
      <button class="small-button dex-close" type="button">閉じる</button>
    </div>
    <div class="dex-layout">
      <aside class="dex-list" aria-label="Breeder一覧">
        ${dexCharacters
          .map((entry) => {
            const canViewEntry = !isStoryBattle || canViewStoryBattleEncyclopedia(entry.character_id);
            return `
              <button class="dex-list-button ${entry.character_id === character.character_id ? "is-selected" : ""}" type="button" data-dex-id="${escapeHtml(entry.character_id)}">
                <span>${escapeHtml(canViewEntry ? entry.name : "？？？？？")}</span>
                ${canViewEntry ? elementPill(entry.element) : ""}
              </button>
            `;
          })
          .join("")}
      </aside>
      <section class="dex-content">
        <div class="dex-profile">
          <div class="detail-image-frame dex-image-frame">
            <img class="detail-image" src="${escapeHtml(character.imageSrc)}" alt="${escapeHtml(dexCharacterName)}" />
          </div>
          <div class="dex-summary">
            <div class="detail-title">${escapeHtml(dexCharacterName)}</div>
            <div class="detail-subtitle">${dexCharacterSubtitle}</div>
            ${dexProfileRows}
          </div>
        </div>
        ${dexStatsSection}
        ${dexResistanceSection}
      </section>
    </div>
  `;

  els.dexPanel.querySelector(".dex-close").addEventListener("click", () => {
    state.dex.open = false;
    renderDexPanel();
  });

  for (const button of els.dexPanel.querySelectorAll(".dex-list-button")) {
    button.addEventListener("click", () => {
      state.dex.characterId = button.dataset.dexId;
      renderDexPanel();
    });
  }
}

function charactersByDisplayOrder() {
  return [...state.characters].sort((a, b) => {
    const displayOrder = a.display_order - b.display_order;
    if (displayOrder) return displayOrder;
    return characterSortNumber(a) - characterSortNumber(b) || a.character_id.localeCompare(b.character_id);
  });
}

function characterSortNumber(character) {
  const match = safeText(character?.character_id).match(/^character_(\d+)$/i);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function resistanceCell(character, element) {
  const percent = Math.round((character.weaknesses[element] ?? 1) * 100);
  const className =
    percent > 100 ? "is-weak" : percent < 100 ? "is-resistant" : "is-neutral";
  const label = percent > 100 ? "弱点" : percent < 100 ? "耐性" : "標準";
  return `
    <div class="resistance-cell ${className}">
      ${elementPill(element)}
      <strong>${percent}%</strong>
      <span>${label}</span>
    </div>
  `;
}

function selectedCharactersForSetup() {
  return charactersForSetupIds(state.selectedIds);
}

function selectedEnemyCharactersForSetup() {
  return charactersForSetupIds(state.selectedEnemyIds);
}

function charactersForSetupIds(characterIds) {
  return characterIds
    .map((id) => state.characterMap.get(id))
    .filter(Boolean);
}

function selectedSlotTotal() {
  return slotTotal(selectedCharactersForSetup());
}

function selectedEnemySlotTotal() {
  return slotTotal(selectedEnemyCharactersForSetup());
}

function setupSelectionIds(side = state.setupSide) {
  return side === "enemy" ? state.selectedEnemyIds : state.selectedIds;
}

function setSetupSelectionIds(characterIds, side = state.setupSide) {
  const validIds = characterIds.filter((characterId) => state.characterMap.has(characterId));
  if (side === "enemy") {
    state.selectedEnemyIds = validIds;
  } else {
    state.selectedIds = validIds;
  }
}

function setupSlotTotal(side = state.setupSide) {
  return slotTotal(charactersForSetupIds(setupSelectionIds(side)));
}

function setupSideLabel(side = state.setupSide) {
  return side === "enemy" ? "相手" : "自分";
}

function setSetupSide(side) {
  state.setupSide = side === "enemy" ? "enemy" : "player";
  renderSetup();
}

function slotMarks(value) {
  const count = Math.max(0, Math.floor(number(value)));
  if (count <= 0) {
    return `<span class="slot-mark-list is-empty" aria-label="スロットなし">-</span>`;
  }

  const marks = Array.from({ length: count }, () => `<span class="slot-mark" aria-hidden="true"></span>`).join("");
  return `<span class="slot-mark-list" aria-label="スロット${count}">${marks}</span>`;
}

function slotMarkText(value) {
  const count = Math.max(0, Math.floor(number(value)));
  return count > 0 ? "〇".repeat(count) : "-";
}

function slotTotal(characters) {
  return characters.reduce((total, character) => total + Math.max(1, character.slot || 1), 0);
}

function energyBadge(value) {
  const count = Math.max(0, Math.floor(number(value)));
  if (count <= 0) {
    return `<span class="energy-chip energy-chip-zero" aria-label="EN-"><span class="energy-chip-label">EN-</span></span>`;
  }

  return `
    <span class="energy-chip" aria-label="EN${count}">
      <span class="energy-chip-label">EN</span>
      <span class="energy-orbs">${energyOrbs(count)}</span>
    </span>
  `;
}

function energyOrbs(value) {
  const count = Math.max(0, Math.floor(number(value)));
  return Array.from({ length: count }, () => `<span class="energy-orb" aria-hidden="true"></span>`).join("");
}

function weaknessEntries(character) {
  if (!character) return [];
  return ELEMENT_TYPES
    .map((element) => ({
      element,
      percent: Math.round((character.weaknesses[element] ?? 1) * 100),
    }))
    .filter((entry) => entry.percent > 100);
}

function renderWeaknessBadges(character) {
  const entries = weaknessEntries(character);
  if (!entries.length) {
    return `<span class="effect-chip effect-none">なし</span>`;
  }

  return entries
    .map(
      (entry) => `
        <span class="weakness-badge">
          <span class="weakness-badge-element-square element-${escapeHtml(elementClass(entry.element))}" aria-hidden="true"></span>
          ${escapeHtml(elementName(entry.element))}
        </span>
      `,
    )
    .join("");
}

function weaknessSummaryText(character) {
  const entries = weaknessEntries(character);
  return entries.length ? entries.map((entry) => elementName(entry.element)).join("、") : "なし";
}

function resistanceSummaryText(character) {
  if (!character) return "";
  return ELEMENT_TYPES
    .map((element) => {
      const percent = Math.round((character.weaknesses[element] ?? 1) * 100);
      return `${elementName(element)}${percent}%`;
    })
    .join(" / ");
}

function battleStatModifierLabel(stat, value) {
  const marker = value > 0 ? "△" : "▼";
  const suffix = STAT_STAGE_MOD_KEY_SET.has(stat) ? "%" : "";
  return `${STAT_LABELS[stat] ?? stat}${marker}${Math.abs(value)}${suffix}`;
}

function battleStatusDisplayLabel(status) {
  const resistanceLabel = battleResistanceStatusLabel(status);
  return resistanceLabel || status.name;
}

function battleResistanceStatusLabel(status) {
  if (status?.group !== "resistance") return "";
  const element = resistanceEffectElement(status);
  if (!element) return "";
  const delta = resistanceWeakModDelta(status);
  if (!delta) return "";
  return battleWeakModLabel(element, delta);
}

function battleWeakModLabel(element, value) {
  const displayValue = -value;
  const direction = displayValue > 0 ? "+" : "-";
  return `${elementName(element)}属性${direction}${Math.abs(displayValue)}%`;
}

function fighterWeakModEntries(fighter) {
  if (!fighter) return [];
  const weakMods = ensureFighterWeakMods(fighter);
  return ELEMENT_TYPES
    .map((element) => ({
      element,
      value: weakMods[element].value,
    }))
    .filter((entry) => entry.value !== 0)
    .map((entry) => ({
      label: battleWeakModLabel(entry.element, entry.value),
      className: `effect-resistance-${entry.element}`,
    }));
}

function fighterBattleStatusEntries(fighter) {
  if (!fighter) return [];
  const statusEntries = fighter.statuses
    .filter((status) => status.group !== "resistance")
    .map((status) => ({
      label: battleStatusDisplayLabel(status),
      className: effectChipClass(status.id),
    }));
  const weakModEntries = fighterWeakModEntries(fighter);
  const battleEffectEntries = fighter.battleEffects.map((effect) => ({
    label: effect.name,
    className: effectChipClass(effect.id),
  }));
  const side = sideForActiveFighter(fighter);
  const fieldEffectEntries = side
    ? fieldEffectsForSide(state.fieldEffects, side).map((effect) => ({
        label: effect.name,
        className: effectChipClass(effect.id),
      }))
    : [];
  const statEntries = Object.entries(fighter.statMods)
    .filter(([, value]) => value !== 0)
    .map(([stat, value]) => ({
      label: battleStatModifierLabel(stat, value),
      className: value > 0 ? "effect-up" : "effect-down",
    }));

  return [...statusEntries, ...weakModEntries, ...battleEffectEntries, ...fieldEffectEntries, ...statEntries];
}

function renderFighterStatusChips(fighter) {
  const entries = fighterBattleStatusEntries(fighter);
  if (!entries.length) {
    return `<span class="effect-chip effect-none">なし</span>`;
  }

  return entries
    .map(
      (entry) => `
        <span class="effect-chip ${escapeHtml(entry.className)}">
          ${escapeHtml(entry.label)}
        </span>
      `,
    )
    .join("");
}

function fighterStatusSummary(fighter) {
  const entries = fighterBattleStatusEntries(fighter).map((entry) => entry.label);
  return entries.length ? entries.join("、") : "なし";
}

function buildSlotTeam(pool, slotLimit = TEAM_SLOT_LIMIT, randomize = false) {
  const eligible = pool.filter(
    (character) => character?.character_id && character.name && character.slot <= slotLimit,
  );
  const candidates = randomize ? sample(eligible, eligible.length) : [...eligible];
  const team = [];
  let usedSlots = 0;

  for (const character of candidates) {
    if (usedSlots + character.slot > slotLimit) continue;
    team.push(character);
    usedSlots += character.slot;
    if (usedSlots === slotLimit) return team;
  }

  if (usedSlots !== slotLimit) {
    for (const character of pool) {
      if (!character?.character_id || team.includes(character)) continue;
      if (usedSlots + character.slot > slotLimit) continue;
      team.push(character);
      usedSlots += character.slot;
      if (usedSlots === slotLimit) return team;
    }
  }

  return team;
}

function initialPlayerCharacterIds() {
  const characterIds = INITIAL_PLAYER_CHARACTER_IDS.filter((characterId) => state.characterMap.has(characterId));
  return characterIds.length ? characterIds : buildSlotTeam(state.characters).map((character) => character.character_id);
}

function loadSaveData({ preserveCurrentOnMissing = false, storageKey = null, allowLegacy = false } = {}) {
  if (!storageKey) {
    if (!preserveCurrentOnMissing) {
      state.saveData = createSaveData();
      state.story.clearedRankBattleIds = new Set();
      state.story.disabledRankBattleIds = new Set();
    }
    return { ok: false, missing: true };
  }

  const source = findSaveStorageSource(storageKey, { allowLegacy });
  if (!source.raw) {
    if (!preserveCurrentOnMissing) {
      state.saveData = createSaveData();
      state.story.clearedRankBattleIds = new Set();
      state.story.disabledRankBattleIds = new Set();
    }
    return { ok: false, missing: true };
  }

  const result = applySaveDataFromRaw(source.raw);
  if (!result.ok) {
    showSaveStatus(result.error, { isError: true });
    return { ...result, key: source.key };
  }

  return { ok: true, key: source.key, legacy: source.legacy };
}

function saveGameData() {
  return { ok: true, skipped: true };
}

function createSavePayload() {
  ensurePartyOwnedIds();
  const clearedBattles = [...new Set([...state.story.clearedRankBattleIds].map((id) => safeText(id)).filter(Boolean))];
  return {
    money: state.saveData.money,
    time_of_day: normalizeTimeOfDay(state.story.timeOfDay),
    owned_books: [...state.saveData.ownedBooks],
    owned_monsters: state.saveData.ownedMonsters.map((entry) => ({
      owned_id: entry.ownedId,
      character_id: entry.characterId,
      equipment: normalizeOwnedMonsterEquipment(entry.equipment),
      storage: ownedMonsterStorage(entry),
    })),
    party_owned_ids: normalizePartyOwnedIds(state.saveData.partyOwnedIds, state.saveData.ownedMonsters),
    owned_equipment: Object.fromEntries(state.saveData.ownedEquipment),
    shop_stock: Object.fromEntries(state.saveData.shopStock),
    purchased_shop_entries: [...state.saveData.purchasedShopEntries],
    seen_dialogue_ids: [...state.saveData.seenDialogueIds],
    cleared_battles: clearedBattles,
    cleared_rank_battle_ids: clearedBattles,
    next_owned_monster_number: state.saveData.nextOwnedMonsterNumber,
    initial_money_version: state.saveData.initialMoneyVersion,
    initial_party_version: state.saveData.initialPartyVersion,
  };
}

function handleManualSave(slotNumber) {
  const key = MANUAL_SAVE_STORAGE_KEYS[slotNumber - 1];
  if (!key) return;

  const existingSave = readStorageValue(key);
  if (existingSave && !window.confirm(`セーブ${slotNumber}を上書きしますか？`)) return;

  const payload = createSavePayload();
  payload.saved_at = new Date().toISOString();

  try {
    setStorageValue(key, JSON.stringify(payload));
    clearUnsavedChanges();
    renderMyHouseSaveControls();
    showSaveStatus(`セーブ${slotNumber}に保存しました。`);
  } catch {
    showSaveStatus(`セーブ${slotNumber}への保存に失敗しました。`, { isError: true });
  }
}

function handleSaveLoad(key, label) {
  const slotLabel = label || key;
  const confirmMessage = `${slotLabel}をロードしますか？現在の表示中データは上書きされます。`;
  if (!window.confirm(confirmMessage)) return;

  const raw = readStorageValue(key);
  if (!raw) {
    showSaveStatus(`${slotLabel}にはデータがありません。`, { isError: true });
    renderMyHouseSaveControls();
    return;
  }

  const result = applySaveDataFromRaw(raw);
  if (!result.ok) {
    showSaveStatus(result.error, { isError: true });
    renderMyHouseSaveControls();
    return;
  }

  initializeSaveDataParty({ persist: false });
  refreshProgressViews();
  showSaveStatus(`${slotLabel}をロードしました。`);
}

function applySaveDataFromRaw(raw) {
  let rawData = null;
  try {
    rawData = JSON.parse(raw || "null");
  } catch {
    return { ok: false, error: "セーブデータのJSONが破損しています。" };
  }

  const normalized = normalizeSavePayload(rawData);
  if (!normalized.ok) return normalized;

  state.saveData = normalized.saveData;
  state.story.timeOfDay = normalized.timeOfDay;
  state.story.clearedRankBattleIds = normalized.clearedRankBattleIds;
  state.story.disabledRankBattleIds = new Set(state.story.clearedRankBattleIds);
  clearUnsavedChanges();
  return { ok: true };
}

function normalizeSavePayload(rawData) {
  if (!rawData || typeof rawData !== "object" || Array.isArray(rawData)) {
    return { ok: false, error: "セーブデータの形式が正しくありません。" };
  }

  const nextSaveData = createSaveData();
  const timeOfDay = normalizeTimeOfDay(rawData.time_of_day ?? rawData.timeOfDay);
  nextSaveData.money = Math.max(0, Math.floor(number(rawData.money, INITIAL_MONEY)));
  nextSaveData.initialMoneyVersion = Math.floor(number(rawData.initial_money_version ?? rawData.initialMoneyVersion, 1));
  nextSaveData.initialPartyVersion = Math.floor(number(rawData.initial_party_version ?? rawData.initialPartyVersion, INITIAL_PARTY_VERSION));

  const ownedBooks = saveArrayField(rawData.owned_books ?? rawData.ownedBooks, "owned_books");
  if (!ownedBooks.ok) return ownedBooks;
  for (const bookId of ownedBooks.value) {
    const id = safeText(bookId);
    if (id) nextSaveData.ownedBooks.add(id);
  }

  const purchasedEntries = saveArrayField(rawData.purchased_shop_entries ?? rawData.purchasedShopEntries, "purchased_shop_entries");
  if (!purchasedEntries.ok) return purchasedEntries;
  for (const entryId of purchasedEntries.value) {
    const id = safeText(entryId);
    if (id) nextSaveData.purchasedShopEntries.add(id);
  }

  const seenDialogueIds = saveArrayField(rawData.seen_dialogue_ids ?? rawData.seenDialogueIds, "seen_dialogue_ids");
  if (!seenDialogueIds.ok) return seenDialogueIds;
  for (const dialogueId of seenDialogueIds.value) {
    const id = safeText(dialogueId);
    if (id) nextSaveData.seenDialogueIds.add(id);
  }

  const stockData = rawData.shop_stock ?? rawData.shopStock;
  if (stockData != null) {
    if (typeof stockData !== "object" || Array.isArray(stockData)) {
      return { ok: false, error: "shop_stockの形式が正しくありません。" };
    }
    for (const [entryId, stock] of Object.entries(stockData)) {
      const id = safeText(entryId);
      if (id) nextSaveData.shopStock.set(id, Math.max(0, Math.floor(number(stock))));
    }
  }

  const equipmentData = rawData.owned_equipment ?? rawData.ownedEquipment;
  if (equipmentData != null) {
    if (typeof equipmentData !== "object" || Array.isArray(equipmentData)) {
      return { ok: false, error: "owned_equipmentの形式が正しくありません。" };
    }
    for (const [equipmentId, count] of Object.entries(equipmentData)) {
      const id = safeText(equipmentId);
      const ownedCount = Math.max(0, Math.floor(number(count)));
      if (id && ownedCount > 0) nextSaveData.ownedEquipment.set(id, ownedCount);
    }
  }

  const ownedMonsters = saveArrayField(rawData.owned_monsters ?? rawData.ownedMonsters, "owned_monsters");
  if (!ownedMonsters.ok) return ownedMonsters;
  nextSaveData.ownedMonsters = ownedMonsters.value
    .map((entry) => ({
      ownedId: safeText(entry?.owned_id ?? entry?.ownedId),
      characterId: safeText(entry?.character_id ?? entry?.characterId),
      equipment: normalizeOwnedMonsterEquipment(entry?.equipment),
      storage: normalizeOwnedMonsterStorage(entry?.storage ?? entry?.location),
    }))
    .filter((entry) => entry.ownedId && entry.characterId);

  const loadedNextNumber = Math.max(
    1,
    Math.floor(number(rawData.next_owned_monster_number ?? rawData.nextOwnedMonsterNumber, 1)),
  );
  const nextNumberFromIds = nextSaveData.ownedMonsters.reduce((maxValue, entry) => {
    const match = entry.ownedId.match(/(\d+)$/);
    return match ? Math.max(maxValue, Number(match[1]) + 1) : maxValue;
  }, 1);
  nextSaveData.nextOwnedMonsterNumber = Math.max(loadedNextNumber, nextNumberFromIds);

  const rawPartyOwnedIds = rawData.party_owned_ids ?? rawData.partyOwnedIds;
  const partyOwnedIds = saveArrayField(rawPartyOwnedIds, "party_owned_ids");
  if (!partyOwnedIds.ok) return partyOwnedIds;
  nextSaveData.partyOwnedIds =
    rawPartyOwnedIds == null
      ? legacyPartyOwnedIdsFromOwnedMonsters(nextSaveData.ownedMonsters)
      : normalizePartyOwnedIds(partyOwnedIds.value, nextSaveData.ownedMonsters);
  syncOwnedMonsterStorageFromParty(nextSaveData);

  migrateLegacyInitialParty(nextSaveData);

  const clearedBattles = saveArrayField(
    rawData.cleared_battles ?? rawData.clearedBattles ?? rawData.cleared_rank_battle_ids ?? rawData.clearedRankBattleIds,
    "cleared_battles",
  );
  if (!clearedBattles.ok) return clearedBattles;

  return {
    ok: true,
    saveData: nextSaveData,
    timeOfDay,
    clearedRankBattleIds: new Set(
      clearedBattles.value
        .map((rankBattleId) => safeText(rankBattleId))
        .filter(Boolean),
    ),
  };
}

function saveArrayField(value, fieldName) {
  if (value == null) return { ok: true, value: [] };
  if (!Array.isArray(value)) {
    return { ok: false, error: `${fieldName}の形式が正しくありません。` };
  }
  return { ok: true, value };
}

function normalizeOwnedMonsterEquipment(value) {
  const equipment = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return {
    accessory: safeText(equipment.accessory),
  };
}

function normalizeOwnedMonsterStorage(value) {
  return safeText(value).toLowerCase() === "lab" ? "lab" : "party";
}

function ownedMonsterStorage(ownedMonster) {
  return normalizeOwnedMonsterStorage(ownedMonster?.storage);
}

function validOwnedMonsterEntries(ownedMonsters = state.saveData.ownedMonsters) {
  return (Array.isArray(ownedMonsters) ? ownedMonsters : []).filter(
    (entry) =>
      entry?.ownedId &&
      entry.characterId &&
      (!state.characterMap.size || state.characterMap.has(entry.characterId)),
  );
}

function normalizePartyOwnedIds(partyOwnedIds, ownedMonsters = state.saveData.ownedMonsters, options = {}) {
  const { fallbackToOwnedMonsters = true } = options;
  const validOwnedIds = new Set(validOwnedMonsterEntries(ownedMonsters).map((entry) => entry.ownedId));
  const normalized = [];

  for (const ownedId of Array.isArray(partyOwnedIds) ? partyOwnedIds : []) {
    const id = safeText(ownedId);
    if (!id || !validOwnedIds.has(id) || normalized.includes(id)) continue;
    normalized.push(id);
    if (normalized.length >= LAB_MEMBER_DISPLAY_LIMIT) break;
  }

  if (!normalized.length && fallbackToOwnedMonsters) {
    return legacyPartyOwnedIdsFromOwnedMonsters(ownedMonsters);
  }

  return normalized;
}

function legacyPartyOwnedIdsFromOwnedMonsters(ownedMonsters = state.saveData.ownedMonsters) {
  const validEntries = validOwnedMonsterEntries(ownedMonsters);
  const partyIds = [];

  for (const entry of validEntries) {
    if (ownedMonsterStorage(entry) !== "party" || partyIds.includes(entry.ownedId)) continue;
    partyIds.push(entry.ownedId);
    if (partyIds.length >= LAB_MEMBER_DISPLAY_LIMIT) return partyIds;
  }

  if (partyIds.length) return partyIds;

  for (const entry of validEntries) {
    if (partyIds.includes(entry.ownedId)) continue;
    partyIds.push(entry.ownedId);
    if (partyIds.length >= LAB_MEMBER_DISPLAY_LIMIT) break;
  }

  return partyIds;
}

function syncOwnedMonsterStorageFromParty(saveData = state.saveData, options = {}) {
  if (!saveData) return;
  const { fallbackToOwnedMonsters = true } = options;
  saveData.partyOwnedIds = normalizePartyOwnedIds(saveData.partyOwnedIds, saveData.ownedMonsters, {
    fallbackToOwnedMonsters,
  });
  const partyOwnedIdSet = new Set(saveData.partyOwnedIds);
  saveData.ownedMonsters = validOwnedMonsterEntries(saveData.ownedMonsters).map((entry) => ({
    ...entry,
    equipment: normalizeOwnedMonsterEquipment(entry.equipment),
    storage: partyOwnedIdSet.has(entry.ownedId) ? "party" : "lab",
  }));
}

function ensurePartyOwnedIds(saveData = state.saveData) {
  if (!saveData) return [];
  saveData.partyOwnedIds = normalizePartyOwnedIds(saveData.partyOwnedIds, saveData.ownedMonsters);
  syncOwnedMonsterStorageFromParty(saveData);
  return saveData.partyOwnedIds;
}

function currentPartyOwnedIds(saveData = state.saveData) {
  return normalizePartyOwnedIds(saveData.partyOwnedIds, saveData.ownedMonsters, {
    fallbackToOwnedMonsters: false,
  });
}

function ownedMonsterByOwnedId(ownedId) {
  const id = safeText(ownedId);
  return state.saveData.ownedMonsters.find((entry) => entry.ownedId === id) ?? null;
}

function partyOwnedIdSet() {
  return new Set(currentPartyOwnedIds());
}

function partySlotTotalForOwnedIds(ownedIds) {
  return slotTotal(
    normalizePartyOwnedIds(ownedIds, state.saveData.ownedMonsters, { fallbackToOwnedMonsters: false })
      .map((ownedId) => state.characterMap.get(ownedMonsterByOwnedId(ownedId)?.characterId))
      .filter(Boolean),
  );
}

function findSaveStorageSource(storageKey) {
  const raw = readStorageValue(storageKey);
  if (raw) return { key: storageKey, raw, legacy: false };

  return { key: storageKey, raw: null, legacy: false };
}

function readStorageValue(key) {
  try {
    return window.localStorage?.getItem(key) || "";
  } catch {
    return "";
  }
}

function setStorageValue(key, value) {
  window.localStorage?.setItem(key, value);
}

function markUnsavedChanges() {
  state.hasUnsavedChanges = true;
  renderUnsavedChangesNotice();
}

function clearUnsavedChanges() {
  state.hasUnsavedChanges = false;
  renderUnsavedChangesNotice();
}

function renderUnsavedChangesNotice() {
  if (!els.labUnsavedNotice) return;
  els.labUnsavedNotice.classList.toggle("is-hidden", !state.hasUnsavedChanges);
}

function refreshProgressViews() {
  syncSelectedIdsFromOwnedMonsters();
  renderSetup();
  updateStoryRankBattleButtons();
  if (state.shop.open) renderBusinessShop();
  if (els.myHousePanel && !els.myHousePanel.classList.contains("is-hidden")) {
    ensureMyHouseSelection();
    renderMyHouse();
  }
  if (els.labInteriorScreen && !els.labInteriorScreen.classList.contains("is-hidden")) {
    renderLabInterior();
  }
}

function showSaveStatus(message, { isError = false } = {}) {
  if (!els.myHouseSaveStatus) {
    if (isError) console.warn(message);
    return;
  }

  els.myHouseSaveStatus.textContent = message;
  els.myHouseSaveStatus.classList.toggle("is-error", isError);
  window.clearTimeout(saveStatusTimer);
  if (!isError) {
    saveStatusTimer = window.setTimeout(() => {
      els.myHouseSaveStatus.textContent = "";
      els.myHouseSaveStatus.classList.remove("is-error");
    }, 3200);
  }
}

function showShopMessage(message, { isError = false } = {}) {
  if (!els.businessShopMessage) {
    if (isError) console.warn(message);
    return;
  }

  els.businessShopMessage.textContent = message;
  els.businessShopMessage.classList.toggle("is-error", isError);
  window.clearTimeout(shopMessageTimer);
  if (!isError) {
    shopMessageTimer = window.setTimeout(() => {
      els.businessShopMessage.textContent = "";
      els.businessShopMessage.classList.remove("is-error");
    }, 3200);
  }
}

function migrateLegacyInitialParty(saveData) {
  if (saveData.initialPartyVersion >= INITIAL_PARTY_VERSION) return;
  saveData.initialPartyVersion = INITIAL_PARTY_VERSION;
}

function initializeSaveDataParty({ persist = false } = {}) {
  state.saveData.ownedMonsters = state.saveData.ownedMonsters
    .filter((entry) => state.characterMap.has(entry.characterId))
    .map((entry) => ({
      ...entry,
      equipment: normalizeOwnedMonsterEquipment(entry.equipment),
      storage: ownedMonsterStorage(entry),
    }));

  if (!state.saveData.ownedMonsters.length) {
    state.saveData.ownedMonsters = initialPlayerCharacterIds().map((characterId) =>
      createOwnedMonster(characterId),
    );
  }

  ensurePartyOwnedIds();
  syncSelectedIdsFromOwnedMonsters();
  if (persist) saveGameData();
}

function createOwnedMonster(characterId, options = {}) {
  return {
    ownedId: nextOwnedMonsterId(),
    characterId,
    equipment: options.equipment ?? normalizeOwnedMonsterEquipment(),
    storage: normalizeOwnedMonsterStorage(options.storage),
  };
}

function nextOwnedMonsterId() {
  const ownedId = `owned_${String(state.saveData.nextOwnedMonsterNumber).padStart(3, "0")}`;
  state.saveData.nextOwnedMonsterNumber += 1;
  return ownedId;
}

function syncSelectedIdsFromOwnedMonsters() {
  state.selectedIds = partyOwnedMonsterEntries()
    .map((entry) => entry.characterId)
    .filter((characterId) => state.characterMap.has(characterId));
}

function syncOwnedMonsterPartyFromSelectedIds({ persist = true } = {}) {
  const remainingOwnedMonsters = [...state.saveData.ownedMonsters];
  const nextOwnedMonsters = [];
  const currentPartyOwnedIds = new Set(state.saveData.partyOwnedIds);

  for (const characterId of state.selectedIds) {
    if (!state.characterMap.has(characterId)) continue;
    let existingIndex = remainingOwnedMonsters.findIndex(
      (entry) => entry.characterId === characterId && currentPartyOwnedIds.has(entry.ownedId),
    );
    if (existingIndex < 0) {
      existingIndex = remainingOwnedMonsters.findIndex((entry) => entry.characterId === characterId);
    }
    if (existingIndex >= 0) {
      const [ownedMonster] = remainingOwnedMonsters.splice(existingIndex, 1);
      nextOwnedMonsters.push({ ...ownedMonster, storage: "party" });
    } else {
      nextOwnedMonsters.push(createOwnedMonster(characterId));
    }
  }

  state.saveData.ownedMonsters = [...nextOwnedMonsters, ...remainingOwnedMonsters];
  state.saveData.partyOwnedIds = normalizePartyOwnedIds(
    nextOwnedMonsters.map((entry) => entry.ownedId),
    state.saveData.ownedMonsters,
    { fallbackToOwnedMonsters: false },
  );
  ensurePartyOwnedIds();
  syncSelectedIdsFromOwnedMonsters();
  markUnsavedChanges();
  if (persist) saveGameData();
}

function partyOwnedMonsterEntries() {
  const ownedMonsterMap = new Map(state.saveData.ownedMonsters.map((entry) => [entry.ownedId, entry]));
  return currentPartyOwnedIds()
    .map((ownedId) => ownedMonsterMap.get(ownedId))
    .filter(Boolean)
    .slice(0, LAB_MEMBER_DISPLAY_LIMIT);
}

function ownedPartyCharacters() {
  return partyOwnedMonsterEntries()
    .map((entry) => state.characterMap.get(entry.characterId))
    .filter(Boolean);
}

function ownedPartySlotTotal() {
  return slotTotal(ownedPartyCharacters());
}

function toggleCharacter(characterId) {
  const selectedIds = setupSelectionIds();
  const selectedIndex = selectedIds.indexOf(characterId);
  if (selectedIndex >= 0) {
    selectedIds.splice(selectedIndex, 1);
  } else {
    const character = state.characterMap.get(characterId);
    if (!character || character.slot > TEAM_SLOT_LIMIT) return;
    while (setupSlotTotal() + character.slot > TEAM_SLOT_LIMIT && selectedIds.length) {
      selectedIds.shift();
    }
    if (setupSlotTotal() + character.slot > TEAM_SLOT_LIMIT) return;
    selectedIds.push(characterId);
  }
  renderSetup();
}

function startRandomBattle() {
  const randomTeam = buildSlotTeam(state.characters, TEAM_SLOT_LIMIT, true);
  if (!randomTeam.length) return;
  state.selectedIds = randomTeam.map((character) => character.character_id);
  state.selectedEnemyIds = [];
  renderSetup();
  startBattle();
}

async function showRankBattleConfirm(rankBattleId) {
  if (gameDataPromise) {
    await gameDataPromise;
  }

  if (isStoryRankBattleDisabled(rankBattleId)) return;
  const details = resolveRankBattleConfirmDetails(rankBattleId);
  if (!details.ok) {
    warnArenaDataMissing(details);
    return;
  }

  await showNpcConditionalDialogue("guide", {
    conditionType: DIALOGUE_CONDITION_BATTLE_AVAILABLE,
    conditionValue: rankBattleId,
  });

  state.story.pendingRankBattleId = rankBattleId;
  els.storyBattleConfirmLayout?.classList.add("is-rich-confirm");
  els.storyBattleConfirmText.classList.add("story-confirm-content-rich");
  els.storyBattleConfirmText.innerHTML = renderRankBattleConfirmContent(details);
  els.storyBattleOpponentList.innerHTML = "";
  els.storyBattleOpponentPanel?.classList.add("is-hidden");
  els.storyBattleConfirmOverlay.classList.remove("is-hidden");
  els.storyBattleConfirmYesButton.focus({ preventScroll: true });
}

function hideRankBattleConfirm({ restoreFocus = false } = {}) {
  const restoreRankBattleId = state.story.pendingRankBattleId;
  state.story.pendingRankBattleId = null;
  els.storyBattleConfirmOverlay?.classList.add("is-hidden");
  els.storyBattleConfirmLayout?.classList.remove("is-rich-confirm");
  els.storyBattleConfirmText?.classList.remove("story-confirm-content-rich");
  if (els.storyBattleConfirmText) {
    els.storyBattleConfirmText.innerHTML = "";
  }
  if (els.storyBattleOpponentList) {
    els.storyBattleOpponentList.innerHTML = "";
  }
  els.storyBattleOpponentPanel?.classList.add("is-hidden");
  if (restoreFocus) {
    findStoryRankBattleButton(restoreRankBattleId)?.focus({ preventScroll: true });
  }
}

async function confirmRankBattleStart() {
  const rankBattleId = state.story.pendingRankBattleId;
  if (!rankBattleId) return;
  hideRankBattleConfirm();
  await startRankBattle(rankBattleId);
}

function resolveRankBattleConfirmDetails(rankBattleId, options = {}) {
  const id = safeText(rankBattleId);
  if (!id) return { ok: false, rankBattleId: id, missing: "rank_battle_id" };

  const fallback = STORY_RANK_BATTLE_FALLBACKS[id];
  const rankBattle = state.rankBattles.get(id) || (fallback
    ? {
        rank_battle_id: id,
        rank: "",
        name: fallback.name,
        enemy_party_id: id,
        reward_money: 0,
        unlockBattleIds: [],
      }
    : null);
  if (!rankBattle) {
    return { ok: false, rankBattleId: id, missing: "rank_battle.csv" };
  }

  const enemyCharacterIds = rankBattleEnemyCharacterIds(id);
  const missingCharacterIds = [];
  const enemies = enemyCharacterIds
    .map((characterId) => {
      const character = state.characterMap.get(characterId);
      if (!character) missingCharacterIds.push(characterId);
      return character;
    })
    .filter(Boolean);

  if (missingCharacterIds.length || !enemies.length) {
    return {
      ok: false,
      rankBattleId: id,
      enemyPartyId: safeText(rankBattle.enemy_party_id),
      missing: "character.csv",
      missingCharacterIds,
    };
  }

  return {
    ok: true,
    entranceId: safeText(options.entranceId, rankBattle.rank || id),
    rankBattleId: id,
    rankBattle,
    enemyPartyId: safeText(rankBattle.enemy_party_id),
    enemies,
  };
}

function rankBattleDisplayName(rankBattleId) {
  return state.rankBattles.get(rankBattleId)?.name ||
    STORY_RANK_BATTLE_FALLBACKS[rankBattleId]?.name ||
    rankBattleId;
}

function renderStoryOpponentCharacterNames(rankBattleId) {
  const names = rankBattleEnemyCharacterIds(rankBattleId)
    .map((characterId) => state.characterMap.get(characterId)?.name)
    .filter(Boolean);

  return names
    .map((name) => `<div class="story-opponent-name">${escapeHtml(name)}</div>`)
    .join("");
}

function rankBattleEnemyCharacterIds(rankBattleId) {
  const rankBattle = state.rankBattles.get(rankBattleId);
  const enemyParty = state.enemyParties.get(rankBattle?.enemy_party_id ?? rankBattleId);
  return enemyParty?.characterIds.length
    ? enemyParty.characterIds
    : STORY_RANK_BATTLE_FALLBACKS[rankBattleId]?.enemyCharacterIds ?? [];
}

function isStoryRankBattleCleared(rankBattleId) {
  return state.story.clearedRankBattleIds.has(rankBattleId);
}

function isStoryRankBattleUnlocked(rankBattleId) {
  const id = safeText(rankBattleId);
  if (!id) return false;
  if (INITIAL_STORY_RANK_BATTLE_IDS.has(id)) return true;
  if (isStoryRankBattleCleared(id)) return true;
  if (!state.rankBattles.has(id)) return Boolean(STORY_RANK_BATTLE_FALLBACKS[id]);
  return [...state.story.clearedRankBattleIds].some((clearedRankBattleId) =>
    state.rankBattles.get(clearedRankBattleId)?.unlockBattleIds?.includes(id),
  );
}

function isStoryRankBattleDisabled(rankBattleId) {
  return !isStoryRankBattleUnlocked(rankBattleId);
}

function updateStoryRankBattleButtons() {
  if (!els.storyRankBattleButtons) return;
  els.storyRankBattleButtons.innerHTML = storyRankBattles()
    .map(renderStoryRankBattleButton)
    .join("");

  for (const button of els.storyRankBattleButtons.querySelectorAll("[data-rank-battle-id]")) {
    updateStoryRankBattleButton(button, button.dataset.rankBattleId);
  }
}

function storyRankBattles() {
  return [...state.rankBattles.values()]
    .filter((rankBattle) => STORY_RANK_ORDER_INDEX.has(rankBattle.rank))
    .filter((rankBattle) => STORY_RANK_BUTTON_AREAS[rankBattle.rank])
    .filter((rankBattle) => rankBattleEnemyCharacterIds(rankBattle.rank_battle_id).length > 0)
    .sort((a, b) => {
      const rankOrder = STORY_RANK_ORDER_INDEX.get(a.rank) - STORY_RANK_ORDER_INDEX.get(b.rank);
      return rankOrder || a.rank_battle_id.localeCompare(b.rank_battle_id);
    });
}

function renderStoryRankBattleButton(rankBattle) {
  const area = STORY_RANK_BUTTON_AREAS[rankBattle.rank];
  const label = `${rankBattle.rank} ${rankBattle.name}`;
  const style = `left: ${area.left}%; top: ${area.top}%; width: ${area.width}%; height: ${area.height}%;`;
  return `
    <button
      class="story-rank-button story-rank-battle-button story-rank-battle-${escapeHtml(cssToken(rankBattle.rank, "rank"))}"
      type="button"
      data-rank-battle-id="${escapeHtml(rankBattle.rank_battle_id)}"
      data-rank="${escapeHtml(rankBattle.rank)}"
      style="${style}"
      aria-label="${escapeHtml(label)}"
      title="${escapeHtml(label)}"
    >
      <span class="story-rank-state" aria-hidden="true"></span>
    </button>
  `;
}

function handleStoryMainStageClick(event) {
  if (event.target.closest("button")) return;
  const rankBattleId = storyRankBattleIdAtPoint(event.clientX, event.clientY);
  if (!rankBattleId || isStoryRankBattleDisabled(rankBattleId)) return;
  event.preventDefault();
  showRankBattleConfirm(rankBattleId);
}

function storyRankBattleIdAtPoint(clientX, clientY) {
  if (!els.storyMainStage) return "";
  const stageRect = els.storyMainStage.getBoundingClientRect();
  if (!stageRect.width || !stageRect.height) return "";
  const xPercent = ((clientX - stageRect.left) / stageRect.width) * 100;
  const yPercent = ((clientY - stageRect.top) / stageRect.height) * 100;

  const hit = storyRankBattles().find((rankBattle) => {
    const area = STORY_RANK_BUTTON_AREAS[rankBattle.rank];
    if (!area) return false;
    return xPercent >= area.left &&
      xPercent <= area.left + area.width &&
      yPercent >= area.top &&
      yPercent <= area.top + area.height;
  });

  return hit?.rank_battle_id || "";
}

function findStoryRankBattleButton(rankBattleId) {
  if (!els.storyRankBattleButtons || !rankBattleId) return null;
  return [...els.storyRankBattleButtons.querySelectorAll("[data-rank-battle-id]")]
    .find((button) => button.dataset.rankBattleId === rankBattleId) ?? null;
}

function updateStoryRankBattleButton(button, rankBattleId) {
  if (!button) return;
  const cleared = isStoryRankBattleCleared(rankBattleId);
  const locked = !isStoryRankBattleUnlocked(rankBattleId);
  const disabled = locked;
  button.disabled = disabled;
  button.classList.toggle("is-rank-cleared", cleared);
  button.classList.toggle("is-locked", locked);
  button.setAttribute("aria-disabled", `${disabled}`);
  const stateLabel = button.querySelector(".story-rank-state");
  if (stateLabel) {
    stateLabel.textContent = cleared ? "CLEAR" : locked ? "LOCK" : "";
  }
}

async function startRankBattle(rankBattleId) {
  if (gameDataPromise) {
    await gameDataPromise;
  }

  if (isStoryRankBattleDisabled(rankBattleId)) return;

  const enemyCharacterIds = rankBattleEnemyCharacterIds(rankBattleId);

  if (!enemyCharacterIds.length) return;

  initializeSaveDataParty({ persist: false });
  renderSetup();
  if (ownedPartySlotTotal() <= 0 || ownedPartySlotTotal() > TEAM_SLOT_LIMIT) {
    return;
  }

  const isArenaBattle = Boolean(ARENA_BATTLE_ENTRANCE_BY_ID[rankBattleId]);
  startBattle({
    enemyCharacterIds,
    ...(isArenaBattle ? { arenaBattleId: rankBattleId } : { storyRankBattleId: rankBattleId }),
  });
}

function startBattle(options = {}) {
  clearGameOverReturnTimer();
  const requestedStoryBattleId = safeText(options.storyRankBattleId);
  const requestedArenaBattleId =
    safeText(options.arenaBattleId) ||
    (ARENA_BATTLE_ENTRANCE_BY_ID[requestedStoryBattleId] ? requestedStoryBattleId : "");
  const usesOwnedParty = Boolean(requestedStoryBattleId || requestedArenaBattleId);
  if (usesOwnedParty) {
    initializeSaveDataParty({ persist: false });
    if (ownedPartySlotTotal() <= 0 || ownedPartySlotTotal() > TEAM_SLOT_LIMIT) return;
  } else if (selectedSlotTotal() <= 0 || selectedSlotTotal() > TEAM_SLOT_LIMIT) {
    return;
  }
  const currentBattleId = requestedArenaBattleId ? null : requestedStoryBattleId || null;
  const currentArenaBattleId = requestedArenaBattleId || null;
  const hasProvidedEnemyTeam = Array.isArray(options.enemyCharacterIds);
  const manualEnemyCharacters = selectedEnemyCharactersForSetup();
  if (!hasProvidedEnemyTeam && manualEnemyCharacters.length && selectedEnemySlotTotal() > TEAM_SLOT_LIMIT) return;
  const enemyPool = state.characters.filter(
    (character) => !state.selectedIds.includes(character.character_id),
  );
  const playerFighterSources = usesOwnedParty ? partyBattleFighterSources() : selectedBattleFighterSources();
  const enemyCharacters = Array.isArray(options.enemyCharacterIds)
    ? options.enemyCharacterIds
        .map((id) => state.characterMap.get(id))
        .filter(Boolean)
    : manualEnemyCharacters.length
      ? manualEnemyCharacters
    : buildSlotTeam(enemyPool.length ? enemyPool : state.characters, TEAM_SLOT_LIMIT, true);

  if (!playerFighterSources.length || !enemyCharacters.length) return;

  state.playerTeam = playerFighterSources.map((source) =>
    createFighter(source.character, { ownedMonster: source.ownedMonster }),
  );
  state.enemyTeam = enemyCharacters.map(createFighter);
  state.playerActiveIndex = 0;
  state.enemyActiveIndex = 0;
  state.commandMode = "fight";
  state.turn = 1;
  state.busy = false;
  state.gameOver = false;
  state.pendingSwitchSide = null;
  state.battleWinner = null;
  state.battleAnimation = null;
  state.exchange = createExchangeState();
  state.fieldEffects = createFieldEffectsState();
  state.nextFieldEffectId = 1;
  state.battleInspectSide = "enemy";
  state.story.currentRankBattleId = currentBattleId;
  state.story.currentArenaBattleId = currentArenaBattleId;
  state.story.lastDefeatedEnemyId = null;
  playRankBattleBgm(currentArenaBattleId || currentBattleId);
  state.dex = {
    open: false,
    characterId: null,
  };
  state.log = [
    `相手は ${activeEnemy().name} をくりだした！`,
    `ゆけっ！ ${activePlayer().name}！`,
  ];
  state.battleMessage = {
    text: "",
    visible: false,
  };

  state.story.active = false;
  clearStoryWalkTimer();
  els.titleView.classList.add("is-hidden");
  els.storyView.classList.add("is-hidden");
  els.setupView.classList.add("is-hidden");
  els.battleView.classList.remove("is-hidden");
  renderBattle();
  showBattleMessage(state.log.at(-1));
}

function partyBattleFighterSources() {
  return partyOwnedMonsterEntries()
    .map((ownedMonster) => {
      const character = state.characterMap.get(ownedMonster.characterId);
      return character ? { character, ownedMonster } : null;
    })
    .filter(Boolean);
}

function selectedBattleFighterSources() {
  const remainingOwnedMonsters = [...state.saveData.ownedMonsters];
  return state.selectedIds
    .map((characterId) => {
      const character = state.characterMap.get(characterId);
      if (!character) return null;
      const ownedIndex = remainingOwnedMonsters.findIndex((entry) => entry.characterId === characterId);
      const ownedMonster = ownedIndex >= 0 ? remainingOwnedMonsters.splice(ownedIndex, 1)[0] : null;
      return { character, ownedMonster };
    })
    .filter(Boolean);
}

function createFighter(character, options = {}) {
  const equipment = equippedAccessoryForOwnedMonster(options.ownedMonster, character);
  const battleBase = applyEquipmentBonusesToCharacter(character, equipment);
  return {
    id: character.character_id,
    name: character.name,
    ownedId: safeText(options.ownedMonster?.ownedId),
    equipment,
    base: battleBase,
    originalBase: character,
    maxHp: battleBase.hp,
    hp: battleBase.hp,
    maxEnergy: 7,
    energy: START_ENERGY,
    fainted: false,
    statMods: createEmptyStatMods(),
    weakMods: createEmptyWeakMods(),
    statuses: [],
    battleEffects: [],
    pendingMove: null,
    pendingSkill: null,
  };
}

function renderBattle() {
  const player = activePlayer();
  const enemy = activeEnemy();
  const exchangeVisible =
    state.gameOver &&
    state.battleWinner === "player" &&
    !state.story.currentArenaBattleId;
  const arenaResultVisible = state.gameOver && Boolean(state.story.currentArenaBattleId);
  const resultPanelVisible = exchangeVisible || arenaResultVisible;
  const playerPendingMove = Boolean(pendingSkillFor(player));
  const inspectSide = state.battleInspectSide === "player" ? "player" : "enemy";
  const inspectFighter = inspectSide === "player" ? player : enemy;

  els.enemyHud.innerHTML = renderHud(enemy, state.enemyTeam, state.enemyActiveIndex, "enemy");
  els.playerHud.innerHTML = renderHud(player, state.playerTeam, state.playerActiveIndex, "player");
  els.enemySprite.innerHTML = renderSprite(enemy, "enemy", state.enemyActiveIndex);
  els.playerSprite.innerHTML = renderSprite(player, "player", state.playerActiveIndex);
  applyPositionEffectClass(els.enemySprite, enemy);
  applyPositionEffectClass(els.playerSprite, player);
  bindSpriteStatusClicks();
  renderBattleMessage();
  renderBattleAnimationLayer();

  els.fightTab.classList.toggle("is-active", state.commandMode === "fight");
  els.switchTab.classList.toggle("is-active", state.commandMode === "switch");
  els.fightTab.disabled = state.busy || state.gameOver || Boolean(state.pendingSwitchSide);
  els.switchTab.disabled = state.busy || state.gameOver || playerPendingMove;
  els.moveGrid.classList.toggle(
    "is-hidden",
    state.commandMode !== "fight" || resultPanelVisible,
  );
  els.switchGrid.classList.toggle(
    "is-hidden",
    state.commandMode !== "switch" || resultPanelVisible,
  );
  els.enemyInfoPanel.classList.toggle(
    "is-hidden",
    state.commandMode !== "enemyInfo" || resultPanelVisible,
  );
  els.exchangePanel.classList.toggle("is-hidden", !resultPanelVisible);
  els.commandLights.innerHTML = renderCommandLights();
  els.battleStatusPanel.innerHTML = renderBattleStatusPanel(player, enemy);

  renderMoveGrid(player);
  renderSwitchGrid();
  renderEnemyInfoPanel(inspectFighter, inspectSide);
  renderExchangePanel();
}

function renderHud(fighter, team, activeIndex, side) {
  const hpRate = fighter ? clamp(fighter.hp / fighter.maxHp, 0, 1) : 0;
  const hpText = fighter && side === "player" ? `${Math.max(0, fighter.hp)}/${fighter.maxHp}` : "";

  return `
    <div class="hud-row">
      <div class="hud-name">${renderHudElementBadge(fighter)}<span class="hud-character-name">${fighter ? escapeHtml(fighter.name) : ""}</span></div>
      <div class="hud-level">${fighter ? escapeHtml(fighter.name) : ""}</div>
    </div>
    <div class="hp-line">
      <span>体力</span>
      <div class="meter"><div class="meter-fill hp-fill ${hpRate <= 0.28 ? "is-low" : ""}" style="width: ${hpRate * 100}%"></div></div>
      <span class="hud-value hp-value">${escapeHtml(hpText)}</span>
    </div>
    <div class="energy-line">
      <span>EN</span>
      <div class="meter energy-meter">${renderEnergySegments(fighter)}</div>
    </div>
    <div class="battle-info-stack">
      <div class="battle-info-line">
        <span>弱点</span>
        <span class="battle-info-chips">${renderWeaknessBadges(fighter?.base)}</span>
      </div>
      <div class="battle-info-line">
        <span>状態</span>
        <span class="battle-info-chips">${renderFighterStatusChips(fighter)}</span>
      </div>
    </div>
    <div class="party-pips">
      ${team
        .map(
          (member, index) =>
            `<span class="pip ${member.fainted ? "is-fainted" : "is-alive"} ${index === activeIndex ? "is-active" : ""}"></span>`,
        )
        .join("")}
    </div>
  `;
}

function renderHudElementBadge(fighter) {
  const element = fighter?.originalBase?.element ?? fighter?.base?.element ?? "none";
  const normalized = elementClass(element);
  const label = elementName(normalized);
  return `
    <span class="element-pill hud-element-badge element-${normalized}" title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}属性">
      ${escapeHtml(label)}
    </span>
  `;
}

function renderEnergySegments(fighter) {
  const maxEnergy = fighter?.maxEnergy ?? 7;
  const currentEnergy = fighter ? Math.floor(fighter.energy) : 0;
  return Array.from({ length: maxEnergy }, (_, index) => {
    const filled = index < currentEnergy;
    return `<span class="energy-segment ${filled ? "is-filled" : ""}"></span>`;
  }).join("");
}

function renderBattleStatusPanel(player, enemy) {
  const persistentLabels = [
    ...benchPersistentBattleEffectLabels(state.playerTeam, player).map((label) => `自:${label}`),
    ...benchPersistentBattleEffectLabels(state.enemyTeam, enemy).map((label) => `相:${label}`),
  ];
  const regularLabels = [
    ...statusLabels(player).map((label) => `自:${label}`),
    ...statusLabels(enemy).map((label) => `相:${label}`),
  ];
  const labels = [
    ...persistentLabels,
    ...regularLabels.slice(0, Math.max(0, 4 - persistentLabels.length)),
  ];

  if (!labels.length) {
    return `<div class="battle-status-empty">状態効果なし</div>`;
  }

  return labels
    .map((label) => `<div class="battle-status-line">${escapeHtml(label)}</div>`)
    .join("");
}

function benchPersistentBattleEffectLabels(team, activeFighter) {
  return (team ?? []).flatMap((member) => {
    if (!member || member === activeFighter || member.fainted) return [];
    return fighterPersistentBattleEffectLabels(member).map((label) => `${member.name} ${label}`);
  });
}

function fighterPersistentBattleEffectLabels(fighter) {
  if (!fighter || fighter.fainted) return [];
  return (fighter.battleEffects ?? [])
    .filter((effect) => SWITCH_PERSISTENT_BATTLE_EFFECT_IDS.has(effect.id))
    .map((effect) => effect.name);
}

function switchPersistentBattleEffectSummary(fighter) {
  const labels = [
    ...fighterPersistentBattleEffectLabels(fighter),
    ...sideGuardBattleEffectLabels("player"),
  ];
  const uniqueLabels = [...new Set(labels)];
  return uniqueLabels.length ? ` / ${uniqueLabels.map(escapeHtml).join("、")}` : "";
}

function sideGuardBattleEffectLabels(side) {
  return fieldEffectsForSide(state.fieldEffects, side)
    .filter((effect) => isSideGuardBattleEffectId(effect.id))
    .map((effect) => effect.name);
}

function renderCommandLights() {
  return state.playerTeam
    .map((member, index) => {
      const active = index === state.playerActiveIndex;
      const className = member.fainted ? "is-fainted" : active ? "is-active" : "is-ready";
      return `<span class="command-light ${className}"></span>`;
    })
    .join("");
}

function renderSprite(fighter, side, activeIndex = 0) {
  if (!fighter) return "";
  const slotClass = `sprite-slot-${Math.max(1, Math.floor(number(fighter.base.slot, 1)))}`;
  const teamSlotClass = `sprite-team-slot-${Math.max(1, activeIndex + 1)}`;
  const characterClass = `sprite-${cssToken(fighter.id, "character")}`;
  const renderOffsetX = number(fighter.base.renderOffsetX);
  const renderOffsetY = number(fighter.base.renderOffsetY);
  const imageStyleValues = [
    renderOffsetX ? `--sprite-render-offset-x: ${escapeHtml(renderOffsetX)}px;` : "",
    renderOffsetY ? `--sprite-render-offset-y: ${escapeHtml(renderOffsetY)}px;` : "",
  ].filter(Boolean);
  const imageStyle = imageStyleValues.length
    ? ` style="${imageStyleValues.join(" ")}"`
    : "";
  return `
    <div class="sprite-image-wrap ${slotClass} ${teamSlotClass} ${characterClass}" data-fighter-side="${escapeHtml(side)}" role="button" tabindex="0" aria-label="${escapeHtml(fighter.name)}の状態">
      <img class="sprite-image ${side === "enemy" ? "is-enemy" : ""}" src="${escapeHtml(fighter.base.imageSrc)}" alt="${escapeHtml(fighter.name)}"${imageStyle} />
    </div>
    <div class="sprite-name">${escapeHtml(fighter.name)}</div>
    <div class="sprite-element">${elementPill(fighter.base.element)}</div>
  `;
}

function bindSpriteStatusClicks() {
  for (const control of [els.enemySprite, els.playerSprite].flatMap((sprite) => (
    sprite ? [...sprite.querySelectorAll("[data-fighter-side]")] : []
  ))) {
    const showStatus = () => showFighterStatus(control.dataset.fighterSide);
    control.addEventListener("click", showStatus);
    control.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      showStatus();
    });
  }
}

function showFighterStatus(side) {
  const fighter = activeBySide(side);
  if (!fighter) return;
  if (state.busy || state.gameOver || state.pendingSwitchSide) return;
  state.battleInspectSide = side === "player" ? "player" : "enemy";
  state.commandMode = "enemyInfo";
  renderBattle();
}

function renderEnemyInfoPanel(enemy, inspectSide = "enemy") {
  if (!els.enemyInfoPanel) return;
  if (!enemy) {
    els.enemyInfoPanel.innerHTML = "";
    return;
  }

  const isStoryBattle = Boolean(state.story.currentRankBattleId);
  const canViewDetails = !isStoryBattle || canViewStoryBattleEncyclopedia(enemy.id);
  const inspectTitle = inspectSide === "player" ? "自分情報" : "相手情報";

  if (!canViewDetails) {
    els.enemyInfoPanel.innerHTML = `
      <div class="battle-inspect-header">
        <div>
          <div class="detail-title">${escapeHtml(inspectTitle)}</div>
          <div class="detail-subtitle">？？？？？</div>
        </div>
        <button class="small-button battle-inspect-back" type="button">戻る</button>
      </div>
      <div class="battle-inspect-body battle-inspect-locked">
        <div class="detail-image-frame battle-inspect-image-frame">
          <img class="detail-image" src="${escapeHtml(enemy.base.imageSrc)}" alt="？？？？？" />
        </div>
        <div class="dex-data-row battle-inspect-row">
          <span>能力値</span>
          <strong>？？？</strong>
        </div>
        <div class="command-note">対応する図鑑を購入すると情報を確認できます</div>
      </div>
    `;
    bindBattleInspectBackButton();
    return;
  }

  els.enemyInfoPanel.innerHTML = `
    <div class="battle-inspect-header">
      <div>
        <div class="detail-title">${escapeHtml(inspectTitle)}</div>
        <div class="detail-subtitle">${escapeHtml(enemy.name)}</div>
      </div>
      <button class="small-button battle-inspect-back" type="button">戻る</button>
    </div>
    <div class="battle-inspect-body">
      <div class="dex-data-row battle-inspect-row">
        <span>状態</span>
        <strong>${renderFighterStatusChips(enemy)}</strong>
      </div>
      <div class="detail-section-title">属性耐性</div>
      <div class="resistance-grid battle-inspect-resistance-grid">
        ${ELEMENT_TYPES.map((element) => resistanceCell(enemy.base, element)).join("")}
      </div>
    </div>
  `;

  bindBattleInspectBackButton();
}

function bindBattleInspectBackButton() {
  els.enemyInfoPanel.querySelector(".battle-inspect-back")?.addEventListener("click", () => {
    state.commandMode = "fight";
    renderBattle();
  });
}

function renderBattleMessage() {
  const messageVisible = state.battleMessage.visible && state.battleMessage.text;
  els.battleLog.classList.toggle("is-visible", Boolean(messageVisible));
  els.battleLog.innerHTML = messageVisible
    ? `<div class="log-line">${escapeHtml(state.battleMessage.text)}</div>`
    : "";
}

function renderBattleAnimationLayer() {
  if (!els.battleAnimationLayer) return;
  const animation = state.battleAnimation;
  if (!animation?.src) {
    els.battleAnimationLayer.innerHTML = "";
    return;
  }

  const sideClass = animation.side === "player" ? "is-player-target" : "is-enemy-target";
  const framePosition = animationFramePosition(
    animation.cellIndex ?? animation.frameIndex,
    animation.columns,
    animation.frameWidth,
    animation.frameHeight,
  );
  const left = Number.isFinite(animation.x) ? `${animation.x}px` : "50%";
  const top = Number.isFinite(animation.y) ? `${animation.y}px` : "50%";
  const scale = Number.isFinite(animation.scale) ? animation.scale : BATTLE_ANIMATION_SCALE;
  els.battleAnimationLayer.innerHTML = `
    <div
      class="battle-animation ${sideClass}"
      style="
        left: ${escapeHtml(left)};
        top: ${escapeHtml(top)};
        right: auto;
        --battle-animation-duration: ${escapeHtml(animation.duration)}ms;
        --battle-animation-frame-width: ${escapeHtml(animation.frameWidth)}px;
        --battle-animation-frame-height: ${escapeHtml(animation.frameHeight)}px;
        --battle-animation-frame-x: ${escapeHtml(framePosition.x)}px;
        --battle-animation-frame-y: ${escapeHtml(framePosition.y)}px;
        --battle-animation-scale: ${escapeHtml(scale)};
        background-image: url('${escapeHtml(animation.src)}');
      "
      data-animation-sequence="${escapeHtml(animation.sequence)}"
    ></div>
  `;
}

function showBattleMessage(message, duration = BATTLE_MESSAGE_DURATION) {
  if (!message) return;
  state.battleMessage = {
    text: message,
    visible: true,
  };
  clearBattleMessageTimer();
  battleMessageTimer = window.setTimeout(() => {
    state.battleMessage.visible = false;
    renderBattle();
  }, scaledBattleTextDelay(duration));
  renderBattle();
}

function hideBattleMessage() {
  clearBattleMessageTimer();
  state.battleMessage = {
    text: "",
    visible: false,
  };
}

function clearBattleMessageTimer() {
  if (!battleMessageTimer) return;
  window.clearTimeout(battleMessageTimer);
  battleMessageTimer = null;
}

function renderMoveGrid(fighter) {
  if (!fighter) {
    els.moveGrid.innerHTML = "";
    return;
  }

  const pendingMoveId = pendingSkillId(fighter);
  const saveEnergyDisabled =
    state.busy ||
    state.gameOver ||
    Boolean(state.pendingSwitchSide) ||
    Boolean(pendingMoveId);
  const moveButtons = movesForCharacter(fighter.base)
    .map((move) => {
      const disabled =
        state.busy ||
        state.gameOver ||
        Boolean(state.pendingSwitchSide) ||
        (pendingMoveId ? move.skill_id !== pendingMoveId : fighter.energy < move.cost);
      const powerText = move.category === "attack" ? move.power : "-";
      const elementClassName = elementClass(move.element);
      const kindText = move.category === "attack" ? attackTypeLabel(move.attack_type) : moveCategoryLabel(move.category);
      const moveText = move.text;
      return `
        <button class="move-button move-element-${elementClassName}" type="button" data-move-id="${move.skill_id}" ${disabled ? "disabled" : ""}>
          <span class="move-name">${escapeHtml(move.name)}</span>
          <span class="move-cost">${energyBadge(move.cost)}</span>
          <span class="move-element">${escapeHtml(elementName(move.element))}</span>
          <span class="move-kind">${escapeHtml(kindText)}</span>
          <span class="move-power power-chip">威力 ${escapeHtml(powerText)}</span>
          ${moveText ? `<span class="move-text">${escapeHtml(moveText)}</span>` : ""}
        </button>
      `;
    })
    .join("");
  const saveEnergyButton = BATTLE_SAVE_ENERGY_ENABLED ? `
    <button class="move-button move-save-energy-button" type="button" data-save-energy="true" ${saveEnergyDisabled ? "disabled" : ""}>
      <span class="move-name">静止</span>
      <span class="move-cost">${energyBadge(0)}</span>
      <span class="move-element">無</span>
      <span class="move-kind">待機</span>
      <span class="move-power power-chip">EN回復</span>
      <span class="move-text">行動せず、ターン終了時のEN回復を待つ。</span>
    </button>
  ` : "";
  els.moveGrid.innerHTML = `${moveButtons}${saveEnergyButton}`;

  for (const button of els.moveGrid.querySelectorAll(".move-button")) {
    if (button.dataset.saveEnergy) {
      button.addEventListener("click", () => playerChooseSaveEnergy());
    } else {
      button.addEventListener("click", () => playerChooseMove(button.dataset.moveId));
    }
  }
}

function renderSwitchGrid() {
  const forced = state.pendingSwitchSide === "player";
  const activePendingMove = Boolean(pendingSkillFor(activePlayer()));
  els.switchGrid.innerHTML = state.playerTeam
    .map((member, index) => {
      const active = index === state.playerActiveIndex;
      const disabled = state.busy || state.gameOver || activePendingMove || member.fainted || (!forced && active);
      return `
        <button class="switch-button ${active ? "is-active-member" : ""} ${member.fainted ? "is-fainted-member" : ""}" type="button" data-member-index="${index}" ${disabled ? "disabled" : ""}>
          <span class="switch-name">${escapeHtml(member.name)}</span>
          <span class="switch-meta">体力 ${Math.max(0, member.hp)}/${member.maxHp} / ${energyBadge(member.energy)}${switchPersistentBattleEffectSummary(member)}</span>
        </button>
      `;
    })
    .join("");

  if (forced) {
    els.switchGrid.insertAdjacentHTML(
      "afterbegin",
      `<div class="command-note">次に出すBreederを選んでください。</div>`,
    );
  }

  for (const button of els.switchGrid.querySelectorAll(".switch-button")) {
    button.addEventListener("click", () => playerChooseSwitch(Number(button.dataset.memberIndex)));
  }
}

function renderExchangePanel() {
  if (state.gameOver && state.story.currentArenaBattleId) {
    renderArenaBattleResultPanel();
    return;
  }

  if (!(state.gameOver && state.battleWinner === "player") || state.story.currentArenaBattleId) {
    els.exchangePanel.innerHTML = "";
    return;
  }

  const isStoryRankBattle = Boolean(state.story.currentRankBattleId);
  if (isStoryRankBattle) {
    renderStoryVictoryLabCapturePanel();
    return;
  }

  const selectedPlayerIndices = exchangePlayerIndices();
  const playerSlotTotal = exchangePlayerSlotTotal();
  const enemySlotNeed = exchangeEnemySlotNeed();
  const nextPlayerSlotTotal = exchangeNextPlayerSlotTotal();
  const hasPlayerOffer = selectedPlayerIndices.length > 0;
  const hasEnemyTarget = state.exchange.enemyIndex !== null;
  const canReceiveWithoutExchange = canReceiveEnemyWithoutExchange();
  const playerButtons = state.playerTeam
    .map((member, index) => exchangeChoiceButton("player", member, index))
    .join("");
  const enemyButtons = state.enemyTeam
    .map((member, index) => exchangeChoiceButton("enemy", member, index))
    .join("");
  const canExchange =
    hasEnemyTarget &&
    !state.exchange.completed &&
    (canReceiveWithoutExchange || (hasPlayerOffer && isValidVictoryExchange()));
  const invalidExchange =
    hasEnemyTarget &&
    !state.exchange.completed &&
    !canExchange;
  const exchangeButtonLabel = canReceiveWithoutExchange && !hasPlayerOffer ? "入手する" : "交換する";
  const exchangeTitle = state.exchange.cancelled
    ? "交換終了"
    : state.exchange.completed
      ? "交換完了"
      : "勝利交換";
  const slotNote = exchangeSlotNote(playerSlotTotal, enemySlotNeed, nextPlayerSlotTotal, hasEnemyTarget);

  els.exchangePanel.innerHTML = `
    <div class="exchange-title">${exchangeTitle}</div>
    <div class="exchange-columns">
      <div class="exchange-list">
        <div class="exchange-label">自分</div>
        ${playerButtons}
      </div>
      <div class="exchange-list">
        <div class="exchange-label">相手</div>
        ${enemyButtons}
      </div>
    </div>
    <div class="exchange-actions">
      <button class="primary-button exchange-action" type="button" data-result-action="exchange" ${canExchange ? "" : "disabled"}>${exchangeButtonLabel}</button>
      <button class="small-button exchange-action" type="button" data-result-action="rematch">このチームで再戦</button>
      ${state.exchange.completed ? "" : `<button class="small-button exchange-action" type="button" data-result-action="cancel">やめる</button>`}
    </div>
    ${invalidExchange ? `<div class="command-note">${escapeHtml(slotNote)}</div>` : slotNote ? `<div class="command-note">${escapeHtml(slotNote)}</div>` : ""}
  `;

  for (const button of els.exchangePanel.querySelectorAll("[data-exchange-side]")) {
    button.addEventListener("click", () => {
      if (state.exchange.completed) return;
      const side = button.dataset.exchangeSide;
      const index = Number(button.dataset.exchangeIndex);
      if (side === "player") {
        toggleExchangePlayerIndex(index);
      } else {
        state.exchange.enemyIndex = index;
      }
      renderBattle();
    });
  }

  for (const button of els.exchangePanel.querySelectorAll("[data-result-action]")) {
    button.addEventListener("click", () => {
      if (button.dataset.resultAction === "exchange") {
        completeVictoryExchange();
      } else if (button.dataset.resultAction === "rematch") {
        startBattle();
      } else if (button.dataset.resultAction === "cancel") {
        cancelVictoryExchange();
      }
    });
  }
}

function renderArenaBattleResultPanel() {
  const rankBattleId = state.story.currentArenaBattleId;
  const won = state.battleWinner === "player";
  const opponentName = rankBattleDisplayName(rankBattleId);
  const rewardMoney = rankBattleRewardMoney(rankBattleId);
  const alreadyCleared = isStoryRankBattleCleared(rankBattleId);
  const title = won ? "Arena勝利" : "Arena敗北";
  const message = won
    ? alreadyCleared
      ? `${opponentName}との再戦に勝利しました。報酬は受け取り済みです。`
      : `${opponentName}に勝利しました。報酬 ${rewardMoney}z を受け取ります。`
    : `${opponentName}に敗北しました。`;
  els.exchangePanel.innerHTML = `
    <div class="exchange-title">${escapeHtml(title)}</div>
    <div class="command-note">${escapeHtml(message)}</div>
    <div class="exchange-actions arena-result-actions">
      <button class="primary-button exchange-action" type="button" data-arena-result-action="${won ? "complete" : "return"}">Arenaへ戻る</button>
    </div>
  `;

  els.exchangePanel.querySelector("[data-arena-result-action]")?.addEventListener("click", () => {
    if (won) {
      finalizeArenaBattleVictory(rankBattleId);
    } else {
      returnToArenaAfterBattle();
    }
  });
}

function renderStoryVictoryLabCapturePanel() {
  if (isStoryRankBattleCleared(state.story.currentRankBattleId)) {
    renderStoryRankBattleReplayVictoryPanel();
    return;
  }

  const capture = state.exchange.storyLabCaptureCompleted
    ? state.exchange.storyLabCapture
    : null;
  const candidates = storyVictoryLabCaptureCandidates();

  if (!capture) {
    els.exchangePanel.innerHTML = `
      <div class="exchange-title">勝利</div>
      <div class="command-note">仲間にするモンスターを選んでください。空きslotがあればMembersへ、あふれた場合はLABへ送られます。</div>
      <div class="exchange-list story-capture-list">
        ${candidates.map(renderStoryLabCaptureCandidate).join("")}
      </div>
      ${candidates.length ? "" : `
        <div class="command-note">入手できるモンスターが見つかりませんでした。</div>
        <div class="exchange-actions">
          <button class="small-button exchange-action" type="button" data-story-lab-capture-action="complete">メイン画面へ戻る</button>
        </div>
      `}
    `;

    for (const button of els.exchangePanel.querySelectorAll("[data-story-lab-capture-character-id]")) {
      button.addEventListener("click", () => {
        completeStoryVictoryLabCapture(button.dataset.storyLabCaptureCharacterId);
        renderBattle();
      });
    }

    els.exchangePanel.querySelector("[data-story-lab-capture-action='complete']")?.addEventListener("click", () => {
      finalizeStoryBattleVictory(state.story.currentRankBattleId);
    });
    return;
  }

  const monsterName = capture?.name || "モンスター";
  els.exchangePanel.innerHTML = `
    <div class="exchange-title">勝利</div>
    <div class="command-note">
      ${escapeHtml(monsterName)}を仲間にした！<br>
      ${capture?.storage === "party" ? "Membersに加わった！" : "Membersに入りきらないため、研究所（LAB）へ送られた！"}
    </div>
    ${state.hasUnsavedChanges ? `<div class="command-note">My Houseでセーブすると入手内容が保存されます。</div>` : ""}
    <div class="exchange-actions">
      <button class="primary-button exchange-action" type="button" data-story-lab-capture-action="complete">メイン画面へ戻る</button>
    </div>
  `;

  els.exchangePanel.querySelector("[data-story-lab-capture-action='complete']")?.addEventListener("click", () => {
    finalizeStoryBattleVictory(state.story.currentRankBattleId);
  });
}

function renderStoryRankBattleReplayVictoryPanel() {
  const rankBattleId = state.story.currentRankBattleId;
  const opponentName = rankBattleDisplayName(rankBattleId);
  els.exchangePanel.innerHTML = `
    <div class="exchange-title">勝利</div>
    <div class="command-note">${escapeHtml(opponentName)}との再戦に勝利しました。報酬は受け取り済みです。</div>
    <div class="exchange-actions">
      <button class="primary-button exchange-action" type="button" data-story-rank-replay-action="complete">メイン画面へ戻る</button>
    </div>
  `;

  els.exchangePanel.querySelector("[data-story-rank-replay-action='complete']")?.addEventListener("click", () => {
    finalizeStoryBattleVictory(rankBattleId);
  });
}

function storyVictoryLabCaptureCandidates() {
  return state.enemyTeam
    .map((member, index) => {
      const character = state.characterMap.get(member?.id);
      return character ? { member, character, index } : null;
    })
    .filter(Boolean);
}

function renderStoryLabCaptureCandidate(candidate) {
  const { member, character, index } = candidate;
  const slotText = slotMarks(character.slot);
  return `
    <button class="exchange-choice story-capture-choice" type="button" data-story-lab-capture-character-id="${escapeHtml(character.character_id)}" data-story-lab-capture-index="${index}">
      <span class="switch-name">${escapeHtml(character.name || member.name || character.character_id)}</span>
      <span class="switch-meta">slot ${slotText} / HP ${Math.max(0, member.hp)}/${member.maxHp}</span>
    </button>
  `;
}

function completeStoryVictoryLabCapture(characterId) {
  if (state.exchange.storyLabCaptureCompleted) {
    return state.exchange.storyLabCapture;
  }
  if (isStoryRankBattleCleared(state.story.currentRankBattleId)) {
    return null;
  }

  const id = safeText(characterId);
  const isEnemyCharacter = state.enemyTeam.some((member) => member?.id === id);
  const character = isEnemyCharacter ? state.characterMap.get(id) : null;
  state.exchange.storyLabCaptureCompleted = true;

  if (!character) {
    state.exchange.storyLabCapture = null;
    return null;
  }

  const currentPartyIds = currentPartyOwnedIds();
  const canAddToMembers =
    currentPartyIds.length < LAB_MEMBER_DISPLAY_LIMIT &&
    partySlotTotalForOwnedIds(currentPartyIds) + number(character.slot, 1) <= TEAM_SLOT_LIMIT;
  const storage = canAddToMembers ? "party" : "lab";
  const ownedMonster = createOwnedMonster(character.character_id, { equipment: {}, storage });
  state.saveData.ownedMonsters.push(ownedMonster);
  if (canAddToMembers) {
    state.saveData.partyOwnedIds = [...currentPartyIds, ownedMonster.ownedId];
  }
  syncOwnedMonsterStorageFromParty(state.saveData, { fallbackToOwnedMonsters: false });
  syncSelectedIdsFromOwnedMonsters();
  markUnsavedChanges();
  saveGameData();
  if (els.myHousePanel && !els.myHousePanel.classList.contains("is-hidden")) renderMyHouse();
  if (els.labInteriorScreen && !els.labInteriorScreen.classList.contains("is-hidden")) renderLabInterior();

  state.exchange.storyLabCapture = {
    ownedId: ownedMonster.ownedId,
    characterId: character.character_id,
    name: character.name || character.character_id,
    storage,
  };
  return state.exchange.storyLabCapture;
}

function renderStoryVictoryExchangeChoice() {
  els.exchangePanel.innerHTML = `
    <div class="exchange-title">勝利交換</div>
    <div class="command-note">モンスターを交換しますか？</div>
    <div class="exchange-actions">
      <button class="primary-button exchange-action" type="button" data-story-exchange-action="exchange">モンスターを交換する</button>
      <button class="small-button exchange-action" type="button" data-story-exchange-action="skip">交換しない</button>
    </div>
  `;

  for (const button of els.exchangePanel.querySelectorAll("[data-story-exchange-action]")) {
    button.addEventListener("click", () => {
      if (button.dataset.storyExchangeAction === "exchange") {
        state.exchange.storyDecision = "exchange";
      } else {
        state.exchange.storyDecision = "confirmSkip";
      }
      renderBattle();
    });
  }
}

function renderStorySkipExchangeConfirm() {
  els.exchangePanel.innerHTML = `
    <div class="exchange-title">交換しない</div>
    <div class="command-note">交換せずに終了しますか？</div>
    <div class="exchange-actions">
      <button class="primary-button exchange-action" type="button" data-story-skip-action="confirm">はい</button>
      <button class="small-button exchange-action" type="button" data-story-skip-action="cancel">キャンセル</button>
    </div>
  `;

  for (const button of els.exchangePanel.querySelectorAll("[data-story-skip-action]")) {
    button.addEventListener("click", () => {
      if (button.dataset.storySkipAction === "confirm") {
        finalizeStoryBattleVictory(state.story.currentRankBattleId);
        return;
      }
      state.exchange.storyDecision = "choice";
      renderBattle();
    });
  }
}

function exchangeChoiceButton(side, member, index) {
  const selected =
    side === "player"
      ? exchangePlayerIndices().includes(index)
      : state.exchange.enemyIndex === index;
  const slotText = slotMarks(member.base.slot);
  return `
    <button class="exchange-choice ${selected ? "is-selected" : ""}" type="button" data-exchange-side="${side}" data-exchange-index="${index}" ${state.exchange.completed ? "disabled" : ""}>
      <span class="switch-name">${escapeHtml(member.name)}</span>
      <span class="switch-meta">スロット ${slotText} / 体力 ${Math.max(0, member.hp)}/${member.maxHp}</span>
    </button>
  `;
}

function movesForCharacter(character) {
  const csvMoves = character.skillIds
    .map((skillId) => state.skills.get(skillId))
    .filter((skill) => skill && skill.name && skill.category);
  const hasAttack = csvMoves.some((skill) => skill.category === "attack");
  const moves = [...csvMoves];

  if (!hasAttack) {
    moves.push(state.skills.get("basic_strike"));
    if (character.element !== "none" && state.skills.has(`${character.element}_strike`)) {
      moves.push(state.skills.get(`${character.element}_strike`));
    }
  }

  return uniqueBy(moves, "skill_id");
}

function skillNamesFor(character) {
  return movesForCharacter(character)
    .slice(0, 3)
    .map((skill) => skill.name);
}

function playerChooseMove(moveId) {
  if (state.busy || state.gameOver || state.pendingSwitchSide) return;
  const fighter = activePlayer();
  const pendingMoveId = pendingSkillId(fighter);
  const selectedMoveId = pendingMoveId || moveId;
  if (pendingMoveId && moveId !== pendingMoveId) return;

  const move = moveForFighter(fighter, selectedMoveId);
  if (!move || (!pendingMoveId && fighter.energy < move.cost)) return;
  resolveTurn({ side: "player", type: "move", moveId: selectedMoveId });
}

function playerChooseSaveEnergy() {
  if (!BATTLE_SAVE_ENERGY_ENABLED) return;
  if (state.busy || state.gameOver || state.pendingSwitchSide) return;
  const fighter = activePlayer();
  if (!fighter || pendingSkillId(fighter)) return;
  resolveTurn({ side: "player", type: "save_energy" });
}

function playerChooseSwitch(index) {
  if (state.busy || state.gameOver) return;
  const target = state.playerTeam[index];
  if (!target || target.fainted || index === state.playerActiveIndex) return;
  if (state.pendingSwitchSide === "player") {
    completeForcedSwitch(index);
    return;
  }
  resolveTurn({ side: "player", type: "switch", index });
}

function completeForcedSwitch(index) {
  const target = state.playerTeam[index];
  if (!target || target.fainted) return;

  switchActive("player", index, { resetEnergy: true });
  state.pendingSwitchSide = null;
  state.commandMode = "fight";
  pushLog(`${target.name}、出番だ！`);
  renderBattle();
}

function exchangePlayerIndices() {
  if (!Array.isArray(state.exchange.playerIndices)) {
    return Number.isInteger(state.exchange.playerIndex) ? [state.exchange.playerIndex] : [];
  }

  return [...new Set(state.exchange.playerIndices)]
    .filter((index) => Number.isInteger(index) && state.playerTeam[index])
    .sort((a, b) => a - b);
}

function toggleExchangePlayerIndex(index) {
  const selected = new Set(exchangePlayerIndices());
  if (selected.has(index)) {
    selected.delete(index);
  } else {
    selected.add(index);
  }
  state.exchange.playerIndices = [...selected].sort((a, b) => a - b);
}

function exchangePlayerMembers() {
  return exchangePlayerIndices()
    .map((index) => state.playerTeam[index])
    .filter(Boolean);
}

function exchangePlayerSlotTotal() {
  return slotTotal(exchangePlayerMembers().map((member) => member.base));
}

function exchangeEnemySlotNeed() {
  const enemyMember = state.enemyTeam[state.exchange.enemyIndex];
  return enemyMember ? Math.max(1, enemyMember.base.slot || 1) : 0;
}

function exchangeCurrentPlayerSlotTotal() {
  return slotTotal(state.playerTeam.map((member) => member.base));
}

function exchangeNextPlayerSlotTotal() {
  if (state.exchange.enemyIndex === null) {
    return exchangeCurrentPlayerSlotTotal();
  }
  return exchangeCurrentPlayerSlotTotal() - exchangePlayerSlotTotal() + exchangeEnemySlotNeed();
}

function canReceiveEnemyWithoutExchange() {
  if (state.exchange.enemyIndex === null) return false;
  return exchangeCurrentPlayerSlotTotal() + exchangeEnemySlotNeed() <= TEAM_SLOT_LIMIT;
}

function exchangeSlotNote(playerSlotTotal, enemySlotNeed, nextPlayerSlotTotal, hasEnemyTarget) {
  if (state.exchange.completed || !hasEnemyTarget) return "";
  if (canReceiveEnemyWithoutExchange() && playerSlotTotal === 0) {
    return `空きスロットに入ります。交換せずに入手できます。${nextPlayerSlotTotal}/${TEAM_SLOT_LIMIT}`;
  }
  if (playerSlotTotal === 0) {
    return `相手のスロット ${slotMarkText(enemySlotNeed)} に合わせて、自分のモンスターを選んでください。`;
  }
  if (nextPlayerSlotTotal > TEAM_SLOT_LIMIT) {
    return `交換後のスロットが上限を超えます。${nextPlayerSlotTotal}/${TEAM_SLOT_LIMIT}`;
  }
  return `交換後スロット ${nextPlayerSlotTotal}/${TEAM_SLOT_LIMIT}`;
}

function completeVictoryExchange() {
  if (
    state.exchange.completed ||
    state.exchange.enemyIndex === null
  ) {
    return;
  }

  const playerMembers = exchangePlayerMembers();
  const enemyMember = state.enemyTeam[state.exchange.enemyIndex];
  if (!enemyMember) return;

  if (!playerMembers.length) {
    if (canReceiveEnemyWithoutExchange()) {
      completeVictoryReceiveWithoutExchange(enemyMember);
    }
    return;
  }

  if (!isValidVictoryExchange()) return;

  const offeredIndexSet = new Set(exchangePlayerIndices());
  state.playerTeam = [
    ...state.playerTeam.filter((_, index) => !offeredIndexSet.has(index)),
    createFighter(enemyMember.originalBase || enemyMember.base),
  ];
  state.enemyTeam = [
    ...state.enemyTeam.filter((_, index) => index !== state.exchange.enemyIndex),
    ...playerMembers.map((member) => createFighter(member.originalBase || member.base)),
  ];
  state.playerActiveIndex = Math.min(state.playerActiveIndex, Math.max(0, state.playerTeam.length - 1));
  state.enemyActiveIndex = Math.min(state.enemyActiveIndex, Math.max(0, state.enemyTeam.length - 1));
  state.selectedIds = state.playerTeam.map((member) => member.id);
  if (!state.story.currentRankBattleId) {
    state.selectedEnemyIds = state.enemyTeam.map((member) => member.id);
  }
  syncOwnedMonsterPartyFromSelectedIds({ persist: false });
  if (state.story.currentRankBattleId) {
    finalizeStoryBattleVictory(state.story.currentRankBattleId);
    return;
  }
  saveGameData();
  state.exchange = {
    ...createExchangeState(),
    completed: true,
  };
  pushLog(`${playerMembers.map((member) => member.name).join("、")} と ${enemyMember.name} を交換した！`);
  renderBattle();
}

function completeVictoryReceiveWithoutExchange(enemyMember) {
  if (!enemyMember || !canReceiveEnemyWithoutExchange()) return;

  state.playerTeam = [
    ...state.playerTeam,
    createFighter(enemyMember.originalBase || enemyMember.base),
  ];
  state.enemyTeam = state.enemyTeam.filter((_, index) => index !== state.exchange.enemyIndex);
  state.playerActiveIndex = Math.min(state.playerActiveIndex, Math.max(0, state.playerTeam.length - 1));
  state.enemyActiveIndex = Math.min(state.enemyActiveIndex, Math.max(0, state.enemyTeam.length - 1));
  state.selectedIds = state.playerTeam.map((member) => member.id);
  if (!state.story.currentRankBattleId) {
    state.selectedEnemyIds = state.enemyTeam.map((member) => member.id);
  }
  syncOwnedMonsterPartyFromSelectedIds({ persist: false });
  if (state.story.currentRankBattleId) {
    finalizeStoryBattleVictory(state.story.currentRankBattleId);
    return;
  }
  saveGameData();
  state.exchange = {
    ...createExchangeState(),
    completed: true,
  };
  pushLog(`${enemyMember.name} が仲間になった！`);
  renderBattle();
}

function cancelVictoryExchange() {
  if (state.exchange.completed) return;
  if (state.story.currentRankBattleId) {
    finalizeStoryBattleVictory(state.story.currentRankBattleId);
    return;
  }

  state.exchange = {
    ...createExchangeState(),
    completed: true,
    cancelled: true,
  };
  pushLog("交換をやめた。");
  renderBattle();
}

function isValidVictoryExchange() {
  const enemyMember = state.enemyTeam[state.exchange.enemyIndex];
  const playerMembers = exchangePlayerMembers();
  if (!playerMembers.length || !enemyMember) return false;

  return exchangeNextPlayerSlotTotal() <= TEAM_SLOT_LIMIT;
}

async function resolveTurn(playerAction) {
  state.busy = true;
  renderBattle();

  await resolveDelayedBattleEffects();
  if (state.gameOver || state.pendingSwitchSide) {
    state.busy = false;
    renderBattle();
    return;
  }

  const enemyAction = chooseEnemyAction();
  const actions = [decorateAction(playerAction), decorateAction(enemyAction)].sort(compareActions);

  pushLog(`ターン ${state.turn}`);
  await pause(260);

  for (const action of actions) {
    if (state.gameOver || state.pendingSwitchSide) break;
    await executeAction(action);
  }

  if (!state.gameOver && !state.pendingSwitchSide) {
    await endRound();
  }

  if (!state.gameOver && !state.pendingSwitchSide) {
    applyRankBattleTurnLimit();
  }

  if (!state.gameOver) {
    state.turn += 1;
  }

  if (!state.gameOver && !state.pendingSwitchSide) {
    state.commandMode = "fight";
  }

  state.busy = false;
  renderBattle();
}

function decorateAction(action) {
  if (action.type === "switch") {
    return { ...action, priority: 6, speed: Number.MAX_SAFE_INTEGER };
  }

  const actor = activeBySide(action.side);
  if (action.type === "save_energy" || action.type === "idle") {
    return {
      ...action,
      priority: 0,
      speed: actor ? effectiveStat(actor, "speed") : 0,
    };
  }

  const move = moveForFighter(actor, action.moveId);
  return {
    ...action,
    priority: move ? move.priority : 0,
    speed: actor ? effectiveStat(actor, "speed") : 0,
  };
}

function compareActions(a, b) {
  if (a.priority !== b.priority) return b.priority - a.priority;
  if (a.speed !== b.speed) return b.speed - a.speed;
  return Math.random() > 0.5 ? 1 : -1;
}

async function executeAction(action) {
  const actor = activeBySide(action.side);
  if (!actor || actor.fainted) return;

  if (action.type === "switch") {
    switchActive(action.side, action.index);
    if (action.side === "player") {
      state.commandMode = "fight";
    }
    pushLog(`${actor.name}を戻した。${activeBySide(action.side).name}、出番だ！`);
    await pause(420);
    return;
  }

  if (action.type === "idle") {
    return;
  }

  if (action.type === "save_energy") {
    if (!BATTLE_SAVE_ENERGY_ENABLED) return;
    const blockText = blockedByControl(actor);
    if (blockText) {
      pushLog(blockText);
      await pause(520);
      return;
    }

    pushLog(`${actor.name}は静止している。`);
    await pause(420);
    return;
  }

  const pendingSkill = pendingSkillFor(actor);
  const selectedMoveId = pendingSkill?.skillId || pendingSkill?.moveId || action.moveId;
  const baseMove = moveForFighter(actor, selectedMoveId);
  const completingTwoTurnMove = Boolean(pendingSkill && selectedMoveId === baseMove?.skill_id);
  if (!baseMove || (!completingTwoTurnMove && actor.energy < baseMove.cost)) return;
  const positionBeforeAction = positionEffectId(actor);

  const targetSide = pendingSkill?.targetSide ?? (action.side === "player" ? "enemy" : "player");
  const target = baseMove.target === "self" ? actor : activeBySide(targetSide);
  if (!target || target.fainted) return;
  const move = completingTwoTurnMove
    ? moveWithPendingPower(baseMove, pendingSkill, actor, target, state.powerRules)
    : moveWithEffectivePower(baseMove, actor, target, state.powerRules);

  const blockText = blockedByControl(actor);
  if (blockText) {
    pushLog(blockText);
    await pause(520);
    return;
  }

  const stunText = consumeStunForMoveAction(actor);
  if (stunText) {
    pushLog(stunText);
    await pause(520);
    return;
  }

  if (!completingTwoTurnMove) {
    actor.energy = clamp(actor.energy - move.cost, 0, actor.maxEnergy);
  }
  pushLog(`${actor.name}の ${move.name}！`);
  await pause(420);

  if (!completingTwoTurnMove && move.category === "attack") {
    const twoTurnEffectId = twoTurnBattleEffectId(move);
    const pendingTargetSide = move.target === "self" ? action.side : targetSide;
    const startedTwoTurnMove = twoTurnEffectId
      ? startTwoTurnMove(actor, move, twoTurnEffectId, pendingTargetSide, state.battleEffects, state.turn)
      : null;
    if (startedTwoTurnMove) {
      applyBattleCoreEvents(startedTwoTurnMove.events);
      const auxiliaryBattleEffectResult = applyBattleEffects(
        move,
        actor,
        target,
        state.battleEffects,
        state.turn,
        state.fieldEffects,
        state.nextFieldEffectId,
        new Set([startedTwoTurnMove.battleEffectId]),
        sideForActiveFighter(actor),
        sideForActiveFighter(target),
      );
      state.nextFieldEffectId = auxiliaryBattleEffectResult.nextFieldEffectId;
      applyBattleCoreEvents(auxiliaryBattleEffectResult.events);
      applyBattleCoreEvents(applySkillEffects(
        move,
        actor,
        target,
        state.effects,
        STAT_LABELS,
        { targets: ["self"] },
      ));
      renderBattle();
      await playBattleEffectAnimation(startedTwoTurnMove.battleEffect, action.side);
      await playBattleEffectAnimations(auxiliaryBattleEffectResult.appliedBattleEffects, action.side);
      await pause(500);
      return;
    }
  }

  const delayedAttackSetup = hasDelayedAttackBattleEffect(move);
  const delayedAttackSetupOnly =
    delayedAttackSetup &&
    (move.category !== "attack" || hasSetupOnlyDelayedAttackBattleEffect(move));
  const animationSide = move.target === "self" ? action.side : targetSide;
  if (!delayedAttackSetupOnly) {
    await playSkillAnimation(move, animationSide);
  }

  if (move.category !== "attack" && move.target !== "self") {
    const hitCheck = canHitTarget(target, move);
    if (!hitCheck.canHit) {
      pushLog(hitCheck.reason);
      await pause(360);
      return;
    }
  }

  if (move.category === "attack" && !delayedAttackSetupOnly) {
    const result = dealDamage(actor, target, move, fieldEffectsForActiveFighter(target));
    if (result.damage > 0) {
      flashSprite(targetSide);
      pushLog(`${target.name}に ${result.damage} ダメージ！${result.effectText}`);
      applyBattleCoreEvents(clearSleepOnAttackDamage(target));
    } else {
      pushLog(result.effectText.trim());
    }
    await pause(520);

    if (result.revengeDamage > 0 && !target.fainted) {
      actor.hp = Math.max(0, actor.hp - result.revengeDamage);
      pushLog(`${target.name}の反撃！ ${actor.name}に ${result.revengeDamage} ダメージ！`);
      await pause(500);
      await handleFaint(action.side);
    }

    await handleFaint(targetSide);
    if (!target.fainted && result.damage > 0) {
      applyBattleCoreEvents(applySkillEffects(
        move,
        actor,
        target,
        state.effects,
        STAT_LABELS,
        completingTwoTurnMove ? { targets: ["enemy"] } : {},
      ));
      const damageLinkedStunResult = applyDamageLinkedStun(
        move,
        actor,
        target,
        state.battleEffects,
        state.turn,
      );
      applyBattleCoreEvents(damageLinkedStunResult.events);
      await playBattleEffectAnimations(damageLinkedStunResult.appliedBattleEffects, action.side);
      await pause(300);
    }
  } else {
    applyBattleCoreEvents(applySkillEffects(move, actor, target, state.effects, STAT_LABELS));
    await pause(360);
  }

  const returnedPosition = completingTwoTurnMove
    ? finishTwoTurnMove(actor)
    : clearPositionAfterAction(actor, move, positionBeforeAction);
  if (returnedPosition) {
    renderBattle();
    await pause(180);
  }

  if (!completingTwoTurnMove) {
    const battleEffectResult = applyBattleEffects(
      move,
      actor,
      target,
      state.battleEffects,
      state.turn,
      state.fieldEffects,
      state.nextFieldEffectId,
      returnedPosition ? new Set([returnedPosition]) : null,
      sideForActiveFighter(actor),
      sideForActiveFighter(target),
    );
    state.nextFieldEffectId = battleEffectResult.nextFieldEffectId;
    applyBattleCoreEvents(battleEffectResult.events);
    await playBattleEffectAnimations(battleEffectResult.appliedBattleEffects, action.side);
  }
  await pause(280);
}

function chooseEnemyAction() {
  const enemy = activeEnemy();
  const pendingMoveId = pendingSkillId(enemy);
  if (pendingMoveId) {
    return { side: "enemy", type: "move", moveId: pendingMoveId };
  }

  const enemyIndex = state.enemyActiveIndex;
  const lowHp = enemy.hp / enemy.maxHp <= 0.28;
  const bench = state.enemyTeam.findIndex((member, index) => index !== enemyIndex && !member.fainted);

  if (lowHp && bench >= 0 && Math.random() < 0.22) {
    return { side: "enemy", type: "switch", index: bench };
  }

  const target = activePlayer();
  const aiConfig = enemyAiConfigFor(enemy);
  const allMoves = movesForCharacter(enemy.base);
  const usableMoves = allMoves.filter((move) => move.cost <= enemy.energy);
  const usableMoveScores = usableMoves
    .map((move) => scoreEnemyUsableMove(enemy, target, move, aiConfig))
    .filter(Boolean);
  const scoredMoveIds = new Set(usableMoveScores.map((candidate) => candidate.move.skill_id));
  const legacyFallbackMove = pickLegacyEnemyMove(
    usableMoves.filter((move) => !scoredMoveIds.has(move.skill_id) && move.category === "attack"),
  );
  const saveEnergy = scoreEnemySaveEnergy(enemy, target, allMoves, usableMoveScores, aiConfig);
  const knockoutMoves = usableMoveScores.filter((candidate) => candidate.canKnockout);

  if (knockoutMoves.length) {
    const selected = knockoutMoves.sort(compareEnemyKnockoutMoves)[0];
    debugEnemyAI(enemy, {
      usableMoveScores,
      saveEnergy,
      selected: selected.move.skill_id,
      reason: "knockout",
    });
    return { side: "enemy", type: "move", moveId: selected.move.skill_id };
  }

  if (!usableMoves.length) {
    debugEnemyAI(enemy, {
      usableMoveScores,
      saveEnergy,
      selected: BATTLE_SAVE_ENERGY_ENABLED ? "save_energy" : "idle",
      reason: "no_usable_moves",
    });
    return BATTLE_SAVE_ENERGY_ENABLED
      ? { side: "enemy", type: "save_energy" }
      : { side: "enemy", type: "idle" };
  }

  if (!usableMoveScores.length) {
    if (BATTLE_SAVE_ENERGY_ENABLED && saveEnergy.available && saveEnergy.score > 0) {
      debugEnemyAI(enemy, {
        usableMoveScores,
        saveEnergy,
        selected: "save_energy",
        reason: "future_move",
      });
      return { side: "enemy", type: "save_energy" };
    }

    const fallbackMove = pickLegacyEnemyMove(usableMoves);
    if (fallbackMove) {
      debugEnemyAI(enemy, {
        usableMoveScores,
        saveEnergy,
        selected: fallbackMove.skill_id,
        reason: "legacy_fallback",
      });
      return { side: "enemy", type: "move", moveId: fallbackMove.skill_id };
    }

    return BATTLE_SAVE_ENERGY_ENABLED
      ? { side: "enemy", type: "save_energy" }
      : { side: "enemy", type: "idle" };
  }

  const currentBestScore = Math.max(...usableMoveScores.map((candidate) => candidate.score));
  const candidates = [
    ...usableMoveScores.map((candidate) => ({
      ...candidate,
      action: { side: "enemy", type: "move", moveId: candidate.move.skill_id },
    })),
  ];
  if (BATTLE_SAVE_ENERGY_ENABLED) {
    candidates.push({
      type: "save_energy",
      score: saveEnergy.score,
      estimatedDamage: 0,
      action: { side: "enemy", type: "save_energy" },
    });
  }
  if (legacyFallbackMove) {
    candidates.push({
      type: "move",
      move: legacyFallbackMove,
      score: currentBestScore * aiConfig.LEGACY_FALLBACK_SCORE_RATIO,
      estimatedDamage: 0,
      legacyFallback: true,
      action: { side: "enemy", type: "move", moveId: legacyFallbackMove.skill_id },
    });
  }
  const selected = pickEnemyAiCandidate(candidates, aiConfig);
  debugEnemyAI(enemy, {
    usableMoveScores,
    saveEnergy,
    selected: selected.action.type === "save_energy" ? "save_energy" : selected.action.moveId,
    reason: "scored",
  });
  return selected.action;
}

function isEnemyAiScoredMove(move) {
  return Boolean(
    move &&
      move.category === "attack" &&
      move.target !== "self" &&
      !twoTurnBattleEffectId(move) &&
      !hasDelayedAttackBattleEffect(move)
  );
}

function enemyAiTypeFor(enemy) {
  const aiType = safeText(enemy?.base?.ai_type, "balanced").toLowerCase();
  return ENEMY_AI_TYPE_CONFIGS[aiType] ? aiType : "balanced";
}

function enemyAiConfigFor(enemy) {
  const aiType = enemyAiTypeFor(enemy);
  return {
    ...ENEMY_AI_CONFIG,
    ...(ENEMY_AI_TYPE_CONFIGS[aiType] ?? ENEMY_AI_TYPE_CONFIGS.balanced),
  };
}

function scoreEnemyUsableMove(enemy, target, move, aiConfig = ENEMY_AI_CONFIG) {
  if (!enemy || !target || !isEnemyAiScoredMove(move)) return null;
  const hitCheck = canHitTarget(target, move);
  if (!hitCheck.canHit) return null;

  const estimatedDamage = estimateMoveDamage(
    enemy,
    target,
    move,
    aiConfig,
    state.powerRules,
    fieldEffectsForActiveFighter(target),
  );
  const canKnockout = estimatedDamage >= target.hp;
  let score = estimatedDamage - move.cost * aiConfig.ENERGY_COST_PENALTY;
  if (enemy.energy - move.cost <= 0) {
    score -= aiConfig.EMPTY_ENERGY_PENALTY;
  }
  if (canKnockout) {
    score += aiConfig.KO_BONUS;
  }

  return {
    type: "move",
    move,
    score,
    estimatedDamage,
    canKnockout,
  };
}

function scoreEnemySaveEnergy(enemy, target, allMoves, usableMoveScores, aiConfig = ENEMY_AI_CONFIG) {
  const currentEnergy = enemy?.energy ?? 0;
  const energyCharge = enemy?.base?.energy_charge ?? 1;
  const maxEnergy = enemy?.maxEnergy ?? 7;
  const nextEnergy = Math.min(currentEnergy + energyCharge, maxEnergy);
  const currentBestEstimatedDamage = Math.max(
    0,
    ...usableMoveScores.map((candidate) => candidate.estimatedDamage),
  );
  const futureMoves = (allMoves ?? [])
    .filter((move) => move.cost > currentEnergy && move.cost <= nextEnergy)
    .filter(isEnemyAiScoredMove)
    .map((move) => {
      const hitCheck = target ? canHitTarget(target, move) : { canHit: false };
      if (!hitCheck.canHit) return null;
      const futureEnemy = { ...enemy, energy: nextEnergy };
      return {
        move,
        estimatedDamage: estimateMoveDamage(
          futureEnemy,
          target,
          move,
          aiConfig,
          state.powerRules,
          fieldEffectsForActiveFighter(target),
        ),
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.estimatedDamage - a.estimatedDamage);
  const futureBest = futureMoves[0] ?? null;
  const futureGain = futureBest
    ? futureBest.estimatedDamage - currentBestEstimatedDamage
    : 0;
  let score = futureBest ? futureGain - aiConfig.WAITING_PENALTY : -aiConfig.SAVE_BLOCK_PENALTY;
  let available = Boolean(futureBest);

  if (!futureBest || futureGain < aiConfig.MIN_FUTURE_GAIN) {
    score -= aiConfig.SAVE_BLOCK_PENALTY;
    available = false;
  }
  if (currentEnergy >= maxEnergy) {
    score -= aiConfig.SAVE_BLOCK_PENALTY;
    available = false;
  }
  if (target && currentBestEstimatedDamage >= target.hp * aiConfig.LOW_HP_DAMAGE_RATIO) {
    score -= aiConfig.WAITING_PENALTY;
  }

  return {
    type: "save_energy",
    score,
    available,
    currentEnergy,
    energyCharge,
    nextEnergy,
    currentBestEstimatedDamage,
    futureMoves,
    futureBest,
    futureGain,
  };
}

function compareEnemyKnockoutMoves(a, b) {
  if (a.move.cost !== b.move.cost) return a.move.cost - b.move.cost;
  if (a.estimatedDamage !== b.estimatedDamage) return b.estimatedDamage - a.estimatedDamage;
  return b.score - a.score;
}

function pickLegacyEnemyMove(usableMoves) {
  const attacks = usableMoves.filter((move) => move.category === "attack");
  const candidates = attacks.length ? attacks : usableMoves;
  return candidates[Math.floor(Math.random() * candidates.length)] ?? null;
}

function pickEnemyAiCandidate(candidates, aiConfig = ENEMY_AI_CONFIG) {
  const sorted = [...candidates].sort((a, b) => b.score - a.score);
  const best = sorted[0];
  const nearBestRange = Math.max(
    aiConfig.NEAR_BEST_MIN_RANGE,
    Math.abs(best.score) * aiConfig.NEAR_BEST_RANDOM_RANGE,
  );
  const nearBest = sorted.filter((candidate) => best.score - candidate.score <= nearBestRange);
  if (nearBest.length <= 1) return best;

  const floor = best.score - nearBestRange;
  const totalWeight = nearBest.reduce(
    (total, candidate) => total + Math.max(
      aiConfig.CANDIDATE_MIN_WEIGHT,
      candidate.score - floor + aiConfig.CANDIDATE_WEIGHT_OFFSET,
    ),
    0,
  );
  let roll = Math.random() * totalWeight;
  for (const candidate of nearBest) {
    roll -= Math.max(
      aiConfig.CANDIDATE_MIN_WEIGHT,
      candidate.score - floor + aiConfig.CANDIDATE_WEIGHT_OFFSET,
    );
    if (roll <= 0) return candidate;
  }
  return best;
}

function debugEnemyAI(enemy, details) {
  if (!ENEMY_AI_CONFIG.DEBUG) return;
  const saveEnergy = details.saveEnergy;
  const usableLines = details.usableMoveScores.length
    ? details.usableMoveScores.map((candidate) => (
        `  ${candidate.move.skill_id} score=${Math.round(candidate.score)} estimatedDamage=${candidate.estimatedDamage}`
      ))
    : ["  none"];
  const futureLines = saveEnergy.futureMoves.length
    ? saveEnergy.futureMoves.map((candidate) => (
        `  ${candidate.move.skill_id} estimatedDamage=${candidate.estimatedDamage}`
      ))
    : ["  none"];
  console.debug([
    "[EnemyAI]",
    `enemy=${enemy?.id ?? ""}`,
    `currentEnergy=${saveEnergy.currentEnergy}`,
    `energyCharge=${saveEnergy.energyCharge}`,
    `nextEnergy=${saveEnergy.nextEnergy}`,
    "usableMoves:",
    ...usableLines,
    "futureMoves:",
    ...futureLines,
    `futureGain=${saveEnergy.futureGain}`,
    `saveEnergyScore=${Math.round(saveEnergy.score)}`,
    `selected=${details.selected}`,
    `reason=${details.reason}`,
  ].join("\n"));
}

function finishTwoTurnMove(actor) {
  const pendingSkill = pendingSkillFor(actor);
  if (!pendingSkill) return "";

  clearPendingSkill(actor);
  if (pendingSkill.effectId) {
    removeBattleEffect(actor, pendingSkill.effectId);
  }
  return pendingSkill.effectId || "";
}

function clearPositionAfterAction(actor, move, positionBeforeAction) {
  if (
    move.category !== "attack" ||
    !ACTION_RETURN_POSITION_IDS.has(positionBeforeAction) ||
    !actor.battleEffects.some((effect) => effect.id === positionBeforeAction)
  ) {
    return "";
  }

  removeBattleEffect(actor, positionBeforeAction);
  return positionBeforeAction;
}

function hasDelayedAttackBattleEffect(move) {
  return [
    [move.battle_effect1, move.battle_effect_chance1],
    [move.battle_effect2, move.battle_effect_chance2],
  ].some(([effectId, chance]) => (
    chance > 0 && state.battleEffects.get(effectId)?.battle_effect_group === "delayed_attack"
  ));
}

async function resolveDelayedBattleEffects() {
  for (const side of ["player", "enemy"]) {
    const delayedEffects = readyDelayedBattleEffects(state.fieldEffects, side, state.turn);
    for (const effect of delayedEffects) {
      if (effect.group === DELAYED_HEAL_BATTLE_EFFECT_GROUP) {
        await resolveDelayedHealEffect(side, effect);
      } else {
        await resolveDelayedAttackEffect(side, effect);
      }
      if (state.gameOver || state.pendingSwitchSide) return;
    }
  }
}

async function resolveDelayedAttackEffect(side, effect) {
  const target = activeBySide(side);
  const fallbackAttacker = effect.source
    ? undefined
    : activeBySide(side === "player" ? "enemy" : "player");
  const preparedAttack = prepareDelayedAttack(
    state.fieldEffects,
    side,
    effect,
    target,
    fallbackAttacker,
  );
  if (!preparedAttack.ready) return;
  const { attacker, move } = preparedAttack;

  pushLog(`${target.name}に${effect.name}が炸裂した！`);
  await pause(420);
  await playSkillAnimation(move, side);
  const result = dealDamage(attacker, target, move, fieldEffectsForSide(state.fieldEffects, side));
  if (result.damage > 0) {
    flashSprite(side);
    pushLog(`${target.name}に ${result.damage} ダメージ！${result.effectText}`);
    applyBattleCoreEvents(clearSleepOnAttackDamage(target));
  } else {
    pushLog(result.effectText.trim());
  }
  await pause(520);
  await handleFaint(side);
}

async function resolveDelayedHealEffect(side, effect) {
  const target = activeBySide(side);
  const healState = resolveDelayedHealState(state.fieldEffects, side, effect, target);
  if (!healState.validTarget) return;

  pushLog(`${effect.name}を食べた！`);
  await pause(420);
  if (healState.healed > 0) {
    pushLog(`${target.name}のHPが ${healState.healed} 回復した！`);
  } else {
    pushLog(`${target.name}のHPは満タンだ！`);
  }
  await pause(520);
}

function blockedByControl(fighter) {
  const sleep = fighter.statuses.find((status) => status.id === "sleep");
  if (sleep) return `${fighter.name}は眠っている。`;

  const paralysis = fighter.statuses.find((status) => status.id === "paralysis");
  if (paralysis && Math.random() < 0.5) {
    return `${fighter.name}はしびれて動けない！`;
  }

  return "";
}

function consumeStunForMoveAction(fighter) {
  if (!fighter?.battleEffects?.some((effect) => effect.id === STUN_BATTLE_EFFECT_ID)) {
    return "";
  }
  removeBattleEffect(fighter, STUN_BATTLE_EFFECT_ID);
  return `${fighter.name}はスタンして動けない！`;
}

async function endRound() {
  const energyChargeThisRound = new Map();

  for (const side of ["player", "enemy"]) {
    const fighter = activeBySide(side);
    if (!fighter || fighter.fainted) continue;
    energyChargeThisRound.set(fighter, effectiveEnergyCharge(fighter));

    for (const status of [...fighter.statuses]) {
      if (status.group === "damage" && status.damageType === "percent_maxhp") {
        const damage = Math.max(1, Math.round(fighter.maxHp * (status.damageValue / 100)));
        fighter.hp = Math.max(0, fighter.hp - damage);
        if (status.id === "blood") {
          pushLog(`${fighter.name}は多量出血した！ ${damage} ダメージ。`);
        } else {
          pushLog(`${fighter.name}は${status.name}で ${damage} ダメージ。`);
        }
        await pause(420);
      }
      status.turns -= 1;
    }

    fighter.statuses = fighter.statuses.filter((status) => status.turns > 0);
    tickWeakModsAfterRound(fighter);
    await handleFaint(side);
    if (state.gameOver || state.pendingSwitchSide) return;

    const regenValue = effectiveRegenValue(fighter);
    if (!fighter.fainted && regenValue > 0 && fighter.hp < fighter.maxHp) {
      const beforeHp = fighter.hp;
      fighter.hp = Math.min(fighter.maxHp, fighter.hp + regenValue);
      const healed = fighter.hp - beforeHp;
      if (healed > 0) {
        pushLog(`${fighter.name}は ${healed} 回復した！`);
        await pause(420);
      }
    }
  }

  for (const side of ["player", "enemy"]) {
    const activeFighter = activeBySide(side);
    for (const fighter of teamBySide(side)) {
      if (!fighter || fighter.fainted) continue;
      if (fighter === activeFighter) {
        const energyCharge = energyChargeThisRound.get(fighter) ?? effectiveEnergyCharge(fighter);
        fighter.energy = clamp(fighter.energy + energyCharge, 0, fighter.maxEnergy);
      }
      fighter.battleEffects = tickBattleEffectsAfterRound(fighter.battleEffects);
    }
  }

  for (const side of ["player", "enemy"]) {
    state.fieldEffects[side] = tickBattleEffectsAfterRound(fieldEffectsForSide(state.fieldEffects, side));
  }
}

function tickBattleEffectsAfterRound(battleEffects) {
  return battleEffects
    .map((effect) => {
      if (
        effect.group === "position" ||
        effect.group === "charge" ||
        effect.group === "delayed_attack" ||
        effect.group === DELAYED_HEAL_BATTLE_EFFECT_GROUP ||
        effect.id === STUN_BATTLE_EFFECT_ID
      ) {
        return effect;
      }
      return { ...effect, turns: effect.turns - 1 };
    })
    .filter((effect) => (
      effect.group === "position" ||
      effect.group === "charge" ||
      effect.group === "delayed_attack" ||
      effect.group === DELAYED_HEAL_BATTLE_EFFECT_GROUP ||
      effect.id === STUN_BATTLE_EFFECT_ID ||
      effect.turns > 0
    ));
}

async function handleFaint(side) {
  const fighter = activeBySide(side);
  if (!fighter || fighter.fainted || fighter.hp > 0) return;

  fighter.hp = 0;
  fighter.fainted = true;
  if (side === "enemy") {
    state.story.lastDefeatedEnemyId = fighter.id;
  }
  clearPendingSkill(fighter);
  fighter.battleEffects = fighter.battleEffects.filter(
    (effect) => !TWO_TURN_BATTLE_EFFECT_IDS.has(effect.id),
  );
  pushLog(`${fighter.name}は倒れた！`);
  await pause(520);

  const team = teamBySide(side);
  const nextIndex = team.findIndex((member) => !member.fainted);
  if (nextIndex < 0) {
    finishBattle(side === "player" ? "enemy" : "player");
    return;
  }

  if (side === "player") {
    state.pendingSwitchSide = "player";
    state.commandMode = "switch";
    pushLog("次に出すBreederを選んでください。");
    await pause(260);
    return;
  }

  switchActive(side, nextIndex, { resetEnergy: true });
  pushLog(`${activeBySide(side).name}が場に出た！`);
  await pause(520);
}

function applyRankBattleTurnLimit() {
  const rankBattleId = state.story.currentArenaBattleId || state.story.currentRankBattleId;
  if (
    state.turn < RANK_BATTLE_TURN_LIMIT ||
    !rankBattleId ||
    RANK_BATTLE_TURN_LIMIT_EXCLUDED_IDS.has(rankBattleId)
  ) {
    return false;
  }

  const result = rankBattleTurnLimitResult();
  pushLog(result.message);
  finishBattle(result.winner);
  return true;
}

function rankBattleTurnLimitResult() {
  const playerCount = remainingBattleCharacterCount(state.playerTeam);
  const enemyCount = remainingBattleCharacterCount(state.enemyTeam);
  if (playerCount !== enemyCount) {
    const winner = playerCount > enemyCount ? "player" : "enemy";
    return {
      winner,
      message: `20ターンが経過しました。残りモンスター数 ${playerCount}対${enemyCount} の判定により、${battleJudgementText(winner)}`,
    };
  }

  const playerHpRatio = remainingBattleHpRatio(state.playerTeam);
  const enemyHpRatio = remainingBattleHpRatio(state.enemyTeam);
  if (playerHpRatio !== enemyHpRatio) {
    const winner = playerHpRatio > enemyHpRatio ? "player" : "enemy";
    return {
      winner,
      message: `20ターンが経過しました。残りモンスター数は${playerCount}対${enemyCount}で同数です。残りHP割合 ${formatBattleHpRatio(playerHpRatio)}対${formatBattleHpRatio(enemyHpRatio)} の判定により、${battleJudgementText(winner)}`,
    };
  }

  return {
    winner: "enemy",
    message: "20ターンが経過しました。残りモンスター数と残りHP割合が同じため、敗北扱いです。",
  };
}

function battleJudgementText(winner) {
  return winner === "player" ? "あなたが勝利しました。" : "あなたの敗北です。";
}

function remainingBattleCharacterCount(team) {
  return (Array.isArray(team) ? team : []).filter((member) => member && !member.fainted && member.hp > 0).length;
}

function remainingBattleHpRatio(team) {
  const members = Array.isArray(team) ? team : [];
  const maxHpTotal = members.reduce((total, member) => total + Math.max(0, number(member?.maxHp)), 0);
  if (maxHpTotal <= 0) return 0;
  const hpTotal = members.reduce((total, member) => {
    const maxHp = Math.max(0, number(member?.maxHp));
    const hp = Math.max(0, Math.min(number(member?.hp), maxHp));
    return total + hp;
  }, 0);
  return hpTotal / maxHpTotal;
}

function formatBattleHpRatio(ratio) {
  return `${Math.round(ratio * 1000) / 10}%`;
}

function finishBattle(winner) {
  if (state.gameOver) return;
  advanceTimeOfDay();
  state.gameOver = true;
  state.pendingSwitchSide = null;
  state.battleWinner = winner;
  state.battleAnimation = null;
  const canShowVictoryResult = winner === "player" && !state.story.currentArenaBattleId;
  state.commandMode = canShowVictoryResult ? "exchange" : "fight";
  state.exchange = createExchangeState();
  pushLog(winner === "player" ? "勝負に勝った！" : "目の前が真っ暗になった...");
  if (winner !== "player") {
    scheduleGameOverReturnToTitle();
  }
}

async function finalizeStoryBattleVictory(rankBattleId) {
  const clearedRankBattleId = applyRankBattleVictory(rankBattleId);
  if (!clearedRankBattleId) return;
  state.story.currentRankBattleId = null;
  state.story.currentArenaBattleId = null;
  state.story.pendingRankBattleId = null;
  state.story.lastDefeatedEnemyId = null;
  resetRankBattleRuntimeState();
  saveGameData();
  hideRankBattleConfirm();
  showStoryMain();
  await showRankBattleVictoryDialogues(clearedRankBattleId);
}

function finalizeArenaBattleVictory(rankBattleId) {
  if (!applyRankBattleVictory(rankBattleId)) return;
  state.story.currentRankBattleId = null;
  state.story.currentArenaBattleId = null;
  state.story.pendingRankBattleId = null;
  state.story.lastDefeatedEnemyId = null;
  state.story.selectedArenaEntranceId = null;
  state.story.selectedArenaBattleId = null;
  resetRankBattleRuntimeState();
  saveGameData();
  hideArenaBattleConfirm({ clearSelection: true, focus: false });
  void showArena();
}

function returnToArenaAfterBattle() {
  state.story.currentRankBattleId = null;
  state.story.currentArenaBattleId = null;
  state.story.pendingRankBattleId = null;
  state.story.lastDefeatedEnemyId = null;
  resetRankBattleRuntimeState();
  hideArenaBattleConfirm({ clearSelection: true, focus: false });
  void showArena();
}

function applyRankBattleVictory(rankBattleId) {
  const currentBattleId = safeText(rankBattleId);
  if (!currentBattleId) return "";
  const alreadyCleared = state.story.clearedRankBattleIds.has(currentBattleId);
  if (!alreadyCleared) {
    state.saveData.money += rankBattleRewardMoney(currentBattleId);
  }
  state.story.clearedRankBattleIds.add(currentBattleId);
  state.story.disabledRankBattleIds.add(currentBattleId);
  return currentBattleId;
}

function resetRankBattleRuntimeState() {
  state.gameOver = true;
  state.busy = false;
  state.pendingSwitchSide = null;
  state.battleWinner = null;
  state.battleAnimation = null;
  state.exchange = createExchangeState();
  state.fieldEffects = createFieldEffectsState();
  state.nextFieldEffectId = 1;
  state.commandMode = "fight";
}

function rankBattleRewardMoney(rankBattleId) {
  return Math.max(0, Math.floor(number(state.rankBattles.get(rankBattleId)?.reward_money)));
}

function switchActive(side, index, options = {}) {
  const team = teamBySide(side);
  const previousIndex = side === "player" ? state.playerActiveIndex : state.enemyActiveIndex;
  const previous = team[previousIndex];
  const next = team[index];
  if (!next || next.fainted) return;
  if (previous && previous !== next) {
    clearSwitchVolatileState(previous);
  }

  if (side === "player") {
    state.playerActiveIndex = index;
  } else {
    state.enemyActiveIndex = index;
  }

  const fighter = activeBySide(side);
  if (options.resetEnergy && fighter && !fighter.fainted) {
    fighter.energy = START_ENERGY;
  }
}

function clearSwitchVolatileState(fighter) {
  clearPendingSkill(fighter);
  fighter.battleEffects = fighter.fainted
    ? []
    : fighter.battleEffects.filter((effect) => SWITCH_PERSISTENT_BATTLE_EFFECT_IDS.has(effect.id));
  fighter.statMods = createEmptyStatMods();
}

function moveForFighter(fighter, moveId) {
  if (!fighter) return null;
  return movesForCharacter(fighter.base).find((move) => move.skill_id === moveId) ?? null;
}

function activePlayer() {
  return state.playerTeam[state.playerActiveIndex];
}

function activeEnemy() {
  return state.enemyTeam[state.enemyActiveIndex];
}

function activeBySide(side) {
  return side === "player" ? activePlayer() : activeEnemy();
}

function sideForActiveFighter(fighter) {
  if (!fighter) return "";
  if (fighter === activePlayer()) return "player";
  if (fighter === activeEnemy()) return "enemy";
  return "";
}

function fieldEffectsForActiveFighter(fighter) {
  const side = sideForActiveFighter(fighter);
  return side ? fieldEffectsForSide(state.fieldEffects, side) : [];
}

function teamBySide(side) {
  return side === "player" ? state.playerTeam : state.enemyTeam;
}

function effectivenessText(multiplier) {
  if (multiplier >= 1.25) return " 効果はばつぐんだ！";
  if (multiplier <= 0.75) return " 効果はいまひとつ。";
  return "";
}

function statusLabels(fighter) {
  return fighterBattleStatusEntries(fighter).map((entry) => entry.label).slice(0, 5);
}

function pushLog(message) {
  state.log.push(message);
  if (state.log.length > 12) state.log = state.log.slice(-12);
  showBattleMessage(message);
}

function applyBattleCoreEvents(events) {
  for (const event of events ?? []) {
    if (event?.type === "log") {
      pushLog(event.text);
    }
  }
}

function isPositionHidden(fighter) {
  return Boolean(
    fighter?.battleEffects.some(
      (effect) => effect.group === "position" || POSITION_EFFECT_IDS.includes(effect.id),
    ),
  );
}

function positionEffectId(fighter) {
  return (
    fighter?.battleEffects.find(
      (effect) => effect.group === "position" || POSITION_EFFECT_IDS.includes(effect.id),
    )?.id ?? ""
  );
}

function positionAnimationFor(effectId) {
  return state.animations.get(effectId) ?? {
    battle_effect_id: effectId,
    ...(DEFAULT_POSITION_ANIMATIONS[effectId] ?? {
      position_class: `position-${effectId}`,
      animation_name: "",
      animation_duration_ms: 520,
      surface_color: "",
    }),
  };
}

function applyPositionEffectClass(sprite, fighter) {
  const positionClassNames = POSITION_EFFECT_IDS.map((id) => positionAnimationFor(id).position_class);
  sprite.classList.remove("is-position-hidden", "has-position-surface", ...positionClassNames);
  sprite.style.removeProperty("--position-animation-name");
  sprite.style.removeProperty("--position-animation-duration");
  sprite.style.removeProperty("--position-surface-color");

  const id = positionEffectId(fighter);
  if (!id) return;
  const animation = positionAnimationFor(id);
  sprite.classList.add("is-position-hidden", animation.position_class);
  if (animation.animation_name) {
    sprite.style.setProperty("--position-animation-name", animation.animation_name);
  }
  if (animation.animation_duration_ms) {
    sprite.style.setProperty("--position-animation-duration", `${animation.animation_duration_ms}ms`);
  }
  if (animation.surface_color) {
    sprite.classList.add("has-position-surface");
    sprite.style.setProperty("--position-surface-color", animation.surface_color);
  }
}

function flashSprite(side) {
  void side;
}

function animationDefinitionForId(animationId) {
  return animationId ? state.animationDefinitions.get(animationId) ?? null : null;
}

function animationDurationFromDefinition(definition) {
  const frameTotal = Math.max(1, definition.frame_order.length || definition.frame_count);
  return (frameTotal / Math.max(1, definition.fps)) * 1000;
}

function animationSheetMetaFromDefinition(definition) {
  const frameCount = Math.max(1, definition.frame_count);
  return {
    columns: Math.max(1, definition.columns),
    rows: Math.max(1, definition.rows),
    frameCount,
    frameOrder: definition.frame_order.length ? definition.frame_order : parseFrameOrder("", frameCount),
    frameWidth: Math.max(1, definition.frame_width),
    frameHeight: Math.max(1, definition.frame_height),
  };
}

async function playSkillAnimation(move, side) {
  const definition = animationDefinitionForId(move.animation_id);
  if (!definition) return;

  await playBattleAnimation(
    {
      definition,
      fileName: definition.image_path,
      duration: move.animation_duration_ms || animationDurationFromDefinition(definition),
      repeatCount: move.repeat_count || definition.repeat_count,
    },
    side,
  );
}

async function playBattleEffectAnimation(battleEffect, side) {
  void battleEffect;
  void side;
  return;
}

async function playBattleEffectAnimations(battleEffects, side) {
  for (const battleEffect of battleEffects) {
    await playBattleEffectAnimation(battleEffect, side);
  }
}

async function playBattleAnimation(config, side) {
  const definition = config.definition;
  const rawSrc = animationAssetPath(config.fileName);
  if (!rawSrc) return;
  const src = config.transparentDarkBackground
    ? await transparentDarkAnimationSrc(rawSrc, config.transparentThreshold)
    : rawSrc;

  const sheetMeta = definition ? animationSheetMetaFromDefinition(definition) : await loadAnimationSheetMeta(src);
  const duration = Math.max(80, number(config.duration, 500) || 500);
  const repeatCount = Math.min(8, Math.max(1, Math.floor(number(config.repeatCount, 1))));
  const targetCenter = battleAnimationTargetCenter(side);
  for (let index = 0; index < repeatCount; index += 1) {
    const sequence = `${Date.now()}-${index}-${Math.random()}`;
    state.battleAnimation = {
      src,
      side,
      duration,
      sequence,
      x: targetCenter.x,
      y: targetCenter.y,
      scale: number(config.scale, BATTLE_ANIMATION_SCALE),
      columns: sheetMeta.columns,
      frameCount: sheetMeta.frameCount,
      frameOrder: sheetMeta.frameOrder,
      frameWidth: sheetMeta.frameWidth,
      frameHeight: sheetMeta.frameHeight,
      frameIndex: 0,
      cellIndex: sheetMeta.frameOrder[0] ?? 0,
    };
    renderBattle();
    await playBattleAnimationFrames(sequence, duration, sheetMeta);
    state.battleAnimation = null;
    renderBattle();
    if (index < repeatCount - 1) {
      await rawDelay(80);
    }
  }
}

function battleAnimationTargetCenter(side) {
  const sprite = side === "player" ? els.playerSprite : els.enemySprite;
  const field = sprite?.closest(".battle-field");
  const targetNode = sprite?.querySelector(".sprite-image") ?? sprite;
  if (!field || !targetNode) return { x: Number.NaN, y: Number.NaN };

  const fieldRect = field.getBoundingClientRect();
  const targetRect = targetNode.getBoundingClientRect();
  if (!fieldRect.width || !fieldRect.height || !targetRect.width || !targetRect.height) {
    return { x: Number.NaN, y: Number.NaN };
  }

  return {
    x: targetRect.left - fieldRect.left + targetRect.width / 2,
    y: targetRect.top - fieldRect.top + targetRect.height / 2,
  };
}

function transparentDarkAnimationSrc(src, threshold = 28) {
  const safeThreshold = Math.max(0, Math.min(255, Math.round(number(threshold, 28))));
  const cacheKey = `${src}|${safeThreshold}`;
  if (transparentAnimationCache.has(cacheKey)) {
    return transparentAnimationCache.get(cacheKey);
  }

  const imagePromise = new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d");
      if (!context) {
        resolve(src);
        return;
      }

      try {
        context.drawImage(image, 0, 0);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        for (let index = 0; index < pixels.length; index += 4) {
          const brightness = Math.max(pixels[index], pixels[index + 1], pixels[index + 2]);
          if (brightness <= safeThreshold) {
            pixels[index + 3] = 0;
          }
        }
        context.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch (error) {
        resolve(src);
      }
    };
    image.onerror = () => resolve(src);
    image.src = src;
  });

  transparentAnimationCache.set(cacheKey, imagePromise);
  return imagePromise;
}

function loadAnimationSheetMeta(src) {
  if (animationSheetMetaCache.has(src)) {
    return animationSheetMetaCache.get(src);
  }

  const metaPromise = new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const columns = Math.max(1, Math.floor(image.naturalWidth / ANIMATION_FRAME_WIDTH));
      const rows = Math.max(1, Math.floor(image.naturalHeight / ANIMATION_FRAME_HEIGHT));
      const frameCount = Math.max(1, columns * rows);
      resolve({
        columns,
        rows,
        frameCount,
        frameOrder: parseFrameOrder("", frameCount),
        frameWidth: ANIMATION_FRAME_WIDTH,
        frameHeight: ANIMATION_FRAME_HEIGHT,
      });
    };
    image.onerror = () => {
      resolve({
        columns: 1,
        rows: 1,
        frameCount: 1,
        frameOrder: [0],
        frameWidth: ANIMATION_FRAME_WIDTH,
        frameHeight: ANIMATION_FRAME_HEIGHT,
      });
    };
    image.src = src;
  });

  animationSheetMetaCache.set(src, metaPromise);
  return metaPromise;
}

function playBattleAnimationFrames(sequence, duration, sheetMeta) {
  const configuredFrameCount = Math.max(1, sheetMeta.frameCount);
  const frameOrder = sheetMeta.frameOrder?.length ? sheetMeta.frameOrder : parseFrameOrder("", configuredFrameCount);
  const frameCount = Math.max(1, frameOrder.length);
  const totalDuration = Math.max(1, duration);
  const startedAt = window.performance.now();

  return new Promise((resolve) => {
    const updateFrame = (timestamp) => {
      const animation = state.battleAnimation;
      if (!animation || animation.sequence !== sequence) {
        resolve();
        return;
      }

      const elapsed = Math.max(0, timestamp - startedAt);
      const progress = Math.min(1, elapsed / totalDuration);
      const nextFrameIndex = Math.min(frameCount - 1, Math.floor(progress * frameCount));
      if (animation.frameIndex !== nextFrameIndex) {
        const cellIndex = frameOrder[nextFrameIndex] ?? nextFrameIndex;
        animation.frameIndex = nextFrameIndex;
        animation.cellIndex = cellIndex;
        updateBattleAnimationFrame(cellIndex, sheetMeta);
      }

      if (progress < 1) {
        window.requestAnimationFrame(updateFrame);
        return;
      }

      resolve();
    };

    updateBattleAnimationFrame(frameOrder[0] ?? 0, sheetMeta);
    window.requestAnimationFrame(updateFrame);
  });
}

function updateBattleAnimationFrame(cellIndex, sheetMeta) {
  const animationNode = els.battleAnimationLayer?.querySelector(".battle-animation");
  if (!animationNode) return;

  const framePosition = animationFramePosition(
    cellIndex,
    sheetMeta.columns,
    sheetMeta.frameWidth,
    sheetMeta.frameHeight,
  );
  animationNode.style.setProperty("--battle-animation-frame-x", `${framePosition.x}px`);
  animationNode.style.setProperty("--battle-animation-frame-y", `${framePosition.y}px`);
}

function animationFramePosition(cellIndex, columns, frameWidth = ANIMATION_FRAME_WIDTH, frameHeight = ANIMATION_FRAME_HEIGHT) {
  const safeColumns = Math.max(1, Math.floor(number(columns, 1)));
  const safeCellIndex = Math.max(0, Math.floor(number(cellIndex, 0)));
  const column = safeCellIndex % safeColumns;
  const row = Math.floor(safeCellIndex / safeColumns);
  return {
    x: -column * frameWidth,
    y: -row * frameHeight,
  };
}

function animationAssetPath(fileName) {
  const text = animationAssetName(fileName).replace(/\\/g, "/");
  if (!text) return "";
  if (/^(https?:|data:)/i.test(text)) return text;

  const relativePath = text.replace(/^\.?\//, "");
  const assetPath = relativePath.startsWith("assets/")
    ? relativePath
    : `assets/animation/${relativePath}`;
  const parts = assetPath
    .split("/")
    .map((part) => part.trim())
    .filter((part) => part && part !== "." && part !== "..");
  return parts.length ? `./${parts.map(encodeURIComponent).join("/")}` : "";
}

function elementName(element) {
  return ELEMENT_LABELS[element] ?? element;
}

function hitTypeSuffix(hitTypeId) {
  if (!hitTypeId || hitTypeId === "normal") return "";
  const hitType = state.hitTypes.get(hitTypeId);
  return hitType ? ` / ${hitType.name}` : ` / ${hitTypeId}`;
}

function hitTypeName(hitTypeId) {
  if (!hitTypeId) return "通常";
  return state.hitTypes.get(hitTypeId)?.name ?? hitTypeId;
}

function effectChipClass(effectId) {
  if (effectId === "paralysis") return "effect-paralysis";
  if (effectId === "poison") return "effect-poison";
  if (effectId === "burn") return "effect-burn";
  if (effectId === "phy_protect") return "effect-phy-protect";
  if (effectId === "sp_protect") return "effect-sp-protect";
  const resistanceClass = resistanceEffectChipClass(effectId);
  if (resistanceClass) return resistanceClass;
  if (effectId.endsWith("_up")) return "effect-up";
  if (effectId.endsWith("_down") || effectId === "def_down") return "effect-down";
  return "effect-other";
}

function resistanceEffectChipClass(effectId) {
  const match = safeText(effectId).match(/^(fire|water|thunder|ice|dragon)_weak_/);
  return match ? `effect-resistance-${match[1]}` : "";
}

function moveCategoryLabel(category) {
  return (
    {
      attack: "攻撃",
      status: "変化",
      support: "補助",
    }[category] ?? category
  );
}

function attackTypeLabel(attackType) {
  return (
    {
      physical: "物理",
      special: "特殊",
      none: "種別なし",
    }[attackType] ?? attackType
  );
}

function targetLabel(target) {
  return (
    {
      enemy: "相手",
      self: "自分",
      ally: "味方",
    }[target] ?? target
  );
}

function elementPill(element) {
  const normalized = elementClass(element);
  return `<span class="element-pill element-${normalized}">${escapeHtml(elementName(normalized))}</span>`;
}

function elementClass(element) {
  return `${element || "none"}`.replace(/[^a-z0-9_-]/gi, "") || "none";
}

function uniqueBy(items, key) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item || seen.has(item[key])) return false;
    seen.add(item[key]);
    return true;
  });
}

function sample(items, count) {
  const copy = [...items];
  const picked = [];
  while (copy.length && picked.length < count) {
    const index = Math.floor(Math.random() * copy.length);
    picked.push(copy.splice(index, 1)[0]);
  }
  return picked;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function pause(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, scaledBattleTextDelay(ms)));
}

function rawDelay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, Math.max(0, Math.round(ms))));
}

function scaledBattleTextDelay(ms) {
  return Math.max(0, Math.round(ms * BATTLE_TEXT_SPEED_SCALE));
}

function escapeHtml(value) {
  return `${value ?? ""}`
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

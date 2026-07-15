const DATA_PATHS = {
  characters: "./data/character.csv",
  skills: "./data/skill.csv",
  battleEffects: "./data/battle_effect.csv",
  effects: "./data/effect.csv",
  hitTypes: "./data/hit_type.csv",
  animations: "./data/animation.csv",
  rankBattles: "./data/rank_battle.csv",
  enemyParties: "./data/enemy_party.csv",
  shopItems: "./data/shop_item.csv",
  encyclopediaBooks: "./data/encyclopedia_book.csv",
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

const SAVE_STORAGE_KEY = "mhb_save_data_v1";
const INITIAL_MONEY = 1500;
const BUSINESS_SHOP_ID = "business";
const INITIAL_PLAYER_CHARACTER_IDS = ["character_001", "character_004"];
const LEGACY_INITIAL_PLAYER_CHARACTER_IDS = ["character_004", "character_002"];
const INITIAL_PARTY_VERSION = 1;

const ELEMENT_LABELS = {
  none: "無",
  fire: "火",
  water: "水",
  thunder: "雷",
  ice: "氷",
  dragon: "龍",
};

const ELEMENT_TYPES = ["fire", "water", "thunder", "ice", "dragon"];
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
const BATTLE_MESSAGE_DURATION = 1400;
const BATTLE_TEXT_SPEED_SCALE = 2;
const ANIMATION_FRAME_WIDTH = 250;
const ANIMATION_FRAME_HEIGHT = 43;
const BATTLE_ANIMATION_SCALE = 1.52;
const TEAM_SLOT_LIMIT = 5;
const START_ENERGY = 1;
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

const STAT_MOD_KEYS = ["phy_atk", "phy_def", "sp_atk", "sp_def", "speed"];

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
    effect_chance1: 0,
    effect2: "none",
    effect_chance2: 0,
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

const state = {
  characters: [],
  characterMap: new Map(),
  skills: new Map(),
  effects: new Map(),
  battleEffects: new Map(),
  hitTypes: new Map(),
  animations: new Map(),
  animationDefinitions: new Map(),
  rankBattles: new Map(),
  enemyParties: new Map(),
  shopItems: [],
  encyclopediaBooks: new Map(),
  saveData: createSaveData(),
  shop: createShopState(),
  selectedIds: [],
  playerTeam: [],
  enemyTeam: [],
  playerActiveIndex: 0,
  enemyActiveIndex: 0,
  commandMode: "fight",
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
  detailCharacterId: null,
  dex: {
    open: false,
    characterId: null,
  },
  story: {
    active: false,
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
    clearedRankBattleIds: new Set(),
    disabledRankBattleIds: new Set(),
  },
};

const els = {};
let battleMessageTimer = null;
let gameDataPromise = null;
const animationSheetMetaCache = new Map();
const transparentAnimationCache = new Map();

function createExchangeState() {
  return {
    playerIndices: [],
    enemyIndex: null,
    completed: false,
    storyDecision: null,
  };
}

function createSaveData() {
  return {
    money: INITIAL_MONEY,
    ownedBooks: new Set(),
    ownedMonsters: [],
    shopStock: new Map(),
    purchasedShopEntries: new Set(),
    nextOwnedMonsterNumber: 1,
    initialMoneyVersion: 1,
    initialPartyVersion: INITIAL_PARTY_VERSION,
  };
}

function createShopState() {
  return {
    open: false,
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
    storyBackButton: document.querySelector("#storyBackButton"),
    storyMainStage: document.querySelector("#storyMainStage"),
    storyBusinessButton: document.querySelector("#storyBusinessButton"),
    storyRankBattleF1Button: document.querySelector("#storyRankBattleF1Button"),
    storyBattleConfirmOverlay: document.querySelector("#storyBattleConfirmOverlay"),
    storyBattleConfirmText: document.querySelector("#storyBattleConfirmText"),
    storyBattleOpponentList: document.querySelector("#storyBattleOpponentList"),
    storyBattleConfirmYesButton: document.querySelector("#storyBattleConfirmYesButton"),
    storyBattleConfirmNoButton: document.querySelector("#storyBattleConfirmNoButton"),
    storyMap: document.querySelector("#storyMap"),
    storyTiles: document.querySelector("#storyTiles"),
    storyPlayer: document.querySelector("#storyPlayer"),
    businessShopPanel: document.querySelector("#businessShopPanel"),
    businessShopBackButton: document.querySelector("#businessShopBackButton"),
    businessShopMoney: document.querySelector("#businessShopMoney"),
    businessShopSlots: document.querySelector("#businessShopSlots"),
    businessShopItems: document.querySelector("#businessShopItems"),
    businessShopExchangePanel: document.querySelector("#businessShopExchangePanel"),
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
  });

  bindEvents();
  gameDataPromise = loadGameData();
});

function bindEvents() {
  els.storyModeButton.addEventListener("click", startStoryMode);
  els.battleModeButton.addEventListener("click", showBattleSetup);
  els.storyBackButton.addEventListener("click", showTitleView);
  els.storyBusinessButton?.addEventListener("click", showBusinessShop);
  els.businessShopBackButton?.addEventListener("click", hideBusinessShop);
  els.storyRankBattleF1Button?.addEventListener("click", (event) => {
    event.preventDefault();
    if (isStoryRankBattleDisabled("battle_f_1")) return;
    showRankBattleConfirm("battle_f_1");
  });
  els.storyBattleConfirmYesButton?.addEventListener("click", confirmRankBattleStart);
  els.storyBattleConfirmNoButton?.addEventListener("click", () => hideRankBattleConfirm({ restoreFocus: true }));
  els.storyBattleConfirmOverlay?.addEventListener("click", (event) => {
    if (event.target === els.storyBattleConfirmOverlay) {
      hideRankBattleConfirm({ restoreFocus: true });
    }
  });
  document.addEventListener("keydown", handleStoryKeydown);

  els.randomTeamButton.addEventListener("click", () => {
    state.selectedIds = buildSlotTeam(state.characters, TEAM_SLOT_LIMIT, true).map((character) => character.character_id);
    renderSetup();
  });

  els.randomBattleButton.addEventListener("click", startRandomBattle);

  els.clearTeamButton.addEventListener("click", () => {
    state.selectedIds = [];
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
    pushLog("用語は準備中です。");
  });

  els.restartButton.addEventListener("click", () => {
    returnToSetup();
  });
}

function showTitleView() {
  state.story.active = false;
  state.shop.open = false;
  hideBusinessShop();
  clearStoryWalkTimer();
  hideRankBattleConfirm();
  state.story.currentRankBattleId = null;
  els.battleView.classList.add("is-hidden");
  els.setupView.classList.add("is-hidden");
  els.storyView.classList.add("is-hidden");
  els.titleView.classList.remove("is-hidden");
  clearTitleMessage();
}

function showStoryPreparing() {
  state.story.active = false;
  state.shop.open = false;
  hideBusinessShop();
  clearStoryWalkTimer();
  els.setupView.classList.add("is-hidden");
  els.battleView.classList.add("is-hidden");
  els.storyView.classList.add("is-hidden");
  els.titleView.classList.remove("is-hidden");
  els.titleMessage.classList.remove("is-hidden");
}

function showBattleSetup() {
  state.story.active = false;
  state.shop.open = false;
  hideBusinessShop();
  clearStoryWalkTimer();
  hideRankBattleConfirm();
  state.story.currentRankBattleId = null;
  clearTitleMessage();
  els.titleView.classList.add("is-hidden");
  els.storyView.classList.add("is-hidden");
  els.battleView.classList.add("is-hidden");
  els.setupView.classList.remove("is-hidden");
  renderSetup();
}

function clearTitleMessage() {
  els.titleMessage?.classList.add("is-hidden");
}

async function startStoryMode() {
  state.story.active = false;
  state.shop.open = false;
  hideBusinessShop();
  clearStoryWalkTimer();
  hideRankBattleConfirm();
  clearTitleMessage();
  els.titleView.classList.add("is-hidden");
  els.setupView.classList.add("is-hidden");
  els.battleView.classList.add("is-hidden");
  els.storyView.classList.remove("is-hidden");
  updateStoryRankBattleButtons();
  els.storyBackButton.focus({ preventScroll: true });
}

async function showBusinessShop() {
  if (gameDataPromise) {
    await gameDataPromise;
  }

  loadSaveData({ preserveCurrentOnMissing: true });
  initializeSaveDataParty();
  state.shop.open = true;
  state.shop.exchangeEntryId = null;
  state.shop.offerOwnedIds = [];
  hideRankBattleConfirm();
  els.storyMainStage?.classList.add("is-hidden");
  els.storyBackButton?.classList.add("is-hidden");
  els.businessShopPanel?.classList.remove("is-hidden");
  renderBusinessShop();
  els.businessShopBackButton?.focus({ preventScroll: true });
}

function hideBusinessShop() {
  state.shop.open = false;
  state.shop.exchangeEntryId = null;
  state.shop.offerOwnedIds = [];
  els.businessShopPanel?.classList.add("is-hidden");
  els.storyMainStage?.classList.remove("is-hidden");
  els.storyBackButton?.classList.remove("is-hidden");
}

function renderBusinessShop() {
  if (!els.businessShopPanel) return;

  els.businessShopMoney.textContent = `${state.saveData.money}`;
  els.businessShopSlots.textContent = `${ownedPartySlotTotal()} / ${TEAM_SLOT_LIMIT}`;

  const items = availableShopItems(BUSINESS_SHOP_ID);
  els.businessShopItems.innerHTML = items.length
    ? items.map(renderShopItem).join("")
    : `<div class="shop-empty">現在購入できる商品はありません。</div>`;

  for (const button of els.businessShopItems.querySelectorAll("[data-shop-entry-id]")) {
    button.addEventListener("click", () => handleShopPurchase(button.dataset.shopEntryId));
  }

  renderShopExchangePanel();
}

function availableShopItems(shopId) {
  return state.shopItems
    .filter((item) => item.shop_id === shopId)
    .filter((item) => item.item_type && item.content_id)
    .filter((item) => item.item_type === "book" || item.item_type === "monster")
    .filter((item) => shopContentExists(item))
    .filter((item) => shopUnlockMet(item.unlock_condition))
    .sort((a, b) => a.display_order - b.display_order);
}

function shopContentExists(item) {
  if (item.item_type === "book") return state.encyclopediaBooks.has(item.content_id);
  if (item.item_type === "monster") return state.characterMap.has(item.content_id);
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
  const typeLabel = item.item_type === "book" ? "図鑑" : "モンスター";
  const monster = item.item_type === "monster" ? state.characterMap.get(item.content_id) : null;
  const book = item.item_type === "book" ? state.encyclopediaBooks.get(item.content_id) : null;
  const disabledReason = shopDisabledReason(item);
  const description = book?.description || (monster ? `${monster.name}を仲間にします。` : "");

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
          <span>在庫 ${escapeHtml(stock)}</span>
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
  return state.saveData.shopStock.has(item.shop_entry_id)
    ? state.saveData.shopStock.get(item.shop_entry_id)
    : item.stock;
}

function setShopStock(item, stock) {
  state.saveData.shopStock.set(item.shop_entry_id, Math.max(0, Math.floor(number(stock))));
}

function handleShopPurchase(shopEntryId) {
  const item = availableShopItems(BUSINESS_SHOP_ID).find((entry) => entry.shop_entry_id === shopEntryId);
  if (!item || shopDisabledReason(item)) return;

  if (item.item_type === "book") {
    purchaseBook(item);
    return;
  }

  beginMonsterPurchase(item);
}

function purchaseBook(item) {
  if (shopDisabledReason(item)) return;
  state.saveData.money -= item.price;
  state.saveData.ownedBooks.add(item.content_id);
  state.saveData.purchasedShopEntries.add(item.shop_entry_id);
  setShopStock(item, currentShopStock(item) - 1);
  saveGameData();
  renderBusinessShop();
}

function beginMonsterPurchase(item) {
  const monster = state.characterMap.get(item.content_id);
  if (!monster || shopDisabledReason(item)) return;

  if (ownedPartySlotTotal() + monster.slot <= TEAM_SLOT_LIMIT) {
    completeMonsterPurchase(item, []);
    return;
  }

  state.shop.exchangeEntryId = item.shop_entry_id;
  state.shop.offerOwnedIds = [];
  renderBusinessShop();
}

function renderShopExchangePanel() {
  if (!els.businessShopExchangePanel) return;

  const item = availableShopItems(BUSINESS_SHOP_ID).find(
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

function completeMonsterPurchase(item, offerOwnedIds) {
  const monster = state.characterMap.get(item.content_id);
  if (!monster || shopDisabledReason(item)) return;

  const offerSet = new Set(offerOwnedIds);
  const offeredCharacters = state.saveData.ownedMonsters
    .filter((entry) => offerSet.has(entry.ownedId))
    .map((entry) => state.characterMap.get(entry.characterId))
    .filter(Boolean);
  const nextSlotTotal = ownedPartySlotTotal() - slotTotal(offeredCharacters) + monster.slot;
  if (nextSlotTotal > TEAM_SLOT_LIMIT) return;

  state.saveData.money -= item.price;
  setShopStock(item, currentShopStock(item) - 1);
  state.saveData.purchasedShopEntries.add(item.shop_entry_id);
  state.saveData.ownedMonsters = state.saveData.ownedMonsters.filter(
    (entry) => !offerSet.has(entry.ownedId),
  );
  state.saveData.ownedMonsters.push(createOwnedMonster(monster.character_id));
  syncSelectedIdsFromOwnedMonsters();
  state.shop.exchangeEntryId = null;
  state.shop.offerOwnedIds = [];
  saveGameData();
  renderSetup();
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

function returnToSetup() {
  state.story.active = false;
  state.shop.open = false;
  hideBusinessShop();
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
  state.detailCharacterId = null;
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
      battleEffectText,
      effectText,
      hitTypeText,
      animationText,
      rankBattleText,
      enemyPartyText,
      shopItemText,
      encyclopediaBookText,
    ] = await Promise.all([
      loadCsvText("characters", DATA_PATHS.characters),
      loadCsvText("skills", DATA_PATHS.skills),
      loadCsvText("battleEffects", DATA_PATHS.battleEffects),
      loadCsvText("effects", DATA_PATHS.effects),
      loadCsvText("hitTypes", DATA_PATHS.hitTypes),
      loadCsvText("animations", DATA_PATHS.animations),
      loadOptionalCsvText("rankBattles", DATA_PATHS.rankBattles),
      loadOptionalCsvText("enemyParties", DATA_PATHS.enemyParties),
      loadOptionalCsvText("shopItems", DATA_PATHS.shopItems),
      loadOptionalCsvText("encyclopediaBooks", DATA_PATHS.encyclopediaBooks),
    ]);

    state.characters = rowsFromCsv(characterText)
      .map(normalizeCharacter)
      .filter((character) => character.character_id && character.name);
    state.characterMap = new Map(
      state.characters.map((character) => [character.character_id, character]),
    );

    for (const skill of rowsFromCsv(skillText).map(normalizeSkill)) {
      if (skill.skill_id && skill.name && skill.category) {
        state.skills.set(skill.skill_id, skill);
      }
    }

    for (const skill of Object.values(GENERATED_SKILLS)) {
      state.skills.set(skill.skill_id, skill);
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
    initializeSaveDataParty();
    renderSetup();
  } catch (error) {
    els.rosterGrid.innerHTML = `<div class="selected-slot is-filled">CSVを読み込めませんでした。</div>`;
    console.error(error);
  }
}

async function loadCsvText(key, path) {
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
    renderOffsetY: number(row.render_offset_y),
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
    effect_chance1: number(row.effect_chance1),
    effect2: safeText(row.effect2, "none"),
    effect_chance2: number(row.effect_chance2),
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
  };
}

function normalizeEffect(row) {
  return {
    effect_id: safeText(row.effect_id),
    name: safeText(row.name),
    effect_group: safeText(row.effect_group),
    damage_type: safeText(row.damage_type, "none"),
    damage_value: number(row.damage_value),
    turn: Math.max(1, number(row.turn, 1)),
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

function normalizeRankBattle(row) {
  return {
    rank_battle_id: safeText(row.rank_battle_id),
    rank: safeText(row.rank),
    name: safeText(row.name),
    enemy_party_id: safeText(row.enemy_party_id),
    reward_money: number(row.reward_money),
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

function parseBoolean(value) {
  return `${value}`.toLowerCase() === "true";
}

function renderSetup() {
  renderSelectedSlots();
  renderRoster();
  renderDetailPanel();
  els.startButton.disabled = selectedSlotTotal() <= 0 || selectedSlotTotal() > TEAM_SLOT_LIMIT;
  els.randomBattleButton.disabled = state.characters.length <= 0;
}

function renderSelectedSlots() {
  const selectedCharacters = selectedCharactersForSetup();
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
  const emptyHtml = Array.from({ length: emptySlots }, () => {
    return `<div class="selected-slot"><div class="slot-name">EMPTY</div><div class="slot-meta">スロット ${slotMarks(1)}</div></div>`;
  }).join("");

  els.selectedSlots.innerHTML = `
    <div class="team-slot-summary">スロット ${usedSlots}/${TEAM_SLOT_LIMIT}</div>
    ${selectedHtml}${emptyHtml}
  `;
}

function renderRoster() {
  els.rosterGrid.innerHTML = state.characters
    .map((character) => {
      const selected = state.selectedIds.includes(character.character_id);
      return `
        <article class="character-card ${selected ? "is-selected" : ""}">
          <button class="card-select-button" type="button" data-character-id="${character.character_id}">
            <div class="card-topline">
              <span class="card-name">${escapeHtml(character.name)}</span>
              ${elementPill(character.element)}
            </div>
            <div class="card-image-frame">
              <img class="card-image" src="${escapeHtml(character.imageSrc)}" alt="${escapeHtml(character.name)}" />
            </div>
            <div class="card-slot-meta">スロット ${slotMarks(character.slot)}</div>
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

function detailStat(label, value, statKey) {
  const barPercent = detailStatBarPercent(statKey, value);
  const displayValue = statKey === "hp" && value > STAT_GRAPH_MAX.hp ? "???" : value;
  return `
    <div class="detail-stat detail-stat-${statKey}" style="--bar-width: ${barPercent}%">
      <span class="detail-stat-label">${escapeHtml(label)}</span>
      <div class="detail-stat-track"><span class="detail-stat-fill"></span></div>
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

  const fallbackId = activeEnemy()?.id || activePlayer()?.id || state.characters[0]?.character_id || null;
  const selectedId = state.dex.characterId || fallbackId;
  const character = state.characterMap.get(selectedId) || state.characters[0];
  els.dexOverlay.classList.toggle("is-hidden", !state.dex.open || !character);

  if (!state.dex.open || !character) {
    els.dexPanel.innerHTML = "";
    return;
  }

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
        ${state.characters
          .map(
            (entry) => `
              <button class="dex-list-button ${entry.character_id === character.character_id ? "is-selected" : ""}" type="button" data-dex-id="${escapeHtml(entry.character_id)}">
                <span>${escapeHtml(entry.name)}</span>
                ${elementPill(entry.element)}
              </button>
            `,
          )
          .join("")}
      </aside>
      <section class="dex-content">
        <div class="dex-profile">
          <div class="detail-image-frame dex-image-frame">
            <img class="detail-image" src="${escapeHtml(character.imageSrc)}" alt="${escapeHtml(character.name)}" />
          </div>
          <div class="dex-summary">
            <div class="detail-title">${escapeHtml(character.name)}</div>
            <div class="detail-subtitle">${characterSubtitle(character)}</div>
            <div class="dex-data-row"><span>スロット</span><strong>${slotMarks(character.slot)}</strong></div>
            <div class="dex-data-row"><span>EN回復</span><strong>${energyBadge(character.energy_charge)}</strong></div>
            <div class="dex-data-row"><span>回復力</span><strong>${escapeHtml(character.regen_value)}</strong></div>
          </div>
        </div>
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
        <div class="detail-section-title">属性耐性</div>
        <div class="resistance-grid">
          ${ELEMENT_TYPES.map((element) => resistanceCell(character, element)).join("")}
        </div>
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
  return state.selectedIds
    .map((id) => state.characterMap.get(id))
    .filter(Boolean);
}

function selectedSlotTotal() {
  return slotTotal(selectedCharactersForSetup());
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
        <span class="weakness-badge element-${escapeHtml(elementClass(entry.element))}">
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

function statModifierLabel(stat, value) {
  const steps = Math.min(4, Math.max(1, Math.round(Math.abs(value) / 25)));
  const marker = value > 0 ? "△" : "▼";
  return `${STAT_LABELS[stat] ?? stat}${marker.repeat(steps)}`;
}

function fighterStatusEntries(fighter) {
  if (!fighter) return [];
  const statusEntries = fighter.statuses.map((status) => ({
    label: status.name,
    className: effectChipClass(status.id),
  }));
  const battleEffectEntries = fighter.battleEffects.map((effect) => ({
    label: effect.name,
    className: effectChipClass(effect.id),
  }));
  const statEntries = Object.entries(fighter.statMods)
    .filter(([, value]) => value !== 0)
    .map(([stat, value]) => ({
      label: statModifierLabel(stat, value),
      className: value > 0 ? "effect-up" : "effect-down",
    }));

  return [...statusEntries, ...battleEffectEntries, ...statEntries];
}

function renderFighterStatusChips(fighter) {
  const entries = fighterStatusEntries(fighter);
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
  const entries = fighterStatusEntries(fighter).map((entry) => entry.label);
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

function loadSaveData({ preserveCurrentOnMissing = false } = {}) {
  const nextSaveData = createSaveData();
  let rawData = null;

  try {
    rawData = JSON.parse(window.localStorage?.getItem(SAVE_STORAGE_KEY) || "null");
  } catch {
    rawData = null;
  }

  if (!rawData && preserveCurrentOnMissing) return;

  if (rawData && typeof rawData === "object") {
    const loadedMoney = Math.max(0, Math.floor(number(rawData.money)));
    const initialMoneyVersion = Math.floor(number(rawData.initial_money_version ?? rawData.initialMoneyVersion));
    nextSaveData.money = initialMoneyVersion >= 1 ? loadedMoney : Math.max(loadedMoney, INITIAL_MONEY);
    nextSaveData.initialMoneyVersion = 1;

    for (const bookId of arrayFromSave(rawData.owned_books ?? rawData.ownedBooks)) {
      const id = safeText(bookId);
      if (id) nextSaveData.ownedBooks.add(id);
    }

    for (const entryId of arrayFromSave(rawData.purchased_shop_entries ?? rawData.purchasedShopEntries)) {
      const id = safeText(entryId);
      if (id) nextSaveData.purchasedShopEntries.add(id);
    }

    const stockData = rawData.shop_stock ?? rawData.shopStock;
    if (stockData && typeof stockData === "object") {
      for (const [entryId, stock] of Object.entries(stockData)) {
        const id = safeText(entryId);
        if (id) nextSaveData.shopStock.set(id, Math.max(0, Math.floor(number(stock))));
      }
    }

    nextSaveData.ownedMonsters = arrayFromSave(rawData.owned_monsters ?? rawData.ownedMonsters)
      .map((entry) => ({
        ownedId: safeText(entry?.owned_id ?? entry?.ownedId),
        characterId: safeText(entry?.character_id ?? entry?.characterId),
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
    nextSaveData.initialPartyVersion = Math.floor(number(rawData.initial_party_version ?? rawData.initialPartyVersion));
    migrateLegacyInitialParty(nextSaveData);

    state.story.clearedRankBattleIds = new Set(
      arrayFromSave(rawData.cleared_battles ?? rawData.clearedBattles ?? rawData.cleared_rank_battle_ids ?? rawData.clearedRankBattleIds)
        .map((rankBattleId) => safeText(rankBattleId))
        .filter(Boolean),
    );
  }

  state.saveData = nextSaveData;
}

function saveGameData() {
  const clearedBattles = [...new Set([...state.story.clearedRankBattleIds].map((id) => safeText(id)).filter(Boolean))];
  const saveData = {
    money: state.saveData.money,
    owned_books: [...state.saveData.ownedBooks],
    owned_monsters: state.saveData.ownedMonsters.map((entry) => ({
      owned_id: entry.ownedId,
      character_id: entry.characterId,
    })),
    shop_stock: Object.fromEntries(state.saveData.shopStock),
    purchased_shop_entries: [...state.saveData.purchasedShopEntries],
    cleared_battles: clearedBattles,
    cleared_rank_battle_ids: clearedBattles,
    next_owned_monster_number: state.saveData.nextOwnedMonsterNumber,
    initial_money_version: state.saveData.initialMoneyVersion,
    initial_party_version: state.saveData.initialPartyVersion,
  };

  try {
    window.localStorage?.setItem(SAVE_STORAGE_KEY, JSON.stringify(saveData));
  } catch {
    // Some private previews can block localStorage; the in-memory save_data still works.
  }
}

function arrayFromSave(value) {
  return Array.isArray(value) ? value : [];
}

function migrateLegacyInitialParty(saveData) {
  if (saveData.initialPartyVersion >= INITIAL_PARTY_VERSION) return;

  const ownedCharacterIds = saveData.ownedMonsters.map((entry) => entry.characterId);
  if (sameCharacterIdSet(ownedCharacterIds, LEGACY_INITIAL_PLAYER_CHARACTER_IDS)) {
    saveData.ownedMonsters = initialPlayerCharacterIds().map((characterId, index) => ({
      ownedId: `owned_${String(index + 1).padStart(3, "0")}`,
      characterId,
    }));
    saveData.nextOwnedMonsterNumber = Math.max(saveData.nextOwnedMonsterNumber, saveData.ownedMonsters.length + 1);
    saveData.initialPartyVersion = INITIAL_PARTY_VERSION;
    return;
  }

  saveData.initialPartyVersion = INITIAL_PARTY_VERSION;
}

function sameCharacterIdSet(leftIds, rightIds) {
  if (leftIds.length !== rightIds.length) return false;
  const left = [...leftIds].map((id) => safeText(id)).sort();
  const right = [...rightIds].map((id) => safeText(id)).sort();
  return left.every((id, index) => id === right[index]);
}

function initializeSaveDataParty() {
  state.saveData.ownedMonsters = state.saveData.ownedMonsters.filter((entry) =>
    state.characterMap.has(entry.characterId),
  );

  if (!state.saveData.ownedMonsters.length) {
    state.saveData.ownedMonsters = initialPlayerCharacterIds().map((characterId) =>
      createOwnedMonster(characterId),
    );
  }

  syncSelectedIdsFromOwnedMonsters();
  saveGameData();
}

function createOwnedMonster(characterId) {
  return {
    ownedId: nextOwnedMonsterId(),
    characterId,
  };
}

function nextOwnedMonsterId() {
  const ownedId = `owned_${String(state.saveData.nextOwnedMonsterNumber).padStart(3, "0")}`;
  state.saveData.nextOwnedMonsterNumber += 1;
  return ownedId;
}

function syncSelectedIdsFromOwnedMonsters() {
  state.selectedIds = state.saveData.ownedMonsters
    .map((entry) => entry.characterId)
    .filter((characterId) => state.characterMap.has(characterId));
}

function syncOwnedMonsterPartyFromSelectedIds({ persist = true } = {}) {
  const remainingOwnedMonsters = [...state.saveData.ownedMonsters];
  const nextOwnedMonsters = [];

  for (const characterId of state.selectedIds) {
    if (!state.characterMap.has(characterId)) continue;
    const existingIndex = remainingOwnedMonsters.findIndex((entry) => entry.characterId === characterId);
    if (existingIndex >= 0) {
      nextOwnedMonsters.push(remainingOwnedMonsters.splice(existingIndex, 1)[0]);
    } else {
      nextOwnedMonsters.push(createOwnedMonster(characterId));
    }
  }

  state.saveData.ownedMonsters = nextOwnedMonsters;
  if (persist) saveGameData();
}

function ownedPartyCharacters() {
  return state.saveData.ownedMonsters
    .map((entry) => state.characterMap.get(entry.characterId))
    .filter(Boolean);
}

function ownedPartySlotTotal() {
  return slotTotal(ownedPartyCharacters());
}

function toggleCharacter(characterId) {
  const selectedIndex = state.selectedIds.indexOf(characterId);
  if (selectedIndex >= 0) {
    state.selectedIds.splice(selectedIndex, 1);
  } else {
    const character = state.characterMap.get(characterId);
    if (!character || character.slot > TEAM_SLOT_LIMIT) return;
    while (selectedSlotTotal() + character.slot > TEAM_SLOT_LIMIT && state.selectedIds.length) {
      state.selectedIds.shift();
    }
    if (selectedSlotTotal() + character.slot > TEAM_SLOT_LIMIT) return;
    state.selectedIds.push(characterId);
  }
  renderSetup();
}

function startRandomBattle() {
  const randomTeam = buildSlotTeam(state.characters, TEAM_SLOT_LIMIT, true);
  if (!randomTeam.length) return;
  state.selectedIds = randomTeam.map((character) => character.character_id);
  renderSetup();
  startBattle();
}

async function showRankBattleConfirm(rankBattleId) {
  if (gameDataPromise) {
    await gameDataPromise;
  }

  if (isStoryRankBattleDisabled(rankBattleId)) return;

  state.story.pendingRankBattleId = rankBattleId;
  const opponentName = rankBattleDisplayName(rankBattleId);
  els.storyBattleConfirmText.textContent = `${opponentName}と対戦を開始しますか？`;
  els.storyBattleOpponentList.innerHTML = renderStoryOpponentCharacterNames(rankBattleId);
  els.storyBattleConfirmOverlay.classList.remove("is-hidden");
  els.storyBattleConfirmYesButton.focus({ preventScroll: true });
}

function hideRankBattleConfirm({ restoreFocus = false } = {}) {
  state.story.pendingRankBattleId = null;
  els.storyBattleConfirmOverlay?.classList.add("is-hidden");
  if (els.storyBattleOpponentList) {
    els.storyBattleOpponentList.innerHTML = "";
  }
  if (restoreFocus) {
    els.storyRankBattleF1Button?.focus({ preventScroll: true });
  }
}

async function confirmRankBattleStart() {
  const rankBattleId = state.story.pendingRankBattleId;
  if (!rankBattleId) return;
  hideRankBattleConfirm();
  await startRankBattle(rankBattleId);
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

function isStoryRankBattleDisabled(rankBattleId) {
  return state.story.disabledRankBattleIds.has(rankBattleId);
}

function updateStoryRankBattleButtons() {
  updateStoryRankBattleButton(els.storyRankBattleF1Button, "battle_f_1");
}

function updateStoryRankBattleButton(button, rankBattleId) {
  if (!button) return;
  const disabled = isStoryRankBattleDisabled(rankBattleId);
  button.disabled = disabled;
  button.classList.toggle("is-cleared", disabled);
  button.setAttribute("aria-disabled", `${disabled}`);
}

async function startRankBattle(rankBattleId) {
  if (gameDataPromise) {
    await gameDataPromise;
  }

  const enemyCharacterIds = rankBattleEnemyCharacterIds(rankBattleId);

  if (!enemyCharacterIds.length) return;

  if (selectedSlotTotal() <= 0 || selectedSlotTotal() > TEAM_SLOT_LIMIT) {
    loadSaveData();
    initializeSaveDataParty();
    renderSetup();
  }

  startBattle({ enemyCharacterIds, storyRankBattleId: rankBattleId });
}

function startBattle(options = {}) {
  if (selectedSlotTotal() <= 0 || selectedSlotTotal() > TEAM_SLOT_LIMIT) return;
  const currentBattleId = options.storyRankBattleId || null;
  const enemyPool = state.characters.filter(
    (character) => !state.selectedIds.includes(character.character_id),
  );
  const playerCharacters = state.selectedIds
    .map((id) => state.characterMap.get(id))
    .filter(Boolean);
  const enemyCharacters = Array.isArray(options.enemyCharacterIds)
    ? options.enemyCharacterIds
        .map((id) => state.characterMap.get(id))
        .filter(Boolean)
    : buildSlotTeam(enemyPool.length ? enemyPool : state.characters, TEAM_SLOT_LIMIT, true);

  if (!enemyCharacters.length) return;

  state.playerTeam = playerCharacters.map(createFighter);
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
  state.story.currentRankBattleId = currentBattleId;
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

function createFighter(character) {
  return {
    id: character.character_id,
    name: character.name,
    base: character,
    maxHp: character.hp,
    hp: character.hp,
    maxEnergy: 7,
    energy: START_ENERGY,
    fainted: false,
    statMods: createEmptyStatMods(),
    statuses: [],
    battleEffects: [],
    pendingMove: null,
    pendingSkill: null,
  };
}

function pendingSkillFor(fighter) {
  return fighter?.pendingSkill ?? fighter?.pendingMove ?? null;
}

function pendingSkillId(fighter) {
  const pendingSkill = pendingSkillFor(fighter);
  return pendingSkill?.skillId ?? pendingSkill?.moveId ?? "";
}

function setPendingSkill(fighter, pendingSkill) {
  if (!fighter) return;
  fighter.pendingSkill = pendingSkill;
  fighter.pendingMove = pendingSkill;
}

function clearPendingSkill(fighter) {
  if (!fighter) return;
  fighter.pendingSkill = null;
  fighter.pendingMove = null;
}

function createEmptyStatMods() {
  return STAT_MOD_KEYS.reduce((mods, stat) => {
    mods[stat] = 0;
    return mods;
  }, {});
}

function renderBattle() {
  const player = activePlayer();
  const enemy = activeEnemy();
  const exchangeVisible = state.gameOver && state.battleWinner === "player";
  const playerPendingMove = Boolean(pendingSkillFor(player));

  els.enemyHud.innerHTML = renderHud(enemy, state.enemyTeam, state.enemyActiveIndex, "相手", "enemy");
  els.playerHud.innerHTML = renderHud(player, state.playerTeam, state.playerActiveIndex, "自分", "player");
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
    state.commandMode !== "fight" || exchangeVisible,
  );
  els.switchGrid.classList.toggle(
    "is-hidden",
    state.commandMode !== "switch" || exchangeVisible,
  );
  els.enemyInfoPanel.classList.toggle(
    "is-hidden",
    state.commandMode !== "enemyInfo" || exchangeVisible,
  );
  els.exchangePanel.classList.toggle("is-hidden", !exchangeVisible);
  els.commandLights.innerHTML = renderCommandLights();
  els.battleStatusPanel.innerHTML = renderBattleStatusPanel(player, enemy);

  renderMoveGrid(player);
  renderSwitchGrid();
  renderEnemyInfoPanel(enemy);
  renderExchangePanel();
}

function renderHud(fighter, team, activeIndex, label, side) {
  const hpRate = fighter ? clamp(fighter.hp / fighter.maxHp, 0, 1) : 0;
  const hpText = fighter && side === "player" ? `${Math.max(0, fighter.hp)}/${fighter.maxHp}` : "";

  return `
    <div class="hud-row">
      <div class="hud-name">${escapeHtml(label)} ${fighter ? escapeHtml(fighter.name) : ""}</div>
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

function renderEnergySegments(fighter) {
  const maxEnergy = fighter?.maxEnergy ?? 7;
  const currentEnergy = fighter ? Math.floor(fighter.energy) : 0;
  return Array.from({ length: maxEnergy }, (_, index) => {
    const filled = index < currentEnergy;
    return `<span class="energy-segment ${filled ? "is-filled" : ""}"></span>`;
  }).join("");
}

function renderBattleStatusPanel(player, enemy) {
  const labels = [
    ...statusLabels(player).map((label) => `自:${label}`),
    ...statusLabels(enemy).map((label) => `相:${label}`),
  ];

  if (!labels.length) {
    return `<div class="battle-status-empty">状態効果なし</div>`;
  }

  return labels
    .slice(0, 4)
    .map((label) => `<div class="battle-status-line">${escapeHtml(label)}</div>`)
    .join("");
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
  const renderOffsetY = number(fighter.base.renderOffsetY);
  const imageStyle = renderOffsetY
    ? ` style="--sprite-render-offset-y: ${escapeHtml(renderOffsetY)}px;"`
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
  const owner = side === "player" ? "自分" : "相手";
  if (side === "enemy") {
    if (state.busy || state.gameOver || state.pendingSwitchSide) return;
    state.commandMode = "enemyInfo";
    renderBattle();
    return;
  }

  pushLog(
    `${owner}:${fighter.name} / EN ${fighter.energy} / 耐性 ${resistanceSummaryText(fighter.base)} / 状態 ${fighterStatusSummary(fighter)}`,
  );
}

function renderEnemyInfoPanel(enemy) {
  if (!els.enemyInfoPanel) return;
  if (!enemy) {
    els.enemyInfoPanel.innerHTML = "";
    return;
  }

  els.enemyInfoPanel.innerHTML = `
    <div class="battle-inspect-header">
      <div>
        <div class="detail-title">相手情報</div>
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

  els.enemyInfoPanel.querySelector(".battle-inspect-back").addEventListener("click", () => {
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
  els.moveGrid.innerHTML = movesForCharacter(fighter.base)
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

  for (const button of els.moveGrid.querySelectorAll(".move-button")) {
    button.addEventListener("click", () => playerChooseMove(button.dataset.moveId));
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
          <span class="switch-meta">体力 ${Math.max(0, member.hp)}/${member.maxHp} / ${energyBadge(member.energy)}</span>
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
  if (!(state.gameOver && state.battleWinner === "player")) {
    els.exchangePanel.innerHTML = "";
    return;
  }

  const isStoryRankBattle = Boolean(state.story.currentRankBattleId);
  if (isStoryRankBattle && state.exchange.storyDecision === "choice") {
    renderStoryVictoryExchangeChoice();
    return;
  }
  if (isStoryRankBattle && state.exchange.storyDecision === "confirmSkip") {
    renderStorySkipExchangeConfirm();
    return;
  }

  const selectedPlayerIndices = exchangePlayerIndices();
  const playerSlotTotal = exchangePlayerSlotTotal();
  const enemySlotNeed = exchangeEnemySlotNeed();
  const nextPlayerSlotTotal = exchangeNextPlayerSlotTotal();
  const hasPlayerOffer = selectedPlayerIndices.length > 0;
  const hasEnemyTarget = state.exchange.enemyIndex !== null;
  const playerButtons = state.playerTeam
    .map((member, index) => exchangeChoiceButton("player", member, index))
    .join("");
  const enemyButtons = state.enemyTeam
    .map((member, index) => exchangeChoiceButton("enemy", member, index))
    .join("");
  const canExchange =
    hasPlayerOffer &&
    hasEnemyTarget &&
    !state.exchange.completed &&
    isValidVictoryExchange();
  const invalidExchange =
    hasPlayerOffer &&
    hasEnemyTarget &&
    !state.exchange.completed &&
    !isValidVictoryExchange();
  const slotNote = exchangeSlotNote(playerSlotTotal, enemySlotNeed, nextPlayerSlotTotal, hasEnemyTarget);

  els.exchangePanel.innerHTML = `
    <div class="exchange-title">${state.exchange.completed ? "交換完了" : "勝利交換"}</div>
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
      <button class="primary-button exchange-action" type="button" data-result-action="exchange" ${canExchange ? "" : "disabled"}>交換する</button>
      <button class="small-button exchange-action" type="button" data-result-action="rematch">このチームで再戦</button>
    </div>
    ${invalidExchange ? `<div class="command-note">${escapeHtml(slotNote)}</div>` : slotNote ? `<div class="command-note">${escapeHtml(slotNote)}</div>` : ""}
  `;

  if (isStoryRankBattle) {
    els.exchangePanel.querySelector('[data-result-action="rematch"]')?.remove();
  }

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
      }
    });
  }
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
  if (!exchangePlayerIndices().length || state.exchange.enemyIndex === null) {
    return exchangeCurrentPlayerSlotTotal();
  }
  return exchangeCurrentPlayerSlotTotal() - exchangePlayerSlotTotal() + exchangeEnemySlotNeed();
}

function exchangeSlotNote(playerSlotTotal, enemySlotNeed, nextPlayerSlotTotal, hasEnemyTarget) {
  if (state.exchange.completed || !hasEnemyTarget) return "";
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
    !exchangePlayerIndices().length ||
    state.exchange.enemyIndex === null ||
    !isValidVictoryExchange()
  ) {
    return;
  }

  const playerMembers = exchangePlayerMembers();
  const enemyMember = state.enemyTeam[state.exchange.enemyIndex];
  if (!playerMembers.length || !enemyMember) return;

  const offeredIndexSet = new Set(exchangePlayerIndices());
  state.playerTeam = [
    ...state.playerTeam.filter((_, index) => !offeredIndexSet.has(index)),
    createFighter(enemyMember.base),
  ];
  state.enemyTeam = [
    ...state.enemyTeam.filter((_, index) => index !== state.exchange.enemyIndex),
    ...playerMembers.map((member) => createFighter(member.base)),
  ];
  state.playerActiveIndex = Math.min(state.playerActiveIndex, Math.max(0, state.playerTeam.length - 1));
  state.enemyActiveIndex = Math.min(state.enemyActiveIndex, Math.max(0, state.enemyTeam.length - 1));
  state.selectedIds = state.playerTeam.map((member) => member.id);
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

  const pendingSkill = pendingSkillFor(actor);
  const selectedMoveId = pendingSkill?.skillId || pendingSkill?.moveId || action.moveId;
  const move = moveForFighter(actor, selectedMoveId);
  const completingTwoTurnMove = Boolean(pendingSkill && selectedMoveId === move?.skill_id);
  if (!move || (!completingTwoTurnMove && actor.energy < move.cost)) return;
  const positionBeforeAction = positionEffectId(actor);

  const targetSide = pendingSkill?.targetSide ?? (action.side === "player" ? "enemy" : "player");
  const target = move.target === "self" ? actor : activeBySide(targetSide);
  if (!target || target.fainted) return;

  const blockText = blockedByControl(actor);
  if (blockText) {
    pushLog(blockText);
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
    const startedBattleEffect = twoTurnEffectId
      ? startTwoTurnMove(actor, move, twoTurnEffectId, pendingTargetSide)
      : null;
    if (startedBattleEffect) {
      renderBattle();
      await playBattleEffectAnimation(startedBattleEffect, action.side);
      await pause(500);
      return;
    }
  }

  const delayedAttackSetup = hasDelayedAttackBattleEffect(move);
  const animationSide = move.target === "self" ? action.side : targetSide;
  if (!delayedAttackSetup) {
    await playSkillAnimation(move, animationSide);
  }

  if (move.category === "attack" && !delayedAttackSetup) {
    const result = dealDamage(actor, target, move);
    if (result.damage > 0) {
      flashSprite(targetSide);
      pushLog(`${target.name}に ${result.damage} ダメージ！${result.effectText}`);
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
      applySkillEffects(move, actor, target);
      await pause(300);
    }
  } else {
    applySkillEffects(move, actor, target);
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
    const appliedBattleEffects = applyBattleEffects(move, actor, target, returnedPosition ? new Set([returnedPosition]) : null);
    await playBattleEffectAnimations(appliedBattleEffects, action.side);
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

  const moves = movesForCharacter(enemy.base).filter((move) => move.cost <= enemy.energy);
  const attacks = moves.filter((move) => move.category === "attack");
  const candidates = attacks.length ? attacks : moves;
  const picked = candidates[Math.floor(Math.random() * candidates.length)] ?? state.skills.get("basic_strike");
  return { side: "enemy", type: "move", moveId: picked.skill_id };
}

function dealDamage(attacker, target, move) {
  const hitCheck = canHitTarget(target, move);
  if (!hitCheck.canHit) {
    return {
      damage: 0,
      effectText: ` ${hitCheck.reason}`,
      revengeDamage: 0,
    };
  }

  const physical = move.attack_type !== "special";
  const attackStat = effectiveStat(attacker, physical ? "phy_atk" : "sp_atk");
  const defenseStat = effectiveStat(target, physical ? "phy_def" : "sp_def");
  const ratio = attackStat / Math.max(45, defenseStat + 60);
  const elementMultiplier = weaknessMultiplier(target, move.element);
  const sameElementBonus =
    move.element !== "none" && move.element === attacker.base.element ? 1.15 : 1;
  const variance = 0.9 + Math.random() * 0.15;
  let damage = (move.power * 1.45 + attackStat * 0.48) * ratio;
  let effectText = effectivenessText(elementMultiplier);

  damage *= elementMultiplier * sameElementBonus * variance;
  damage = applyIncomingBattleEffects(target, damage, move);
  damage = Math.max(1, Math.round(damage));

  const endure = target.battleEffects.find((effect) => effect.id === "endure");
  if (endure && target.hp - damage <= 0) {
    target.hp = 1;
    removeBattleEffect(target, "endure");
    effectText += " こらえた！";
  } else {
    target.hp = Math.max(0, target.hp - damage);
  }

  const revenge = target.battleEffects.find((effect) => effect.id === "revenge");
  const revengeDamage =
    revenge && damage > 0 ? Math.max(1, Math.round(damage * ((revenge.damage_value || 50) / 100))) : 0;
  if (revenge) removeBattleEffect(target, "revenge");

  return { damage, effectText, revengeDamage };
}

function applyIncomingBattleEffects(target, damage, move) {
  let adjusted = damage;
  const protect = target.battleEffects.find((effect) => effect.id === "protect");
  if (protect) {
    const cutRate = move.hit_type === "guard_break" ? (protect.damage_cut || 50) / 200 : (protect.damage_cut || 50) / 100;
    adjusted *= 1 - cutRate;
  }

  const position = target.battleEffects.find((effect) => POSITION_EFFECT_IDS.includes(effect.id));
  if (position) {
    adjusted *= 0.75;
  }

  return adjusted;
}

function canHitTarget(target, move) {
  const position = target.battleEffects.find((effect) => POSITION_EFFECT_IDS.includes(effect.id));
  if (!position || move.hit_type === "sure_hit") {
    return { canHit: true, reason: "" };
  }

  const requiredHitType = {
    fly: "anti_air",
    underground: "ground_wave",
    underwater: "water_wave",
    ghost_phase: "sure_hit",
  }[position.id];

  if (move.hit_type === requiredHitType) {
    return { canHit: true, reason: "" };
  }

  return { canHit: false, reason: `${target.name}に届かなかった！` };
}

function applySkillEffects(move, actor, target) {
  const pairs = [
    [move.effect1, move.effect_chance1],
    [move.effect2, move.effect_chance2],
  ];

  for (const [effectId, chance] of pairs) {
    if (!effectId || effectId === "none" || chance <= 0) continue;
    if (Math.random() * 100 <= chance) {
      applyEffect(effectId, actor, target);
    }
  }
}

function applyEffect(effectId, actor, target) {
  if (effectId === "def_down") {
    applyEffect("phy_def_down", actor, target);
    applyEffect("sp_def_down", actor, target);
    return;
  }

  const effect = state.effects.get(effectId);
  if (!effect) return;

  if (effect.effect_group === "buff" || effect.effect_group === "debuff") {
    const stat = effect.target_stat;
    if (!target.statMods[stat] && target.statMods[stat] !== 0) return;
    const amount = effect.effect_group === "buff" ? effect.damage_value : -effect.damage_value;
    const before = target.statMods[stat];
    const stageLimit = Math.max(0, Math.abs(effect.damage_value) * 4);
    target.statMods[stat] = clamp(target.statMods[stat] + amount, -stageLimit, stageLimit);
    if (target.statMods[stat] !== before) {
      pushLog(`${target.name}の${STAT_LABELS[stat]}が${amount > 0 ? "上がった" : "下がった"}！`);
    }
    return;
  }

  const current = target.statuses.find((status) => status.id === effect.effect_id);
  if (current) {
    current.turns = Math.max(current.turns, effect.turn);
  } else {
    target.statuses.push({
      id: effect.effect_id,
      name: effect.name,
      group: effect.effect_group,
      damageType: effect.damage_type,
      damageValue: effect.damage_value,
      turns: effect.turn,
    });
  }
  pushLog(`${target.name}は${effect.name}になった！`);
}

function twoTurnBattleEffectId(move) {
  return [
    [move.battle_effect1, move.battle_effect_chance1],
    [move.battle_effect2, move.battle_effect_chance2],
  ].find(([effectId, chance]) => (
    TWO_TURN_BATTLE_EFFECT_IDS.has(effectId) && chance > 0
  ))?.[0] ?? "";
}

function startTwoTurnMove(actor, move, effectId, targetSide) {
  const battleEffect = state.battleEffects.get(effectId);
  if (!battleEffect) return null;

  setPendingSkill(actor, {
    skillId: move.skill_id,
    moveId: move.skill_id,
    effectId,
    target: move.target,
    targetSide,
    startedTurn: state.turn,
  });
  addBattleEffect(actor, battleEffect);
  pushLog(battleEffectStartText(actor, battleEffect));
  return battleEffect;
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

function applyBattleEffects(move, actor, target, skipEffectIds = null) {
  const appliedBattleEffects = [];
  const pairs = [
    [move.battle_effect1, move.battle_effect_chance1],
    [move.battle_effect2, move.battle_effect_chance2],
  ];

  for (const [battleEffectId, chance] of pairs) {
    if (!battleEffectId || battleEffectId === "none" || chance <= 0) continue;
    if (skipEffectIds?.has(battleEffectId)) continue;
    if (Math.random() * 100 > chance) continue;

    if (battleEffectId === "charge_attack") {
      actor.statMods.phy_atk = clamp(actor.statMods.phy_atk + 10, -100, 100);
      pushLog(`${actor.name}は勢いづいた！`);
      const battleEffect = state.battleEffects.get(battleEffectId);
      if (battleEffect) {
        appliedBattleEffects.push(battleEffect);
      }
      continue;
    }

    const battleEffect = state.battleEffects.get(battleEffectId);
    if (!battleEffect) continue;

    const recipient = battleEffect.battle_effect_group === "delayed_attack" ? target : actor;
    if (!recipient) continue;
    addBattleEffect(
      recipient,
      battleEffect,
      battleEffect.battle_effect_group === "delayed_attack"
        ? delayedBattleEffectPayload(move, actor, battleEffect)
        : {},
    );
    pushLog(battleEffectStartText(actor, battleEffect, recipient));
    appliedBattleEffects.push(battleEffect);
  }
  return appliedBattleEffects;
}

function hasDelayedAttackBattleEffect(move) {
  return [
    [move.battle_effect1, move.battle_effect_chance1],
    [move.battle_effect2, move.battle_effect_chance2],
  ].some(([effectId, chance]) => (
    chance > 0 && state.battleEffects.get(effectId)?.battle_effect_group === "delayed_attack"
  ));
}

function delayedBattleEffectPayload(move, actor, battleEffect) {
  const fixedPower = battleEffect.damage_type === "fixed_power" ? battleEffect.damage_value : 0;
  const ratePower =
    battleEffect.damage_type === "skill_power_rate"
      ? Math.round(move.power * ((battleEffect.damage_value || 100) / 100))
      : 0;
  const delayedPower = Math.max(1, fixedPower || ratePower || move.power);
  return {
    delayedMove: {
      name: move.name,
      power: delayedPower,
      element: safeText(move.element, "none"),
      attack_type: safeText(move.attack_type, "special"),
      hit_type: safeText(move.hit_type, "sure_hit"),
      animation_id: safeText(move.animation_id),
      animation_duration_ms: Math.max(0, number(move.animation_duration_ms)),
      repeat_count: Math.max(0, number(move.repeat_count)),
    },
    source: {
      name: actor.name,
      element: actor.base.element,
      phy_atk: effectiveStat(actor, "phy_atk"),
      sp_atk: effectiveStat(actor, "sp_atk"),
    },
  };
}

function battleEffectStartText(actor, battleEffect, recipient = actor) {
  if (battleEffect.battle_effect_id === "future_blast") {
    return "周囲に粉塵が舞う！";
  }

  if (battleEffect.battle_effect_group === "delayed_attack" && recipient !== actor) {
    return `${actor.name}は${recipient.name}に${battleEffect.name}を仕掛けた！`;
  }

  if (battleEffect.battle_effect_id === "protect") {
    return `${actor.name}は防御態勢をとっている！`;
  }

  const positionMessages = {
    fly: "上空に飛び上がった",
    underground: "地中に潜った",
    underwater: "水中に潜った",
    ghost_phase: "姿を消した",
  };
  const message = positionMessages[battleEffect.battle_effect_id];
  return message
    ? `${actor.name}は${message}！`
    : `${actor.name}は${battleEffect.name}の構え！`;
}

function addBattleEffect(fighter, battleEffect, extra = {}) {
  const current = fighter.battleEffects.find(
    (effect) => effect.id === battleEffect.battle_effect_id,
  );
  const next = {
    id: battleEffect.battle_effect_id,
    name: battleEffect.name,
    group: battleEffect.battle_effect_group,
    turns: battleEffect.turn,
    createdTurn: state.turn,
    damage_value: battleEffect.damage_value,
    damage_cut: battleEffect.damage_cut,
    animation: battleEffect.animation,
    animation_duration_ms: battleEffect.animation_duration_ms,
    ...extra,
  };

  if (current) {
    Object.assign(current, next);
  } else {
    fighter.battleEffects.push(next);
  }
}

function removeBattleEffect(fighter, id) {
  fighter.battleEffects = fighter.battleEffects.filter((effect) => effect.id !== id);
}

async function resolveDelayedBattleEffects() {
  for (const side of ["player", "enemy"]) {
    const target = activeBySide(side);
    if (!target || target.fainted) continue;

    const delayedEffects = target.battleEffects.filter(
      (effect) => effect.group === "delayed_attack" && delayedBattleEffectReady(effect),
    );
    for (const effect of delayedEffects) {
      removeBattleEffect(target, effect.id);
      const attacker = delayedEffectAttacker(effect, side);
      const move = delayedEffectMove(effect);
      if (!attacker || !move) continue;

      pushLog(`${target.name}に${effect.name}が炸裂した！`);
      await pause(420);
      await playSkillAnimation(move, side);
      const result = dealDamage(attacker, target, move);
      if (result.damage > 0) {
        flashSprite(side);
        pushLog(`${target.name}に ${result.damage} ダメージ！${result.effectText}`);
      } else {
        pushLog(result.effectText.trim());
      }
      await pause(520);
      await handleFaint(side);
      if (state.gameOver || state.pendingSwitchSide) return;
    }
  }
}

function delayedBattleEffectReady(effect) {
  const delayTurns = Math.max(1, number(effect.turns, 1));
  return state.turn - effect.createdTurn >= delayTurns;
}

function delayedEffectMove(effect) {
  if (!effect.delayedMove) return null;
  return {
    skill_id: effect.id,
    name: effect.delayedMove.name || effect.name,
    category: "attack",
    power: Math.max(1, number(effect.delayedMove.power, 1)),
    element: safeText(effect.delayedMove.element, "none"),
    attack_type: safeText(effect.delayedMove.attack_type, "special"),
    hit_type: safeText(effect.delayedMove.hit_type, "sure_hit"),
    animation_id: safeText(effect.delayedMove.animation_id),
    animation_duration_ms: Math.max(0, number(effect.delayedMove.animation_duration_ms)),
    repeat_count: Math.max(0, number(effect.delayedMove.repeat_count)),
    target: "enemy",
  };
}

function delayedEffectAttacker(effect, targetSide) {
  const source = effect.source;
  if (source) {
    return {
      name: source.name || effect.name,
      base: {
        element: safeText(source.element, "none"),
        phy_atk: Math.max(1, number(source.phy_atk, 1)),
        sp_atk: Math.max(1, number(source.sp_atk, 1)),
      },
      statMods: createEmptyStatMods(),
    };
  }

  const sourceSide = targetSide === "player" ? "enemy" : "player";
  return activeBySide(sourceSide);
}

function blockedByControl(fighter) {
  const sleep = fighter.statuses.find((status) => status.id === "sleep");
  if (sleep) return `${fighter.name}は眠っている。`;

  const paralysis = fighter.statuses.find((status) => status.id === "paralysis");
  if (paralysis && Math.random() < 0.35) {
    return `${fighter.name}はしびれて動けない！`;
  }

  return "";
}

async function endRound() {
  for (const side of ["player", "enemy"]) {
    const fighter = activeBySide(side);
    if (!fighter || fighter.fainted) continue;

    for (const status of [...fighter.statuses]) {
      if (status.group === "damage" && status.damageType === "percent_maxhp") {
        const damage = Math.max(1, Math.round(fighter.maxHp * (status.damageValue / 100)));
        fighter.hp = Math.max(0, fighter.hp - damage);
        pushLog(`${fighter.name}は${status.name}で ${damage} ダメージ。`);
        await pause(420);
      }
      status.turns -= 1;
    }

    fighter.statuses = fighter.statuses.filter((status) => status.turns > 0);
    await handleFaint(side);
    if (state.gameOver || state.pendingSwitchSide) return;

    const regenValue = Math.max(0, fighter.base.regen_value || 0);
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
    const fighter = activeBySide(side);
    if (!fighter || fighter.fainted) continue;
    fighter.energy = clamp(fighter.energy + fighter.base.energy_charge, 0, fighter.maxEnergy);
    fighter.battleEffects = tickBattleEffectsAfterRound(fighter.battleEffects);
  }
}

function tickBattleEffectsAfterRound(battleEffects) {
  return battleEffects
    .map((effect) => {
      if (
        effect.group === "position" ||
        effect.group === "charge" ||
        effect.group === "delayed_attack"
      ) {
        return effect;
      }
      return { ...effect, turns: effect.turns - 1 };
    })
    .filter((effect) => (
      effect.group === "position" ||
      effect.group === "charge" ||
      effect.group === "delayed_attack" ||
      effect.turns > 0
    ));
}

async function handleFaint(side) {
  const fighter = activeBySide(side);
  if (!fighter || fighter.fainted || fighter.hp > 0) return;

  fighter.hp = 0;
  fighter.fainted = true;
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

function finishBattle(winner) {
  state.gameOver = true;
  state.pendingSwitchSide = null;
  state.battleWinner = winner;
  state.battleAnimation = null;
  state.commandMode = winner === "player" ? "exchange" : "fight";
  state.exchange = createExchangeState();
  if (winner === "player" && state.story.currentRankBattleId) {
    state.exchange.storyDecision = "choice";
  }
  pushLog(winner === "player" ? "勝負に勝った！" : "目の前が真っ暗になった...");
}

function finalizeStoryBattleVictory(rankBattleId) {
  const currentBattleId = safeText(rankBattleId);
  if (!currentBattleId) return;
  const alreadyCleared = state.story.clearedRankBattleIds.has(currentBattleId);
  if (!alreadyCleared) {
    state.saveData.money += rankBattleRewardMoney(currentBattleId);
  }
  state.story.clearedRankBattleIds.add(currentBattleId);
  state.story.disabledRankBattleIds.add(currentBattleId);
  state.story.currentRankBattleId = null;
  state.story.pendingRankBattleId = null;
  state.gameOver = true;
  state.pendingSwitchSide = null;
  state.battleWinner = null;
  state.battleAnimation = null;
  state.exchange = createExchangeState();
  state.commandMode = "fight";
  saveGameData();
  hideRankBattleConfirm();
  updateStoryRankBattleButtons();
  els.titleView.classList.add("is-hidden");
  els.setupView.classList.add("is-hidden");
  els.battleView.classList.add("is-hidden");
  els.storyView.classList.remove("is-hidden");
  els.storyBackButton.focus({ preventScroll: true });
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
  fighter.battleEffects = [];
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

function teamBySide(side) {
  return side === "player" ? state.playerTeam : state.enemyTeam;
}

function effectiveStat(fighter, stat) {
  return Math.max(1, Math.round(fighter.base[stat] * (1 + (fighter.statMods[stat] || 0) / 100)));
}

function weaknessMultiplier(target, element) {
  if (!element || element === "none") return 1;
  return target.base.weaknesses[element] ?? 1;
}

function effectivenessText(multiplier) {
  if (multiplier >= 1.25) return " 効果はばつぐんだ！";
  if (multiplier <= 0.75) return " 効果はいまひとつ。";
  return "";
}

function statusLabels(fighter) {
  return fighterStatusEntries(fighter).map((entry) => entry.label).slice(0, 5);
}

function pushLog(message) {
  state.log.push(message);
  if (state.log.length > 12) state.log = state.log.slice(-12);
  showBattleMessage(message);
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
  if (effectId.endsWith("_up")) return "effect-up";
  if (effectId.endsWith("_down") || effectId === "def_down") return "effect-down";
  return "effect-other";
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

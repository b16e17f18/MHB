const DATA_PATHS = {
  characters: "./data/character.csv",
  skills: "./data/skill.csv",
  battleEffects: "./data/battle_effect.csv",
  effects: "./data/effect.csv",
  hitTypes: "./data/hit_type.csv",
  animations: "./data/animation.csv",
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
const DEFAULT_POSITION_ANIMATIONS = {
  fly: {
    position_class: "position-fly",
    animation_name: "mhbFlyAway",
    animation_duration_ms: 520,
    surface_color: "",
  },
  underground: {
    position_class: "position-underground",
    animation_name: "mhbDiveGround",
    animation_duration_ms: 520,
    surface_color: "#caa45e",
  },
  underwater: {
    position_class: "position-underwater",
    animation_name: "mhbDiveWater",
    animation_duration_ms: 520,
    surface_color: "#2aa7ff",
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
const TEAM_SLOT_LIMIT = 5;
const START_ENERGY = 1;
const STAT_GRAPH_MAX = {
  hp: 999,
  phy_atk: 500,
  phy_def: 500,
  sp_atk: 500,
  sp_def: 500,
  speed: 500,
  regen_value: 500,
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
};

const els = {};
let battleMessageTimer = null;

function createExchangeState() {
  return {
    playerIndices: [],
    enemyIndex: null,
    completed: false,
  };
}

document.addEventListener("DOMContentLoaded", () => {
  Object.assign(els, {
    setupView: document.querySelector("#setupView"),
    battleView: document.querySelector("#battleView"),
    selectedSlots: document.querySelector("#selectedSlots"),
    rosterGrid: document.querySelector("#rosterGrid"),
    randomTeamButton: document.querySelector("#randomTeamButton"),
    clearTeamButton: document.querySelector("#clearTeamButton"),
    startButton: document.querySelector("#startButton"),
    enemyHud: document.querySelector("#enemyHud"),
    playerHud: document.querySelector("#playerHud"),
    enemySprite: document.querySelector("#enemySprite"),
    playerSprite: document.querySelector("#playerSprite"),
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
    exchangePanel: document.querySelector("#exchangePanel"),
    detailOverlay: document.querySelector("#detailOverlay"),
    detailPanel: document.querySelector("#detailPanel"),
    dexOverlay: document.querySelector("#dexOverlay"),
    dexPanel: document.querySelector("#dexPanel"),
  });

  bindEvents();
  loadGameData();
});

function bindEvents() {
  els.randomTeamButton.addEventListener("click", () => {
    state.selectedIds = buildSlotTeam(state.characters, TEAM_SLOT_LIMIT, true).map((character) => character.character_id);
    renderSetup();
  });

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

function returnToSetup() {
  els.battleView.classList.add("is-hidden");
  els.setupView.classList.remove("is-hidden");
  state.commandMode = "fight";
  state.busy = false;
  state.gameOver = false;
  state.pendingSwitchSide = null;
  state.battleWinner = null;
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
    const [characterText, skillText, battleEffectText, effectText, hitTypeText, animationText] = await Promise.all([
      loadCsvText("characters", DATA_PATHS.characters),
      loadCsvText("skills", DATA_PATHS.skills),
      loadCsvText("battleEffects", DATA_PATHS.battleEffects),
      loadCsvText("effects", DATA_PATHS.effects),
      loadCsvText("hitTypes", DATA_PATHS.hitTypes),
      loadCsvText("animations", DATA_PATHS.animations),
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

    state.animations.clear();
    for (const animation of rowsFromCsv(animationText).map(normalizeAnimation)) {
      if (animation.battle_effect_id && animation.position_class && animation.animation_name) {
        state.animations.set(animation.battle_effect_id, animation);
      }
    }
    applyAnimationConfig();

    state.selectedIds = buildSlotTeam(state.characters).map((character) => character.character_id);
    renderSetup();
  } catch (error) {
    els.rosterGrid.innerHTML = `<div class="selected-slot is-filled">CSVを読み込めませんでした。</div>`;
    console.error(error);
  }
}

async function loadCsvText(key, path) {
  try {
    const cacheBustedPath = `${path}${path.includes("?") ? "&" : "?"}v=${Date.now()}`;
    const response = await fetch(cacheBustedPath, { cache: "no-store" });
    if (response.ok) return response.text();
  } catch {
    // File URLs and some preview panes block fetch; the inline CSV keeps the app playable.
  }

  if (window.MHB_CSV?.[key]) {
    return window.MHB_CSV[key];
  }

  throw new Error(`CSV load failed: ${key}`);
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
  const battleEffectId = safeText(row.battle_effect_id);
  const fallback = DEFAULT_POSITION_ANIMATIONS[battleEffectId] ?? {};
  return {
    battle_effect_id: battleEffectId,
    position_class: cssToken(row.position_class, fallback.position_class ?? `position-${battleEffectId}`),
    animation_name: cssToken(row.animation_name, fallback.animation_name ?? ""),
    animation_duration_ms: Math.max(1, number(row.animation_duration_ms, fallback.animation_duration_ms ?? 520)),
    surface_color: safeText(row.surface_color, fallback.surface_color ?? ""),
  };
}

function applyAnimationConfig() {
  const ids = [...state.animations.keys()];
  POSITION_EFFECT_IDS = ids.length ? ids : Object.keys(DEFAULT_POSITION_ANIMATIONS);
  TWO_TURN_BATTLE_EFFECT_IDS = new Set([...POSITION_EFFECT_IDS, "charge_attack"]);
}

function characterImagePath(characterId, imageName = "") {
  const fileName = safeText(imageName, characterId ? `${characterId}.png` : "");
  return fileName ? `./assets/character_image_transparent/${fileName}` : "";
}

function safeText(value, fallback = "") {
  const text = `${value ?? ""}`.trim();
  return text || fallback;
}

function csvText(value) {
  return `${value ?? ""}`;
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
  els.startButton.disabled = selectedSlotTotal() !== TEAM_SLOT_LIMIT;
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
          <div class="dex-data-row"><span>charge</span><strong>${energyBadge(character.energy_charge)}</strong></div>
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
      </div>
      <div class="detail-skills">
        <div class="detail-section-title">技</div>
        ${movesForCharacter(character)
          .map((move) => renderSkillDetail(move))
          .join("")}
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
            <div class="dex-data-row"><span>スロット</span><strong>${escapeHtml(slotMarks(character.slot))}</strong></div>
            <div class="dex-data-row"><span>EN回復</span><strong>${escapeHtml(character.energy_charge)}</strong></div>
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
  return "〇".repeat(count);
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

function startBattle() {
  if (selectedSlotTotal() !== TEAM_SLOT_LIMIT) return;
  const enemyPool = state.characters.filter(
    (character) => !state.selectedIds.includes(character.character_id),
  );
  const playerCharacters = state.selectedIds
    .map((id) => state.characterMap.get(id))
    .filter(Boolean);
  const enemyCharacters = buildSlotTeam(enemyPool.length ? enemyPool : state.characters, TEAM_SLOT_LIMIT, true);

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
  state.exchange = createExchangeState();
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
  };
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
  const playerPendingMove = Boolean(player?.pendingMove);

  els.enemyHud.innerHTML = renderHud(enemy, state.enemyTeam, state.enemyActiveIndex, "相手", "enemy");
  els.playerHud.innerHTML = renderHud(player, state.playerTeam, state.playerActiveIndex, "自分", "player");
  els.enemySprite.innerHTML = renderSprite(enemy, "enemy", state.enemyActiveIndex);
  els.playerSprite.innerHTML = renderSprite(player, "player", state.playerActiveIndex);
  applyPositionEffectClass(els.enemySprite, enemy);
  applyPositionEffectClass(els.playerSprite, player);
  bindSpriteStatusClicks();
  renderBattleMessage();

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
  els.exchangePanel.classList.toggle("is-hidden", !exchangeVisible);
  els.commandLights.innerHTML = renderCommandLights();
  els.battleStatusPanel.innerHTML = renderBattleStatusPanel(player, enemy);

  renderMoveGrid(player);
  renderSwitchGrid();
  renderExchangePanel();
}

function renderHud(fighter, team, activeIndex, label, side) {
  const hpRate = fighter ? clamp(fighter.hp / fighter.maxHp, 0, 1) : 0;
  const hpText = fighter && side === "player" ? `${Math.max(0, fighter.hp)}/${fighter.maxHp}` : "";
  const energyText = fighter ? `${fighter.energy}/${fighter.maxEnergy}` : "";

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
      <span class="hud-value energy-value">${escapeHtml(energyText)}</span>
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
  return `
    <div class="sprite-image-wrap ${slotClass} ${teamSlotClass}" data-fighter-side="${escapeHtml(side)}" role="button" tabindex="0" aria-label="${escapeHtml(fighter.name)}の状態">
      <img class="sprite-image ${side === "enemy" ? "is-enemy" : ""}" src="${escapeHtml(fighter.base.imageSrc)}" alt="${escapeHtml(fighter.name)}" />
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
  pushLog(
    `${owner}:${fighter.name} 体力 ${Math.max(0, fighter.hp)}/${fighter.maxHp} / EN ${fighter.energy} / 弱点 ${weaknessSummaryText(fighter.base)} / 状態 ${fighterStatusSummary(fighter)}`,
  );
}

function renderBattleMessage() {
  const messageVisible = state.battleMessage.visible && state.battleMessage.text;
  els.battleLog.classList.toggle("is-visible", Boolean(messageVisible));
  els.battleLog.innerHTML = messageVisible
    ? `<div class="log-line">${escapeHtml(state.battleMessage.text)}</div>`
    : "";
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

  const pendingMoveId = fighter.pendingMove?.moveId ?? "";
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
  const activePendingMove = Boolean(activePlayer()?.pendingMove);
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

  const selectedPlayerIndices = exchangePlayerIndices();
  const playerSlotTotal = exchangePlayerSlotTotal();
  const enemySlotNeed = exchangeEnemySlotNeed();
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
  const slotNote = exchangeSlotNote(playerSlotTotal, enemySlotNeed, hasEnemyTarget);

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

function exchangeChoiceButton(side, member, index) {
  const selected =
    side === "player"
      ? exchangePlayerIndices().includes(index)
      : state.exchange.enemyIndex === index;
  const slotText = slotMarks(member.base.slot);
  return `
    <button class="exchange-choice ${selected ? "is-selected" : ""}" type="button" data-exchange-side="${side}" data-exchange-index="${index}" ${state.exchange.completed ? "disabled" : ""}>
      <span class="switch-name">${escapeHtml(member.name)}</span>
      <span class="switch-meta">スロット ${escapeHtml(slotText)} / 体力 ${Math.max(0, member.hp)}/${member.maxHp}</span>
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
  const pendingMoveId = fighter?.pendingMove?.moveId;
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

  switchActive("player", index);
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

function exchangeSlotNote(playerSlotTotal, enemySlotNeed, hasEnemyTarget) {
  if (state.exchange.completed || !hasEnemyTarget) return "";
  if (playerSlotTotal === 0) {
    return `相手のスロット ${slotMarks(enemySlotNeed)} に合わせて、自分のモンスターを選んでください。`;
  }
  if (playerSlotTotal < enemySlotNeed) {
    return `差し出すスロットが足りません。${slotMarks(playerSlotTotal)}/${slotMarks(enemySlotNeed)}`;
  }
  if (playerSlotTotal > enemySlotNeed) {
    return `差し出すスロットが多すぎます。${slotMarks(playerSlotTotal)}/${slotMarks(enemySlotNeed)}`;
  }
  return `スロット一致 ${slotMarks(playerSlotTotal)}`;
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

  return exchangePlayerSlotTotal() === Math.max(1, enemyMember.base.slot || 1);
}

async function resolveTurn(playerAction) {
  state.busy = true;
  renderBattle();

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

  const pendingMove = actor.pendingMove;
  const selectedMoveId = pendingMove?.moveId || action.moveId;
  const move = moveForFighter(actor, selectedMoveId);
  const completingTwoTurnMove = Boolean(pendingMove && pendingMove.moveId === move?.skill_id);
  if (!move || (!completingTwoTurnMove && actor.energy < move.cost)) return;
  const positionBeforeAction = positionEffectId(actor);

  const targetSide = action.side === "player" ? "enemy" : "player";
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
    if (twoTurnEffectId && startTwoTurnMove(actor, move, twoTurnEffectId)) {
      renderBattle();
      await pause(500);
      return;
    }
  }

  if (move.category === "attack") {
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
    applyBattleEffects(move, actor, returnedPosition ? new Set([returnedPosition]) : null);
  }
  await pause(280);
}

function chooseEnemyAction() {
  const enemy = activeEnemy();
  if (enemy?.pendingMove) {
    return { side: "enemy", type: "move", moveId: enemy.pendingMove.moveId };
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

function startTwoTurnMove(actor, move, effectId) {
  const battleEffect = state.battleEffects.get(effectId);
  if (!battleEffect) return false;

  actor.pendingMove = {
    moveId: move.skill_id,
    effectId,
    startedTurn: state.turn,
  };
  addBattleEffect(actor, battleEffect);
  pushLog(`${actor.name}は${battleEffect.name}の構え！`);
  return true;
}

function finishTwoTurnMove(actor) {
  const pendingMove = actor.pendingMove;
  if (!pendingMove) return "";

  actor.pendingMove = null;
  if (pendingMove.effectId) {
    removeBattleEffect(actor, pendingMove.effectId);
  }
  return pendingMove.effectId || "";
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

function applyBattleEffects(move, actor, skipEffectIds = null) {
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
      continue;
    }

    const battleEffect = state.battleEffects.get(battleEffectId);
    if (!battleEffect) continue;

    addBattleEffect(actor, battleEffect);
    pushLog(`${actor.name}は${battleEffect.name}の構え！`);
  }
}

function addBattleEffect(fighter, battleEffect) {
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

  for (const team of [state.playerTeam, state.enemyTeam]) {
    for (const fighter of team) {
      if (fighter.fainted) continue;
      fighter.energy = clamp(fighter.energy + fighter.base.energy_charge, 0, fighter.maxEnergy);
      fighter.battleEffects = fighter.battleEffects
        .map((effect) => (
          effect.createdTurn === state.turn ? effect : { ...effect, turns: effect.turns - 1 }
        ))
        .filter((effect) => effect.turns > 0);
    }
  }
}

async function handleFaint(side) {
  const fighter = activeBySide(side);
  if (!fighter || fighter.fainted || fighter.hp > 0) return;

  fighter.hp = 0;
  fighter.fainted = true;
  fighter.pendingMove = null;
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

  switchActive(side, nextIndex);
  pushLog(`${activeBySide(side).name}が場に出た！`);
  await pause(520);
}

function finishBattle(winner) {
  state.gameOver = true;
  state.pendingSwitchSide = null;
  state.battleWinner = winner;
  state.commandMode = winner === "player" ? "exchange" : "fight";
  state.exchange = createExchangeState();
  pushLog(winner === "player" ? "勝負に勝った！" : "目の前が真っ暗になった...");
}

function switchActive(side, index) {
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
  if (fighter && !fighter.fainted) {
    fighter.energy = START_ENERGY;
  }
}

function clearSwitchVolatileState(fighter) {
  fighter.pendingMove = null;
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
  const sprite = side === "player" ? els.playerSprite : els.enemySprite;
  sprite.classList.remove("screen-flash");
  window.requestAnimationFrame(() => sprite.classList.add("screen-flash"));
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

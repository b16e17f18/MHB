const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const appPath = path.join(__dirname, "..", "app.js");
const appSource = fs.readFileSync(appPath, "utf8");

function loadMoveUi() {
  const context = vm.createContext({
    console,
    document: { addEventListener() {} },
    ELEMENT_TYPES: ["fire", "water", "ice", "dragon", "thunder", "none"],
    moveWeaknessMultiplier(target, move) {
      const elements = [move.element, move.element2].filter((element) => element && element !== "none");
      if (!elements.length) return 1;
      return elements.reduce((sum, element) => sum + (target.base.weaknesses[element] ?? 1), 0) / elements.length;
    },
    pendingSkillId(fighter) { return fighter?.pendingSkill?.skillId ?? null; },
    activeEnemy() { return null; },
    findHealBlockForMove() { return null; },
    healBlockMoveDisabledReason() { return ""; },
    DialogueManager: class {},
    window: {},
  });
  vm.runInContext(
    `${appSource}\n;globalThis.__moveUiTest = {
      state,
      moveUnavailableReason,
      moveMatchupInfo,
      moveCardClickIntent,
      shouldIgnoreRepeatedMoveKeydown,
      openMoveDetailState,
      clearMoveDetailState,
      getExpandedMoveId: () => expandedMoveId,
    };`,
    context,
    { filename: appPath },
  );
  return { context, api: context.__moveUiTest };
}

function createFighter(overrides = {}) {
  return {
    name: "テスト個体",
    hp: 100,
    energy: 2,
    fainted: false,
    pendingSkill: null,
    statuses: [],
    ...overrides,
  };
}

test("一覧のクリックは詳細を開く意図になり、詳細カードのクリックだけが実行意図になる", () => {
  const { api } = loadMoveUi();
  assert.equal(api.moveCardClickIntent({ detail: 1 }, false), "open");
  assert.equal(api.moveCardClickIntent({ detail: 1 }, true), "execute");
});

test("連続クリックとキー長押しのリピートを無視する", () => {
  const { api } = loadMoveUi();
  assert.equal(api.moveCardClickIntent({ detail: 2 }, true), "ignore");
  assert.equal(api.shouldIgnoreRepeatedMoveKeydown({ repeat: true }, true), true);
  assert.equal(api.shouldIgnoreRepeatedMoveKeydown({ repeat: false }, true), false);
});

test("詳細を開いて戻っても戦闘状態を変更しない", () => {
  const { api } = loadMoveUi();
  api.state.turn = 4;
  api.state.log = ["既存ログ"];
  assert.equal(api.openMoveDetailState("skill_test"), true);
  assert.equal(api.getExpandedMoveId(), "skill_test");
  assert.equal(api.clearMoveDetailState(), "skill_test");
  assert.equal(api.getExpandedMoveId(), null);
  assert.equal(api.state.turn, 4);
  assert.equal(api.state.log.length, 1);
  assert.equal(api.state.log[0], "既存ログ");
});

test("EN不足の理由を表示し、溜め技以外の選択も拒否できる", () => {
  const { api } = loadMoveUi();
  api.state.commandMode = "fight";
  api.state.busy = false;
  api.state.gameOver = false;
  api.state.pendingSwitchSide = null;
  const fighter = createFighter({ energy: 0 });
  const move = { skill_id: "skill_test", cost: 1 };
  assert.equal(api.moveUnavailableReason(fighter, move), "ENが不足しています（現在 0 / 必要 1）。");
  fighter.pendingSkill = { skillId: "skill_charge" };
  assert.match(api.moveUnavailableReason(fighter, move), /溜め技/);
  assert.equal(api.moveUnavailableReason(fighter, { ...move, skill_id: "skill_charge" }), "");
});

test("攻撃の属性相性はMHB共通倍率を読み取り、状態や乱数を変えない", () => {
  const { context, api } = loadMoveUi();
  api.state.turn = 3;
  api.state.log = ["before"];
  vm.runInContext("Math.random = () => { throw new Error('random called'); }", context);
  const defender = { base: { weaknesses: { fire: 0.4, water: 1.25 } } };
  const matchup = api.moveMatchupInfo({ category: "attack", element: "fire" }, defender);
  assert.equal(matchup.multiplier, 0.4);
  assert.deepEqual(Object.keys(matchup), ["multiplier"]);
  assert.equal(api.state.turn, 3);
  assert.equal(api.state.log[0], "before");
});

test("変化技には属性相性を表示しない", () => {
  const { api } = loadMoveUi();
  assert.equal(api.moveMatchupInfo({ category: "status", element: "fire" }, { base: { weaknesses: { fire: 2 } } }), null);
});

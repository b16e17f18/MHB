// Passive data helpers. Loaded as a classic script before battle-core.js and app.js.

const PASSIVE_EFFECT_TYPE_NONE = "none";
const PASSIVE_TARGET_DEBUFF = "debuff";
const PASSIVE_TARGET_EN_DOWN = "en_down";
const PASSIVE_TARGET_ENERGY_DOWN = "energy_down";
const PASSIVE_TARGET_CLEAR_BUFF = "clear_buff";
const PASSIVE_TARGET_ALL = "all";
const PASSIVE_TARGET_EN = "en";
const PASSIVE_TARGET_HP = "hp";
const PASSIVE_TARGET_PHYSICAL_DAMAGE = "physical_damage";
const PASSIVE_TARGET_SPECIAL_DAMAGE = "special_damage";
const PASSIVE_TYPE_EFFECT_CHANCE_UP = "effect_chance_up";
const PASSIVE_TYPE_ELEMENT_DAMAGE_UP = "element_damage_up";
const PASSIVE_TYPE_PHYSICAL_DAMAGE_CUT = "physical_damage_cut";
const PASSIVE_TYPE_TURN_END_STAT_UP = "turn_end_stat_up";
const PASSIVE_TYPE_DAMAGE_DRAIN = "damage_drain";
const PASSIVE_TYPE_SURVIVE_ONCE = "survive_once";
const PASSIVE_TYPE_TWO_TURN_SKIP_ONCE = "two_turn_skip_once";
const PASSIVE_TYPE_SWITCH_HEAL = "switch_heal";
const PASSIVE_TYPE_STATUS_MOVE_PRIORITY_UP = "status_move_priority_up";
const PASSIVE_TYPE_HEAL_BLOCK = "heal_block";
const PASSIVE_TYPE_PASSIVE_PIERCE = "passive_pierce";
const PASSIVE_STATUS_IMMUNITY_ALL_EFFECT_IDS = new Set([
  "poison",
  "paralysis",
  "sleep",
  "burn",
  "blood",
]);

function normalizePassive(row) {
  const passive = {
    passive_id: safeText(row.passive_id),
    name: safeText(row.name),
    passive_type1: safeText(row.passive_type1, PASSIVE_EFFECT_TYPE_NONE),
    target_id1: safeText(row.target_id1, PASSIVE_EFFECT_TYPE_NONE),
    value1: number(row.value1),
    passive_type2: safeText(row.passive_type2, PASSIVE_EFFECT_TYPE_NONE),
    target_id2: safeText(row.target_id2, PASSIVE_EFFECT_TYPE_NONE),
    value2: number(row.value2),
    text: csvText(row.text),
  };
  passive.effect1 = normalizePassiveEffect(passive, 1);
  passive.effect2 = normalizePassiveEffect(passive, 2);
  passive.effects = [passive.effect1, passive.effect2].filter(
    (effect) => effect.type && effect.type !== PASSIVE_EFFECT_TYPE_NONE,
  );
  return passive;
}

function normalizePassiveEffect(passive, slot) {
  const type = safeText(passive[`passive_type${slot}`], PASSIVE_EFFECT_TYPE_NONE);
  return {
    passive_id: passive.passive_id,
    passive_name: passive.name,
    name: passive.name,
    slot,
    type,
    passive_type: type,
    target_id: safeText(passive[`target_id${slot}`], PASSIVE_EFFECT_TYPE_NONE),
    value: number(passive[`value${slot}`]),
  };
}

function passiveEffectsOf(fighter) {
  if (Array.isArray(fighter?.passiveEffects)) return fighter.passiveEffects;
  if (Array.isArray(fighter?.passive?.effects)) return fighter.passive.effects;
  return [];
}

function findPassiveEffect(fighter, predicate) {
  return passiveEffectsOf(fighter).find(predicate) ?? null;
}

function hasPassiveEffect(fighter, predicate) {
  return Boolean(findPassiveEffect(fighter, predicate));
}

function passiveEffectType(passiveEffect) {
  return safeText(passiveEffect?.type ?? passiveEffect?.passive_type, PASSIVE_EFFECT_TYPE_NONE);
}

function passiveEffectTargetId(passiveEffect) {
  return safeText(passiveEffect?.target_id, PASSIVE_EFFECT_TYPE_NONE);
}

function passiveEffectValue(passiveEffect) {
  return number(passiveEffect?.value);
}

function passiveTargetMatches(passiveEffect, targetId) {
  return passiveEffectTargetId(passiveEffect) === targetId;
}

function passiveTargetMatchesAny(passiveEffect, targetIds) {
  return targetIds.includes(passiveEffectTargetId(passiveEffect));
}

function externalPassiveSource(actor, target) {
  return Boolean(actor && target && actor !== target);
}

function passiveActivationLogEvents(target, passiveEffect) {
  const passiveName = safeText(passiveEffect?.passive_name ?? passiveEffect?.name);
  return passiveName && target
    ? [{ type: "log", text: `${target.name}の${passiveName}！` }]
    : [];
}

function startEnergyFromPassiveEffects(passiveEffects, fallbackEnergy) {
  const passiveEffect = (passiveEffects ?? []).find((effect) => (
    passiveEffectType(effect) === "start_energy" &&
    passiveEffectTargetId(effect) === PASSIVE_TARGET_EN
  ));
  return passiveEffect ? passiveEffectValue(passiveEffect) : fallbackEnergy;
}

function initialEnergyFromPassive(fighter, fallbackEnergy) {
  return startEnergyFromPassiveEffects(passiveEffectsOf(fighter), fallbackEnergy);
}

function effectChanceMultiplierFromPassive(actor) {
  const passiveEffect = findPassiveEffect(actor, (effect) => (
    passiveEffectType(effect) === PASSIVE_TYPE_EFFECT_CHANCE_UP &&
    passiveTargetMatches(effect, PASSIVE_TARGET_ALL)
  ));
  return passiveEffect ? passiveEffectValue(passiveEffect) / 100 : 1;
}

function effectChanceWithPassive(actor, baseChance) {
  return Math.min(100, number(baseChance) * effectChanceMultiplierFromPassive(actor));
}

function elementDamageMultiplierFromPassive(actor, move) {
  const moveElement = safeText(move?.element, PASSIVE_EFFECT_TYPE_NONE);
  const passiveEffect = findPassiveEffect(actor, (effect) => (
    passiveEffectType(effect) === PASSIVE_TYPE_ELEMENT_DAMAGE_UP &&
    passiveTargetMatches(effect, moveElement)
  ));
  return passiveEffect ? 1 + passiveEffectValue(passiveEffect) / 100 : 1;
}

function passivePierceEffect(actor) {
  return findPassiveEffect(actor, (effect) => (
    passiveEffectType(effect) === PASSIVE_TYPE_PASSIVE_PIERCE &&
    passiveTargetMatches(effect, PASSIVE_TARGET_ALL)
  ));
}

function ignoresOpponentPassives(actor, move, passiveOwner) {
  return Boolean(
    actor &&
    move &&
    passiveOwner &&
    actor !== passiveOwner &&
    !move.isBattleEffectDamage &&
    safeText(move.category) === "attack" &&
    passivePierceEffect(actor)
  );
}

function physicalDamageMultiplierFromPassive(target, move, context = {}) {
  if (!move || move.isBattleEffectDamage) return 1;
  if (ignoresOpponentPassives(context.actor, move, target)) return 1;
  const damageTarget = move.attack_type === "special"
    ? PASSIVE_TARGET_SPECIAL_DAMAGE
    : PASSIVE_TARGET_PHYSICAL_DAMAGE;
  const passiveEffect = findPassiveEffect(target, (effect) => (
    passiveEffectType(effect) === PASSIVE_TYPE_PHYSICAL_DAMAGE_CUT &&
    passiveTargetMatches(effect, damageTarget)
  ));
  return passiveEffect ? 1 - passiveEffectValue(passiveEffect) / 100 : 1;
}

function damageDrainPercentFromPassive(actor, move) {
  if (!move || move.isBattleEffectDamage || move.attack_type === "special") return 0;
  const passiveEffect = findPassiveEffect(actor, (effect) => (
    passiveEffectType(effect) === PASSIVE_TYPE_DAMAGE_DRAIN &&
    passiveTargetMatches(effect, PASSIVE_TARGET_PHYSICAL_DAMAGE)
  ));
  return passiveEffect ? passiveEffectValue(passiveEffect) : 0;
}

function switchHealPercentFromPassive(fighter) {
  const passiveEffect = findPassiveEffect(fighter, (effect) => (
    passiveEffectType(effect) === PASSIVE_TYPE_SWITCH_HEAL &&
    passiveTargetMatches(effect, PASSIVE_TARGET_HP)
  ));
  return passiveEffect ? passiveEffectValue(passiveEffect) : 0;
}

function statusMovePriorityBonusFromPassive(actor, move) {
  if (!move || safeText(move.category) === "attack") return 0;
  const passiveEffect = findPassiveEffect(actor, (effect) => (
    passiveEffectType(effect) === PASSIVE_TYPE_STATUS_MOVE_PRIORITY_UP &&
    passiveTargetMatches(effect, PASSIVE_TARGET_ALL)
  ));
  return passiveEffect ? passiveEffectValue(passiveEffect) : 0;
}

function movePriorityWithPassive(actor, move, basePriority) {
  return number(basePriority) + statusMovePriorityBonusFromPassive(actor, move);
}

function isImmediateHpHealingEffect(effect) {
  return Boolean(
    effect &&
      safeText(effect.effect_group) === "heal" &&
      safeText(effect.target_stat) === PASSIVE_TARGET_HP
  );
}

function isImmediateHpHealingStatusMove(move, effectLookup) {
  if (!move || safeText(move.category) === "attack") return false;

  return [move.effect1, move.effect2, move.effect3].some((effectId) => {
    const normalizedEffectId = safeText(effectId, PASSIVE_EFFECT_TYPE_NONE);
    if (!normalizedEffectId || normalizedEffectId === PASSIVE_EFFECT_TYPE_NONE) return false;
    return isImmediateHpHealingEffect(effectLookup?.get(normalizedEffectId));
  });
}

function findHealBlockForMove({ actor, opponent, move, effectLookup }) {
  if (!actor || !opponent || actor === opponent || opponent.fainted) return null;
  if (!isImmediateHpHealingStatusMove(move, effectLookup)) return null;

  return findPassiveEffect(opponent, (passiveEffect) => (
    passiveEffectType(passiveEffect) === PASSIVE_TYPE_HEAL_BLOCK &&
    passiveTargetMatches(passiveEffect, PASSIVE_TARGET_HP)
  ));
}

function turnEndStatUpFromPassive(fighter) {
  const passiveEffect = findPassiveEffect(fighter, (effect) => (
    passiveEffectType(effect) === PASSIVE_TYPE_TURN_END_STAT_UP
  ));
  return passiveEffect
    ? {
        passiveEffect,
        stat: passiveEffectTargetId(passiveEffect),
        value: passiveEffectValue(passiveEffect),
      }
    : null;
}

function surviveOncePassiveEffect(fighter, move, context = {}) {
  if (!fighter || !move || move.isBattleEffectDamage) return null;
  if (ignoresOpponentPassives(context.actor, move, fighter)) return null;
  return findPassiveEffect(fighter, (effect) => (
    passiveEffectType(effect) === PASSIVE_TYPE_SURVIVE_ONCE &&
    passiveTargetMatches(effect, PASSIVE_EFFECT_TYPE_NONE)
  ));
}

function twoTurnSkipOncePassiveEffect(fighter, move) {
  if (!fighter || !move) return null;
  return findPassiveEffect(fighter, (effect) => (
    passiveEffectType(effect) === PASSIVE_TYPE_TWO_TURN_SKIP_ONCE &&
    passiveTargetMatches(effect, PASSIVE_TARGET_ALL)
  ));
}

function findBlockingEffectPassive({ actor, target, effect, move }) {
  if (!effect || !target) return null;
  if (ignoresOpponentPassives(actor, move, target)) return null;

  const effectId = safeText(effect.effect_id);
  const effectGroup = safeText(effect.effect_group);
  const isExternal = externalPassiveSource(actor, target);
  return findPassiveEffect(target, (passiveEffect) => {
    const type = passiveEffectType(passiveEffect);

    if (type === "status_immunity") {
      return passiveTargetMatches(passiveEffect, effectId) ||
        (
          passiveTargetMatches(passiveEffect, PASSIVE_TARGET_ALL) &&
          PASSIVE_STATUS_IMMUNITY_ALL_EFFECT_IDS.has(effectId)
        );
    }

    if (type === "debuff_immunity") {
      return isExternal &&
        effectGroup === "debuff" &&
        passiveTargetMatchesAny(passiveEffect, [PASSIVE_TARGET_DEBUFF, effectId]);
    }

    if (type === "en_down_immunity") {
      return isExternal &&
        effectGroup === "energy_down" &&
        passiveTargetMatchesAny(passiveEffect, [
          PASSIVE_TARGET_EN_DOWN,
          PASSIVE_TARGET_ENERGY_DOWN,
          PASSIVE_TARGET_ALL,
          effectId,
        ]);
    }

    if (type === "clear_buff_immunity") {
      return isExternal &&
        effectGroup === "clear_buff" &&
        passiveTargetMatchesAny(passiveEffect, [
          PASSIVE_TARGET_CLEAR_BUFF,
          PASSIVE_TARGET_ALL,
          effectId,
        ]);
    }

    return false;
  });
}

function findBlockingBattleEffectPassive({ actor, target, battleEffect, move }) {
  if (!battleEffect || !target || !externalPassiveSource(actor, target)) return null;
  if (ignoresOpponentPassives(actor, move, target)) return null;

  const battleEffectId = safeText(battleEffect.battle_effect_id);
  return findPassiveEffect(target, (passiveEffect) => (
    passiveEffectType(passiveEffect) === "battle_effect_immunity" &&
    passiveTargetMatches(passiveEffect, battleEffectId)
  ));
}

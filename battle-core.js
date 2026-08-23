// Pure battle calculation and battle-state helpers shared by app.js.
// Loaded as a classic script before app.js; project-wide module conversion is intentionally avoided.

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

function createEmptyWeakMods() {
  return ELEMENT_TYPES.reduce((mods, element) => {
    mods[element] = { value: 0, turns: 0 };
    return mods;
  }, {});
}

function ensureFighterWeakMods(fighter) {
  if (!fighter.weakMods || typeof fighter.weakMods !== "object") {
    fighter.weakMods = createEmptyWeakMods();
  }

  for (const element of ELEMENT_TYPES) {
    const current = fighter.weakMods[element];
    if (typeof current === "number") {
      fighter.weakMods[element] = {
        value: clamp(Math.round(current), TEMP_WEAK_MOD_MIN, TEMP_WEAK_MOD_MAX),
        turns: 0,
      };
      continue;
    }
    if (!current || typeof current !== "object") {
      fighter.weakMods[element] = { value: 0, turns: 0 };
      continue;
    }
    current.value = clamp(Math.round(number(current.value)), TEMP_WEAK_MOD_MIN, TEMP_WEAK_MOD_MAX);
    current.turns = Math.max(0, Math.floor(number(current.turns)));
  }

  return fighter.weakMods;
}

function moveWithEffectivePower(move, actor, target) {
  const effectivePower = effectiveMovePower(move, actor, target);
  return effectivePower === number(move?.power) ? move : { ...move, power: effectivePower };
}

function moveWithPendingPower(move, pendingSkill, actor, target) {
  const pendingPower = optionalNumber(pendingSkill?.power);
  return pendingPower === null ? moveWithEffectivePower(move, actor, target) : { ...move, power: pendingPower };
}

function effectiveMovePower(move, actor, target) {
  const basePower = number(move?.power);
  const ruleGroup = safeText(move?.power_rule);
  if (!ruleGroup) return basePower;

  const multiplier = powerRuleMultiplier(ruleGroup, move, actor, target);
  const uncappedPower = Math.round(basePower * multiplier);
  return Number.isFinite(move?.power_cap) ? Math.min(uncappedPower, move.power_cap) : uncappedPower;
}

function powerRuleMultiplier(ruleGroup, move, actor, target) {
  const rules = state.powerRules.get(ruleGroup);
  if (!rules?.length) {
    warnPowerRuleFallback(ruleGroup, move, "rule group not found");
    return 1;
  }

  const value = powerRuleValue(ruleGroup, move, actor, target);
  if (!Number.isFinite(value)) return 1;

  const matchedRule = rules.find((rule) => powerRuleMatchesValue(ruleGroup, rule, value));
  if (!matchedRule) {
    warnPowerRuleFallback(ruleGroup, move, "matching range not found", { value });
    return 1;
  }

  return number(matchedRule.power_multiplier, 1);
}

function powerRuleValue(ruleGroup, move, actor, target) {
  if (ruleGroup === "speed_ratio") {
    return speedRatioValue(actor, target, ruleGroup, move);
  }
  if (ruleGroup === "inverse_speed_ratio") {
    return speedRatioValue(target, actor, ruleGroup, move);
  }
  if (ruleGroup === "en_value") {
    if (!actor) {
      warnPowerRuleFallback(ruleGroup, move, "actor not found");
      return Number.NaN;
    }
    return number(actor.energy);
  }
  if (ruleGroup === "hp_ratio") {
    if (!actor || actor.maxHp <= 0) {
      warnPowerRuleFallback(ruleGroup, move, "actor hp not available");
      return Number.NaN;
    }
    return clamp(Math.floor((actor.hp / actor.maxHp) * 100), 0, 100);
  }

  warnPowerRuleFallback(ruleGroup, move, "rule value calculation not implemented");
  return Number.NaN;
}

function speedRatioValue(numeratorFighter, denominatorFighter, ruleGroup, move) {
  const numeratorSpeed = numeratorFighter ? effectiveStat(numeratorFighter, "speed") : 0;
  const denominatorSpeed = denominatorFighter ? effectiveStat(denominatorFighter, "speed") : 0;
  if (denominatorSpeed <= 0) {
    warnPowerRuleFallback(ruleGroup, move, "speed denominator is zero or below", {
      numeratorSpeed,
      denominatorSpeed,
    });
    return Number.NaN;
  }
  return (numeratorSpeed / denominatorSpeed) * 100;
}

function powerRuleMatchesValue(ruleGroup, rule, value) {
  if (rule.max_ratio !== null && rule.min_ratio === rule.max_ratio) {
    return value === rule.min_ratio;
  }
  if (value < rule.min_ratio) return false;
  if (rule.max_ratio === null) return true;
  if (ruleGroup === "hp_ratio") return value <= rule.max_ratio;
  return value < rule.max_ratio;
}

function warnPowerRuleFallback(ruleGroup, move, reason, details = {}) {
  console.warn("[PowerRule] falling back to multiplier 1", {
    skill_id: move?.skill_id,
    name: move?.name,
    power_rule: ruleGroup,
    reason,
    ...details,
  });
}

function estimateMoveDamage(attacker, target, move, aiConfig = ENEMY_AI_CONFIG) {
  if (!attacker || !target || !move) return 0;
  const hitCheck = canHitTarget(target, move);
  if (!hitCheck.canHit) return 0;

  const damageMove = moveWithEffectivePower(move, attacker, target);
  const physical = move.attack_type !== "special";
  const attackStat = effectiveStat(attacker, physical ? "phy_atk" : "sp_atk");
  const defenseStat = effectiveStat(target, physical ? "phy_def" : "sp_def");
  const ratio = attackStat / Math.max(45, defenseStat + 60);
  const elementMultiplier = weaknessMultiplier(target, move.element);
  const sameElementBonus =
    move.element !== "none" && move.element === attacker.base.element ? 1.15 : 1;
  let damage = (damageMove.power * 1.45 + attackStat * 0.48) * ratio;

  damage *= elementMultiplier * sameElementBonus * aiConfig.AVERAGE_DAMAGE_VARIANCE;
  damage = applyIncomingBattleEffects(target, damage, damageMove);
  return Math.max(1, Math.round(damage));
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
  const protect = target.battleEffects
    .filter((effect) => effect.group === "guard" && guardAppliesToMove(effect, move))
    .reduce((best, effect) => {
      if (!best || number(effect.damage_cut) > number(best.damage_cut)) {
        return effect;
      }
      return best;
    }, null);
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

function guardAppliesToMove(effect, move) {
  const guardType = safeText(effect?.guard_type, "all_damage");
  if (guardType === "all_damage") return true;
  if (guardType === "phy_damage") return move?.attack_type === "physical";
  if (guardType === "sp_damage") return move?.attack_type === "special";
  return true;
}

function twoTurnBattleEffectId(move) {
  return [
    [move.battle_effect1, move.battle_effect_chance1],
    [move.battle_effect2, move.battle_effect_chance2],
  ].find(([effectId, chance]) => (
    TWO_TURN_BATTLE_EFFECT_IDS.has(effectId) && chance > 0
  ))?.[0] ?? "";
}

function hasSetupOnlyDelayedAttackBattleEffect(move) {
  return [
    [move.battle_effect1, move.battle_effect_chance1],
    [move.battle_effect2, move.battle_effect_chance2],
  ].some(([effectId, chance]) => (
    chance > 0 && DELAYED_ATTACK_SETUP_ONLY_EFFECT_IDS.has(effectId)
  ));
}

function delayedHealAmount(effect, target) {
  if (effect.damage_type === "percent_maxhp") {
    return Math.max(0, Math.round(target.maxHp * ((effect.damage_value || 0) / 100)));
  }
  return Math.max(0, Math.round(effect.damage_value || 0));
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

function effectiveEnergyCharge(fighter) {
  const baseCharge = Math.max(0, fighter?.base?.energy_charge || 0);
  const modifier = fighterEnergyChargeModifier(fighter);
  return Math.max(0, baseCharge + modifier);
}

function effectiveRegenValue(fighter) {
  const baseRegen = Math.max(0, fighter?.base?.regen_value || 0);
  const modifier = fighter?.statMods?.regen_value || 0;
  return Math.max(0, Math.round(baseRegen + modifier));
}

function fighterEnergyChargeModifier(fighter) {
  if (!fighter) return 0;
  return fighter.statuses.reduce((total, status) => {
    if (status.targetStat !== "en") return total;
    const amount = Math.max(0, Math.abs(status.damageValue || 0));
    if (status.group === "energy_up") return total + amount;
    if (status.group === "energy_down") return total - amount;
    return total;
  }, 0);
}

function tickWeakModsAfterRound(fighter) {
  if (!fighter) return;
  const weakMods = ensureFighterWeakMods(fighter);
  for (const element of ELEMENT_TYPES) {
    const current = weakMods[element];
    if (current.turns <= 0) continue;
    current.turns -= 1;
    if (current.turns <= 0) {
      current.value = 0;
      current.turns = 0;
    }
  }
}

function effectiveStat(fighter, stat) {
  return Math.max(1, Math.round(fighter.base[stat] * (1 + (fighter.statMods[stat] || 0) / 100)));
}

function weaknessMultiplier(target, element) {
  if (!element || element === "none") return 1;
  return effectiveWeakPercent(target, element) / 100;
}

function effectiveWeakPercent(target, element) {
  const baseWeak = Math.round(number(target?.base?.weaknesses?.[element], 1) * 100);
  return baseWeak + temporaryWeakModValue(target, element);
}

function temporaryWeakModValue(target, element) {
  if (!target || !ELEMENT_TYPES.includes(element)) return 0;
  return ensureFighterWeakMods(target)[element].value;
}

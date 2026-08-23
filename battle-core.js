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

function clearSleepOnAttackDamage(target) {
  if (!target?.statuses?.some((status) => status.id === "sleep")) return [];
  target.statuses = target.statuses.filter((status) => status.id !== "sleep");
  return target.hp > 0
    ? [{ type: "log", text: `${target.name}は目を覚ました！` }]
    : [];
}

function addTimedStatusEffect(effect, target) {
  const current = target.statuses.find((status) => status.id === effect.effect_id);
  if (current) {
    current.turns = Math.max(current.turns, effect.turn);
    current.damageValue = effect.damage_value;
    current.targetStat = effect.target_stat;
  } else {
    target.statuses.push({
      id: effect.effect_id,
      name: effect.name,
      group: effect.effect_group,
      damageType: effect.damage_type,
      damageValue: effect.damage_value,
      targetStat: effect.target_stat,
      turns: effect.turn,
    });
  }
  return [{ type: "log", text: `${target.name}は${effect.name}になった！` }];
}

function applyStatModifierEffect(effect, target, statLabels = {}) {
  const stat = effect.target_stat;
  if (!target.statMods[stat] && target.statMods[stat] !== 0) return [];

  const amount = effect.effect_group === "buff" ? effect.damage_value : -effect.damage_value;
  const before = target.statMods[stat];
  const stageLimit = Math.max(0, Math.abs(effect.damage_value) * 4);
  target.statMods[stat] = clamp(target.statMods[stat] + amount, -stageLimit, stageLimit);
  if (target.statMods[stat] !== before) {
    return [{
      type: "log",
      text: `${target.name}の${statLabels[stat] ?? stat}が${amount > 0 ? "上がった" : "下がった"}！`,
    }];
  }
  return [];
}

function applyGenericStatusEffect(effect, target) {
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
      targetStat: effect.target_stat,
      turns: effect.turn,
    });
  }
  return [{ type: "log", text: `${target.name}は${effect.name}になった！` }];
}

function applyEffect(effectId, actor, target, effects, statLabels = {}) {
  if (!target) return [];

  if (effectId === "def_down") {
    return [
      ...applyEffect("phy_def_down", actor, target, effects, statLabels),
      ...applyEffect("sp_def_down", actor, target, effects, statLabels),
    ];
  }

  const effect = effects?.get(effectId);
  if (!effect) return [];

  if (effect.effect_group === "heal") {
    return applyHealEffect(effect, target);
  }

  if (effect.effect_group === "energy_up" || effect.effect_group === "energy_down") {
    return applyEnergyEffect(effect, target);
  }

  if (effect.effect_group === "buff" || effect.effect_group === "debuff") {
    return applyStatModifierEffect(effect, target, statLabels);
  }

  if (effect.effect_group === "resistance") {
    return applyResistanceEffect(effect, target);
  }

  return applyGenericStatusEffect(effect, target);
}

function normalizeEffectTarget(value) {
  return safeText(value, "enemy").toLowerCase() === "self" ? "self" : "enemy";
}

function applySkillEffects(move, actor, target, effects, statLabels, options = {}) {
  const events = [];
  const allowedTargets = Array.isArray(options.targets)
    ? new Set(options.targets.map(normalizeEffectTarget))
    : null;
  const pairs = [
    [move.effect1, move.effect_chance1, move.effect_target1],
    [move.effect2, move.effect_chance2, move.effect_target2],
    [move.effect3, move.effect_chance3, move.effect_target3],
  ];

  for (const [effectId, chance, effectTarget] of pairs) {
    if (!effectId || effectId === "none" || chance <= 0) continue;
    const normalizedTarget = normalizeEffectTarget(effectTarget);
    if (allowedTargets && !allowedTargets.has(normalizedTarget)) continue;
    if (Math.random() * 100 <= chance) {
      events.push(...applyEffect(
        effectId,
        actor,
        skillEffectRecipient(normalizedTarget, actor, target),
        effects,
        statLabels,
      ));
    }
  }

  return events;
}

function skillEffectRecipient(effectTarget, actor, target) {
  return normalizeEffectTarget(effectTarget) === "self" ? actor : target;
}

function elementFromWeakTargetStat(targetStat) {
  const match = safeText(targetStat).match(/^weak_(fire|water|thunder|ice|dragon)$/);
  return match?.[1] ?? "";
}

function elementFromResistanceEffectId(effectId) {
  const match = safeText(effectId).match(/^(fire|water|thunder|ice|dragon)_weak_(?:up|down)$/);
  return match?.[1] ?? "";
}

function resistanceEffectElement(effect) {
  return (
    elementFromWeakTargetStat(effect?.target_stat ?? effect?.targetStat) ||
    elementFromResistanceEffectId(effect?.effect_id ?? effect?.id)
  );
}

function resistanceWeakModDelta(effect) {
  const effectId = safeText(effect?.effect_id ?? effect?.id);
  const amount = Math.abs(number(effect?.damage_value ?? effect?.damageValue));
  if (effectId.endsWith("_weak_up")) return amount;
  if (effectId.endsWith("_weak_down")) return -amount;

  const name = safeText(effect?.name).toLowerCase();
  if (name.endsWith("down")) return amount;
  if (name.endsWith("up")) return -amount;
  return 0;
}

function applyResistanceEffect(effect, target) {
  const element = resistanceEffectElement(effect);
  const delta = resistanceWeakModDelta(effect);
  if (!element || !delta) return [];

  const weakMods = ensureFighterWeakMods(target);
  const current = weakMods[element];
  current.value = clamp(current.value + delta, TEMP_WEAK_MOD_MIN, TEMP_WEAK_MOD_MAX);
  current.turns = Math.max(0, Math.floor(number(effect.turn)));
  return [{ type: "log", text: `${target.name}は${effect.name}になった！` }];
}

function applyHealEffect(effect, target) {
  const amount = Math.max(0, Math.abs(effect.damage_value));
  if (amount <= 0) return [];

  if (effect.target_stat === "hp") {
    const beforeHp = target.hp;
    target.hp = Math.min(target.maxHp, target.hp + amount);
    const healed = target.hp - beforeHp;
    if (healed > 0) {
      return [{ type: "log", text: `${target.name}は ${healed} 回復した！` }];
    }
    return [];
  }

  if (effect.target_stat === "en") {
    const beforeEnergy = target.energy;
    target.energy = clamp(target.energy + amount, 0, target.maxEnergy);
    const recovered = target.energy - beforeEnergy;
    if (recovered > 0) {
      return [{ type: "log", text: `${target.name}のENが ${recovered} 回復した！` }];
    }
  }

  return [];
}

function applyEnergyEffect(effect, target) {
  if (effect.target_stat !== "en") return [];

  const amount = Math.max(0, Math.abs(effect.damage_value));
  if (amount <= 0) return [];

  if (effect.turn <= 0) {
    const beforeEnergy = target.energy;
    const nextEnergy = effect.effect_group === "energy_up"
      ? target.energy + amount
      : target.energy - amount;
    target.energy = clamp(nextEnergy, 0, target.maxEnergy);
    const changed = target.energy - beforeEnergy;
    if (changed > 0) {
      return [{ type: "log", text: `${target.name}のENが ${changed} 増えた！` }];
    }
    if (changed < 0) {
      return [{ type: "log", text: `${target.name}のENが ${Math.abs(changed)} 減った！` }];
    }
    return [];
  }

  return addTimedStatusEffect(effect, target);
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

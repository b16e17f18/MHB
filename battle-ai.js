const ENEMY_AI_CONFIG = {
  DEBUG: false,
  AVERAGE_DAMAGE_VARIANCE: 0.975,
  WAITING_PENALTY: 25,
  MIN_FUTURE_GAIN: 20,
  ENERGY_COST_PENALTY: 3,
  EMPTY_ENERGY_PENALTY: 8,
  LOW_HP_DAMAGE_RATIO: 0.7,
  SAVE_BLOCK_PENALTY: 10000,
  HEAL_BASE_WEIGHT: 0.45,
  HEAL_MISSING_HP_WEIGHT: 1.25,
  BUFF_LOW_HP_RATIO: 0.25,
  BUFF_LOW_HP_MULTIPLIER: 0.45,
  PROTECT_BASE_WEIGHT: 0.8,
  PROTECT_MISSING_HP_WEIGHT: 1,
  PROTECT_TURN_BONUS: 5,
  STATUS_CONTROL_BASE_SCORE: 42,
  STATUS_DAMAGE_BASE_SCORE: 28,
  STATUS_TURN_BONUS: 6,
  STATUS_DAMAGE_WEIGHT: 0.45,
  DEBUFF_TARGET_HP_MIN_MULTIPLIER: 0.25,
  NEAR_BEST_RANDOM_RANGE: 0.1,
  NEAR_BEST_MIN_RANGE: 5,
  CANDIDATE_MIN_WEIGHT: 1,
  CANDIDATE_WEIGHT_OFFSET: 1,
  KO_BONUS: 1000,
  LEGACY_FALLBACK_SCORE_RATIO: 0.94,
  MAIN_SKILL_SCORE_MULTIPLIER: 1.08,
  SETUP_SKILL_SCORE_MULTIPLIER: 1.18,
  SETUP_FIRST_TURN_MULTIPLIER: 1.25,
  SETUP_MAIN_EN_SHORT_MULTIPLIER: 1.12,
  SWITCH_OFFENSE_WEIGHT: 1,
  SWITCH_INCOMING_DAMAGE_WEIGHT: 0.65,
  SWITCH_INCOMING_HP_RATIO_WEIGHT: 35,
  SWITCH_HP_RATIO_WEIGHT: 30,
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

function chooseEnemyBattleAction(context) {
  const enemy = context.enemy;
  const pendingMoveId = pendingSkillId(enemy);
  if (pendingMoveId) {
    return { side: "enemy", type: "move", moveId: pendingMoveId };
  }

  const lowHp = enemy.hp / enemy.maxHp <= 0.28;
  const bench = context.enemyBenchIndex;

  if (lowHp && bench >= 0 && Math.random() < 0.22) {
    return {
      side: "enemy",
      type: "switch",
      index: chooseEnemySwitchIndex(context, bench, enemyAiConfigFor(enemy)),
    };
  }

  const target = context.target;
  const aiConfig = enemyAiConfigFor(enemy);
  const allMoves = context.allMoves;
  const usableMoves = allMoves.filter((move) => move.cost <= enemy.energy);
  const usableAttackMoveScores = usableMoves
    .map((move) => scoreEnemyUsableMove(enemy, target, move, context, aiConfig))
    .filter(Boolean)
    .map((candidate) => applyEnemySkillPreference(candidate, context, enemy, aiConfig));
  const supportMoveScores = usableMoves
    .map((move) => scoreEnemySupportMove(enemy, target, move, context, aiConfig))
    .filter(Boolean)
    .map((candidate) => applyEnemySkillPreference(candidate, context, enemy, aiConfig));
  const usableMoveScores = [...usableAttackMoveScores, ...supportMoveScores];
  const scoredMoveIds = new Set(usableMoveScores.map((candidate) => candidate.move.skill_id));
  const legacyFallbackMove = pickLegacyEnemyMove(
    usableMoves.filter((move) => !scoredMoveIds.has(move.skill_id) && move.category === "attack"),
  );
  const saveEnergy = scoreEnemySaveEnergy(enemy, target, allMoves, usableMoveScores, context, aiConfig);
  const knockoutMoves = usableAttackMoveScores.filter((candidate) => candidate.canKnockout);

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
      selected: context.saveEnergyEnabled ? "save_energy" : "idle",
      reason: "no_usable_moves",
    });
    return context.saveEnergyEnabled
      ? { side: "enemy", type: "save_energy" }
      : { side: "enemy", type: "idle" };
  }

  if (!usableMoveScores.length) {
    if (context.saveEnergyEnabled && saveEnergy.available && saveEnergy.score > 0) {
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

    return context.saveEnergyEnabled
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
  if (context.saveEnergyEnabled) {
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

function isEnemyAiScoredMove(move, battleEffects) {
  return Boolean(
    move &&
      move.category === "attack" &&
      move.target !== "self" &&
      !twoTurnBattleEffectId(move) &&
      !hasEnemyAiDelayedAttackBattleEffect(move, battleEffects)
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

function scoreEnemyUsableMove(enemy, target, move, context, aiConfig = ENEMY_AI_CONFIG) {
  if (!enemy || !target || !isEnemyAiScoredMove(move, context.battleEffects)) return null;
  const hitCheck = canHitTarget(target, move);
  if (!hitCheck.canHit) return null;

  const estimatedDamage = estimateMoveDamage(
    enemy,
    target,
    move,
    aiConfig,
    context.powerRules,
    context.targetFieldEffects,
  );
  const canKnockout = estimatedDamage >= target.hp;
  let score = estimatedDamage - move.cost * aiConfig.ENERGY_COST_PENALTY;
  if (enemy.energy - move.cost <= 0) {
    score -= aiConfig.EMPTY_ENERGY_PENALTY;
  }
  if (canKnockout) {
    score += aiConfig.KO_BONUS;
  }
  score += scoreEnemyTargetStatusMove(target, move, context, aiConfig);
  score += scoreEnemyTargetDebuffMove(target, move, context.effects, aiConfig);

  return {
    type: "move",
    move,
    score,
    estimatedDamage,
    canKnockout,
  };
}

function scoreEnemySupportMove(enemy, target, move, context, aiConfig = ENEMY_AI_CONFIG) {
  if (!enemy || !move || move.category === "attack") return null;
  if (move.target !== "self") {
    const hitCheck = target ? canHitTarget(target, move) : { canHit: false };
    if (!hitCheck.canHit) return null;
  }

  const supportScore =
    scoreEnemyHealingMove(enemy, move, context.effects, aiConfig) +
    scoreEnemySelfBuffMove(enemy, move, context.effects, aiConfig) +
    scoreEnemyProtectMove(enemy, move, context, aiConfig) +
    scoreEnemyTargetStatusMove(target, move, context, aiConfig) +
    scoreEnemyTargetDebuffMove(target, move, context.effects, aiConfig);
  const score = supportScore - move.cost * aiConfig.ENERGY_COST_PENALTY;
  if (enemy.energy - move.cost <= 0) {
    return score - aiConfig.EMPTY_ENERGY_PENALTY > 0
      ? supportMoveCandidate(move, score - aiConfig.EMPTY_ENERGY_PENALTY, supportScore)
      : null;
  }
  return score > 0 ? supportMoveCandidate(move, score, supportScore) : null;
}

function supportMoveCandidate(move, score, supportScore) {
  return {
    type: "move",
    move,
    score,
    estimatedDamage: 0,
    canKnockout: false,
    supportScore,
  };
}

function chooseEnemySwitchIndex(context, fallbackIndex, aiConfig = ENEMY_AI_CONFIG) {
  const candidates = Array.isArray(context.enemySwitchCandidates)
    ? context.enemySwitchCandidates.filter((candidate) => (
        candidate &&
        Number.isInteger(candidate.index) &&
        candidate.index >= 0 &&
        candidate.fighter &&
        !candidate.fighter.fainted
      ))
    : [];

  if (candidates.length === 0) return fallbackIndex;
  if (candidates.length === 1) return candidates[0].index;

  const scoredCandidates = candidates
    .map((candidate) => scoreEnemySwitchCandidate(candidate, context, aiConfig))
    .filter(Boolean);
  if (!scoredCandidates.length) return fallbackIndex;

  scoredCandidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.index - b.index;
  });
  return scoredCandidates[0].index;
}

function scoreEnemySwitchCandidate(candidate, context, aiConfig) {
  const fighter = candidate.fighter;
  const player = context.target;
  if (!fighter || !player) return null;

  const offense = bestEnemyAiEstimatedAttackDamage(
    fighter,
    player,
    candidate.moves,
    context,
    context.targetFieldEffects,
  );
  const incoming = bestEnemyAiEstimatedAttackDamage(
    player,
    fighter,
    context.playerMoves,
    context,
    context.enemyFieldEffects,
  );
  if (!offense.available && !incoming.available) return null;

  const hpRatio = enemyAiHpRatio(fighter);
  const incomingHpRatio = fighter.hp > 0
    ? Math.min(2, incoming.damage / fighter.hp)
    : 2;
  const score =
    offense.damage * aiConfig.SWITCH_OFFENSE_WEIGHT -
    incoming.damage * aiConfig.SWITCH_INCOMING_DAMAGE_WEIGHT -
    incomingHpRatio * aiConfig.SWITCH_INCOMING_HP_RATIO_WEIGHT +
    hpRatio * aiConfig.SWITCH_HP_RATIO_WEIGHT;

  return {
    index: candidate.index,
    score,
    offenseDamage: offense.damage,
    incomingDamage: incoming.damage,
    hpRatio,
  };
}

function bestEnemyAiEstimatedAttackDamage(attacker, target, moves, context, targetFieldEffects) {
  const attackScores = (moves ?? [])
    .filter((move) => move?.category === "attack")
    .filter((move) => move.cost <= (attacker?.energy ?? 0))
    .filter((move) => isEnemyAiScoredMove(move, context.battleEffects))
    .map((move) => {
      const hitCheck = canHitTarget(target, move);
      if (!hitCheck.canHit) return 0;
      return estimateMoveDamage(
        attacker,
        target,
        move,
        ENEMY_AI_CONFIG,
        context.powerRules,
        targetFieldEffects,
      );
    });
  const damage = Math.max(0, ...attackScores);
  return {
    available: damage > 0,
    damage,
  };
}

function applyEnemySkillPreference(candidate, context, enemy, aiConfig) {
  if (!candidate?.move || candidate.score <= 0) return candidate;

  const skillId = safeText(candidate.move.skill_id);
  const setupSkillId = safeText(context.aiSetupSkill);
  const mainSkillId = safeText(context.aiMainSkill);
  let multiplier = 1;

  if (mainSkillId && skillId === mainSkillId) {
    multiplier *= aiConfig.MAIN_SKILL_SCORE_MULTIPLIER;
  }
  if (setupSkillId && skillId === setupSkillId) {
    multiplier *= aiConfig.SETUP_SKILL_SCORE_MULTIPLIER;
    if (enemyAiIsOpeningTurn(context)) {
      multiplier *= aiConfig.SETUP_FIRST_TURN_MULTIPLIER;
    }
    if (enemyAiMainSkillNeedsEnergy(context, enemy)) {
      multiplier *= aiConfig.SETUP_MAIN_EN_SHORT_MULTIPLIER;
    }
  }

  if (multiplier === 1) return candidate;
  return {
    ...candidate,
    score: candidate.score * multiplier,
    preferenceMultiplier: multiplier,
  };
}

function enemyAiIsOpeningTurn(context) {
  const turn = Number(context.turn);
  return Number.isFinite(turn) && turn <= 1;
}

function enemyAiMainSkillNeedsEnergy(context, enemy) {
  const mainSkillId = safeText(context.aiMainSkill);
  if (!mainSkillId) return false;

  const mainMove = (context.allMoves ?? []).find((move) => move?.skill_id === mainSkillId);
  return Boolean(mainMove && mainMove.cost > (enemy?.energy ?? 0));
}

function scoreEnemyHealingMove(enemy, move, effects, aiConfig) {
  return enemyAiMoveEffectPairs(move)
    .filter((pair) => enemyAiEffectTargetsSelf(move, pair.effectTarget))
    .reduce((total, pair) => {
      const effect = effects?.get(pair.effectId);
      if (effect?.effect_group !== "heal" || effect.target_stat !== "hp") return total;
      const missingHp = Math.max(0, enemy.maxHp - enemy.hp);
      if (missingHp <= 0) return total;

      const healAmount = Math.max(0, Math.abs(Number(effect.damage_value) || 0));
      if (healAmount <= 0) return total;

      const effectiveHeal = Math.min(missingHp, healAmount);
      const missingRatio = enemy.maxHp > 0 ? missingHp / enemy.maxHp : 0;
      const urgency = aiConfig.HEAL_BASE_WEIGHT + missingRatio * aiConfig.HEAL_MISSING_HP_WEIGHT;
      return total + effectiveHeal * urgency * enemyAiChanceWeight(pair.chance);
    }, 0);
}

function scoreEnemySelfBuffMove(enemy, move, effects, aiConfig) {
  return enemyAiMoveEffectPairs(move)
    .filter((pair) => enemyAiEffectTargetsSelf(move, pair.effectTarget))
    .reduce((total, pair) => {
      const effect = effects?.get(pair.effectId);
      if (effect?.effect_group !== "buff") return total;

      const stat = effect.target_stat;
      if (!["phy_atk", "phy_def", "sp_atk", "sp_def", "speed"].includes(stat)) return total;

      const amount = Math.max(0, Math.abs(Number(effect.damage_value) || 0));
      if (amount <= 0) return total;

      const current = Number(enemy.statMods?.[stat]) || 0;
      const stageLimit = amount * 4;
      if (current >= stageLimit) return total;

      const stackMultiplier = enemyAiBuffStackMultiplier(current, amount);
      const lowHpMultiplier = enemyAiHpRatio(enemy) <= aiConfig.BUFF_LOW_HP_RATIO
        ? aiConfig.BUFF_LOW_HP_MULTIPLIER
        : 1;
      const statWeight = enemyAiBuffStatWeight(stat);
      return total + amount * statWeight * stackMultiplier * lowHpMultiplier * enemyAiChanceWeight(pair.chance);
    }, 0);
}

function scoreEnemyProtectMove(enemy, move, context, aiConfig) {
  return enemyAiMoveBattleEffectPairs(move)
    .reduce((total, pair) => {
      const battleEffect = context.battleEffects?.get(pair.effectId);
      if (battleEffect?.battle_effect_group !== "guard") return total;
      if (enemyAiHasActiveGuard(enemy, context.actorFieldEffects, battleEffect.battle_effect_id)) return total;

      const damageCut = Math.max(0, Number(battleEffect.damage_cut) || 0);
      if (damageCut <= 0) return total;

      const missingRatio = 1 - enemyAiHpRatio(enemy);
      const urgency = aiConfig.PROTECT_BASE_WEIGHT + missingRatio * aiConfig.PROTECT_MISSING_HP_WEIGHT;
      const turnBonus = Math.max(0, Math.min(4, Math.floor(Number(battleEffect.turn) || 0))) * aiConfig.PROTECT_TURN_BONUS;
      return total + (damageCut * urgency + turnBonus) * enemyAiChanceWeight(pair.chance);
    }, 0);
}

function scoreEnemyTargetStatusMove(target, move, context, aiConfig) {
  const effectScore = enemyAiMoveEffectPairs(move)
    .filter((pair) => enemyAiEffectTargetsEnemy(move, pair.effectTarget))
    .reduce((total, pair) => {
      const effect = context.effects?.get(pair.effectId);
      if (!enemyAiIsTargetStatusEffect(effect)) return total;
      if (enemyAiTargetHasEffect(target, effect.effect_id)) return total;
      return total + enemyAiStatusEffectScore(effect, target, aiConfig) * enemyAiChanceWeight(pair.chance);
    }, 0);
  const battleEffectScore = enemyAiMoveBattleEffectPairs(move)
    .reduce((total, pair) => {
      const battleEffect = context.battleEffects?.get(pair.effectId);
      if (battleEffect?.battle_effect_group !== "control") return total;
      if (enemyAiTargetHasEffect(target, battleEffect.battle_effect_id)) return total;
      return total + enemyAiControlStatusScore(battleEffect, target, aiConfig) * enemyAiChanceWeight(pair.chance);
    }, 0);
  return effectScore + battleEffectScore;
}

function scoreEnemyTargetDebuffMove(target, move, effects, aiConfig) {
  return enemyAiMoveEffectPairs(move)
    .filter((pair) => enemyAiEffectTargetsEnemy(move, pair.effectTarget))
    .reduce((total, pair) => {
      const effect = effects?.get(pair.effectId);
      if (effect?.effect_group !== "debuff") return total;

      const stat = effect.target_stat;
      if (!["phy_atk", "phy_def", "sp_atk", "sp_def", "speed"].includes(stat)) return total;

      const amount = Math.max(0, Math.abs(Number(effect.damage_value) || 0));
      if (amount <= 0) return total;

      const current = Number(target?.statMods?.[stat]) || 0;
      const stageLimit = amount * 4;
      if (current <= -stageLimit) return total;

      const targetHpMultiplier = Math.max(
        aiConfig.DEBUFF_TARGET_HP_MIN_MULTIPLIER,
        enemyAiHpRatio(target),
      );
      const stackMultiplier = enemyAiDebuffStackMultiplier(current, amount);
      return total + amount * enemyAiDebuffStatWeight(stat) * targetHpMultiplier * stackMultiplier * enemyAiChanceWeight(pair.chance);
    }, 0);
}

function scoreEnemySaveEnergy(enemy, target, allMoves, usableMoveScores, context, aiConfig = ENEMY_AI_CONFIG) {
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
    .filter((move) => isEnemyAiScoredMove(move, context.battleEffects))
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
          context.powerRules,
          context.targetFieldEffects,
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

function hasEnemyAiDelayedAttackBattleEffect(move, battleEffects) {
  return [
    [move?.battle_effect1, move?.battle_effect_chance1],
    [move?.battle_effect2, move?.battle_effect_chance2],
  ].some(([effectId, chance]) => (
    chance > 0 && battleEffects?.get(effectId)?.battle_effect_group === "delayed_attack"
  ));
}

function enemyAiMoveEffectPairs(move) {
  return [
    { effectId: move?.effect1, chance: move?.effect_chance1, effectTarget: move?.effect_target1 },
    { effectId: move?.effect2, chance: move?.effect_chance2, effectTarget: move?.effect_target2 },
    { effectId: move?.effect3, chance: move?.effect_chance3, effectTarget: move?.effect_target3 },
  ].filter((pair) => pair.effectId && pair.effectId !== "none" && pair.chance > 0);
}

function enemyAiMoveBattleEffectPairs(move) {
  return [
    { effectId: move?.battle_effect1, chance: move?.battle_effect_chance1 },
    { effectId: move?.battle_effect2, chance: move?.battle_effect_chance2 },
  ].filter((pair) => pair.effectId && pair.effectId !== "none" && pair.chance > 0);
}

function enemyAiEffectTargetsSelf(move, effectTarget) {
  const normalizedTarget = safeText(effectTarget, "enemy").toLowerCase() === "self" ? "self" : "enemy";
  return normalizedTarget === "self" || safeText(move?.target, "enemy").toLowerCase() === "self";
}

function enemyAiEffectTargetsEnemy(move, effectTarget) {
  const normalizedTarget = safeText(effectTarget, "enemy").toLowerCase() === "self" ? "self" : "enemy";
  return normalizedTarget !== "self" && safeText(move?.target, "enemy").toLowerCase() !== "self";
}

function enemyAiChanceWeight(chance) {
  const value = Number(chance);
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value)) / 100;
}

function enemyAiHpRatio(fighter) {
  return fighter?.maxHp > 0 ? Math.max(0, Math.min(1, fighter.hp / fighter.maxHp)) : 0;
}

function enemyAiBuffStackMultiplier(current, amount) {
  if (current >= amount * 2) return 0.2;
  if (current >= amount) return 0.55;
  return 1;
}

function enemyAiBuffStatWeight(stat) {
  return {
    phy_atk: 3,
    sp_atk: 3,
    speed: 2.4,
    phy_def: 2.2,
    sp_def: 2.2,
  }[stat] ?? 1;
}

function enemyAiHasActiveGuard(enemy, actorFieldEffects, battleEffectId) {
  const activeEffects = [
    ...(enemy?.battleEffects ?? []),
    ...(actorFieldEffects ?? []),
  ];
  return Boolean(
    activeEffects.some((effect) => effect.id === battleEffectId || effect.group === "guard")
  );
}

function enemyAiIsTargetStatusEffect(effect) {
  return effect?.effect_group === "control" || effect?.effect_group === "damage";
}

function enemyAiTargetHasEffect(target, effectId) {
  return Boolean(
    target?.statuses?.some((status) => status.id === effectId) ||
      target?.battleEffects?.some((effect) => effect.id === effectId)
  );
}

function enemyAiStatusEffectScore(effect, target, aiConfig) {
  if (effect.effect_group === "control") {
    return enemyAiControlStatusScore(effect, target, aiConfig);
  }
  if (effect.effect_group === "damage") {
    return enemyAiDamageStatusScore(effect, target, aiConfig);
  }
  return 0;
}

function enemyAiControlStatusScore(effect, target, aiConfig) {
  const targetHpRatio = enemyAiHpRatio(target);
  const turns = Math.max(1, Math.floor(Number(effect.turn) || 1));
  return (
    aiConfig.STATUS_CONTROL_BASE_SCORE *
      Math.max(aiConfig.DEBUFF_TARGET_HP_MIN_MULTIPLIER, targetHpRatio) +
    Math.min(4, turns) * aiConfig.STATUS_TURN_BONUS
  );
}

function enemyAiDamageStatusScore(effect, target, aiConfig) {
  const targetHpRatio = enemyAiHpRatio(target);
  const turns = Math.max(1, Math.min(4, Math.floor(Number(effect.turn) || 1)));
  const damageValue = Math.max(0, Math.abs(Number(effect.damage_value) || 0));
  if (damageValue <= 0) return 0;

  const estimatedDamage = effect.damage_type === "percent_maxhp"
    ? (target?.maxHp ?? 0) * (damageValue / 100) * turns
    : damageValue * turns;
  return (
    aiConfig.STATUS_DAMAGE_BASE_SCORE *
      Math.max(aiConfig.DEBUFF_TARGET_HP_MIN_MULTIPLIER, targetHpRatio) +
    estimatedDamage * aiConfig.STATUS_DAMAGE_WEIGHT * targetHpRatio
  );
}

function enemyAiDebuffStackMultiplier(current, amount) {
  if (current <= -amount * 2) return 0.2;
  if (current <= -amount) return 0.55;
  return 1;
}

function enemyAiDebuffStatWeight(stat) {
  return {
    phy_def: 2.4,
    sp_def: 2.4,
    phy_atk: 2,
    sp_atk: 2,
    speed: 1.6,
  }[stat] ?? 1;
}

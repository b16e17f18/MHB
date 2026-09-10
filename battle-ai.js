const ENEMY_AI_CONFIG = {
  DEBUG: false,
  AVERAGE_DAMAGE_VARIANCE: 0.975,
  WAITING_PENALTY: 25,
  TWO_TURN_DAMAGE_MULTIPLIER: 0.82,
  DELAYED_DAMAGE_MULTIPLIER: 0.62,
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
  STATUS_TARGET_HP_MIN_MULTIPLIER: 0.15,
  STATUS_EFFECT_SCORE_MULTIPLIERS: {
    paralysis: 1.12,
    sleep: 0.95,
    poison: 1,
    burn: 1.05,
    stun: 0.75,
  },
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
  SWITCH_MATCHUP_ADVANTAGE_THRESHOLD: 60,
  SWITCH_MATCHUP_MIN_BENCH_SCORE: 20,
  SWITCH_MATCHUP_MIN_BENCH_HP_RATIO: 0.18,
};

const ENEMY_AI_TYPE_CONFIGS = {
  balanced: {},
  aggressive: {
    WAITING_PENALTY: 40,
    ATTACK_SCORE_MULTIPLIER: 1.1,
    MAIN_SKILL_TYPE_MULTIPLIER: 1.04,
  },
  patient: {
    WAITING_PENALTY: 10,
    SETUP_SKILL_TYPE_MULTIPLIER: 1.08,
  },
  defensive: {
    HEAL_SCORE_MULTIPLIER: 1.15,
    PROTECT_SCORE_MULTIPLIER: 1.15,
    DEFENSE_BUFF_SCORE_MULTIPLIER: 1.15,
  },
  disruptor: {
    STATUS_SCORE_MULTIPLIER: 1.15,
    DEBUFF_SCORE_MULTIPLIER: 1.15,
  },
  tactical: {
    SETUP_SKILL_TYPE_MULTIPLIER: 1.12,
    MAIN_SKILL_TYPE_MULTIPLIER: 1.06,
    SWITCH_MATCHUP_ADVANTAGE_MULTIPLIER: 1.1,
  },
};

const ENEMY_AI_ELEMENT_GUARD_TYPES = {
  fire_damage: "fire",
  water_damage: "water",
  thunder_damage: "thunder",
  ice_damage: "ice",
  dragon_damage: "dragon",
};
const ENEMY_AI_SWITCH_LOCK_BATTLE_EFFECT_ID = "switch_lock";

function chooseEnemyBattleAction(context) {
  const enemy = context.enemy;
  const pendingMoveId = pendingSkillId(enemy);
  if (pendingMoveId) {
    return { side: "enemy", type: "move", moveId: pendingMoveId };
  }

  const lowHp = enemy.hp / enemy.maxHp <= 0.28;
  const bench = context.enemyBenchIndex;
  const switchLocked = enemyAiHasSwitchLock(enemy);

  if (!switchLocked && lowHp && bench >= 0 && Math.random() < 0.22) {
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
  const twoTurnMoveScores = usableMoves
    .map((move) => scoreEnemyTwoTurnMove(enemy, target, move, context, aiConfig))
    .filter(Boolean)
    .map((candidate) => applyEnemySkillPreference(candidate, context, enemy, aiConfig));
  const delayedAttackMoveScores = usableMoves
    .map((move) => scoreEnemyDelayedAttackMove(enemy, target, move, context, aiConfig))
    .filter(Boolean)
    .map((candidate) => applyEnemySkillPreference(candidate, context, enemy, aiConfig));
  const supportMoveScores = usableMoves
    .map((move) => scoreEnemySupportMove(enemy, target, move, context, aiConfig))
    .filter(Boolean)
    .map((candidate) => applyEnemySkillPreference(candidate, context, enemy, aiConfig));
  const usableMoveScores = [
    ...usableAttackMoveScores,
    ...twoTurnMoveScores,
    ...delayedAttackMoveScores,
    ...supportMoveScores,
  ];
  const scoredMoveIds = new Set(usableMoveScores.map((candidate) => candidate.move.skill_id));
  const legacyFallbackMove = pickLegacyEnemyMove(
    usableMoves.filter((move) => (
      !scoredMoveIds.has(move.skill_id) &&
      move.category === "attack" &&
      !hasEnemyAiDelayedAttackBattleEffect(move, context.battleEffects)
    )),
  );
  const saveEnergy = scoreEnemySaveEnergy(enemy, target, allMoves, usableMoveScores, context, aiConfig);
  const knockoutMoves = [...usableAttackMoveScores, ...delayedAttackMoveScores]
    .filter((candidate) => candidate.canKnockout);

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

  const matchupSwitchIndex = !switchLocked && !lowHp
    ? chooseEnemyMatchupSwitchIndex(context, bench, aiConfig)
    : -1;
  if (matchupSwitchIndex >= 0) {
    return { side: "enemy", type: "switch", index: matchupSwitchIndex };
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

    const fallbackMove = pickLegacyEnemyMove(
      usableMoves.filter((move) => !hasEnemyAiDelayedAttackBattleEffect(move, context.battleEffects)),
    );
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
  let score = estimatedDamage * enemyAiTypeMultiplier(aiConfig, "ATTACK_SCORE_MULTIPLIER") -
    move.cost * aiConfig.ENERGY_COST_PENALTY;
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

function scoreEnemyTwoTurnMove(enemy, target, move, context, aiConfig = ENEMY_AI_CONFIG) {
  if (!enemy || !target || !isEnemyAiTwoTurnScoredMove(move, context.battleEffects)) return null;
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
  let score =
    estimatedDamage *
      aiConfig.TWO_TURN_DAMAGE_MULTIPLIER *
      enemyAiTypeMultiplier(aiConfig, "ATTACK_SCORE_MULTIPLIER") -
    aiConfig.WAITING_PENALTY -
    move.cost * aiConfig.ENERGY_COST_PENALTY;
  if (enemy.energy - move.cost <= 0) {
    score -= aiConfig.EMPTY_ENERGY_PENALTY;
  }

  return {
    type: "move",
    move,
    score,
    estimatedDamage,
    canKnockout: false,
    futureCanKnockout: estimatedDamage >= target.hp,
    twoTurn: true,
  };
}

function scoreEnemyDelayedAttackMove(enemy, target, move, context, aiConfig = ENEMY_AI_CONFIG) {
  if (!enemy || !target || !isEnemyAiDelayedAttackScoredMove(move, context.battleEffects)) return null;
  const delayedPairs = enemyAiDelayedAttackBattleEffectPairs(move, context.battleEffects);
  if (!delayedPairs.length) return null;
  if (enemyAiHasPendingDelayedAttack(delayedPairs, context.targetFieldEffects)) return null;

  const setupOnly = enemyAiIsDelayedAttackSetupOnly(move);
  const immediateDamage = setupOnly
    ? 0
    : estimateMoveDamage(
        enemy,
        target,
        move,
        aiConfig,
        context.powerRules,
        context.targetFieldEffects,
      );
  let delayedEstimatedDamage = 0;
  const delayedDamageScore = delayedPairs.reduce((total, pair) => {
    const delayedMove = enemyAiDelayedAttackMove(move, enemy, pair.battleEffect);
    if (!delayedMove) return total;
    const hitCheck = canHitTarget(target, delayedMove);
    if (!hitCheck.canHit) return total;
    const futureDamage = estimateMoveDamage(
      enemy,
      target,
      delayedMove,
      aiConfig,
      context.powerRules,
        context.targetFieldEffects,
      );
    const chanceWeight = enemyAiChanceWeight(pair.chance);
    delayedEstimatedDamage += futureDamage * chanceWeight;
    return total +
      futureDamage *
        aiConfig.DELAYED_DAMAGE_MULTIPLIER *
        chanceWeight;
  }, 0);
  if (setupOnly && delayedDamageScore <= 0) return null;

  const canKnockout = !setupOnly && immediateDamage >= target.hp;
  let score =
    immediateDamage * enemyAiTypeMultiplier(aiConfig, "ATTACK_SCORE_MULTIPLIER") +
    delayedDamageScore -
    move.cost * aiConfig.ENERGY_COST_PENALTY;
  if (setupOnly) {
    score -= aiConfig.WAITING_PENALTY;
  } else {
    score += scoreEnemyTargetStatusMove(target, move, context, aiConfig);
    score += scoreEnemyTargetDebuffMove(target, move, context.effects, aiConfig);
  }
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
    estimatedDamage: immediateDamage,
    delayedEstimatedDamage,
    delayedEstimatedScore: delayedDamageScore,
    canKnockout,
    futureCanKnockout: delayedEstimatedDamage >= target.hp,
    delayedAttack: true,
    delayedSetupOnly: setupOnly,
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
  const candidates = enemyAiSwitchCandidates(context);

  if (candidates.length === 0) return fallbackIndex;
  if (candidates.length === 1) return candidates[0].index;

  const selected = bestEnemySwitchCandidate(context, aiConfig);
  return selected?.index ?? fallbackIndex;
}

function chooseEnemyMatchupSwitchIndex(context, fallbackIndex, aiConfig = ENEMY_AI_CONFIG) {
  if (fallbackIndex < 0) return -1;

  const current = scoreEnemySwitchCandidate(
    { index: -1, fighter: context.enemy, moves: context.allMoves },
    context,
    aiConfig,
  );
  const selected = bestEnemySwitchCandidate(context, aiConfig);
  if (!current || !selected) return -1;
  if (selected.hpRatio < aiConfig.SWITCH_MATCHUP_MIN_BENCH_HP_RATIO) return -1;
  if (selected.score < aiConfig.SWITCH_MATCHUP_MIN_BENCH_SCORE) return -1;
  const advantage = (selected.score - current.score) *
    enemyAiTypeMultiplier(aiConfig, "SWITCH_MATCHUP_ADVANTAGE_MULTIPLIER");
  if (advantage < aiConfig.SWITCH_MATCHUP_ADVANTAGE_THRESHOLD) return -1;

  return selected.index;
}

function bestEnemySwitchCandidate(context, aiConfig = ENEMY_AI_CONFIG) {
  const scoredCandidates = enemyAiSwitchCandidates(context)
    .map((candidate) => scoreEnemySwitchCandidate(candidate, context, aiConfig))
    .filter(Boolean);
  if (!scoredCandidates.length) return null;

  scoredCandidates.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.index - b.index;
  });
  return scoredCandidates[0];
}

function enemyAiSwitchCandidates(context) {
  const candidates = Array.isArray(context.enemySwitchCandidates)
    ? context.enemySwitchCandidates.filter((candidate) => (
        candidate &&
        Number.isInteger(candidate.index) &&
        candidate.index >= 0 &&
        candidate.fighter &&
        !candidate.fighter.fainted
      ))
    : [];

  return candidates;
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
    aiConfig,
  );
  const incoming = bestEnemyAiEstimatedAttackDamage(
    player,
    fighter,
    context.playerMoves,
    context,
    context.enemyFieldEffects,
    aiConfig,
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

function bestEnemyAiEstimatedAttackDamage(
  attacker,
  target,
  moves,
  context,
  targetFieldEffects,
  aiConfig = ENEMY_AI_CONFIG,
) {
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
        aiConfig,
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
    multiplier *= enemyAiTypeMultiplier(aiConfig, "MAIN_SKILL_TYPE_MULTIPLIER");
  }
  if (setupSkillId && skillId === setupSkillId) {
    multiplier *= aiConfig.SETUP_SKILL_SCORE_MULTIPLIER;
    multiplier *= enemyAiTypeMultiplier(aiConfig, "SETUP_SKILL_TYPE_MULTIPLIER");
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
      return total +
        effectiveHeal *
          urgency *
          enemyAiChanceWeight(pair.chance) *
          enemyAiTypeMultiplier(aiConfig, "HEAL_SCORE_MULTIPLIER");
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
      return total +
        amount *
          statWeight *
          stackMultiplier *
          lowHpMultiplier *
          enemyAiChanceWeight(pair.chance) *
          enemyAiSelfBuffTypeMultiplier(stat, aiConfig);
    }, 0);
}

function scoreEnemyProtectMove(enemy, move, context, aiConfig) {
  return enemyAiMoveBattleEffectPairs(move)
    .reduce((total, pair) => {
      const battleEffect = context.battleEffects?.get(pair.effectId);
      if (battleEffect?.battle_effect_group !== "guard") return total;
      if (enemyAiHasActiveGuard(enemy, context.actorFieldEffects, battleEffect.battle_effect_id)) return total;
      if (!enemyAiElementGuardMatchesPlayerMoves(enemy, battleEffect, context)) return total;

      const damageCut = Math.max(0, Number(battleEffect.damage_cut) || 0);
      if (damageCut <= 0) return total;

      const missingRatio = 1 - enemyAiHpRatio(enemy);
      const urgency = aiConfig.PROTECT_BASE_WEIGHT + missingRatio * aiConfig.PROTECT_MISSING_HP_WEIGHT;
      const turnBonus = Math.max(0, Math.min(4, Math.floor(Number(battleEffect.turn) || 0))) * aiConfig.PROTECT_TURN_BONUS;
      return total +
        (damageCut * urgency + turnBonus) *
          enemyAiChanceWeight(pair.chance) *
          enemyAiTypeMultiplier(aiConfig, "PROTECT_SCORE_MULTIPLIER");
    }, 0);
}

function enemyAiElementGuardMatchesPlayerMoves(enemy, battleEffect, context) {
  const requiredElement = ENEMY_AI_ELEMENT_GUARD_TYPES[safeText(battleEffect?.guard_type)];
  if (!requiredElement) return true;

  return (context.playerMoves ?? []).some((playerMove) => (
    playerMove?.category === "attack" &&
    safeText(playerMove.element, "none") === requiredElement &&
    playerMove.cost <= (context.target?.energy ?? 0) &&
    canHitTarget(enemy, playerMove).canHit
  ));
}

function enemyAiHasSwitchLock(fighter) {
  return Boolean(
    fighter?.battleEffects?.some((effect) => effect.id === ENEMY_AI_SWITCH_LOCK_BATTLE_EFFECT_ID),
  );
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
      return total +
        enemyAiControlStatusScore(battleEffect, target, aiConfig) *
          enemyAiChanceWeight(pair.chance) *
          enemyAiTypeMultiplier(aiConfig, "STATUS_SCORE_MULTIPLIER");
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
      return total +
        amount *
          enemyAiDebuffStatWeight(stat) *
          targetHpMultiplier *
          stackMultiplier *
          enemyAiChanceWeight(pair.chance) *
          enemyAiTypeMultiplier(aiConfig, "DEBUFF_SCORE_MULTIPLIER");
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

function isEnemyAiDelayedAttackScoredMove(move, battleEffects) {
  return Boolean(
    move &&
      move.category === "attack" &&
      move.target !== "self" &&
      !twoTurnBattleEffectId(move) &&
      hasEnemyAiDelayedAttackBattleEffect(move, battleEffects)
  );
}

function isEnemyAiTwoTurnScoredMove(move, battleEffects) {
  return Boolean(
    move &&
      move.category === "attack" &&
      move.target !== "self" &&
      twoTurnBattleEffectId(move) &&
      !hasEnemyAiDelayedAttackBattleEffect(move, battleEffects)
  );
}

function enemyAiDelayedAttackBattleEffectPairs(move, battleEffects) {
  return enemyAiMoveBattleEffectPairs(move)
    .map((pair) => ({
      ...pair,
      battleEffect: battleEffects?.get(pair.effectId),
    }))
    .filter((pair) => pair.battleEffect?.battle_effect_group === "delayed_attack");
}

function enemyAiHasPendingDelayedAttack(delayedPairs, targetFieldEffects) {
  return delayedPairs.some((pair) => (
    (targetFieldEffects ?? []).some((effect) => (
      effect?.group === "delayed_attack" && effect.id === pair.effectId
    ))
  ));
}

function enemyAiIsDelayedAttackSetupOnly(move) {
  if (move?.category !== "attack") return true;
  if (typeof hasSetupOnlyDelayedAttackBattleEffect === "function") {
    return hasSetupOnlyDelayedAttackBattleEffect(move);
  }
  return false;
}

function enemyAiDelayedAttackMove(move, enemy, battleEffect) {
  const delayedMove = typeof delayedBattleEffectPayload === "function"
    ? delayedBattleEffectPayload(move, enemy, battleEffect)?.delayedMove
    : enemyAiDelayedAttackMoveFallback(move, battleEffect);
  if (!delayedMove) return null;

  return {
    skill_id: battleEffect.battle_effect_id,
    name: delayedMove.name || battleEffect.name,
    category: "attack",
    power: Math.max(1, Number(delayedMove.power) || 1),
    element: safeText(delayedMove.element, "none"),
    attack_type: safeText(delayedMove.attack_type, "special"),
    hit_type: safeText(delayedMove.hit_type, "sure_hit"),
    animation_id: safeText(delayedMove.animation_id),
    animation_duration_ms: Math.max(0, Number(delayedMove.animation_duration_ms) || 0),
    repeat_count: Math.max(0, Number(delayedMove.repeat_count) || 0),
    target: "enemy",
    cost: 0,
  };
}

function enemyAiDelayedAttackMoveFallback(move, battleEffect) {
  const fixedPower = battleEffect.damage_type === "fixed_power"
    ? Number(battleEffect.damage_value) || 0
    : 0;
  const ratePower = battleEffect.damage_type === "skill_power_rate"
    ? Math.round((Number(move.power) || 0) * ((Number(battleEffect.damage_value) || 100) / 100))
    : 0;
  return {
    name: move.name,
    power: Math.max(1, fixedPower || ratePower || Number(move.power) || 1),
    element: safeText(move.element, "none"),
    attack_type: safeText(move.attack_type, "special"),
    hit_type: safeText(move.hit_type, "sure_hit"),
    animation_id: safeText(move.animation_id),
    animation_duration_ms: Math.max(0, Number(move.animation_duration_ms) || 0),
    repeat_count: Math.max(0, Number(move.repeat_count) || 0),
  };
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

function enemyAiTypeMultiplier(aiConfig, key) {
  const value = Number(aiConfig?.[key]);
  return Number.isFinite(value) && value > 0 ? value : 1;
}

function enemyAiSelfBuffTypeMultiplier(stat, aiConfig) {
  let multiplier = enemyAiTypeMultiplier(aiConfig, "SELF_BUFF_SCORE_MULTIPLIER");
  if (stat === "phy_def" || stat === "sp_def") {
    multiplier *= enemyAiTypeMultiplier(aiConfig, "DEFENSE_BUFF_SCORE_MULTIPLIER");
  }
  return multiplier;
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
  const multiplier =
    enemyAiStatusEffectMultiplier(effect, aiConfig) *
    enemyAiTypeMultiplier(aiConfig, "STATUS_SCORE_MULTIPLIER");
  if (effect.effect_group === "control") {
    return enemyAiControlStatusScore(effect, target, aiConfig) * multiplier;
  }
  if (effect.effect_group === "damage") {
    return enemyAiDamageStatusScore(effect, target, aiConfig) * multiplier;
  }
  return 0;
}

function enemyAiStatusEffectMultiplier(effect, aiConfig) {
  const effectId = safeText(effect?.effect_id || effect?.battle_effect_id);
  return aiConfig.STATUS_EFFECT_SCORE_MULTIPLIERS?.[effectId] ?? 1;
}

function enemyAiControlStatusScore(effect, target, aiConfig) {
  const targetHpRatio = enemyAiHpRatio(target);
  const targetHpMultiplier = Math.max(aiConfig.STATUS_TARGET_HP_MIN_MULTIPLIER, targetHpRatio);
  const turns = Math.max(1, Math.floor(Number(effect.turn) || 1));
  return (
    (aiConfig.STATUS_CONTROL_BASE_SCORE + Math.min(4, turns) * aiConfig.STATUS_TURN_BONUS) *
      targetHpMultiplier
  );
}

function enemyAiDamageStatusScore(effect, target, aiConfig) {
  const targetHpRatio = enemyAiHpRatio(target);
  const targetHpMultiplier = Math.max(aiConfig.STATUS_TARGET_HP_MIN_MULTIPLIER, targetHpRatio);
  const turns = Math.max(1, Math.min(4, Math.floor(Number(effect.turn) || 1)));
  const damageValue = Math.max(0, Math.abs(Number(effect.damage_value) || 0));
  if (damageValue <= 0) return 0;

  const estimatedDamage = effect.damage_type === "percent_maxhp"
    ? (target?.maxHp ?? 0) * (damageValue / 100) * turns
    : damageValue * turns;
  return (
    aiConfig.STATUS_DAMAGE_BASE_SCORE *
      targetHpMultiplier +
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

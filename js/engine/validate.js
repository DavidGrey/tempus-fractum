// Checks story content for mistakes (typos in node ids, missing items, dead
// ends) when the game loads. Problems are printed to the browser console and
// shown in the debug panel (?debug in the URL). It never stops the game.

import { toArray } from './conditions.js';

export function validateContent({ scenes, characters, items, chapters }) {
  const problems = [];

  for (const [sceneId, scene] of Object.entries(scenes)) {
    const at = (nodeId) => `${sceneId}.${nodeId}`;
    if (scene.id !== sceneId) problems.push(`Scene registered as "${sceneId}" has id "${scene.id}"`);
    if (!scene.nodes?.[scene.start]) problems.push(`Scene "${sceneId}": start node "${scene.start}" does not exist`);
    if (scene.chapter && !chapters[scene.chapter]) problems.push(`Scene "${sceneId}": unknown chapter "${scene.chapter}"`);
    if (scene.character && !characters[scene.character]) problems.push(`Scene "${sceneId}": unknown character "${scene.character}"`);
    checkEffects(scene.onEnter, `Scene "${sceneId}" onEnter`);
    for (const rule of scene.patience ?? []) {
      if (!rule.npc || !rule.max || !rule.fail) problems.push(`Scene "${sceneId}": patience rules need npc, max, and fail`);
      else checkTarget(rule.fail, sceneId, `Scene "${sceneId}" patience "${rule.npc}"`);
    }

    for (const [nodeId, node] of Object.entries(scene.nodes ?? {})) {
      const versions = [node, ...(node.variants ?? [])];
      for (const v of versions) {
        const where = at(nodeId);
        if (v.next) checkTarget(v.next, sceneId, where);
        if (v.ending?.next) checkTarget(v.ending.next, sceneId, `${where} ending`);
        if (v.skipIf && !v.next) problems.push(`${where}: skipIf needs a "next" to skip to`);
        if (v.speaker && !characters[v.speaker]) problems.push(`${where}: unknown speaker "${v.speaker}"`);
        if (v.character && !characters[v.character]) problems.push(`${where}: unknown character "${v.character}"`);
        if (v.choicesFrom && !scene.nodes[v.choicesFrom]) problems.push(`${where}: choicesFrom "${v.choicesFrom}" does not exist`);
        checkEffects(v.onEnter, `${where} onEnter`);
        for (const choice of v.choices ?? []) {
          const label = `${where} choice "${choice.say ?? choice.action ?? '?'}"`;
          if (!choice.say && !choice.action) problems.push(`${label}: needs "say" or "action"`);
          if (!choice.next) problems.push(`${label}: missing "next"`);
          if (choice.strike && !(scene.patience ?? []).some((r) => r.npc === choice.strike)) {
            problems.push(`${label}: strike "${choice.strike}" has no patience rule in this scene`);
          }
          else checkTarget(choice.next, sceneId, label);
          checkEffects(choice.effects, label);
        }
      }
      const leadsSomewhere = versions.some((v) => v.choices?.length || v.choicesFrom || v.next || v.ending);
      if (!leadsSomewhere) problems.push(`${at(nodeId)}: dead end (no choices, next, or ending)`);
    }
  }

  function checkTarget(target, sceneId, where) {
    if (typeof target === 'string') {
      if (!scenes[sceneId].nodes[target]) problems.push(`${where}: next node "${target}" does not exist`);
    } else if (!scenes[target.scene]) {
      problems.push(`${where}: next scene "${target.scene}" does not exist`);
    } else if (target.node && !scenes[target.scene].nodes[target.node]) {
      problems.push(`${where}: node "${target.node}" does not exist in scene "${target.scene}"`);
    }
  }

  function checkEffects(fx, where) {
    if (!fx) return;
    for (const id of [...toArray(fx.addItems), ...toArray(fx.removeItems)]) {
      if (!items[id]) problems.push(`${where}: unknown item "${id}"`);
    }
  }

  return problems;
}

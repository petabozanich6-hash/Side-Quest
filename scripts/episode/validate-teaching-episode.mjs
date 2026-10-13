/**
 * Validate teaching-episode JSON (Phase 2 pilot schema).
 * Usage: node scripts/episode/validate-teaching-episode.mjs [path]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');

function fail(msg) {
  throw new Error(msg);
}

function nonempty(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

export function validateTeachingEpisode(ep) {
  if (!ep || ep.format !== 'teaching') fail('format must be teaching');
  if (!nonempty(ep.id) || !nonempty(ep.seed_key)) fail('id and seed_key required');
  if (!nonempty(ep.title) || !nonempty(ep.transcript)) fail('title and transcript required');
  if (!nonempty(ep.learning_intention)) fail('learning_intention required');
  if (!['S2', 'S3', 'S4'].includes(ep.stage)) fail('stage must be S2, S3 or S4');
  if (!Array.isArray(ep.scenes) || ep.scenes.length < 3) fail('at least 3 scenes required');

  const roles = new Set();
  let interacts = 0;
  const mathChecks = [];

  for (const scene of ep.scenes) {
    if (!nonempty(scene.id) || !nonempty(scene.title)) fail(`scene missing id/title`);
    if (!['park', 'room', 'evening', 'board'].includes(scene.bg)) fail(`${scene.id}: bad bg`);
    if (!Array.isArray(scene.beats) || !scene.beats.length) fail(`${scene.id}: beats required`);
    if (scene.role) roles.add(scene.role);

    for (const beat of scene.beats) {
      if (!['narrate', 'diagram', 'interact', 'pause', 'conclude'].includes(beat.type)) {
        fail(`${scene.id}: bad beat type ${beat.type}`);
      }
      if (beat.who && !['pip', 'juno'].includes(beat.who)) fail(`${scene.id}: bad speaker`);
      if (beat.diagram) {
        const d = beat.diagram;
        if (d.type !== 'number_line') fail(`${scene.id}: only number_line diagrams supported`);
        if (!(d.low < d.high) || d.value < d.low || d.value > d.high) {
          fail(`${scene.id}: number_line bounds invalid`);
        }
        mathChecks.push({
          scene: scene.id,
          low: d.low,
          high: d.high,
          value: d.value,
          left: d.value - d.low,
          right: d.high - d.value,
        });
      }
      if (beat.type === 'interact') {
        interacts += 1;
        if (!nonempty(beat.prompt) || !Array.isArray(beat.choices) || beat.choices.length < 2) {
          fail(`${scene.id}: interact incomplete`);
        }
        if (!Number.isInteger(beat.correct_index) || beat.correct_index < 0 || beat.correct_index >= beat.choices.length) {
          fail(`${scene.id}: correct_index out of range`);
        }
        if (!beat.feedback?.correct || !beat.feedback?.incorrect) fail(`${scene.id}: feedback required`);
      }
    }
  }

  if (interacts < 2) fail('need at least 2 interactive beats');
  if (!roles.has('introduce') || !roles.has('conclusion')) fail('introduce and conclusion roles required');

  // Pilot math assertions for the rounding episode
  if (ep.seed_key === 's2-mat-y3-w02-l1') {
    const byScene = Object.fromEntries(mathChecks.map((m) => [m.scene, m]));
    const worked = byScene.worked;
    if (!worked || worked.value !== 224 || worked.left !== 4 || worked.right !== 6) {
      fail('pilot worked example must be 224 with distances 4 and 6');
    }
    const mis = byScene.misconception;
    if (!mis || mis.value !== 368 || mis.left !== 8 || mis.right !== 2) {
      fail('pilot misconception must be 368 with distances 8 and 2');
    }
    const mid = byScene.midpoint;
    if (!mid || mid.value !== 450 || mid.left !== 50 || mid.right !== 50) {
      fail('pilot midpoint must be 450 with equal distances 50');
    }
    const challenge = byScene.challenge;
    if (!challenge || challenge.value !== 163 || challenge.left !== 3 || challenge.right !== 7) {
      fail('pilot challenge must be 163 with distances 3 and 7');
    }
  }

  return { scenes: ep.scenes.length, interacts, mathChecks: mathChecks.length };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const target = process.argv[2] || path.join(root, 'frontend/src/episodes/s2-mat-y3-w02-l1.json');
  const data = JSON.parse(fs.readFileSync(target, 'utf8'));
  const result = validateTeachingEpisode(data);
  console.log(`Teaching episode OK: ${path.relative(root, target)}`, result);
}

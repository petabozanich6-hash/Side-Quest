import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateTeachingEpisode } from './validate-teaching-episode.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const pilotPath = path.join(root, 'frontend/src/episodes/s2-mat-y3-w02-l1.json');
const pilot = JSON.parse(fs.readFileSync(pilotPath, 'utf8'));

const ok = validateTeachingEpisode(pilot);
assert.equal(ok.scenes, 9);
assert.ok(ok.interacts >= 4);

const broken = structuredClone(pilot);
broken.scenes.find((s) => s.id === 'worked').beats[0].diagram.value = 229;
assert.throws(() => validateTeachingEpisode(broken), /distances 4 and 6/);

const badChoice = structuredClone(pilot);
const interact = badChoice.scenes.find((s) => s.id === 'predict').beats[0];
interact.correct_index = 99;
assert.throws(() => validateTeachingEpisode(badChoice), /correct_index/);

console.log('Teaching episode schema and rounding math checks passed.');

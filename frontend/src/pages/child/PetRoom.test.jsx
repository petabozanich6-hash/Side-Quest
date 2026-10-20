import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import PetRoom from './PetRoom';
import { api } from '../../lib/api';
jest.mock('react-router-dom', () => ({ useNavigate: () => jest.fn() }));
jest.mock('../../lib/api', () => ({ api: { get: jest.fn(), post: jest.fn(), put: jest.fn() } }));
jest.mock('../../lib/sfx', () => ({ sfxOn: () => false, setSfx: jest.fn(), playSfx: jest.fn() }));
jest.mock('../../components/shared/useSeasonal', () => ({ __esModule: true, default: () => ({ packs: [], keepsakes: [{ id: 'star', slot: 'chest', emoji: '⭐', worn: true }] }) }));
jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
global.IS_REACT_ACT_ENVIRONMENT = true;
let host, root, pet;
const find = id => host.querySelector(`[data-testid="${id}"]`);
const click = async id => act(async () => find(id).click());
beforeEach(() => {
  jest.clearAllMocks();
  pet = { name: 'Fern', species: 'fox', hatched: true, level_name: 'Companion', xp: 1900, next_xp: 4500, happiness: 85, accessories: ['cape', 'scarf', 'flower_crown'], care: { needs_cleaning: true }, accessory_catalog: [{ id: 'scarf', label: 'Scarf', unlocked: true }] };
  api.get.mockImplementation(async path => { if (path === '/pet/quests') throw new Error('optional quests unavailable'); return { data: pet }; });
  api.post.mockResolvedValue({ data: {} });
  api.put.mockResolvedValue({ data: {} });
  host = document.createElement('div'); document.body.appendChild(host); root = createRoot(host);
});
afterEach(async () => { await act(async () => root.unmount()); host.remove(); });
const render = () => act(async () => root.render(<PetRoom />));
test.each(['fox', 'owl', 'turtle', 'hedgehog', 'fawn', 'squirrel', 'rabbit', 'dragon', 'goblin'])('%s retains pet art and front, back and seasonal accessory layers', async species => {
  pet.species = species; await render();
  expect(find('pet-body').querySelector('svg').getAttribute('viewBox')).toBe('0 0 120 120');
  expect(find('pet-body').querySelector('svg').getAttribute('data-species')).toBe(species);
  expect(find('worn-accessories')).not.toBeNull(); expect(find('worn-accessories-back')).not.toBeNull(); expect(find('worn-seasonal')).not.toBeNull();
  expect(find('pet-scene').getAttribute('data-scene')).toBe('cozy');
  expect(host.querySelector('[role="progressbar"][aria-label="XP"]').getAttribute('aria-valuenow')).toBe('1900');
});
test('care controls retain endpoints and clean-up is separate from hello', async () => {
  await render(); expect(find('pet-body').contains(find('poop'))).toBe(false);
  await click('feed-btn'); expect(api.post).toHaveBeenLastCalledWith('/pet/care/feed');
  await click('play-btn'); expect(api.post).toHaveBeenLastCalledWith('/pet/care/play');
  await click('poop'); expect(api.post).toHaveBeenLastCalledWith('/pet/care/clean');
  await act(async () => find('pet-body').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })));
  expect(find('pet-body').className).toContain('act-hello');
  expect(api.post).toHaveBeenCalledTimes(3);
});
test('egg keeps warming, cuddling, hatch progress and seasonal prizes', async () => {
  pet.hatched = false; pet.level_name = 'Egg'; pet.hatch = { xp_needed: 60, care_days_needed: 3, care_days_done: 1 }; await render();
  expect(find('feed-btn').textContent).toContain('Warm up'); expect(find('play-btn').textContent).toContain('Cuddle');
  expect(find('clean-btn')).toBeNull(); expect(find('hatch-progress').textContent).toContain('1/3'); expect(find('worn-seasonal')).not.toBeNull();
});
test('wardrobe changes preserve remaining accessories', async () => {
  await render(); await click('acc-scarf');
  expect(api.put).toHaveBeenCalledWith('/pet/care/wear', { accessories: ['cape', 'flower_crown'] });
});

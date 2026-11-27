import test from 'node:test';
import assert from 'node:assert/strict';
import { initial } from '../src/data.js';
import { effectCategories } from '../src/ui-index.js';
import { effectEntries, effectSections, colorEffectSections, effectEntry, parentSection, entryActive,
  directoryEntries, readFavorites, validCategory, FAVORITES_KEY } from '../src/effects-navigation.js';

const browse = (category, extra = {}) => directoryEntries({view:'browse',category,query:'',favorites:[],state:initial,...extra});

test('families cover every original Effects section once and every nested lab has a parent', () => {
  const all = effectCategories.flatMap(category => browse(category.id));
  const count=effectSections.length+colorEffectSections.length;
  assert.equal(all.length, count);
  assert.equal(new Set(all.map(entry => entry.id)).size, count);
  assert.equal(new Set(effectEntries.map(entry => entry.id)).size, effectEntries.length);
  for (const entry of effectEntries) {
    assert.ok(effectCategories.some(category => category.id === entry.group), entry.id);
    assert.ok(effectEntry(parentSection(entry)), `${entry.id} has controls`);
  }
  assert.equal(validCategory('not-a-family'), 'Signal');
  assert.equal(validCategory('Time'), 'Time');
});

test('favorites tolerate damaged/private storage and never enter the artwork state', () => {
  const stateBefore = JSON.stringify(initial);
  const storage = value => ({getItem:key => {assert.equal(key, FAVORITES_KEY);return value;}});
  for (const value of ['invalid', '{}', 'null', '42']) assert.deepEqual(readFavorites(storage(value)), []);
  assert.deepEqual(readFavorites({getItem(){throw new Error('Private storage');}}), []);
  assert.deepEqual(readFavorites(storage('["signal","signal","unknown","filament-neural"]')), ['signal','filament-neural']);
  const saved = ['signal','filament-neural'];
  const favoritesBefore = [...saved];
  const result = directoryEntries({view:'favorites',category:'Light',query:'',favorites:saved,state:initial});
  assert.deepEqual(result.map(entry => entry.id).sort(), [...saved].sort());
  assert.deepEqual(saved, favoritesBefore);
  assert.equal(JSON.stringify(initial), stateBefore);
});

test('effect search crosses categories, collapsed labs and dashboard filters', () => {
  for (const view of ['browse','active','favorites']) {
    const result = directoryEntries({view,category:'Signal',query:'synaptic plasticity',favorites:[],state:initial});
    assert.ok(result.some(entry => entry.id === 'filament-plasticity'), view);
    assert.ok(result.every(entry => entry.group === 'Materials'), view);
  }
  const result = browse('Signal',{query:'Schlieren'});
  assert.ok(result.some(entry => entry.id === 'schlieren' && entry.group === 'Light'));
  assert.deepEqual(browse('Signal',{query:'zzqqxx'}), []);
});

test('active dashboard reports contributing systems and reads state without modifying it', () => {
  const state = structuredClone({...initial, bloom:true, photonAmount:80, filamentAmount:80,
    filamentNeuralMode:'Axon train', filamentNeuralAmount:80,
    colonyLifeAmount:80, colonyLifeMode:'Still', colonyFrontGlow:0});
  const before = structuredClone(state);
  const active = directoryEntries({view:'active',category:'Signal',query:'',favorites:[],state});
  for (const id of ['fx-toggles','photon','filament','filament-neural'])
    assert.ok(active.some(entry => entry.id === id), id);
  assert.ok(!active.some(entry => entry.id === 'colony-life'));
  for (const category of effectCategories) browse(category.id, {state});
  for (const entry of effectEntries) entryActive(entry, state);
  assert.deepEqual(state, before, 'navigation, search and activity checks preserve all artwork settings');
});

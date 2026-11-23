import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { numericRanges } from '../src/data.js';
import { sectionMeta } from '../src/ui-index.js';
import { effectControlSnapshot } from './helpers/effect-control-snapshot.mjs';

const baseline = JSON.parse(readFileSync(new URL('./fixtures/effects-controls-cc8d06e.json', import.meta.url), 'utf8'));

test('all original Effects control bindings and action callbacks survive navigation changes', async () => {
  const source = readFileSync(new URL('../src/components/Inspectors.jsx', import.meta.url), 'utf8');
  const current = await effectControlSnapshot(source);
  const remaining = new Map();
  for (const declaration of current) remaining.set(declaration.digest, (remaining.get(declaration.digest) || 0) + 1);
  for (const declaration of baseline.declarations) {
    const count = remaining.get(declaration.digest) || 0;
    assert.ok(count > 0, `Original ${declaration.kind} ${declaration.label || declaration.binding || declaration.digest} changed its binding, range, or action`);
    remaining.set(declaration.digest, count - 1);
  }
  // One mapped Pill declaration creates Bloom, Posterize and Invert.
  const controls = baseline.declarations.filter(d => !['button', 'Reseed'].includes(d.kind));
  assert.equal(controls.length + 2, 390);
  assert.equal(baseline.declarations.filter(d => ['button', 'Reseed'].includes(d.kind)).length, 204);
});

test('all original Effects slider ranges and section reset keys remain intact', () => {
  for (const [name, range] of Object.entries(baseline.numericRanges))
    assert.deepEqual(numericRanges[name], range, `${name} range`);
  for (const [id, keys] of Object.entries(baseline.sectionResets)) {
    assert.ok(sectionMeta(id), `${id} remains indexed`);
    for (const key of keys) assert.ok(sectionMeta(id).reset?.includes(key), `${id} still resets ${key}`);
  }
});

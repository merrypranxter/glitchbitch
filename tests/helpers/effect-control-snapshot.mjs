import { createHash } from 'node:crypto';
import { transformWithEsbuild } from 'vite';
import { parseAst } from 'rollup/parseAst';

const controls = new Set(['Parameter', 'Range', 'Select', 'Toggle', 'Switch', 'Pill', 'input']);
const actions = new Set(['button', 'Reseed']);
// These properties define behavior. Navigation/data attributes and extra control
// declarations may evolve freely without weakening the old bindings check.
const semantic = new Set(['name', 'value', 'checked', 'min', 'max', 'step',
  'format', 'options', 'onStart', 'onChange', 'onEnd', 'onCancel', 'onClick', 'disabled']);
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value)
    .filter(key => !['start', 'end', 'loc', 'raw'].includes(key))
    .sort().map(key => [key, canonical(value[key])]));
  return value;
}
function walk(node, visit) {
  if (!node || typeof node !== 'object') return;
  if (node.type) visit(node);
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) value.forEach(child => walk(child, visit));
    else if (value && typeof value === 'object') walk(value, visit);
  }
}
function text(node) {
  if (!node) return '';
  if (node.type === 'Literal') return String(node.value);
  if (node.type === 'Identifier') return node.name;
  if (node.type === 'MemberExpression') return `${text(node.object)}.${text(node.property)}`;
  return '';
}
export async function effectControlSnapshot(source) {
  const { code } = await transformWithEsbuild(source, 'Inspectors.jsx', { loader: 'jsx' });
  const ast = parseAst(code);
  let inspector;
  walk(ast, node => {
    if (node.type === 'FunctionDeclaration' && node.id?.name === 'EffectsInspector') inspector = node;
  });
  if (!inspector) throw new Error('EffectsInspector missing');
  let body;
  walk(inspector, node => {
    if (node.type === 'VariableDeclarator' && node.id?.name === 'body') body = node.init;
  });
  if (!body) throw new Error('Effects control body missing');
  const result = [];
  walk(inspector, node => {
    if (node.type !== 'CallExpression' || text(node.callee) !== 'React.createElement') return;
    const [component, properties] = node.arguments;
    const kind = text(component);
    if (!controls.has(kind) && !actions.has(kind)) return;
    if (actions.has(kind) && (node.start < body.start || node.end > body.end)) return;
    const props = (properties?.properties || []).filter(p => semantic.has(text(p.key)))
      .map(p => [text(p.key), canonical(p.value)]).sort(([a], [b]) => a.localeCompare(b));
    const digest = createHash('sha256').update(JSON.stringify({ kind, props })).digest('hex');
    const get = key => text(properties?.properties?.find(p => text(p.key) === key)?.value);
    result.push({kind, label:get('label') || (actions.has(kind) ? node.arguments.slice(2).map(text).filter(Boolean).join(' ').trim() : ''), binding:get('name') || get('value') || get('checked'), digest});
  });
  return result;
}

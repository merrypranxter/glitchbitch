import assert from 'node:assert/strict';
import {lifePositions} from '../src/life-physics.js';
const s={seed:42,lifePopulation:30,lifeSize:60,lifeSpeed:80,lifeVariation:70,lifeEvolution:100,lifeBirthRate:90,lifeMutation:0,lifeMortality:80};
for(let mode=0;mode<9;mode++){
 const cfg={...s,lifeBehavior:(mode+.5)*100/9};
 const first=lifePositions(cfg,12,810,1440);
 lifePositions(cfg,0,810,1440);
 const again=lifePositions(cfg,12,810,1440);
 assert.deepEqual([...first],[...again]);assert.deepEqual([...first.trails],[...again.trails]);assert.deepEqual([...first.impacts],[...again.impacts]);
 for(let i=0;i<96;i+=4){if(!first[i+3])continue;assert.ok(first[i+2]>0);assert.ok(first[i]>=first[i+2]-1e-6);assert.ok(first[i]<=810/1440-first[i+2]+1e-6);assert.ok(first[i+1]>=first[i+2]-1e-6);assert.ok(first[i+1]<=1-first[i+2]+1e-6);}
}
console.log('Lifeform deterministic replay and bounds checks passed');

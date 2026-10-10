import {describe,it,expect} from 'vitest';
import {project} from '../src/lib/finance';
describe('simulation commerciale',()=>{
 it('sépare chiffre d’affaires, MRR et marge et borne l’objectif',()=>{
  expect(project({users:1000,conversion:2,creatorPrice:9,business:5,businessPrice:199,ads:200,costs:500})).toEqual({mrr:1175,turnover:1375,arr:14100,margin:875,remaining:8625});
 });
});

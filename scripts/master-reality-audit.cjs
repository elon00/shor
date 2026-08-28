#!/usr/bin/env node
/**
 * SHOR Master Reality Audit — fail-closed release gate.
 * Checks that claims have corresponding executable evidence.
 */
const fs=require('node:fs'); const path=require('node:path');
const root=path.join(__dirname,'..');
function read(p){try{return fs.readFileSync(path.join(root,p),'utf8')}catch{return ''}}
const manifest=read('deployments.json');
const pqc=read('scripts/pqc-reality-gate.cjs');
const verifier=read('scripts/verify-real-deployment.cjs');
const workflows=fs.existsSync(path.join(root,'.github/workflows'))?fs.readdirSync(path.join(root,'.github/workflows')).join('\n'):'';
const checks=[
 ['deployment manifest exists',manifest.length>0],
 ['deployment manifest contains no obvious placeholder address',!/(PQC|PLACEHOLDER|EXAMPLE)/i.test(manifest)],
 ['real RPC bytecode gate exists',/eth_getCode/.test(verifier)],
 ['PQC gate exists',/PQC_REALITY_GATE/.test(pqc)],
 ['CI workflow directory exists',workflows.length>0],
];
let bad=checks.filter(x=>!x[1]); checks.forEach(([n,v])=>console.log(`${v?'PASS':'FAIL'} ${n}`));
if(bad.length){console.error(`MASTER_REALITY_GATE=FAIL (${bad.length} checks)`);process.exit(1)}
console.log('MASTER_REALITY_GATE=PASS');

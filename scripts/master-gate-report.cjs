#!/usr/bin/env node
/** SHOR Master Gate: deterministic, fail-closed release evidence report. */
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const exists=p=>fs.existsSync(path.join(root,p));
const read=p=>exists(p)?fs.readFileSync(path.join(root,p),'utf8'):'';
const manifest=read('deployments.json');
const checks=[
 ['SOURCE_PRESENT',exists('package.json')],
 ['REAL_RPC_GATE',read('scripts/verify-real-deployment.cjs').includes('eth_getCode')],
 ['PQC_FAIL_CLOSED_GATE',read('scripts/pqc-reality-gate.cjs').includes('process.exit(1)')],
 ['MASTER_AUDIT',read('scripts/master-reality-audit.cjs').includes('MASTER_REALITY_GATE')],
 ['NO_PLACEHOLDER_DEPLOYMENT',manifest.length>0&&!/(PQC|PLACEHOLDER|EXAMPLE)/i.test(manifest)],
];
const report={timestamp:new Date().toISOString(),checks:Object.fromEntries(checks),release:'BLOCKED'};
if(checks.every(([,ok])=>ok)) report.release='READY_FOR_EXTERNAL_CHAIN_EVIDENCE';
fs.writeFileSync(path.join(root,'master-gate-report.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(report.release!=='READY_FOR_EXTERNAL_CHAIN_EVIDENCE') process.exit(1);

#!/usr/bin/env node
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>{try{return fs.readFileSync(path.join(root,p),'utf8')}catch{return ''}};
const manifest=read('deployments.json');
const checks={
 source:!!read('package.json'),
 buildScript:/build/.test(read('package.json')),
 realRpcGate:/eth_getCode/.test(read('scripts/verify-real-deployment.cjs')),
 pqcFailClosed:/PQC_REALITY_GATE=FAIL/.test(read('scripts/pqc-reality-gate.cjs')),
 releaseGate:!!read('scripts/release-evidence-gate.cjs'),
 masterGate:!!read('scripts/master-reality-audit.cjs'),
 deploymentNotFaked:/NOT_DEPLOYED_VERIFIED/i.test(manifest)
};
const failed=Object.entries(checks).filter(([,v])=>!v).map(([k])=>k);
const verdict={checks,failed,release:failed.length?'BLOCKED':'READY_FOR_EXTERNAL_EVIDENCE',timestamp:new Date().toISOString()};
fs.writeFileSync(path.join(root,'god-mode-master-verdict.json'),JSON.stringify(verdict,null,2)+'\n');
console.log(JSON.stringify(verdict,null,2));
if(failed.length) process.exit(1);

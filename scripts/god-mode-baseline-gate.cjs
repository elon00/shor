#!/usr/bin/env node
/** Final baseline gate: verify automation exists and fail closed on unproven reality. */
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>{try{return fs.readFileSync(path.join(root,p),'utf8')}catch{return ''}};
const manifest=read('deployments.json');
const checks={
  source:!!read('package.json'),
  ci:fs.existsSync(path.join(root,'.github','workflows')),
  chainVerifier:/eth_getCode/.test(read('scripts/verify-real-deployment.cjs')),
  pqcGate:/PQC_REALITY_GATE/.test(read('scripts/pqc-reality-gate.cjs')),
  katGate:/PQC_KAT_REALITY_GATE/.test(read('scripts/pqc-kat-reality-gate.cjs')),
  releaseGate:!!read('scripts/release-evidence-gate.cjs'),
  deploymentManifestPresent:manifest.length>0,
  noFakeCertification:!/DEPLOYED_AND_VERIFIED/i.test(manifest)
};
const failed=Object.entries(checks).filter(([,v])=>!v).map(([k])=>k);
const result={checks,failed,status:failed.length?'BLOCKED':'BASELINE_READY',timestamp:new Date().toISOString()};
fs.writeFileSync(path.join(root,'god-mode-baseline.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
if(failed.length) process.exit(1);

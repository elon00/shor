#!/usr/bin/env node
/** SHOR: final release gate. Never promotes a project based on claims alone. */
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>{try{return fs.readFileSync(path.join(root,p),'utf8')}catch{return ''}};
const manifest=read('deployments.json');
const report={
  source:!!read('package.json'),
  realRpcVerifier:/eth_getCode/.test(read('scripts/verify-real-deployment.cjs')),
  pqcGate:/PQC_REALITY_GATE=PASS/.test(read('scripts/pqc-reality-gate.cjs')),
  deploymentEvidence:/(txHash|transactionHash)/i.test(manifest)&&!/NOT_DEPLOYED_VERIFIED/i.test(manifest),
  status:'BLOCKED'
};
report.status=Object.values(report).every(v=>v===true)?'RELEASE_CANDIDATE':'BLOCKED';
fs.writeFileSync(path.join(root,'release-evidence.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(report.status!=='RELEASE_CANDIDATE') process.exit(1);

#!/usr/bin/env node
/**
 * SHOR Master Chain+PQC Gate.
 * Generates an evidence report and fails closed. It never creates or guesses
 * credentials, addresses, transaction hashes, cryptographic vectors, or proofs.
 */
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>{try{return fs.readFileSync(path.join(root,p),'utf8')}catch{return ''}};
const manifest=read('deployments.json');
const checks={
  source:!!read('package.json'),
  chainVerifier:/eth_getCode/.test(read('scripts/verify-real-deployment.cjs')),
  pqcGate:/PQC_REALITY_GATE/.test(read('scripts/pqc-reality-gate.cjs')),
  katGate:/PQC_KAT_REALITY_GATE/.test(read('scripts/pqc-kat-reality-gate.cjs')),
  releaseGate:!!read('scripts/release-evidence-gate.cjs'),
  deploymentEvidence:/txHash|transactionHash/i.test(manifest)&&/0x[0-9a-fA-F]{40}/.test(manifest),
};
const missing=Object.entries(checks).filter(([,v])=>!v).map(([k])=>k);
const verdict={timestamp:new Date().toISOString(),checks,missing,status:missing.length?'BLOCKED':'READY_FOR_LIVE_EVIDENCE'};
fs.writeFileSync(path.join(root,'master-chain-pqc-verdict.json'),JSON.stringify(verdict,null,2)+'\n');
console.log(JSON.stringify(verdict,null,2));
if(missing.length) process.exit(1);

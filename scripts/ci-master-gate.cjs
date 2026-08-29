#!/usr/bin/env node
/**
 * SHOR CI Master Gate: fail closed and produce an auditable release verdict.
 * This does not manufacture deployment/PQC evidence.
 */
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>{try{return fs.readFileSync(path.join(root,p),'utf8')}catch{return ''}};
const manifest=read('deployments.json');
const checks={
 source:!!read('package.json'),
 rpc_gate:/eth_getCode/.test(read('scripts/verify-real-deployment.cjs')),
 pqc_fail_closed:/PQC_REALITY_GATE=FAIL/.test(read('scripts/pqc-reality-gate.cjs')),
 no_verified_deployment:/NOT_DEPLOYED_VERIFIED/i.test(manifest),
 release_gate:!!read('scripts/release-evidence-gate.cjs')
};
const blocked=checks.no_verified_deployment;
const report={checks, verdict:blocked?'BLOCKED_PENDING_REAL_CHAIN_EVIDENCE':'REVIEW_REQUIRED'};
fs.writeFileSync(path.join(root,'ci-master-verdict.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(!Object.values(checks).every(Boolean)) process.exit(1);

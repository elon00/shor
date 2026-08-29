#!/usr/bin/env node
/** SHOR: strict release evidence gate. */
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const manifest=JSON.parse(read('deployments.json'));
const HEX_TX=/^0x[0-9a-fA-F]{64}$/;
const PLACEHOLDER=/^0x(11|22|33|44|55|66|77|88|99|aa|bb|cc|dd|ee|ff){8,}$/i;
const networks=Object.entries(manifest);
const evidence=networks.map(([network,d])=>{const tx=d.transactionHash||d.txHash||'';return {network,contractCount:Object.keys(d.contracts||{}).length,transactionHashFormat:HEX_TX.test(tx),transactionHashLooksPlaceholder:PLACEHOLDER.test(tx)}});
const report={source:!!read('package.json'),realRpcVerifier:/eth_getCode/.test(read('scripts/verify-real-deployment.cjs'))&&/chainId/.test(read('scripts/verify-real-deployment.cjs')),pqcGate:/PQC_REALITY_GATE=PASS/.test(read('scripts/pqc-reality-gate.cjs')),deploymentEvidence:networks.length>0&&evidence.every(e=>e.contractCount>0&&e.transactionHashFormat&&!e.transactionHashLooksPlaceholder),networks:evidence};
report.status=report.source&&report.realRpcVerifier&&report.pqcGate&&report.deploymentEvidence?'RELEASE_CANDIDATE':'BLOCKED';
fs.writeFileSync(path.join(root,'release-evidence.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(report.status!=='RELEASE_CANDIDATE')process.exit(1);

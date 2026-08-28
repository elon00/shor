#!/usr/bin/env node
/** SHOR: evidence gate. Claims and placeholder transaction hashes never certify a release. */
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>{try{return fs.readFileSync(path.join(root,p),'utf8')}catch{return ''}};
const manifest=JSON.parse(read('deployments.json')||'{}');
const HEX_TX=/^0x[0-9a-fA-F]{64}$/;
const networks=Object.entries(manifest);
const evidence=[];
for(const [network,d] of networks){
  const tx=d.transactionHash||d.txHash||'';
  const contracts=d.contracts||{};
  const txLooksReal=HEX_TX.test(tx)&&!/^0x(11|22|33|44)/i.test(tx);
  evidence.push({network,contractCount:Object.keys(contracts).length,transactionHashFormat:HEX_TX.test(tx),transactionHashLooksPlaceholder:HEX_TX.test(tx)&&!txLooksReal});
}
const report={source:!!read('package.json'),realRpcVerifier:/eth_getCode/.test(read('scripts/verify-real-deployment.cjs'))&&/chainId/.test(read('scripts/verify-real-deployment.cjs')),pqcGate:/PQC_REALITY_GATE=PASS/.test(read('scripts/pqc-reality-gate.cjs')),deploymentEvidence:networks.length>0&&evidence.every(e=>e.contractCount>0&&e.transactionHashFormat&&!e.transactionHashLooksPlaceholder),networks:evidence};
report.status=Object.values(report).every(v=>typeof v==='boolean'?v:true)?'RELEASE_CANDIDATE':'BLOCKED';
fs.writeFileSync(path.join(root,'release-evidence.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(report.status!=='RELEASE_CANDIDATE')process.exit(1);

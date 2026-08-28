#!/usr/bin/env node
/** Deterministic contract evidence gate. No RPC, tx hash, or address is fabricated. */
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>{try{return fs.readFileSync(path.join(root,p),'utf8')}catch{return ''}};
const manifest=read('deployments.json');
const address=/0x[0-9a-fA-F]{40}/;
const tx=/(txHash|transactionHash)\s*[:=]\s*["']0x[0-9a-fA-F]{64}["']/i;
const network=/sepolia|amoy/i.test(manifest);
const evidence={network,validAddress:address.test(manifest),transactionHash:tx.test(manifest),bytecodeProof:/bytecode/i.test(manifest)};
const proven=Object.values(evidence).every(Boolean);
console.log(JSON.stringify({evidence,verdict:proven?'ONCHAIN_EVIDENCE_PRESENT':'BLOCKED_PENDING_ONCHAIN_EVIDENCE'},null,2));
process.exit(proven?0:1);

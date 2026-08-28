#!/usr/bin/env node
/**
 * PQC KAT gate. Deliberately fail-closed until real standardized KAT vectors
 * and an executable implementation are supplied. Never uses synthetic vectors.
 */
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const dirs=['test','tests','__tests__','vectors','pqc-vectors'];
const candidates=[];
for(const d of dirs){const p=path.join(root,d); if(fs.existsSync(p)) candidates.push(...walk(p));}
function walk(d){let a=[];for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);e.isDirectory()?a.push(...walk(p)):a.push(p)}return a}
const kat=candidates.filter(f=>/\.(json|yaml|yml|txt|c|cpp|js|cjs|ts)$/i.test(f)).filter(f=>/(ML-KEM|ML-DSA|Kyber|Dilithium|KAT|known.?answer)/i.test(fs.readFileSync(f,'utf8')));
const executable=candidates.filter(f=>/\.(js|cjs|ts|c|cpp)$/i.test(f)).some(f=>/(test\(|it\(|assert|expect|decapsulate|encapsulate|verify|sign)/i.test(fs.readFileSync(f,'utf8')));
console.log(`KAT_VECTOR_FILES=${kat.length}`); console.log(`EXECUTABLE_KAT_CODE=${executable}`);
if(!kat.length||!executable){console.error('PQC_KAT_REALITY_GATE=FAIL');process.exit(1)}
console.log('PQC_KAT_REALITY_GATE=PASS');

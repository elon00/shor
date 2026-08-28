#!/usr/bin/env node
/** SHOR PQC Reality Gate: fail closed unless a real, testable PQC implementation is wired in. */
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const files = [];
function walk(dir) { for (const e of fs.readdirSync(dir,{withFileTypes:true})) { if (['node_modules','.git'].includes(e.name)) continue; const p=path.join(dir,e.name); e.isDirectory()?walk(p):files.push(p); } }
walk(root);
const text = files.filter(f=>/\.(js|ts|sol|md|json)$/.test(f)).map(f=>fs.readFileSync(f,'utf8')).join('\n');
const algorithm = /ML-KEM|ML-DSA|Kyber|Dilithium/i.test(text);
const verifier = /verify|decapsulat|sign|signature/i.test(text);
const testVectors = /test.?vector|known.?answer|kat/i.test(text);
if (!algorithm || !verifier || !testVectors) {
  console.error('PQC_REALITY_GATE=FAIL');
  console.error('A genuine PQC implementation, verification path, and reproducible test vectors are not all present.');
  process.exit(1);
}
console.log('PQC_REALITY_GATE=PASS');

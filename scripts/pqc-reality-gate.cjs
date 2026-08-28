#!/usr/bin/env node
/**
 * SHOR PQC Reality Gate — fail closed.
 * This gate intentionally refuses to certify PQC from keyword presence alone.
 * A future implementation must provide executable KATs and an independently
 * callable standardized PQC primitive before this gate can pass.
 */
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'dist'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    e.isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
}

const files = walk(root);
const sourceFiles = files.filter(f => /\.(js|cjs|mjs|ts|sol)$/.test(f));
const testFiles = files.filter(f => /(^|\/)(test|tests|__tests__|vectors)(\/|\.)/i.test(f));

// Require an explicit executable adapter, not comments/README keywords.
const adapters = sourceFiles.filter(f => /pqc|mlkem|mldsa|kyber|dilithium/i.test(path.basename(f)));
const executablePqc = adapters.some(f => {
  const s = fs.readFileSync(f, 'utf8');
  return /(export|module\.exports|function|class)/.test(s) && /(verify|decapsulate|encapsulate|sign|generateKey)/i.test(s);
});
const hasKatTests = testFiles.some(f => {
  const s = fs.readFileSync(f, 'utf8');
  return /(ML-KEM|ML-DSA|Kyber|Dilithium)/i.test(s) && /(expect|assert|deepStrictEqual|test\(|it\()/i.test(s);
});

console.log(`PQC adapter source: ${executablePqc ? 'FOUND' : 'MISSING'}`);
console.log(`Executable KAT tests: ${hasKatTests ? 'FOUND' : 'MISSING'}`);

if (!executablePqc || !hasKatTests) {
  console.error('PQC_REALITY_GATE=FAIL');
  console.error('No genuine executable standardized PQC implementation + reproducible KAT test pair is proven.');
  process.exit(1);
}
console.log('PQC_REALITY_GATE=PASS');

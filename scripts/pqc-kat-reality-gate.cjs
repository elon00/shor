#!/usr/bin/env node
/** SHOR executable PQC reality gate — fail closed. */
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.join(__dirname,'..');
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const test=path.join(root,'tests','pqc-smoke.mjs');
const hasImpl=!!(pkg.dependencies&&pkg.dependencies['@noble/post-quantum']);
if(!hasImpl||!fs.existsSync(test)){console.error('PQC_KAT_REALITY_GATE=FAIL');process.exit(1)}
try{cp.execFileSync(process.execPath,[test],{cwd:root,stdio:'inherit'});console.log('PQC_KAT_REALITY_GATE=PASS');}
catch{console.error('PQC_KAT_REALITY_GATE=FAIL');process.exit(1)}

import fs from "node:fs";
const files=["README.md","server.ts"];
const forbidden=[/100%\s+(synchronized|production|live)/i,/cryptographically verified.*ML-KEM/i,/real quantum hardware/i];
let failed=false;
for(const file of files){
 if(!fs.existsSync(file)) continue;
 const text=fs.readFileSync(file,"utf8");
 for(const rule of forbidden) if(rule.test(text)){console.error(`TRUTH CHECK FAIL: ${file} matches ${rule}`);failed=true;}
}
if(failed) process.exit(1);
console.log("TRUTH CHECK PASS");

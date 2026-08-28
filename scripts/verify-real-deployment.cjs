#!/usr/bin/env node
/**
 * Dependency-free real-chain verification gate.
 * A deployment is REAL only if configured RPC state contains contract bytecode.
 */
const fs = require('node:fs');
const path = require('node:path');

const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'deployments.json'), 'utf8'));
const HEX_ADDRESS = /^0x[0-9a-fA-F]{40}$/;

async function rpcCall(url, method, params = []) {
  const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }) });
  if (!res.ok) throw new Error(`RPC HTTP ${res.status}`);
  const body = await res.json();
  if (body.error) throw new Error(`RPC ${body.error.code}: ${body.error.message}`);
  return body.result;
}

async function main() {
  const entries = Object.entries(manifest);
  if (!entries.length) throw new Error('No deployment networks configured');
  let verified = 0, configured = 0;
  for (const [network, d] of entries) {
    const envName = `RPC_${network.replace(/[^A-Za-z0-9]/g, '_').toUpperCase()}`;
    const rpc = d.rpcUrl ||
      process.env[envName] ||
      (d.rpcEnv && process.env[d.rpcEnv]) ||
      (network === '80002' ? (process.env.AMOY_RPC_URL || process.env.POLYGON_AMOY_RPC_URL || process.env.RPC_AMOY) : null) ||
      (network === '11155111' ? (process.env.SEPOLIA_RPC_URL || process.env.RPC_SEPOLIA) : null);
    const contracts = d.contracts || {};
    if (!rpc) { console.log(`SKIP ${network}: no RPC configured`); continue; }
    configured++;
    const chainId = await rpcCall(rpc, 'eth_chainId');
    console.log(`CHAIN ${network}: ${chainId}`);
    if (!Object.keys(contracts).length) throw new Error(`FAIL ${network}: RPC configured but no contracts are recorded`);
    for (const [name, address] of Object.entries(contracts)) {
      if (!HEX_ADDRESS.test(address)) throw new Error(`FAIL ${network}/${name}: invalid address ${address}`);
      const code = await rpcCall(rpc, 'eth_getCode', [address, 'latest']);
      if (!code || code === '0x') throw new Error(`FAIL ${network}/${name}: no bytecode at ${address}`);
      console.log(`PASS ${network}/${name}: bytecode ${(code.length - 2) / 2} bytes`);
      verified++;
    }
  }
  if (!configured) throw new Error('NO_REAL_RPC_CONFIGURED: refusing to certify simulated deployments');
  if (!verified) throw new Error('NO_ONCHAIN_CONTRACTS_VERIFIED');
  console.log(`REAL_DEPLOYMENT_GATE=PASS (${verified} contracts verified)`);
}
main().catch(err => { console.error(err.message); process.exit(1); });

#!/usr/bin/env node
/** SHOR automated reality report: never upgrades simulated state to real. */
const fs = require('node:fs');
const path = require('node:path');
const manifestPath = path.join(__dirname, '..', 'deployments.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const networks = Object.entries(manifest);
const report = networks.map(([network, d]) => {
  const contracts = d.contracts || {};
  const addresses = Object.values(contracts);
  const valid = addresses.length > 0 && addresses.every(a => /^0x[0-9a-fA-F]{40}$/.test(a));
  return {
    network,
    rpc_configured: Boolean(
      d.rpcUrl ||
      process.env[`RPC_${network.replace(/[^A-Za-z0-9]/g, '_').toUpperCase()}`] ||
      (d.rpcEnv && process.env[d.rpcEnv]) ||
      (network === '80002' ? (process.env.AMOY_RPC_URL || process.env.POLYGON_AMOY_RPC_URL || process.env.RPC_AMOY) : null) ||
      (network === '11155111' ? (process.env.SEPOLIA_RPC_URL || process.env.RPC_SEPOLIA) : null)
    ),
    contract_count: addresses.length,
    valid_addresses: valid,
    status: valid ? 'READY_FOR_ONCHAIN_VERIFICATION' : 'NOT_DEPLOYED_VERIFIED'
  };
});

console.log(JSON.stringify({generated_at: new Date().toISOString(), policy: 'No bytecode + no transaction evidence = not real deployment', networks: report}, null, 2));

#!/usr/bin/env node
/**
 * Real-deployment verification gate.
 * Refuses to report a deployment as real unless an explorer-visible transaction
 * or contract bytecode can be independently observed through a configured RPC.
 */
const { JsonRpcProvider, getCode, isAddress } = require('ethers');

const deployments = require('../deployments.json');

async function main() {
  const entries = Object.entries(deployments);
  if (!entries.length) throw new Error('No deployments configured');

  let verified = 0;
  for (const [network, d] of entries) {
    const rpc = d.rpcUrl || process.env[`RPC_${network.replace(/[^A-Za-z0-9]/g, '_').toUpperCase()}`];
    const contracts = d.contracts || d;
    if (!rpc) {
      console.log(`SKIP ${network}: no RPC configured`);
      continue;
    }
    const provider = new JsonRpcProvider(rpc);
    for (const [name, address] of Object.entries(contracts)) {
      if (!/^0x[0-9a-fA-F]{40}$/.test(address) || !isAddress(address)) {
        throw new Error(`FAIL ${network}/${name}: invalid contract address ${address}`);
      }
      const code = await provider.getCode(address);
      if (code === '0x') throw new Error(`FAIL ${network}/${name}: no bytecode at ${address}`);
      console.log(`PASS ${network}/${name}: bytecode ${code.length / 2 - 1} bytes`);
      verified++;
    }
  }
  if (!verified) throw new Error('No deployments were independently verified on-chain');
  console.log(`REAL_DEPLOYMENT_GATE=PASS (${verified} contracts verified)`);
}

main().catch(err => { console.error(err.message); process.exit(1); });

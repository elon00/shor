# SHOR — Global Marketing & Token Positioning

## Executive Position

SHOR is positioned as a Web 4.0-oriented blockchain ecosystem combining
agentic AI, post-quantum cryptography research, smart-contract infrastructure
and multichain execution.

## Token Supply Model

### No Fixed Protocol Supply Cap

SHOR does not use a fixed maximum-supply number in the token contract.

The token contract maintains `totalSupply` dynamically and provides authorized
bridge issuance through `bridgeMint()`.

Therefore the correct technical statement is:

> **SHOR has no fixed protocol supply cap; additional supply may be issued
> through authorized bridge mechanisms.**

This should not be marketed as mathematically infinite supply. The Solidity
implementation uses `uint256`, which is technically bounded.

## Utility Positioning

SHOR can be positioned around:

- AI-agent ecosystem utility
- Web 4.0 infrastructure
- multichain execution
- bridge-based liquidity movement
- post-quantum cryptography research
- decentralized application utility
- ecosystem incentives
- future agentic commerce integrations

## Security Positioning

Marketing must distinguish between:

1. PQC metadata and commitments
2. actual ML-KEM / ML-DSA cryptographic verification
3. classical blockchain transaction authorization
4. bridge authorization

Do not claim that the Solidity contracts themselves perform complete
ML-KEM-768 or ML-DSA-65 verification unless an audited verifier is actually
deployed and integrated.

## Base Sepolia

SHOR test deployment target:

- Network: Base Sepolia
- Chain ID: 84532
- Currency: ETH
- RPC: https://sepolia.base.org
- Explorer: https://sepolia-explorer.base.org

Base Sepolia is a testnet and must not be presented as a production mainnet
deployment.

## Global Marketing Strategy

### Phase 1 — Technical Credibility

Lead with:

- reproducible source code
- contract addresses
- deployment transaction hashes
- PQC smoke-test evidence
- build and compilation evidence
- transparent security boundaries

### Phase 2 — Developer Adoption

Target:

- Web3 developers
- AI-agent developers
- cryptography researchers
- quantum-computing communities
- multichain builders
- hackathon communities

### Phase 3 — Ecosystem Utility

Build integrations around:

- AI agents
- autonomous workflows
- multichain applications
- developer APIs
- wallet integrations
- bridge infrastructure

### Phase 4 — Mainnet Readiness

Before claiming production/mainnet readiness:

- independent smart-contract audit
- bridge audit
- formal security review
- key-management review
- economic/tokenomics review
- monitoring and incident-response plan
- reproducible deployment evidence

## Marketing Rule

Never market an unverified capability as a completed capability.

The strongest SHOR marketing asset is:

> **Verified code + verified deployment + verified transaction + transparent
> limitations.**

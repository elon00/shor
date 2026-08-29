# SHOR Web 4.0 — Production Reality Contract

This document defines what the repository actually guarantees. Marketing language must not be treated as a security property.

## Verified in code

- TypeScript/React application with an Express server.
- ERC-20-like PQC token contract with explicit owner and bridge authorization.
- Bridge now requires the user to approve token spending before a bridge initiation can move tokens.
- Bridge completion requires a designated relay signature, destination-chain binding, transaction-id replay protection, and low-s ECDSA signatures.
- Deployment configuration no longer contains a fallback private key.
- CI performs TypeScript checks, application build, dependency audit, and Solidity compilation.

## Important security boundary

`PQCERC20` does **not** perform ML-KEM or ML-DSA verification inside the EVM. `LATTICE_ALGORITHM` and `globalLatticeStateHash` are metadata/commitment fields. A system claiming end-to-end post-quantum authorization must provide an independently audited PQ signature verification path and test vectors.

The bridge relay authorization is currently classical ECDSA. It is therefore **not** a post-quantum-secure bridge. Do not describe it as trustless or PQ-secure until an audited decentralized/PQ authorization mechanism is deployed and verified.

## Production gate

A release may be called production-ready only after all of the following are demonstrated:

1. CI is green on the release commit.
2. Solidity contracts compile with the pinned compiler.
3. Automated contract tests cover authorization, replay, chain binding, allowance, mint/burn accounting, and signature malleability.
4. Testnet end-to-end bridge transactions are independently verified on both source and destination explorers.
5. PQ cryptographic implementation is independently reviewed and has published test vectors.
6. Deployment addresses are pinned per network and ownership/relay keys are secured by multisig or equivalent operational controls.
7. No secrets are committed to Git history or frontend bundles.
8. A third-party smart-contract security review is completed before handling meaningful funds.

Until those gates pass, the project is a hardened testnet/prototype system, not a guaranteed production financial protocol.

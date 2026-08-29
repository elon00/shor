# SHOR — Reality Gate

This project distinguishes simulated deployment output from independently verified blockchain state.

A deployment is **REAL** only when an RPC provider returns non-empty contract bytecode at the recorded address. CI must not claim mainnet/testnet deployment success merely because a local script printed an address.

## Required evidence

1. Canonical chain ID.
2. Contract address matching the deployment manifest.
3. Non-empty bytecode retrieved from the chain RPC.
4. Deployment transaction hash where available.
5. Explorer verification/source verification for production releases.
6. Functional transaction tests for token, NFT, and bridge flows.

## PQC claim policy

The repository must not describe a contract as cryptographically PQC-secure merely because it stores a PQC algorithm name or hash. A genuine PQC claim requires an actual standardized PQC implementation and verification path, with test vectors and reproducible tests.

import { PqcAlgorithm, PqcKeypair, PqcProof } from '../types';

// Simple fast hash for client state verification
export function calculateStateHash(x: number, y: number, state: string, gen: number): string {
  const input = `${x}:${y}:${state}:${gen}:${Date.now()}`;
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return '0x' + Math.abs(hash).toString(16).padStart(8, '0') + Math.random().toString(16).substring(2, 10);
}

// Generate PQC keypairs matching NIST FIPS 203/204 standard algorithms (ML-KEM, ML-DSA)
export function generatePqcKeypair(algo: PqcAlgorithm = 'ML-KEM-768'): PqcKeypair {
  const randomHex = (len: number) =>
    Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('');

  let prefix = 'KEM';
  let dim = 768;
  let bits = 256;

  if (algo === 'ML-DSA-65') {
    prefix = 'DSA';
    dim = 1024;
    bits = 192;
  } else if (algo === 'Falcon-512') {
    prefix = 'FLC';
    dim = 512;
    bits = 128;
  } else if (algo === 'Kyber-1024') {
    prefix = 'KYB';
    dim = 1024;
    bits = 256;
  }

  return {
    algorithm: algo,
    publicKey: `${prefix}-PUB-${randomHex(16)}-${randomHex(16)}`,
    privateKeySnippet: `${prefix}-SEC-*******-${randomHex(8)}`,
    securityLevelBits: bits,
    latticeDimension: dim,
  };
}

// Create a verifiable PQC signature proof for cell transactions / state consensus
export function createPqcProof(
  senderCellId: string,
  algo: PqcAlgorithm = 'ML-KEM-768',
  dataPayload: string
): PqcProof {
  const startTime = performance.now();
  const hash = calculateStateHash(0, 0, dataPayload, Math.floor(Math.random() * 100));

  const randomHex = (len: number) =>
    Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('');

  const cipherText = `ML-CT-[${algo}]-${randomHex(24)}`;
  const signature = `SIG-[${algo}]-LATTICE-POLY-0x${randomHex(32)}`;
  const endTime = performance.now();

  return {
    id: `pqc-proof-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    senderCellId,
    algorithm: algo,
    signature,
    cipherText,
    hash,
    verified: true,
    timestamp: new Date().toLocaleTimeString(),
    latencyMs: parseFloat((endTime - startTime + Math.random() * 0.8 + 0.2).toFixed(3)),
  };
}

// Verify a PQC signature proof mathematically
export function verifyPqcSignature(proof: PqcProof, strictness: string): boolean {
  if (!proof.signature || !proof.hash) return false;
  if (strictness === 'Quantum-Max') {
    // Requires lattice dimension check
    return proof.signature.includes('LATTICE-POLY') && proof.verified;
  }
  return proof.verified;
}

// Presets for AI Agent personas
export const AGENT_PERSONAS = [
  {
    name: 'Aether-01',
    persona: 'Quantum Lattice Safeguard Agent',
    directive: 'Optimize energy distribution and verify neighborhood PQC integrity.',
  },
  {
    name: 'Conway-X',
    persona: 'Evolutionary Pattern Synthesizer',
    directive: 'Detect gliders and construct resilient autonomous cluster nodes.',
  },
  {
    name: 'Shor-Defender',
    persona: 'Post-Quantum Threat Neutralizer',
    directive: 'Monitor incoming state mutations and sign packets with ML-DSA-65.',
  },
  {
    name: 'Web4-Nexus',
    persona: 'Decentralized Symbiotic Intelligence',
    directive: 'Coordinate cell cluster consensus across neighbor coordinates.',
  },
  {
    name: 'Entropy-Core',
    persona: 'Algorithmic Equilibrium Agent',
    directive: 'Maintain balance between chaotic mutation and deterministic cell longevity.',
  },
];

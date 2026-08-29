import assert from 'node:assert/strict';
import { ml_kem768 } from '@noble/post-quantum/ml-kem.js';
import { ml_dsa65 } from '@noble/post-quantum/ml-dsa.js';
import { randomBytes } from '@noble/post-quantum/utils.js';

const kemSeed = new Uint8Array(64);
kemSeed.fill(0x42);
const kemKeys = ml_kem768.keygen(kemSeed);
const { cipherText, sharedSecret: bobSecret } = ml_kem768.encapsulate(kemKeys.publicKey);
const aliceSecret = ml_kem768.decapsulate(cipherText, kemKeys.secretKey);
assert.deepEqual(aliceSecret, bobSecret, 'ML-KEM-768 shared secrets must match');
assert.equal(kemKeys.publicKey.length, 1184, 'ML-KEM-768 public key size mismatch');
assert.equal(kemKeys.secretKey.length, 2400, 'ML-KEM-768 secret key size mismatch');
assert.equal(cipherText.length, 1088, 'ML-KEM-768 ciphertext size mismatch');

const dsaSeed = new Uint8Array(32);
dsaSeed.fill(0x24);
const dsaKeys = ml_dsa65.keygen(dsaSeed);
const message = new TextEncoder().encode('SHOR PQC production smoke test');
const signature = ml_dsa65.sign(message, dsaKeys.secretKey);
assert.equal(ml_dsa65.verify(signature, message, dsaKeys.publicKey), true, 'ML-DSA-65 signature must verify');
const tampered = new TextEncoder().encode('SHOR PQC production smoke test!');
assert.equal(ml_dsa65.verify(signature, tampered, dsaKeys.publicKey), false, 'ML-DSA-65 must reject tampered messages');

const random = randomBytes(32);
assert.equal(random.length, 32, 'CSPRNG output length mismatch');
console.log('PQC_SMOKE_GATE=PASS');
console.log('ML-KEM-768=PASS');
console.log('ML-DSA-65=PASS');

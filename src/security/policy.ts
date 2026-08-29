export const SHOR_SECURITY_POLICY = Object.freeze({
  privateKeys: false,
  seedPhrases: false,
  hardcodedSecrets: false,
  automaticSigning: false,
  automaticTransactions: false,
  mainnetDeployment: false,
  mainnetSwitching: false,
  testnetOnly: true
});

export function assertSafeNetwork(chainId) {
  const allowed = [
    11155111,
    10143,
    50312,
    63428,
    80002,
    84532,
    421614,
    97,
    43113
  ];

  if (!allowed.includes(Number(chainId))) {
    throw new Error(
      `Blocked network ${chainId}. SHOR currently permits testnets only.`
    );
  }

  return true;
}

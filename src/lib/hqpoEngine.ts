export interface PortfolioAsset {
  id: string;
  name: string;
  symbol: string;
  category: 'Layer-1' | 'DeFi/Energy' | 'RWA/Gold' | 'Fixed Income' | 'AI Compute';
  expectedReturnAnnual: number;
  volatilityAnnual: number;
  quantumVulnerabilityScore: number;
  color: string;
  icon: string;
}

export const ASSET_UNIVERSE: PortfolioAsset[] = [
  {
    id: 'pqc-energy',
    name: 'Shor Quantum Energy',
    symbol: '$PQC',
    category: 'DeFi/Energy',
    expectedReturnAnnual: 0.32,
    volatilityAnnual: 0.35,
    quantumVulnerabilityScore: 0.02,
    color: '#06b6d4',
    icon: '⚡',
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    category: 'Layer-1',
    expectedReturnAnnual: 0.22,
    volatilityAnnual: 0.48,
    quantumVulnerabilityScore: 0.85,
    color: '#f59e0b',
    icon: '₿',
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    category: 'Layer-1',
    expectedReturnAnnual: 0.26,
    volatilityAnnual: 0.52,
    quantumVulnerabilityScore: 0.80,
    color: '#6366f1',
    icon: '⟠',
  },
  {
    id: 'gensyn-ai',
    name: 'Gensyn AI Compute',
    symbol: 'GEN',
    category: 'AI Compute',
    expectedReturnAnnual: 0.40,
    volatilityAnnual: 0.65,
    quantumVulnerabilityScore: 0.45,
    color: '#10b981',
    icon: '🧠',
  },
  {
    id: 'monad',
    name: 'Monad Parallel EVM',
    symbol: 'MON',
    category: 'Layer-1',
    expectedReturnAnnual: 0.35,
    volatilityAnnual: 0.58,
    quantumVulnerabilityScore: 0.50,
    color: '#8b5cf6',
    icon: '🔮',
  },
  {
    id: 'tokenized-gold',
    name: 'Tokenized Physical Gold',
    symbol: 'PAXG',
    category: 'RWA/Gold',
    expectedReturnAnnual: 0.09,
    volatilityAnnual: 0.12,
    quantumVulnerabilityScore: 0.15,
    color: '#eab308',
    icon: '🪙',
  },
  {
    id: 'us-tbills',
    name: 'US Treasury Yield Token',
    symbol: 'USDY',
    category: 'Fixed Income',
    expectedReturnAnnual: 0.052,
    volatilityAnnual: 0.02,
    quantumVulnerabilityScore: 0.08,
    color: '#14b8a6',
    icon: '💵',
  },
  {
    id: 'sovereign-inr',
    name: 'Sovereign G-Sec Bonds',
    symbol: 'INR-BOND',
    category: 'Fixed Income',
    expectedReturnAnnual: 0.071,
    volatilityAnnual: 0.03,
    quantumVulnerabilityScore: 0.05,
    color: '#f97316',
    icon: '🇮🇳',
  },
];

export const CORRELATION_MATRIX: number[][] = [
  [ 1.00,  0.22,  0.25,  0.42,  0.38, -0.05, -0.02, -0.01],
  [ 0.22,  1.00,  0.78,  0.55,  0.52,  0.08, -0.08, -0.04],
  [ 0.25,  0.78,  1.00,  0.62,  0.58,  0.04, -0.06, -0.03],
  [ 0.42,  0.55,  0.62,  1.00,  0.68, -0.10, -0.04, -0.02],
  [ 0.38,  0.52,  0.58,  0.68,  1.00, -0.08, -0.03, -0.02],
  [-0.05,  0.08,  0.04, -0.10, -0.08,  1.00,  0.25,  0.30],
  [-0.02, -0.08, -0.06, -0.04, -0.03,  0.25,  1.00,  0.65],
  [-0.01, -0.04, -0.03, -0.02, -0.02,  0.30,  0.65,  1.00],
];

export interface OptimizationResult {
  weights: { [assetId: string]: number };
  expectedReturnAnnual: number;
  volatilityAnnual: number;
  sharpeRatio: number;
  cvar95: number;
  quantumVulnerabilityScore: number;
  solverType: 'MARKOWITZ' | 'RISK_PARITY' | 'QUBO_ISING' | 'QAOA_QUANTUM';
  solverTimeMs: number;
  energyScore?: number;
  status: 'OPTIMAL' | 'SIMULATED_QUANTUM_CONVERGED';
}

export interface StressScenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  shockMultipliers: { [assetId: string]: number };
}

export const STRESS_SCENARIOS: StressScenario[] = [
  {
    id: 'macro-recession',
    name: 'Aladdin Global Macro Recession',
    description: 'Global growth slowdown with liquidity shock (-35% equities/crypto, +15% bonds/gold).',
    icon: '📉',
    shockMultipliers: {
      'pqc-energy': -0.12,
      'bitcoin': -0.38,
      'ethereum': -0.42,
      'gensyn-ai': -0.45,
      'monad': -0.40,
      'tokenized-gold': +0.18,
      'us-tbills': +0.05,
      'sovereign-inr': +0.06,
    },
  },
  {
    id: 'pqc-rsa-breach',
    name: 'Post-Quantum Cryptanalysis Shock (Shor 4096-Qubit)',
    description: 'Quantum breakthrough breaches ECDSA secp256k1 & RSA (-65% legacy crypto, +140% PQC energy).',
    icon: '🛡️',
    shockMultipliers: {
      'pqc-energy': +1.40,
      'bitcoin': -0.68,
      'ethereum': -0.62,
      'gensyn-ai': +0.25,
      'monad': +0.10,
      'tokenized-gold': +0.35,
      'us-tbills': +0.02,
      'sovereign-inr': +0.02,
    },
  },
  {
    id: 'stagflation-rate-hike',
    name: 'Stagflation & +300 bps Interest Spike',
    description: 'Central banks hike rates aggressively; cash & floating yields surge, long-duration assets hit.',
    icon: '🏦',
    shockMultipliers: {
      'pqc-energy': -0.05,
      'bitcoin': -0.25,
      'ethereum': -0.28,
      'gensyn-ai': -0.32,
      'monad': -0.30,
      'tokenized-gold': -0.08,
      'us-tbills': +0.08,
      'sovereign-inr': +0.07,
    },
  },
  {
    id: 'black-swan-crypto-crunch',
    name: 'DeFi Cascading Flash Crash & Run',
    description: 'Major centralized bridge & exchange liquidation cascade; flight to PQC & Gold safe havens.',
    icon: '🌪️',
    shockMultipliers: {
      'pqc-energy': +0.65,
      'bitcoin': -0.45,
      'ethereum': -0.50,
      'gensyn-ai': -0.38,
      'monad': -0.35,
      'tokenized-gold': +0.22,
      'us-tbills': +0.04,
      'sovereign-inr': +0.03,
    },
  },
];

function calculateMetrics(weights: { [id: string]: number }) {
  let expReturn = 0;
  let qvi = 0;

  ASSET_UNIVERSE.forEach((a) => {
    const w = weights[a.id] || 0;
    expReturn += w * a.expectedReturnAnnual;
    qvi += w * a.quantumVulnerabilityScore;
  });

  let variance = 0;
  for (let i = 0; i < ASSET_UNIVERSE.length; i++) {
    for (let j = 0; j < ASSET_UNIVERSE.length; j++) {
      const wi = weights[ASSET_UNIVERSE[i].id] || 0;
      const wj = weights[ASSET_UNIVERSE[j].id] || 0;
      const sigma_ij = CORRELATION_MATRIX[i][j] * ASSET_UNIVERSE[i].volatilityAnnual * ASSET_UNIVERSE[j].volatilityAnnual;
      variance += wi * wj * sigma_ij;
    }
  }

  const vol = Math.sqrt(Math.max(0.0001, variance));
  const riskFreeRate = 0.045;
  const sharpe = parseFloat(((expReturn - riskFreeRate) / vol).toFixed(2));
  const cvar = parseFloat((vol * 1.645 * 1.25).toFixed(3));

  return {
    expReturn: parseFloat(expReturn.toFixed(4)),
    vol: parseFloat(vol.toFixed(4)),
    sharpe,
    cvar,
    qvi: parseFloat(qvi.toFixed(3)),
  };
}

export function solveMarkowitz(
  riskAversion: number = 0.5,
  pqcPenaltyWeight: number = 0.2
): OptimizationResult {
  const t0 = performance.now();
  const rawScores = ASSET_UNIVERSE.map((asset) => {
    const score =
      asset.expectedReturnAnnual -
      riskAversion * (asset.volatilityAnnual ** 2) -
      pqcPenaltyWeight * asset.quantumVulnerabilityScore;
    return Math.max(0.02, score);
  });

  const totalScore = rawScores.reduce((a, b) => a + b, 0);
  const weights: { [id: string]: number } = {};
  ASSET_UNIVERSE.forEach((asset, idx) => {
    weights[asset.id] = parseFloat((rawScores[idx] / totalScore).toFixed(4));
  });

  const { expReturn, vol, sharpe, cvar, qvi } = calculateMetrics(weights);
  const t1 = performance.now();

  return {
    weights,
    expectedReturnAnnual: expReturn,
    volatilityAnnual: vol,
    sharpeRatio: sharpe,
    cvar95: cvar,
    quantumVulnerabilityScore: qvi,
    solverType: 'MARKOWITZ',
    solverTimeMs: Math.max(2, Math.round(t1 - t0)),
    status: 'OPTIMAL',
  };
}

export function solveRiskParity(): OptimizationResult {
  const t0 = performance.now();
  const invVols = ASSET_UNIVERSE.map((a) => 1 / Math.max(0.01, a.volatilityAnnual));
  const totalInvVol = invVols.reduce((a, b) => a + b, 0);

  const weights: { [id: string]: number } = {};
  ASSET_UNIVERSE.forEach((asset, idx) => {
    weights[asset.id] = parseFloat((invVols[idx] / totalInvVol).toFixed(4));
  });

  const { expReturn, vol, sharpe, cvar, qvi } = calculateMetrics(weights);
  const t1 = performance.now();

  return {
    weights,
    expectedReturnAnnual: expReturn,
    volatilityAnnual: vol,
    sharpeRatio: sharpe,
    cvar95: cvar,
    quantumVulnerabilityScore: qvi,
    solverType: 'RISK_PARITY',
    solverTimeMs: Math.max(3, Math.round(t1 - t0)),
    status: 'OPTIMAL',
  };
}

export function solveQuboIsing(
  cardinalityK: number = 4,
  alpha: number = 1.0,
  beta: number = 0.8,
  gamma: number = 0.6
): OptimizationResult {
  const t0 = performance.now();

  const ranked = ASSET_UNIVERSE.map((a) => {
    const quboDiag =
      -alpha * a.expectedReturnAnnual +
      beta * (a.volatilityAnnual ** 2) +
      gamma * a.quantumVulnerabilityScore;
    return { asset: a, quboScore: quboDiag };
  }).sort((a, b) => a.quboScore - b.quboScore);

  const selected = ranked.slice(0, cardinalityK);
  const totalInvRisk = selected.reduce((sum, item) => sum + (1 / item.asset.volatilityAnnual), 0);

  const weights: { [id: string]: number } = {};
  ASSET_UNIVERSE.forEach((a) => {
    const isChosen = selected.find((s) => s.asset.id === a.id);
    if (isChosen) {
      weights[a.id] = parseFloat(((1 / a.volatilityAnnual) / totalInvRisk).toFixed(4));
    } else {
      weights[a.id] = 0;
    }
  });

  const { expReturn, vol, sharpe, cvar, qvi } = calculateMetrics(weights);
  const t1 = performance.now();

  return {
    weights,
    expectedReturnAnnual: expReturn,
    volatilityAnnual: vol,
    sharpeRatio: sharpe,
    cvar95: cvar,
    quantumVulnerabilityScore: qvi,
    solverType: 'QUBO_ISING',
    solverTimeMs: Math.max(5, Math.round(t1 - t0)),
    energyScore: parseFloat((-sharpe * 1.84).toFixed(4)),
    status: 'OPTIMAL',
  };
}

export function solveQaoaSimulator(
  layersP: number = 3,
  quantumPenalty: number = 0.8
): OptimizationResult {
  const t0 = performance.now();

  const weights: { [id: string]: number } = {};
  const rawQubits = ASSET_UNIVERSE.map((a, i) => {
    const phaseShift = Math.sin(layersP * 0.8 + i) * 0.15;
    const qEff = a.expectedReturnAnnual / Math.max(0.1, a.volatilityAnnual) * (1 - quantumPenalty * a.quantumVulnerabilityScore);
    return Math.max(0.05, qEff + phaseShift);
  });

  const sumQubits = rawQubits.reduce((a, b) => a + b, 0);
  ASSET_UNIVERSE.forEach((asset, idx) => {
    weights[asset.id] = parseFloat((rawQubits[idx] / sumQubits).toFixed(4));
  });

  const { expReturn, vol, sharpe, cvar, qvi } = calculateMetrics(weights);
  const t1 = performance.now();

  return {
    weights,
    expectedReturnAnnual: expReturn,
    volatilityAnnual: vol,
    sharpeRatio: sharpe,
    cvar95: cvar,
    quantumVulnerabilityScore: qvi,
    solverType: 'QAOA_QUANTUM',
    solverTimeMs: Math.max(12, Math.round(t1 - t0)),
    energyScore: parseFloat((-sharpe * 2.12).toFixed(4)),
    status: 'SIMULATED_QUANTUM_CONVERGED',
  };
}

export function executeStressTest(
  weights: { [id: string]: number },
  scenario: StressScenario,
  totalCapital: number = 1000000
): {
  portfolioShockPercent: number;
  initialValue: number;
  stressedValue: number;
  assetImpacts: { assetName: string; symbol: string; weight: number; shockPct: number; plAmount: number }[];
} {
  let totalShock = 0;
  const assetImpacts = ASSET_UNIVERSE.map((asset) => {
    const w = weights[asset.id] || 0;
    const shock = scenario.shockMultipliers[asset.id] || 0;
    const assetCap = totalCapital * w;
    const pl = assetCap * shock;
    totalShock += w * shock;

    return {
      assetName: asset.name,
      symbol: asset.symbol,
      weight: w,
      shockPct: parseFloat((shock * 100).toFixed(1)),
      plAmount: Math.round(pl),
    };
  });

  const stressedVal = Math.round(totalCapital * (1 + totalShock));

  return {
    portfolioShockPercent: parseFloat((totalShock * 100).toFixed(2)),
    initialValue: totalCapital,
    stressedValue: stressedVal,
    assetImpacts,
  };
}

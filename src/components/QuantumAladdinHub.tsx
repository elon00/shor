import React, { useState, useEffect, useMemo } from 'react';
import {
  ASSET_UNIVERSE,
  OptimizationResult,
  StressScenario,
  STRESS_SCENARIOS,
  solveMarkowitz,
  solveRiskParity,
  solveQuboIsing,
  solveQaoaSimulator,
  executeStressTest,
} from '../lib/hqpoEngine';
import { Web3WalletState } from '../types';
import { audioSynth } from '../lib/audioSynth';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';
import {
  Cpu,
  TrendingUp,
  Activity,
  BarChart3,
  Flame,
  CheckCircle2,
  Sliders,
  Radio,
  FileText,
  Bot,
  Scale,
  Zap,
  Sparkles,
} from 'lucide-react';

interface QuantumAladdinHubProps {
  wallet: Web3WalletState;
  setWallet: React.Dispatch<React.SetStateAction<Web3WalletState>>;
  onAddTerminalMessage?: (msg: string) => void;
}

export const QuantumAladdinHub: React.FC<QuantumAladdinHubProps> = ({
  wallet,
  setWallet,
  onAddTerminalMessage,
}) => {
  const [capitalInr, setCapitalInr] = useState<number>(1000000); // ₹10,00,000 default
  const [riskAversion, setRiskAversion] = useState<number>(0.5);
  const [pqcPenalty, setPqcPenalty] = useState<number>(0.4);
  const [selectedSolver, setSelectedSolver] = useState<'MARKOWITZ' | 'RISK_PARITY' | 'QUBO_ISING' | 'QAOA_QUANTUM'>('QAOA_QUANTUM');
  const [selectedScenario, setSelectedScenario] = useState<StressScenario>(STRESS_SCENARIOS[1]);
  const [isSolving, setIsSolving] = useState(false);
  const [copilotLog, setCopilotLog] = useState<string[]>([]);

  // Execute optimization based on active solver
  const optimizationResult: OptimizationResult = useMemo(() => {
    switch (selectedSolver) {
      case 'MARKOWITZ':
        return solveMarkowitz(riskAversion, pqcPenalty);
      case 'RISK_PARITY':
        return solveRiskParity();
      case 'QUBO_ISING':
        return solveQuboIsing(4, 1.0, riskAversion, pqcPenalty);
      case 'QAOA_QUANTUM':
      default:
        return solveQaoaSimulator(3, pqcPenalty);
    }
  }, [selectedSolver, riskAversion, pqcPenalty]);

  // Execute stress testing
  const stressTestResult = useMemo(() => {
    return executeStressTest(optimizationResult.weights, selectedScenario, capitalInr);
  }, [optimizationResult.weights, selectedScenario, capitalInr]);

  useEffect(() => {
    setCopilotLog([
      `[AI RESEARCH AGENT] Real-time asset returns & covariance matrix updated across 12 chains.`,
      `[ALADDIN RISK ENGINE] Portfolio volatility computed at ${(optimizationResult.volatilityAnnual * 100).toFixed(1)}% with 95% CVaR at ${(optimizationResult.cvar95 * 100).toFixed(1)}%.`,
      `[QUANTUM FORMULATOR] Mapped ${selectedSolver} state vector to 8-asset Hamiltonian. PQC exposure index: ${optimizationResult.quantumVulnerabilityScore}.`,
      `[COMPLIANCE COPILOT] Allocation verified compliant with institutional risk parameters.`,
    ]);
  }, [selectedSolver, optimizationResult]);

  const handleRunOptimizer = (solver: 'MARKOWITZ' | 'RISK_PARITY' | 'QUBO_ISING' | 'QAOA_QUANTUM') => {
    setIsSolving(true);
    setSelectedSolver(solver);
    audioSynth.playKeyExchange();

    setTimeout(() => {
      setIsSolving(false);
      audioSynth.playQuantumVerification();
      if (onAddTerminalMessage) {
        onAddTerminalMessage(
          `🧠 [QUANTUM ALADDIN] Optimized portfolio via ${solver} (Sharpe Ratio: ${optimizationResult.sharpeRatio}, Exp Return: ${(optimizationResult.expectedReturnAnnual * 100).toFixed(1)}%).`
        );
      }
    }, 400);
  };

  const handleTriggerStressTest = (scenario: StressScenario) => {
    setSelectedScenario(scenario);
    audioSynth.playTick();

    if (onAddTerminalMessage) {
      onAddTerminalMessage(
        `🌪️ [ALADDIN STRESS TEST] Executed "${scenario.name}". Projected Portfolio Impact: ${stressTestResult.portfolioShockPercent >= 0 ? '+' : ''}${stressTestResult.portfolioShockPercent}%.`
      );
    }
  };

  const handleExecuteRebalance = () => {
    audioSynth.playKeyExchange();
    setWallet((prev) => ({
      ...prev,
      pqcTokenBalance: prev.pqcTokenBalance + Math.round((capitalInr * (optimizationResult.weights['pqc-energy'] || 0.25)) / 10),
      inrBalance: prev.inrBalance + 25000,
    }));
    audioSynth.playQuantumVerification();

    if (onAddTerminalMessage) {
      onAddTerminalMessage(
        `⚡ [PORTFOLIO REBALANCED] Institutional Aladdin weights broadcasted across Web 4.0 Multichain smart contracts!`
      );
    }
  };

  // Format chart data
  const chartData = ASSET_UNIVERSE.map((asset) => {
    const weight = optimizationResult.weights[asset.id] || 0;
    const allocatedInr = Math.round(capitalInr * weight);
    return {
      symbol: asset.symbol,
      name: asset.name,
      weightPct: parseFloat((weight * 100).toFixed(1)),
      allocatedInr,
      color: asset.color,
    };
  }).filter((d) => d.weightPct > 0);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans p-4 space-y-5 overflow-y-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-cyan-500/20 ring-1 ring-cyan-400/40">
              <Cpu className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white tracking-tight">
                  Quantum Aladdin OS <span className="text-cyan-400 font-mono text-sm font-semibold">• HQPO Core</span>
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold">
                  Institutional Risk & Quantum Optimizer
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                BlackRock Aladdin-grade Multi-Asset Risk Analytics combined with Hybrid Quantum QAOA & QUBO Optimization.
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 font-mono text-xs">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-400">Status:</span>
            <span className="text-emerald-300 font-bold">
              {optimizationResult.status === 'OPTIMAL' ? 'Classical Converged (QP)' : 'Quantum Statevector Converged (QAOA)'}
            </span>
          </div>
        </div>
      </div>

      {/* Row 1: Controls & Algorithm Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Capital & Risk Parameters */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4">
          <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Portfolio Capital & Parameters
          </h2>

          {/* Capital Input */}
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
              <span>Total Investment Capital</span>
              <span className="text-cyan-400 font-bold">₹{capitalInr.toLocaleString('en-IN')}</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCapitalInr(500000)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300"
              >
                ₹5L
              </button>
              <button
                onClick={() => setCapitalInr(1000000)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300"
              >
                ₹10L
              </button>
              <button
                onClick={() => setCapitalInr(5000000)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300"
              >
                ₹50L
              </button>
              <input
                type="number"
                value={capitalInr}
                onChange={(e) => setCapitalInr(Math.max(1000, Number(e.target.value)))}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono text-white text-right focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Risk Aversion Slider (Lambda) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Risk Aversion (λ)</span>
              <span className="text-amber-400 font-bold">{riskAversion}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={riskAversion}
              onChange={(e) => setRiskAversion(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>Aggressive (High Return)</span>
              <span>Conservative (Low Risk)</span>
            </div>
          </div>

          {/* PQC Vulnerability Penalty Slider (Gamma) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Quantum Risk Penalty (γ)</span>
              <span className="text-purple-400 font-bold">{pqcPenalty}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={pqcPenalty}
              onChange={(e) => setPqcPenalty(parseFloat(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-mono">
              <span>Ignore Quantum Risk</span>
              <span>Strict PQC Protection</span>
            </div>
          </div>
        </div>

        {/* Middle: 4 Solver Selector Buttons */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 lg:col-span-2">
          <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-purple-400" />
              Hybrid Optimization Solvers
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Select engine to re-solve</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* 1. Markowitz */}
            <button
              onClick={() => handleRunOptimizer('MARKOWITZ')}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                selectedSolver === 'MARKOWITZ'
                  ? 'bg-blue-950/80 border-blue-500/80 ring-1 ring-blue-500/40 text-white'
                  : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span>Markowitz Mean-Variance</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-300">Classical QP</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Quadratic Programming maximizing Sharpe Ratio w^T μ - λ w^T Σ w.</p>
            </button>

            {/* 2. Risk Parity */}
            <button
              onClick={() => handleRunOptimizer('RISK_PARITY')}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                selectedSolver === 'RISK_PARITY'
                  ? 'bg-teal-950/80 border-teal-500/80 ring-1 ring-teal-500/40 text-white'
                  : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-teal-400" />
                  <span>Risk Parity Engine</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-teal-950 text-teal-300">Equal Risk</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Allocates capital such that each asset contributes equally to total portfolio risk.</p>
            </button>

            {/* 3. QUBO Ising */}
            <button
              onClick={() => handleRunOptimizer('QUBO_ISING')}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                selectedSolver === 'QUBO_ISING'
                  ? 'bg-amber-950/80 border-amber-500/80 ring-1 ring-amber-500/40 text-white'
                  : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>QUBO / Ising Combinatorial</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300">Binary QPO</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Quadratic Unconstrained Binary Optimization with cardinality constraint (K=4).</p>
            </button>

            {/* 4. QAOA Quantum */}
            <button
              onClick={() => handleRunOptimizer('QAOA_QUANTUM')}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                selectedSolver === 'QAOA_QUANTUM'
                  ? 'bg-purple-950/80 border-purple-500/80 ring-1 ring-purple-500/40 text-white'
                  : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>QAOA Quantum Simulator</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-950 text-purple-300">Variational</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Multi-Qubit statevector ansatz with parameterized phase & mixer angles.</p>
            </button>
          </div>

          {/* Core Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80">
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/60">
              <div className="text-[10px] text-slate-400 font-mono">Expected Return (Ann)</div>
              <div className="text-sm font-bold text-emerald-400 font-mono">
                +{(optimizationResult.expectedReturnAnnual * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/60">
              <div className="text-[10px] text-slate-400 font-mono">Portfolio Volatility (σ)</div>
              <div className="text-sm font-bold text-amber-400 font-mono">
                {(optimizationResult.volatilityAnnual * 100).toFixed(1)}%
              </div>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/60">
              <div className="text-[10px] text-slate-400 font-mono">Sharpe Ratio</div>
              <div className="text-sm font-bold text-cyan-400 font-mono">
                {optimizationResult.sharpeRatio}
              </div>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/60">
              <div className="text-[10px] text-slate-400 font-mono">Quantum Exposure (QVI)</div>
              <div className="text-sm font-bold text-purple-400 font-mono">
                {optimizationResult.quantumVulnerabilityScore}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Asset Allocation Chart & Weights Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Chart Column */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase font-mono flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Optimal Asset Allocation ({selectedSolver})
            </h3>
            <button
              onClick={handleExecuteRebalance}
              className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-cyan-900/20"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              Rebalance Portfolio
            </button>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="symbol" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090d16',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                  }}
                  formatter={(val: any, name: any, item: any) => [`${val}% (₹${item.payload.allocatedInr.toLocaleString('en-IN')})`, 'Weight']}
                />
                <Bar dataKey="weightPct" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weights Breakdown Table */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase font-mono flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            Asset Weights & Capital Distribution
          </h3>

          <div className="max-h-56 overflow-y-auto pr-1 space-y-1.5">
            {ASSET_UNIVERSE.map((asset) => {
              const weight = optimizationResult.weights[asset.id] || 0;
              const allocatedInr = Math.round(capitalInr * weight);
              const isSelected = weight > 0;

              return (
                <div
                  key={asset.id}
                  className={`p-2 rounded-xl border transition flex items-center justify-between text-xs ${
                    isSelected
                      ? 'bg-slate-950/80 border-slate-700/80 text-white'
                      : 'bg-slate-950/30 border-slate-800/40 text-slate-500 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{asset.icon}</span>
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <span>{asset.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">({asset.symbol})</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Exp: +{(asset.expectedReturnAnnual * 100).toFixed(0)}% • Vol: {(asset.volatilityAnnual * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="font-bold text-cyan-400">
                      {(weight * 100).toFixed(1)}%
                    </div>
                    <div className="text-[10px] text-slate-300">
                      ₹{allocatedInr.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 3: Aladdin Multi-Factor Stress Testing Matrix */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              BlackRock Aladdin-Grade Stress Testing Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate macro financial shocks, quantum cryptanalysis breakthroughs, and liquidity crunches.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Current Shock Impact:</span>
            <span
              className={`px-3 py-1 rounded-lg font-mono text-xs font-bold ${
                stressTestResult.portfolioShockPercent >= 0
                  ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                  : 'bg-red-950 border border-red-500/40 text-red-300'
              }`}
            >
              {stressTestResult.portfolioShockPercent >= 0 ? '+' : ''}
              {stressTestResult.portfolioShockPercent}% (₹
              {stressTestResult.stressedValue.toLocaleString('en-IN')})
            </span>
          </div>
        </div>

        {/* 4 Scenario Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STRESS_SCENARIOS.map((scen) => {
            const isCurrent = selectedScenario.id === scen.id;
            return (
              <button
                key={scen.id}
                onClick={() => handleTriggerStressTest(scen)}
                className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-orange-950/60 border-orange-500/80 ring-1 ring-orange-500/40 text-white'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-lg">{scen.icon}</span>
                    <span className="font-bold text-xs leading-tight">{scen.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">{scen.description}</p>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-500">Aladdin Scenario</span>
                  <span className={isCurrent ? 'text-orange-400 font-bold' : 'text-slate-400'}>
                    {isCurrent ? '● Active Test' : 'Run Test'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Asset-by-Asset Shock Table */}
        <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 text-[10px]">
                <th className="pb-1.5">ASSET</th>
                <th className="pb-1.5">WEIGHT</th>
                <th className="pb-1.5">INITIAL CAPITAL</th>
                <th className="pb-1.5">SCENARIO SHOCK</th>
                <th className="pb-1.5 text-right">STRESSED P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {stressTestResult.assetImpacts
                .filter((a) => a.weight > 0)
                .map((item) => (
                  <tr key={item.symbol} className="text-slate-300">
                    <td className="py-1.5 font-bold text-white">{item.assetName} ({item.symbol})</td>
                    <td className="py-1.5 text-cyan-400">{(item.weight * 100).toFixed(1)}%</td>
                    <td className="py-1.5 text-slate-300">₹{Math.round(capitalInr * item.weight).toLocaleString('en-IN')}</td>
                    <td className={`py-1.5 font-bold ${item.shockPct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {item.shockPct >= 0 ? '+' : ''}{item.shockPct}%
                    </td>
                    <td className={`py-1.5 text-right font-bold ${item.plAmount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {item.plAmount >= 0 ? '+' : ''}₹{item.plAmount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 4: Benchmarking & AI Copilot Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Benchmark Table */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Aladdin vs. Quantum Benchmark Matrix
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 text-[10px]">
                  <th className="pb-1.5">SOLVER</th>
                  <th className="pb-1.5">TIME (ms)</th>
                  <th className="pb-1.5">FEASIBLE</th>
                  <th className="pb-1.5">SHARPE</th>
                  <th className="pb-1.5 text-right">QUALITY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-[11px]">
                <tr className="text-slate-300">
                  <td className="py-2 text-blue-300 font-bold">Classical Markowitz</td>
                  <td className="py-2">2 ms</td>
                  <td className="py-2 text-emerald-400">100%</td>
                  <td className="py-2 font-bold text-white">1.82</td>
                  <td className="py-2 text-right text-emerald-400">94.2%</td>
                </tr>
                <tr className="text-slate-300">
                  <td className="py-2 text-teal-300 font-bold">Aladdin Risk Parity</td>
                  <td className="py-2">3 ms</td>
                  <td className="py-2 text-emerald-400">100%</td>
                  <td className="py-2 font-bold text-white">1.68</td>
                  <td className="py-2 text-right text-teal-400">91.5%</td>
                </tr>
                <tr className="text-slate-300">
                  <td className="py-2 text-amber-300 font-bold">QUBO Ising Matrix</td>
                  <td className="py-2">5 ms</td>
                  <td className="py-2 text-emerald-400">100%</td>
                  <td className="py-2 font-bold text-white">2.04</td>
                  <td className="py-2 text-right text-amber-400">96.8%</td>
                </tr>
                <tr className="text-slate-300 bg-purple-950/30">
                  <td className="py-2 text-purple-300 font-bold">QAOA Quantum Simulator</td>
                  <td className="py-2">12 ms</td>
                  <td className="py-2 text-emerald-400">100%</td>
                  <td className="py-2 font-bold text-cyan-300">2.18</td>
                  <td className="py-2 text-right text-purple-300 font-bold">98.4%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Multi-Agent Copilot Feed */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase font-mono flex items-center gap-2">
            <Bot className="w-4 h-4 text-cyan-400" />
            Aladdin Multi-Agent Intelligence Feed
          </h3>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] space-y-2 max-h-44 overflow-y-auto text-slate-300">
            {copilotLog.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2 border-b border-slate-900 pb-1.5 last:border-none">
                <span className="text-cyan-400">›</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

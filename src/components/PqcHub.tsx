import React, { useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Lock, Cpu, Play, CheckCircle2, AlertTriangle, Key } from 'lucide-react';
import { PqcProof, QuantumAttackState } from '../types';
import { createPqcProof, verifyPqcSignature } from '../lib/pqc';

interface PqcHubProps {
  proofs: PqcProof[];
  onAddProof: (proof: PqcProof) => void;
  strictness: 'Standard' | 'Strict' | 'Quantum-Max';
  onStrictnessChange: (val: 'Standard' | 'Strict' | 'Quantum-Max') => void;
}

export const PqcHub: React.FC<PqcHubProps> = ({
  proofs,
  onAddProof,
  strictness,
  onStrictnessChange,
}) => {
  const [attackState, setAttackState] = useState<QuantumAttackState>({
    status: 'idle',
    qubits: 4096,
    rsaStatus: 'COMPROMISED (0.002s)',
    pqcStatus: 'SECURE (Lattice Dimension 768 Resisted)',
    attackedVectorsCount: 0,
    blockedCount: 0,
  });

  const [auditReport, setAuditReport] = useState<any | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  // Trigger Shor's Algorithm Quantum Attack Simulation
  const handleSimulateShorAttack = () => {
    setAttackState((prev) => ({
      ...prev,
      status: 'attacking',
    }));

    setTimeout(() => {
      setAttackState((prev) => ({
        ...prev,
        status: 'thwarted',
        attackedVectorsCount: prev.attackedVectorsCount + 128,
        blockedCount: prev.blockedCount + 128,
        lastAttackTimestamp: new Date().toLocaleTimeString(),
      }));

      // Add a blocked proof to feed
      const blockedProof = createPqcProof('QUANTUM-SHOR-SIMULATOR', 'ML-KEM-768', 'Shor Algorithm Decryption Payload');
      onAddProof({
        ...blockedProof,
        verified: true,
        signature: 'SIG-[ML-KEM-768]-LATTICE-DEFENSE-PASSED',
      });
    }, 1200);
  };

  // Run PQC Security Audit with backend Gemini API
  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await fetch('/api/pqc/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalCells: 160,
          pqcProofsCount: proofs.length,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAuditReport(data.report);
      }
    } catch (err) {
      console.error('Audit failed', err);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 text-slate-100 font-sans p-4 space-y-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <h2 className="font-bold text-sm text-slate-100">PQC Lattice Cryptographic Hub</h2>
        </div>

        <select
          value={strictness}
          onChange={(e) => onStrictnessChange(e.target.value as any)}
          className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-cyan-300 font-mono focus:outline-none"
        >
          <option value="Standard">PQC: Standard</option>
          <option value="Strict">PQC: Strict FIPS 203</option>
          <option value="Quantum-Max">PQC: Quantum-Max</option>
        </select>
      </div>

      {/* Shor's Algorithm Attack Simulator Box */}
      <div className="bg-slate-950 p-4 rounded-xl border border-cyan-900/80 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-xs text-cyan-400">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Shor's Algorithm Quantum Attack Simulator</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
            {attackState.qubits} Qubits
          </span>
        </div>

        <p className="text-[11px] text-slate-300 leading-relaxed">
          Simulate a hypothetical 4096-qubit quantum computer attempting to crack cell signature states using Shor's period-finding factorization.
        </p>

        {/* Comparison Bar */}
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
          <div className="p-2.5 bg-rose-950/40 border border-rose-900/80 rounded-lg space-y-1">
            <div className="text-rose-400 font-bold flex items-center justify-between">
              <span>RSA-2048 / ECC</span>
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <div className="text-[10px] text-rose-300">
              {attackState.status === 'idle'
                ? 'Vulnerable to Shor'
                : 'BROKEN IN 0.002s (Factorized)'}
            </div>
          </div>

          <div className="p-2.5 bg-emerald-950/40 border border-emerald-900/80 rounded-lg space-y-1">
            <div className="text-emerald-400 font-bold flex items-center justify-between">
              <span>ML-KEM-768 (Lattice)</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="text-[10px] text-emerald-300">
              {attackState.status === 'thwarted'
                ? 'ATTACK THWARTED (100% Protected)'
                : 'Lattice Security Intact'}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSimulateShorAttack}
            disabled={attackState.status === 'attacking'}
            className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
          >
            {attackState.status === 'attacking' ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
            Launch Shor Attack Test
          </button>

          <button
            onClick={handleRunAudit}
            disabled={isAuditing}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 transition border border-slate-700"
          >
            {isAuditing ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            )}
            Audit Report
          </button>
        </div>
      </div>

      {/* Audit Report Modal / Card */}
      {auditReport && (
        <div className="bg-slate-950 p-3.5 rounded-xl border border-emerald-800/80 space-y-2 text-xs">
          <div className="flex items-center justify-between text-emerald-400 font-semibold border-b border-slate-800 pb-1">
            <span>Gemini PQC Security Audit Report</span>
            <span className="text-[10px] text-slate-400 font-mono">FIPS 203/204</span>
          </div>

          <div className="flex items-center justify-between font-mono text-[11px]">
            <span>PQC Resilience Rating:</span>
            <span className="text-emerald-400 font-bold">{auditReport.pqcResilienceScore}/100</span>
          </div>

          <p className="text-[11px] text-slate-300 leading-normal bg-slate-900 p-2 rounded border border-slate-800">
            {auditReport.auditSummary}
          </p>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Recommendations:</span>
            <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-slate-300">
              {auditReport.keyRecommendations?.map((rec: string, i: number) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Verified PQC Signature Proofs Feed */}
      <div className="flex-1 flex flex-col space-y-2 min-h-0">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>PQC Proof Stream ({proofs.length})</span>
          <span className="text-cyan-400">ML-KEM / ML-DSA</span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {proofs.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs font-mono">
              No proofs generated yet. Step automaton grid to produce PQC proofs.
            </div>
          ) : (
            proofs.map((proof) => (
              <div
                key={proof.id}
                className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1 text-xs font-mono hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-cyan-300 font-semibold text-[11px]">
                    {proof.algorithm}
                  </span>
                  <span className="text-[10px] text-slate-500">{proof.timestamp}</span>
                </div>

                <div className="text-[10px] text-slate-400 truncate">
                  Sig: <span className="text-slate-300">{proof.signature}</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px]">
                  <span className="text-slate-500">Latency: {proof.latencyMs}ms</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3 h-3" /> VERIFIED
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

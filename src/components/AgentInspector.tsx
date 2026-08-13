import React, { useState } from 'react';
import { CellData } from '../types';
import { X, Cpu, ShieldCheck, Zap, RefreshCw, Key, MessageSquare, Activity } from 'lucide-react';

interface AgentInspectorProps {
  cell: CellData | null;
  onClose: () => void;
  onUpdateCell: (updatedCell: CellData) => void;
  onTriggerAiReasoning: (cell: CellData) => Promise<void>;
  isReasoning: boolean;
}

export const AgentInspector: React.FC<AgentInspectorProps> = ({
  cell,
  onClose,
  onUpdateCell,
  onTriggerAiReasoning,
  isReasoning,
}) => {
  const [aiNote, setAiNote] = useState('');

  if (!cell) return null;

  const handleEnergyBoost = () => {
    const updated = {
      ...cell,
      energy: Math.min(100, cell.energy + 25),
    };
    onUpdateCell(updated);
  };

  const handleToggleState = () => {
    const nextStates: Record<string, 'dead' | 'alive' | 'ai_agent' | 'quantum_locked'> = {
      alive: 'ai_agent',
      ai_agent: 'quantum_locked',
      quantum_locked: 'alive',
      dead: 'alive',
    };
    const newState = nextStates[cell.state] || 'alive';
    onUpdateCell({
      ...cell,
      state: newState,
    });
  };

  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full font-sans text-slate-100 shadow-2xl overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <h3 className="font-semibold text-sm text-slate-100">Cell ({cell.x}, {cell.y}) Inspector</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-200 rounded-md hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 text-xs">
        {/* Basic Cell Metadata */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-mono">State:</span>
            <span className="px-2 py-0.5 rounded font-mono text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/80 uppercase">
              {cell.state}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-mono">Generation:</span>
            <span className="font-mono text-cyan-300">{cell.generation}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-mono">Energy Level:</span>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full transition-all"
                  style={{ width: `${cell.energy}%` }}
                />
              </div>
              <span className="font-mono text-emerald-400 font-semibold">{cell.energy}%</span>
            </div>
          </div>
          <div className="pt-2 flex gap-2">
            <button
              onClick={handleEnergyBoost}
              className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center justify-center gap-1 font-medium transition"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" /> +25 Energy
            </button>
            <button
              onClick={handleToggleState}
              className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center justify-center gap-1 font-medium transition"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> Shift State
            </button>
          </div>
        </div>

        {/* AI Agent Node Section */}
        {cell.aiAgent ? (
          <div className="bg-slate-950/80 p-3 rounded-xl border border-emerald-900/60 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold border-b border-slate-800 pb-1.5">
              <Cpu className="w-4 h-4" />
              <span>Gemini AI Agent Node</span>
            </div>
            <div>
              <span className="text-slate-400">Persona:</span>
              <p className="font-semibold text-slate-200 mt-0.5">{cell.aiAgent.persona}</p>
            </div>
            <div>
              <span className="text-slate-400">Current Directive:</span>
              <p className="text-slate-300 italic text-[11px] bg-slate-900/90 p-2 rounded border border-slate-800 mt-1">
                "{cell.aiAgent.directive}"
              </p>
            </div>
            <div>
              <span className="text-slate-400">Agent Memory Log:</span>
              <div className="max-h-24 overflow-y-auto space-y-1 mt-1 font-mono text-[10px] text-slate-300 bg-slate-900 p-2 rounded border border-slate-800">
                {cell.aiAgent.memory.map((mem, idx) => (
                  <div key={idx} className="border-b border-slate-800/60 last:border-none pb-0.5">
                    • {mem}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onTriggerAiReasoning(cell)}
              disabled={isReasoning}
              className="w-full py-2 mt-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 transition shadow-sm"
            >
              {isReasoning ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Activity className="w-3.5 h-3.5" />
              )}
              Execute Gemini Reasoning
            </button>
          </div>
        ) : (
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center text-slate-400">
            <p>Not an active AI Agent node.</p>
            <button
              onClick={() =>
                onUpdateCell({
                  ...cell,
                  state: 'ai_agent',
                  aiAgent: {
                    id: `agent-${cell.x}-${cell.y}`,
                    persona: 'Aether-01',
                    status: 'Active AI Autonomous Cell',
                    directive: 'Optimize cluster energy and maintain PQC security',
                    memory: ['Upgraded to AI Node'],
                    autonomyLevel: 7,
                    generation: 1,
                    energy: 90,
                    decisionsCount: 1,
                  },
                })
              }
              className="mt-2 text-xs px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 rounded-lg transition border border-emerald-700/60"
            >
              Promote to Gemini AI Agent
            </button>
          </div>
        )}

        {/* Post-Quantum Cryptography Metadata */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-cyan-900/60 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold border-b border-slate-800 pb-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>PQC Keypair & State Proof</span>
          </div>

          <div>
            <span className="text-slate-400 font-mono">Algorithm:</span>
            <span className="ml-2 font-mono text-cyan-300 font-semibold">
              {cell.pqcKey?.algorithm || 'ML-KEM-768'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-mono">Public Key:</span>
            <p className="font-mono text-[10px] text-slate-300 bg-slate-900 p-1.5 rounded border border-slate-800 break-all mt-1">
              {cell.pqcKey?.publicKey || 'ML-KEM-768-PUB-UNASSIGNED'}
            </p>
          </div>

          <div>
            <span className="text-slate-400 font-mono">Lattice Security:</span>
            <p className="text-slate-300 text-[11px] font-mono mt-0.5">
              {cell.pqcKey?.securityLevelBits || 256}-bit post-quantum security
            </p>
          </div>

          <div>
            <span className="text-slate-400 font-mono">State SHA3 Hash:</span>
            <p className="font-mono text-[10px] text-slate-400 truncate bg-slate-900 p-1 rounded border border-slate-800">
              {cell.hash}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

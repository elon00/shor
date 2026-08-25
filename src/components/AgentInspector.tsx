import React, { useState } from 'react';
import { CellData } from '../types';
import { X, Cpu, ShieldCheck, Zap, RefreshCw, Activity } from 'lucide-react';

interface AgentInspectorProps {
  cell?: CellData | null;
  selectedCell?: CellData | null;
  generation?: number;
  pqcStrictness?: string;
  onClose?: () => void;
  onUpdateCell?: (updatedCell: CellData) => void;
  onTriggerAiReasoning?: (cell: CellData) => Promise<void>;
  isReasoning?: boolean;
  onAddTerminalMessage?: (msg: string) => void;
}

export const AgentInspector: React.FC<AgentInspectorProps> = ({
  cell,
  selectedCell,
  generation = 1,
  onClose,
  onUpdateCell,
  onTriggerAiReasoning,
  isReasoning = false,
  onAddTerminalMessage,
}) => {
  const activeCell = selectedCell || cell;

  if (!activeCell) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center text-slate-400 text-xs font-mono">
        <Cpu className="w-6 h-6 text-slate-600 mx-auto mb-2" />
        <p>No cell selected.</p>
        <p className="text-[10px] text-slate-500 mt-1">Click any grid coordinate to inspect AI agent or PQC keys.</p>
      </div>
    );
  }

  const handleEnergyBoost = () => {
    if (onUpdateCell && activeCell) {
      onUpdateCell({
        ...activeCell,
        energy: Math.min(100, activeCell.energy + 25),
      });
    }
    if (onAddTerminalMessage) {
      onAddTerminalMessage(`⚡ Boosted cell (${activeCell.x}, ${activeCell.y}) energy by +25.`);
    }
  };

  const handleToggleState = () => {
    if (!onUpdateCell || !activeCell) return;
    const nextStates: Record<string, 'dead' | 'alive' | 'ai_agent' | 'quantum_locked'> = {
      alive: 'ai_agent',
      ai_agent: 'quantum_locked',
      quantum_locked: 'alive',
      dead: 'alive',
    };
    const newState = nextStates[activeCell.state] || 'alive';
    onUpdateCell({
      ...activeCell,
      state: newState,
    });
    if (onAddTerminalMessage) {
      onAddTerminalMessage(`🔄 Shifted cell (${activeCell.x}, ${activeCell.y}) state to ${newState}.`);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col font-sans text-slate-100 shadow-xl overflow-hidden text-xs">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <h3 className="font-semibold text-xs text-slate-100">Cell ({activeCell.x}, {activeCell.y}) Inspector</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-3">
        <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 space-y-1.5 font-mono text-[11px]">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">State:</span>
            <span className="px-1.5 py-0.5 rounded font-bold text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/80 uppercase">
              {activeCell.state}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Generation:</span>
            <span className="text-cyan-300">{activeCell.generation || generation}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Energy Level:</span>
            <span className="text-emerald-400 font-bold">{activeCell.energy || 100}%</span>
          </div>
          <div className="pt-1.5 flex gap-1.5">
            <button
              onClick={handleEnergyBoost}
              className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center justify-center gap-1 font-sans transition text-[10px]"
            >
              <Zap className="w-3 h-3 text-amber-400" /> +25 Energy
            </button>
            <button
              onClick={handleToggleState}
              className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center justify-center gap-1 font-sans transition text-[10px]"
            >
              <RefreshCw className="w-3 h-3 text-cyan-400" /> Shift State
            </button>
          </div>
        </div>

        {/* AI Agent Node Section */}
        {activeCell.aiAgent ? (
          <div className="bg-slate-950/80 p-2.5 rounded-lg border border-emerald-900/60 space-y-1.5 text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold border-b border-slate-800 pb-1">
              <Cpu className="w-3.5 h-3.5" />
              <span>Gemini AI Agent Node</span>
            </div>
            <div>
              <span className="text-slate-400">Persona:</span>
              <span className="font-semibold text-slate-200 ml-1.5">{activeCell.aiAgent.persona}</span>
            </div>
            <div>
              <span className="text-slate-400">Directive:</span>
              <p className="text-slate-300 italic text-[10px] bg-slate-900/90 p-1.5 rounded border border-slate-800 mt-0.5">
                "{activeCell.aiAgent.directive}"
              </p>
            </div>
            {onTriggerAiReasoning && (
              <button
                onClick={() => onTriggerAiReasoning(activeCell)}
                disabled={isReasoning}
                className="w-full py-1.5 mt-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded font-bold flex items-center justify-center gap-1 transition"
              >
                <Activity className="w-3 h-3" />
                Execute Gemini Reasoning
              </button>
            )}
          </div>
        ) : (
          <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800 text-center text-slate-400 text-[11px]">
            <span>Standard Conway Automaton Cell</span>
          </div>
        )}

        {/* PQC Section */}
        <div className="bg-slate-950/80 p-2.5 rounded-lg border border-cyan-900/60 space-y-1 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold border-b border-slate-800 pb-1 font-sans">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PQC Keypair & Lattice Hash</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px]">Algorithm:</span>
            <span className="ml-1.5 text-cyan-300 text-[10px] font-bold">
              {activeCell.pqcKey?.algorithm || 'ML-KEM-768'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px]">State Hash:</span>
            <p className="text-[9px] text-slate-400 truncate bg-slate-900 p-1 rounded border border-slate-800 mt-0.5">
              {activeCell.hash || '0x49f8a...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

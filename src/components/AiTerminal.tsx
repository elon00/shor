import React, { useState } from 'react';
import { Terminal, Send, Sparkles, Cpu, ShieldCheck, Zap, Trash2 } from 'lucide-react';

interface TerminalMessage {
  id: string;
  sender: 'USER' | 'GEMINI_MASTER' | 'SYSTEM';
  text: string;
  timestamp: string;
  payload?: any;
}

interface AiTerminalProps {
  messages: TerminalMessage[];
  onSendMessage: (prompt: string) => Promise<void>;
  isLoading: boolean;
  onClearTerminal: () => void;
}

export const AiTerminal: React.FC<AiTerminalProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onClearTerminal,
}) => {
  const [inputPrompt, setInputPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isLoading) return;
    onSendMessage(inputPrompt.trim());
    setInputPrompt('');
  };

  const handleQuickClick = (quickText: string) => {
    if (isLoading) return;
    onSendMessage(quickText);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border-t border-slate-800 font-mono text-slate-100 p-4 space-y-3">
      {/* Terminal Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-slate-200">WEB 4.0 AI AUTOMATON COMMAND TERMINAL</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500">Gemini 3.6 Flash Server-Side</span>
          <button
            onClick={onClearTerminal}
            className="p-1 text-slate-500 hover:text-slate-300 transition rounded"
            title="Clear Console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-2.5 p-2 bg-slate-900/60 rounded-xl border border-slate-800/80 text-xs min-h-[140px] max-h-[260px]">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-1">
            <div className="flex items-center gap-2 text-[10px]">
              {msg.sender === 'USER' && (
                <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-semibold">
                  USER DIRECTIVE
                </span>
              )}
              {msg.sender === 'GEMINI_MASTER' && (
                <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> GEMINI WEB4 MASTER
                </span>
              )}
              {msg.sender === 'SYSTEM' && (
                <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                  PQC SYSTEM
                </span>
              )}
              <span className="text-slate-500 text-[10px]">{msg.timestamp}</span>
            </div>

            <p className="text-slate-200 pl-2 border-l-2 border-slate-700 whitespace-pre-wrap leading-relaxed">
              {msg.text}
            </p>

            {msg.payload?.explanationHindiEnglish && (
              <div className="ml-2 p-2 bg-slate-950 rounded border border-emerald-900/60 text-[11px] text-emerald-300 font-sans">
                💡 <span className="font-semibold">Context:</span> {msg.payload.explanationHindiEnglish}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-emerald-400 text-xs py-1">
            <div className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            <span>Gemini 3.6 Flash compiling agent consensus and lattice vectors...</span>
          </div>
        )}
      </div>

      {/* Quick Command Chips */}
      <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
        <span className="text-slate-500 font-sans">Quick Commands:</span>
        <button
          onClick={() => handleQuickClick('Deploy a post-quantum protected glider swarm to the center')}
          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-cyan-300 rounded border border-slate-700 transition"
        >
          🚀 Glider Swarm
        </button>
        <button
          onClick={() => handleQuickClick('Construct a PQC ML-KEM-768 lattice matrix node grid')}
          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-emerald-300 rounded border border-slate-700 transition"
        >
          🛡️ PQC Lattice Mesh
        </button>
        <button
          onClick={() => handleQuickClick('Harmonize energy balance across all alive Conway cells')}
          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded border border-slate-700 transition"
        >
          ⚡ Harmonize Energy
        </button>
        <button
          onClick={() => handleQuickClick('Explain how this Web 4.0 Conway AI Automaton works with Post-Quantum Cryptography')}
          className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-purple-300 rounded border border-slate-700 transition"
        >
          ❓ Explain Web 4.0 Architecture
        </button>
      </div>

      {/* Input Command Line */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1">
        <div className="relative flex-1">
          <span className="absolute left-3 top-2.5 text-emerald-400 font-bold">$</span>
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Type directive to Conway AI master consciousness..."
            className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 text-slate-100 rounded-lg pl-7 pr-3 py-2 text-xs focus:outline-none transition font-mono"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={!inputPrompt.trim() || isLoading}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-sm font-sans"
        >
          <Send className="w-3.5 h-3.5" />
          Execute
        </button>
      </form>
    </div>
  );
};

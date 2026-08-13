import React, { useState } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Sparkles, Volume2, VolumeX, Shield, Zap, Send } from 'lucide-react';
import { GridConfig } from '../types';

interface ControlBarProps {
  isRunning: boolean;
  onTogglePlay: () => void;
  onStep: () => void;
  onReset: () => void;
  onRandomize: () => void;
  onLoadPreset: (presetName: string) => void;
  config: GridConfig;
  setConfig: React.Dispatch<React.SetStateAction<GridConfig>>;
  generation: number;
  population: number;
  activeAgentsCount: number;
  onSendQuickDirective: (prompt: string) => void;
  isProcessingDirective: boolean;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  isRunning,
  onTogglePlay,
  onStep,
  onReset,
  onRandomize,
  onLoadPreset,
  config,
  setConfig,
  generation,
  population,
  activeAgentsCount,
  onSendQuickDirective,
  isProcessingDirective,
}) => {
  const [quickPrompt, setQuickPrompt] = useState('');

  const handleDirectiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim() || isProcessingDirective) return;
    onSendQuickDirective(quickPrompt.trim());
    setQuickPrompt('');
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 p-3.5 space-y-3 font-sans text-slate-100 shadow-md">
      {/* Top Row: Playback & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            id="play-pause-btn"
            onClick={onTogglePlay}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 text-sm transition-all shadow-md ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Pause' : 'Play Grid'}
          </button>

          <button
            id="step-forward-btn"
            onClick={onStep}
            disabled={isRunning}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 rounded-lg text-sm flex items-center gap-1.5 transition border border-slate-700"
            title="Advance 1 Generation"
          >
            <SkipForward className="w-4 h-4 text-cyan-400" />
            Step
          </button>

          <button
            id="reset-btn"
            onClick={onReset}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm flex items-center gap-1.5 transition border border-slate-700"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
            Clear
          </button>

          <button
            id="randomize-btn"
            onClick={onRandomize}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm flex items-center gap-1.5 transition border border-slate-700"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            Random Seed
          </button>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Presets:</span>
          <select
            id="preset-selector"
            onChange={(e) => {
              if (e.target.value) onLoadPreset(e.target.value);
            }}
            defaultValue=""
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="" disabled>Select Automaton Pattern...</option>
            <option value="WEB4_AI_SWARM">Web 4.0 AI Swarm Cluster</option>
            <option value="PQC_LATTICE_MESH">PQC Quantum Lattice Mesh</option>
            <option value="GOSPER_GUN">Gosper Glider Gun</option>
            <option value="GLIDER_SWARM">Conway Glider Armada</option>
            <option value="QUANTUM_PULSAR">Quantum Pulsar Oscillator</option>
          </select>
        </div>

        {/* Speed Slider & Sound Toggle */}
        <div className="flex items-center gap-4 border-l border-slate-800 pl-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Speed:</span>
            <input
              type="range"
              min="30"
              max="500"
              step="10"
              value={config.speedMs}
              onChange={(e) => setConfig((prev) => ({ ...prev, speedMs: Number(e.target.value) }))}
              className="w-20 accent-cyan-400 cursor-pointer"
            />
            <span className="text-xs text-cyan-300 font-mono w-10">{config.speedMs}ms</span>
          </div>

          <button
            id="audio-toggle-btn"
            onClick={() => setConfig((prev) => ({ ...prev, enableAudio: !prev.enableAudio }))}
            className={`p-1.5 rounded-lg border transition ${
              config.enableAudio
                ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
            title="Toggle Audio Effects"
          >
            {config.enableAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Generation & Network Stats */}
        <div className="flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
          <div>
            Gen: <span className="text-cyan-400 font-bold">{generation}</span>
          </div>
          <div className="border-l border-slate-800 pl-3">
            Pop: <span className="text-blue-400 font-bold">{population}</span>
          </div>
          <div className="border-l border-slate-800 pl-3">
            AI Nodes: <span className="text-emerald-400 font-bold">{activeAgentsCount}</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Web 4.0 Gemini Directive Bar */}
      <form onSubmit={handleDirectiveSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Sparkles className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
          <input
            id="global-directive-input"
            type="text"
            value={quickPrompt}
            onChange={(e) => setQuickPrompt(e.target.value)}
            placeholder="Issue Gemini AI directive to the automaton swarm (e.g., 'Deploy a post-quantum protected glider team to the center')"
            className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 text-slate-100 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none transition font-sans"
            disabled={isProcessingDirective}
          />
        </div>

        <button
          id="send-directive-btn"
          type="submit"
          disabled={!quickPrompt.trim() || isProcessingDirective}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
        >
          {isProcessingDirective ? (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          Issue AI Directive
        </button>
      </form>
    </div>
  );
};

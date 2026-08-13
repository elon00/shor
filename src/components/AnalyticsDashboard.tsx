import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { Activity, Cpu, ShieldCheck, Network, BarChart3 } from 'lucide-react';

interface HistoryPoint {
  generation: number;
  population: number;
  aiAgents: number;
  latencyMs: number;
  pqcProofs: number;
}

interface AnalyticsDashboardProps {
  history: HistoryPoint[];
  currentGeneration: number;
  currentPopulation: number;
  activeAgentsCount: number;
  totalPqcProofs: number;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  history,
  currentGeneration,
  currentPopulation,
  activeAgentsCount,
  totalPqcProofs,
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-900 border-t border-slate-800 text-slate-100 font-sans p-4 space-y-4 overflow-y-auto">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <div className="text-slate-400 flex items-center justify-between">
            <span>Grid Generation</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-cyan-400">{currentGeneration}</div>
          <div className="text-[10px] text-slate-500">Conway Step Cycles</div>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <div className="text-slate-400 flex items-center justify-between">
            <span>Total Population</span>
            <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-lg font-bold text-blue-400">{currentPopulation}</div>
          <div className="text-[10px] text-slate-500">Active Cells</div>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <div className="text-slate-400 flex items-center justify-between">
            <span>AI Agents</span>
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-emerald-400">{activeAgentsCount}</div>
          <div className="text-[10px] text-slate-500">Autonomous Nodes</div>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <div className="text-slate-400 flex items-center justify-between">
            <span>PQC Verified Proofs</span>
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-lg font-bold text-purple-400">{totalPqcProofs}</div>
          <div className="text-[10px] text-slate-500">ML-KEM-768 Signatures</div>
        </div>
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-[220px]">
        {/* Population & AI Agent Trend */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-200">Automaton Population & AI Node Evolution</span>
            <span className="text-[10px] font-mono text-cyan-400">Live Time Series</span>
          </div>

          <div className="flex-1 w-full min-h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorPop" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="generation" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="population" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPop)" name="Population" />
                <Area type="monotone" dataKey="aiAgents" stroke="#10b981" fillOpacity={1} fill="url(#colorAi)" name="AI Nodes" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PQC Verification Latency */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-200">PQC Signature Verification Latency (ms)</span>
            <span className="text-[10px] font-mono text-emerald-400">ML-KEM-768 Benchmark</span>
          </div>

          <div className="flex-1 w-full min-h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="generation" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} domain={[0, 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="latencyMs" stroke="#c084fc" strokeWidth={2} dot={false} name="Latency (ms)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

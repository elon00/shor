import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Activity, BarChart3, ShieldCheck, Cpu } from 'lucide-react';

interface HistoryPoint {
  generation: number;
  population: number;
  aiAgents: number;
  latencyMs: number;
  pqcProofs: number;
}

interface AnalyticsDashboardProps {
  history?: HistoryPoint[];
  currentGeneration?: number;
  currentPopulation?: number;
  activeAgentsCount?: number;
  totalPqcProofs?: number;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  history = [],
  currentGeneration = 0,
  currentPopulation = 0,
  activeAgentsCount = 0,
  totalPqcProofs = 0,
}) => {
  const chartData = history && history.length > 0
    ? history
    : Array.from({ length: 10 }, (_, i) => ({
        generation: i + 1,
        population: Math.floor(Math.sin(i / 2) * 20 + 40),
        aiAgents: Math.floor(i * 1.5 + 2),
        latencyMs: 12 + (i % 4),
        pqcProofs: (i + 1) * 3,
      }));

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl text-slate-100 font-sans p-4 space-y-4 overflow-y-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <div className="text-slate-400 flex items-center justify-between">
            <span>Grid Generation</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-cyan-400">{currentGeneration || chartData[chartData.length - 1]?.generation || 0}</div>
          <div className="text-[10px] text-slate-500">Conway Step Cycles</div>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <div className="text-slate-400 flex items-center justify-between">
            <span>Total Population</span>
            <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-lg font-bold text-blue-400">{currentPopulation || chartData[chartData.length - 1]?.population || 0}</div>
          <div className="text-[10px] text-slate-500">Active Cells</div>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <div className="text-slate-400 flex items-center justify-between">
            <span>AI Agent Nodes</span>
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-emerald-400">{activeAgentsCount || chartData[chartData.length - 1]?.aiAgents || 0}</div>
          <div className="text-[10px] text-slate-500">Gemini Reasoning Cells</div>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <div className="text-slate-400 flex items-center justify-between">
            <span>PQC Proofs</span>
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-lg font-bold text-purple-400">{totalPqcProofs || chartData[chartData.length - 1]?.pqcProofs || 0}</div>
          <div className="text-[10px] text-slate-500">ML-KEM Verified</div>
        </div>
      </div>

      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-200 font-mono flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          Population & Autonomous Agent Trajectory
        </h3>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="popGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="agentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="generation" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="population" stroke="#06b6d4" fill="url(#popGrad)" name="Population" />
              <Area type="monotone" dataKey="aiAgents" stroke="#10b981" fill="url(#agentGrad)" name="AI Agents" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

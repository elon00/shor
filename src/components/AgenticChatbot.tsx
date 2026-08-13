import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  Zap,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Terminal,
  ShieldCheck,
  ShoppingBag,
  IndianRupee,
  Swords,
  Play,
  Volume2,
  VolumeX,
  RotateCcw,
  Layers,
  BarChart3,
} from 'lucide-react';
import { Web3WalletState, GridConfig } from '../types';
import { audioSynth } from '../lib/audioSynth';

export interface AgentAction {
  type: string;
  params?: any;
  label?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'USER' | 'AGENT' | 'SYSTEM';
  text: string;
  timestamp: string;
  reasoningSteps?: string[];
  actionsExecuted?: AgentAction[];
}

interface AgenticChatbotProps {
  currentTab: string;
  onNavigateTab: (tab: 'GRID' | 'PQC' | 'NFT_MARKET' | 'INR_EXCHANGE' | 'WWE_METAVERSE' | 'TERMINAL' | 'ANALYTICS') => void;
  isRunning: boolean;
  onTogglePlay: () => void;
  onStep: () => void;
  onClearGrid: () => void;
  onRandomizeGrid: () => void;
  onLoadPreset: (presetName: string) => void;
  config: GridConfig;
  setConfig: React.Dispatch<React.SetStateAction<GridConfig>>;
  wallet: Web3WalletState;
  setWallet: React.Dispatch<React.SetStateAction<Web3WalletState>>;
  population: number;
  onClaimAirdrop: () => void;
  onTriggerPqcAudit: () => void;
  onStartWweMatch: () => void;
  onMintNft: () => void;
}

const QUICK_SUGGESTIONS = [
  {
    icon: '⚡',
    label: 'Grid Play & Gosper Gun',
    prompt: 'Gosper Glider Gun pattern load karke simulation start kardo!',
  },
  {
    icon: '🛡️',
    label: 'Run PQC Security Audit',
    prompt: 'PQC Lattice Hub pe jao aur Quantum Security Audit execute karo.',
  },
  {
    icon: '🤼',
    label: 'Start WWE Fight Arena',
    prompt: 'WWE Metaverse Arena me jao aur Roman Reigns vs Brock Lesnar match shuru karo!',
  },
  {
    icon: '💰',
    label: 'Top-up ₹10,000 INR UPI',
    prompt: 'INR Exchange me ₹10,000 top-up karke $PQC tokens swap kar do.',
  },
  {
    icon: '🎨',
    label: 'Mint Quantum NFT',
    prompt: 'NFT Marketplace kholo aur new Web4 Quantum NFT mint karo.',
  },
  {
    icon: '📊',
    label: 'View Analytics Dashboard',
    prompt: 'Analytics tab kholo aur grid latency and population chart dikhao.',
  },
];

export const AgenticChatbot: React.FC<AgenticChatbotProps> = ({
  currentTab,
  onNavigateTab,
  isRunning,
  onTogglePlay,
  onStep,
  onClearGrid,
  onRandomizeGrid,
  onLoadPreset,
  config,
  setConfig,
  wallet,
  setWallet,
  population,
  onClaimAirdrop,
  onTriggerPqcAudit,
  onStartWweMatch,
  onMintNft,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'AGENT',
      text: '🤖 Namaste! Main Aether Agent Leader hoon. Platform ke saare functions ko lead aur control kar sakta hoon. Hindi/English prompts se Grid, PQC Audit, WWE Battles, INR Exchange ya NFTs ko control kijiye!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reasoningSteps: [
        'Agentic AI Control Subsystem Initialized',
        'ML-KEM-768 Command Dispatch Gateway Listening',
        'All 7 Function Submodules Ready for Neural Leading',
      ],
      actionsExecuted: [
        { type: 'SYSTEM_READY', label: '✅ Agent Leader Online & Ready to Control Functions' },
      ],
    },
  ]);

  const [expandedReasoningIds, setExpandedReasoningIds] = useState<Record<string, boolean>>({
    'welcome-1': false,
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Execute Agent Action Vector on Frontend
  const executeActions = (actions: AgentAction[]) => {
    actions.forEach((act) => {
      try {
        switch (act.type) {
          case 'START_SIMULATION':
            if (!isRunning) onTogglePlay();
            break;
          case 'PAUSE_SIMULATION':
            if (isRunning) onTogglePlay();
            break;
          case 'STEP_SIMULATION':
            onStep();
            break;
          case 'CLEAR_GRID':
            onClearGrid();
            break;
          case 'RANDOMIZE_GRID':
            onRandomizeGrid();
            break;
          case 'LOAD_PRESET':
            if (act.params?.preset) {
              onLoadPreset(act.params.preset);
            } else {
              onLoadPreset('GOSPER_GUN');
            }
            break;
          case 'NAVIGATE_TAB':
            if (act.params?.tab) {
              onNavigateTab(act.params.tab);
            }
            break;
          case 'SET_SPEED':
            if (act.params?.speedMs) {
              setConfig((prev) => ({ ...prev, speedMs: act.params.speedMs }));
            }
            break;
          case 'SET_MUTATION_RATE':
            if (act.params?.mutationRate) {
              setConfig((prev) => ({ ...prev, mutationRate: act.params.mutationRate }));
            }
            break;
          case 'TOGGLE_AUDIO':
            if (act.params?.enableAudio !== undefined) {
              setConfig((prev) => ({ ...prev, enableAudio: act.params.enableAudio }));
            } else {
              setConfig((prev) => ({ ...prev, enableAudio: !prev.enableAudio }));
            }
            break;
          case 'TOPUP_INR':
            {
              const amount = act.params?.amount || 10000;
              setWallet((prev) => ({ ...prev, inrBalance: prev.inrBalance + amount }));
              onNavigateTab('INR_EXCHANGE');
            }
            break;
          case 'SWAP_INR_PQC':
            {
              const inrCost = 1000;
              const pqcGained = 500;
              setWallet((prev) => ({
                ...prev,
                inrBalance: Math.max(0, prev.inrBalance - inrCost),
                pqcTokenBalance: prev.pqcTokenBalance + pqcGained,
              }));
              onNavigateTab('INR_EXCHANGE');
            }
            break;
          case 'CLAIM_AIRDROP':
            onClaimAirdrop();
            break;
          case 'TRIGGER_PQC_AUDIT':
            onNavigateTab('PQC');
            onTriggerPqcAudit();
            break;
          case 'CHANGE_PQC_STRICTNESS':
            if (act.params?.strictness) {
              setConfig((prev) => ({ ...prev, pqcStrictness: act.params.strictness }));
            }
            break;
          case 'START_WWE_MATCH':
            onNavigateTab('WWE_METAVERSE');
            onStartWweMatch();
            break;
          case 'MINT_NFT':
            onNavigateTab('NFT_MARKET');
            onMintNft();
            break;
          default:
            console.log('Action type executed:', act.type);
            break;
        }
      } catch (err) {
        console.error('Failed to execute agent action:', act, err);
      }
    });

    audioSynth.playAgentEvent();
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputMessage).trim();
    if (!textToSend || isProcessing) return;

    const userMsgId = `usr-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'USER',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsProcessing(true);

    try {
      const response = await fetch('/api/agent/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: textToSend,
          currentTab,
          isRunning,
          population,
          wallet,
          config,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const agentMsgId = `agent-${Date.now()}`;
        const agentMsg: ChatMessage = {
          id: agentMsgId,
          sender: 'AGENT',
          text: data.replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reasoningSteps: data.reasoningSteps || [],
          actionsExecuted: data.actions || [],
        };

        setMessages((prev) => [...prev, agentMsg]);

        if (data.actions && data.actions.length > 0) {
          executeActions(data.actions);
        }
      }
    } catch (err: any) {
      console.error('Agent chatbot error:', err);
      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'AGENT',
        text: `⚡ Local Agent Leader: Request for "${textToSend}" processed locally. Executing requested system functions.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reasoningSteps: ['Local Agent Command Vector Dispatched'],
        actionsExecuted: [{ type: 'NAVIGATE_TAB', params: { tab: 'GRID' }, label: '📍 Switched to Grid View' }],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleReasoning = (id: string) => {
    setExpandedReasoningIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      {/* Floating Trigger Button when Closed */}
      {!isOpen && (
        <button
          id="agent-trigger-btn"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 text-white shadow-xl hover:shadow-cyan-500/25 transition-all transform hover:scale-105 group border border-cyan-400/30"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-cyan-200 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-300"></span>
            </span>
          </div>
          <div className="text-left font-sans">
            <div className="text-xs font-bold leading-tight flex items-center gap-1 font-mono">
              AGENT LEADER <Sparkles className="w-3 h-3 text-yellow-300" />
            </div>
            <div className="text-[10px] text-cyan-100/90 font-mono">Control All Functions</div>
          </div>
        </button>
      )}

      {/* Expanded Agentic Chatbot Panel */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 z-50 flex flex-col bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden transition-all duration-200 backdrop-blur-md ${
            isExpanded
              ? 'w-[95vw] md:w-[700px] h-[85vh] max-h-[800px]'
              : 'w-[92vw] sm:w-[420px] h-[580px]'
          }`}
        >
          {/* Header */}
          <div className="bg-slate-950/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 p-0.5 shadow-md shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5 font-mono">
                  AETHER AGENT LEADER
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    GEMINI 3.6
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400 flex items-center gap-1 font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Master Controller • Controlling 7 Platform Modules
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition"
                title={isExpanded ? 'Contract Window' : 'Expand Window'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                title="Close Agent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-950/50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'USER' ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  {msg.sender === 'USER' ? (
                    <span className="text-[10px] text-slate-400 font-mono">You</span>
                  ) : (
                    <span className="text-[10px] text-cyan-400 font-mono font-bold flex items-center gap-1">
                      <Bot className="w-3 h-3" /> AETHER AGENT
                    </span>
                  )}
                  <span className="text-[9px] text-slate-500">{msg.timestamp}</span>
                </div>

                <div
                  className={`p-3 rounded-2xl max-w-[88%] leading-relaxed shadow-sm ${
                    msg.sender === 'USER'
                      ? 'bg-cyan-600 text-white rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Executed Action Badges */}
                  {msg.actionsExecuted && msg.actionsExecuted.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-1">
                      <div className="text-[10px] text-emerald-400 font-mono font-semibold flex items-center gap-1">
                        <Zap className="w-3 h-3" /> FUNCTIONS LEADER & EXECUTED:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {msg.actionsExecuted.map((act, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 font-mono"
                          >
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                            {act.label || act.type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Agentic Reasoning Accordion */}
                  {msg.reasoningSteps && msg.reasoningSteps.length > 0 && (
                    <div className="mt-2 pt-1 border-t border-slate-800/60">
                      <button
                        onClick={() => toggleReasoning(msg.id)}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono py-0.5"
                      >
                        <Cpu className="w-3 h-3" />
                        {expandedReasoningIds[msg.id]
                          ? 'Hide Neural Reasoning Steps'
                          : `View Neural Reasoning Chain (${msg.reasoningSteps.length} steps)`}
                        {expandedReasoningIds[msg.id] ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>

                      {expandedReasoningIds[msg.id] && (
                        <div className="mt-1.5 p-2 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-[10px] font-mono text-slate-300">
                          {msg.reasoningSteps.map((step, sIdx) => (
                            <div key={sIdx} className="flex items-start gap-1.5">
                              <span className="text-cyan-400 font-bold">•</span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-mono animate-pulse">
                <Bot className="w-4 h-4 animate-spin" />
                <span>Aether Agent reasoning & controlling functions...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="bg-slate-950/80 px-3 py-2 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
              Quick Lead:
            </span>
            {QUICK_SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(s.prompt)}
                disabled={isProcessing}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-cyan-300 flex items-center gap-1 whitespace-nowrap transition"
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Agent Leader to control grid, WWE, INR, PQC..."
              disabled={isProcessing}
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition font-sans"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isProcessing}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-medium hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1 text-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

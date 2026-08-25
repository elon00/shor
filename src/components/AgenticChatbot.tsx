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
  Globe,
  Coins,
  ArrowLeftRight,
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
  modelUsed?: string;
  timestamp: string;
  reasoningSteps?: string[];
  actionsExecuted?: AgentAction[];
}

export const AI_MODELS = [
  { id: 'gemini-3.7-flash', name: 'Gemini 3.7 Flash', tag: 'Fast & Agentic', color: 'text-cyan-400' },
  { id: 'gemini-3.5-pro', name: 'Gemini 3.5 Pro', tag: 'Deep Reasoning', color: 'text-purple-400' },
  { id: 'quantum-lattice-4', name: 'Quantum Neural 4.0', tag: 'On-Chain Lattice', color: 'text-emerald-400' },
  { id: 'claude-3.7-sonnet', name: 'Claude 3.7 Hybrid', tag: 'Multimodal', color: 'text-amber-400' },
  { id: 'gpt-4o-agentic', name: 'GPT-4o Swarm', tag: 'Autonomous', color: 'text-blue-400' },
  { id: 'deepseek-r1-crypto', name: 'DeepSeek R1 PQC', tag: 'Cryptanalysis', color: 'text-rose-400' },
];

interface AgenticChatbotProps {
  currentTab: string;
  onNavigateTab: (tab: any) => void;
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
  onOpenBridge?: () => void;
}

const QUICK_SUGGESTIONS = [
  {
    icon: '⚡',
    label: 'Mint Unlimited $PQC Tokens',
    prompt: 'Unlimited 100,000 $PQC tokens mint kardo wallet me!',
  },
  {
    icon: '🌐',
    label: 'Switch to Sepolia Testnet',
    prompt: 'Sepolia Testnet network pe switch karo aur Testnet faucet trigger karo.',
  },
  {
    icon: '🚀',
    label: 'Launch Global Marketing Campaign',
    prompt: 'Global Marketing Hub pe jao aur viral Twitter/X thread generate karo!',
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
  onOpenBridge,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].id);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'AGENT',
      text: '🤖 Namaste! Main Aether Multi-Model Agent Leader hoon. Platform ke saare functions ko lead kar sakta hoon: Unlimited $PQC Minting, Testnet 6 Networks deployment, Global Marketing campaigns, Grid Automaton & WWE Arena!',
      modelUsed: 'Gemini 3.7 Flash',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reasoningSteps: [
        'Multi-Model Agentic Controller Initialized (Gemini 3.7 + DeepSeek + Quantum Neural)',
        'Unlimited $PQC Infinite Supply Mint Gateway Connected',
        'Testnet Multichain Bridge & Global Marketing Engine Ready',
      ],
      actionsExecuted: [
        { type: 'SYSTEM_READY', label: '✅ Multi-Model Agent Online & Ready to Control Functions' },
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

  const executeActions = (actions: AgentAction[]) => {
    actions.forEach((act) => {
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
          if (act.params?.preset) onLoadPreset(act.params.preset);
          break;
        case 'NAVIGATE_TAB':
          if (act.params?.tab) onNavigateTab(act.params.tab);
          break;
        case 'MINT_UNLIMITED_TOKENS':
        case 'TOPUP_INR':
          const addedPqc = act.params?.amountPqc || 100000;
          const addedInr = act.params?.amount || 50000;
          setWallet((prev) => ({
            ...prev,
            pqcTokenBalance: prev.pqcTokenBalance + addedPqc,
            inrBalance: prev.inrBalance + addedInr,
          }));
          break;
        case 'SWITCH_CHAIN':
          if (act.params?.chainId) {
            setWallet((p) => ({ ...p, chainId: act.params.chainId }));
          }
          break;
        case 'OPEN_BRIDGE':
          if (onOpenBridge) onOpenBridge();
          break;
        case 'TRIGGER_PQC_AUDIT':
          onTriggerPqcAudit();
          break;
        case 'START_WWE_MATCH':
          onStartWweMatch();
          break;
        case 'MINT_NFT':
          onMintNft();
          break;
      }
    });
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'USER',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputMessage('');
    setIsProcessing(true);
    audioSynth.playKeyExchange();

    try {
      const activeModelObj = AI_MODELS.find((m) => m.id === selectedModel) || AI_MODELS[0];
      const res = await fetch('/api/agent/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: textToSend,
          model: selectedModel,
          currentTab,
          isRunning,
          population,
          wallet,
          config,
        }),
      });

      const data = await res.json();
      const actions = data.actions || [];

      const lower = textToSend.toLowerCase();
      if (lower.includes('unlimited') || lower.includes('infinite') || lower.includes('100000') || lower.includes('faucet')) {
        actions.push({
          type: 'MINT_UNLIMITED_TOKENS',
          params: { amountPqc: 100000, amount: 50000 },
          label: '⚡ Infinite Supply Mint: +100,000 $PQC & ₹50,000 INR',
        });
      }
      if (lower.includes('bridge') || lower.includes('cross chain')) {
        actions.push({ type: 'OPEN_BRIDGE', label: '🌉 Open Multichain Bridge' });
      }
      if (lower.includes('market') || lower.includes('marketing') || lower.includes('viral')) {
        actions.push({ type: 'NAVIGATE_TAB', params: { tab: 'MARKETING' }, label: '🚀 Switch to Global Marketing Hub' });
      }

      executeActions(actions);

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'AGENT',
        text: data.replyText || 'Command executed across Web 4.0 Multichain submodules.',
        modelUsed: activeModelObj.name,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reasoningSteps: data.reasoningSteps || [
          `Processed via ${activeModelObj.name}`,
          'Dispatched Web 4.0 Multichain control vector',
        ],
        actionsExecuted: actions,
      };

      setMessages((prev) => [...prev, agentMsg]);
      audioSynth.playQuantumVerification();
    } catch (err) {
      const fallbackActions: AgentAction[] = [];
      const lower = textToSend.toLowerCase();
      if (lower.includes('unlimited') || lower.includes('mint') || lower.includes('token')) {
        fallbackActions.push({
          type: 'MINT_UNLIMITED_TOKENS',
          params: { amountPqc: 100000, amount: 50000 },
          label: '⚡ Infinite Mint: +100,000 $PQC Added to Wallet',
        });
      }
      if (lower.includes('play') || lower.includes('start')) {
        fallbackActions.push({ type: 'START_SIMULATION', label: '▶ Start Conway Automaton' });
      }
      executeActions(fallbackActions);

      setMessages((prev) => [
        ...prev,
        {
          id: `agent-${Date.now()}`,
          sender: 'AGENT',
          text: `Aether Leader: Command executed for "${textToSend}".`,
          modelUsed: 'Local Fallback Core',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionsExecuted: fallbackActions,
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleReasoning = (msgId: string) => {
    setExpandedReasoningIds((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  const activeModel = AI_MODELS.find((m) => m.id === selectedModel) || AI_MODELS[0];

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white p-3.5 rounded-full shadow-2xl shadow-cyan-900/50 flex items-center gap-2.5 transition transform hover:scale-105 border border-cyan-400/40 group"
        >
          <div className="relative">
            <Bot className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="font-sans font-bold text-xs tracking-wide pr-1 flex items-center gap-1.5">
            <span>Multi-Model AI Leader</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-cyan-300 font-mono">
              {activeModel.name.split(' ')[0]}
            </span>
          </span>
        </button>
      )}

      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 bg-slate-900/95 border border-slate-700/80 shadow-2xl rounded-2xl flex flex-col backdrop-blur-xl ${
            isExpanded
              ? 'inset-4 lg:inset-10'
              : 'bottom-5 right-5 w-[92vw] sm:w-[460px] h-[600px] max-h-[85vh]'
          }`}
        >
          <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xs text-white">Aether Multi-Model Agent</h3>
                  <div className="relative">
                    <button
                      onClick={() => setShowModelPicker(!showModelPicker)}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-mono flex items-center gap-1"
                    >
                      <span>{activeModel.name}</span>
                      <ChevronDown className="w-2.5 h-2.5" />
                    </button>

                    {showModelPicker && (
                      <div className="absolute left-0 mt-1 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50">
                        <div className="text-[9px] text-slate-400 px-2 py-1 uppercase tracking-wider font-mono">
                          Select AI Engine
                        </div>
                        {AI_MODELS.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => {
                              setSelectedModel(m.id);
                              setShowModelPicker(false);
                            }}
                            className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between text-xs transition ${
                              selectedModel === m.id
                                ? 'bg-cyan-950 text-cyan-300 font-bold'
                                : 'text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            <div>
                              <div>{m.name}</div>
                              <div className="text-[9px] text-slate-400">{m.tag}</div>
                            </div>
                            {selectedModel === m.id && <CheckCircle2 className="w-3 h-3 text-cyan-400" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Autonomous Multi-Chain Controller • Infinite Supply Engine
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="px-3 py-2 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
            {QUICK_SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(s.prompt)}
                className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 transition whitespace-nowrap flex items-center gap-1 flex-shrink-0"
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 font-sans text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3 shadow-md ${
                    msg.sender === 'USER'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.sender === 'AGENT' && msg.modelUsed && (
                    <div className="text-[10px] font-mono text-cyan-400 mb-1 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>{msg.modelUsed}</span>
                    </div>
                  )}

                  <div className="leading-relaxed whitespace-pre-wrap">{msg.text}</div>

                  {msg.reasoningSteps && msg.reasoningSteps.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 font-mono">
                      <button
                        onClick={() => toggleReasoning(msg.id)}
                        className="text-[10px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition"
                      >
                        <Zap className="w-2.5 h-2.5 text-amber-400" />
                        <span>AI Reasoning Chain ({msg.reasoningSteps.length} steps)</span>
                        {expandedReasoningIds[msg.id] ? (
                          <ChevronUp className="w-2.5 h-2.5" />
                        ) : (
                          <ChevronDown className="w-2.5 h-2.5" />
                        )}
                      </button>

                      {expandedReasoningIds[msg.id] && (
                        <div className="mt-1.5 space-y-1 pl-2 border-l border-cyan-800/60 text-[10px] text-slate-400">
                          {msg.reasoningSteps.map((step, i) => (
                            <div key={i}>• {step}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {msg.actionsExecuted && msg.actionsExecuted.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {msg.actionsExecuted.map((act, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-[10px] font-mono flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                          {act.label || act.type}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <span className="text-[9px] text-slate-500 font-mono mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isProcessing && (
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono p-2 bg-slate-950 rounded-xl border border-slate-800 max-w-[200px]">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>AI is reasoning...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-3 bg-slate-950 border-t border-slate-800 rounded-b-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Give command in Hindi/English (e.g. mint unlimited tokens)..."
                className="flex-1 bg-slate-900 border border-slate-700 text-xs text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-cyan-500 font-sans"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isProcessing}
                className="p-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl disabled:opacity-40 transition shadow-md shadow-cyan-900/30"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

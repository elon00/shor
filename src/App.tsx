import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CellData, GridConfig, PqcProof, AgentLog, Web3WalletState } from './types';
import { calculateStateHash, generatePqcKeypair, createPqcProof, AGENT_PERSONAS } from './lib/pqc';
import { SUPPORTED_CHAINS, getChainConfig } from './lib/multichain';
import { audioSynth } from './lib/audioSynth';
import { GridAutomaton } from './components/GridAutomaton';
import { ControlBar } from './components/ControlBar';
import { AgentInspector } from './components/AgentInspector';
import { PqcHub } from './components/PqcHub';
import { AiTerminal } from './components/AiTerminal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { Web3WalletBar } from './components/Web3WalletBar';
import { MultichainBridgeModal } from './components/MultichainBridgeModal';
import { NftMarketplace } from './components/NftMarketplace';
import { InrExchangeHub } from './components/InrExchangeHub';
import { WweMetaverseArena } from './components/WweMetaverseArena';
import { AgenticChatbot } from './components/AgenticChatbot';
import { MarketingStrategyHub } from './components/MarketingStrategyHub';
import {
  Cpu,
  ShieldCheck,
  Terminal as TerminalIcon,
  BarChart3,
  Sparkles,
  Layers,
  ShoppingBag,
  IndianRupee,
  Swords,
  Bot,
  Globe,
  ArrowLeftRight,
  TrendingUp,
  Megaphone,
} from 'lucide-react';

const GRID_WIDTH = 36;
const GRID_HEIGHT = 22;

export default function App() {
  const [config, setConfig] = useState<GridConfig>({
    width: GRID_WIDTH,
    height: GRID_HEIGHT,
    speedMs: 150,
    mutationRate: 0.02,
    aiFrequency: 3,
    pqcStrictness: 'Strict',
    enableAudio: true,
  });

  const [grid, setGrid] = useState<CellData[][]>(() => createEmptyGrid(GRID_WIDTH, GRID_HEIGHT));
  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [selectedCell, setSelectedCell] = useState<CellData | null>(null);
  const [hoveredCell, setHoveredCell] = useState<CellData | null>(null);
  const [activeTab, setActiveTab] = useState<'GRID' | 'NFT_MARKET' | 'INR_EXCHANGE' | 'WWE_METAVERSE' | 'MARKETING' | 'PQC' | 'TERMINAL' | 'ANALYTICS'>('GRID');
  const [isBridgeOpen, setIsBridgeOpen] = useState(false);

  const defaultChain = SUPPORTED_CHAINS[0];
  const [wallet, setWallet] = useState<Web3WalletState>({
    isConnected: true,
    address: '0x71C8...3F92',
    network: defaultChain.name,
    chainId: defaultChain.id,
    ethBalance: 5.842,
    nativeBalance: 5.842,
    pqcTokenBalance: 125000,
    inrBalance: 85400,
    pqcErc20Contract: defaultChain.pqcErc20Contract,
    pqcNftErc721Contract: defaultChain.pqcNftErc721Contract,
    bridgeContract: defaultChain.bridgeContract,
    isMetaMaskDetected: true,
  });

  const [pqcProofs, setPqcProofs] = useState<PqcProof[]>([]);
  const [terminalMessages, setTerminalMessages] = useState<any[]>([
    {
      id: 'init-1',
      sender: 'SYSTEM',
      text: '🌐 Web 4.0 Quantum Multichain Automaton & Marketing Engine Initialized.\nML-KEM-768 lattice encryption active across 9 EVM chains. Unlimited $PQC liquidity active.',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    audioSynth.setMuted(!config.enableAudio);
  }, [config.enableAudio]);

  const addTerminalMessage = useCallback((text: string, sender: 'SYSTEM' | 'AI_MASTER' | 'PQC_NODE' | 'USER' = 'SYSTEM') => {
    setTerminalMessages((prev) => [
      {
        id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        sender,
        text,
        timestamp: new Date().toLocaleTimeString(),
      },
      ...prev.slice(0, 50),
    ]);
  }, []);

  function createEmptyGrid(w: number, h: number): CellData[][] {
    const rows: CellData[][] = [];
    for (let r = 0; r < h; r++) {
      const row: CellData[] = [];
      for (let c = 0; c < w; c++) {
        row.push({
          id: `cell-${c}-${r}`,
          x: c,
          y: r,
          state: 'dead',
          generation: 0,
          energy: 100,
          hash: calculateStateHash(c, r, 'dead', 0),
          pqcKey: generatePqcKeypair('ML-KEM-768'),
        });
      }
      rows.push(row);
    }
    return rows;
  }

  const countLiveNeighbors = (g: CellData[][], r: number, c: number) => {
    let count = 0;
    const dirs = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1],
    ];
    for (const [dr, dc] of dirs) {
      const nr = (r + dr + GRID_HEIGHT) % GRID_HEIGHT;
      const nc = (c + dc + GRID_WIDTH) % GRID_WIDTH;
      if (g[nr]?.[nc]?.state !== 'dead') {
        count++;
      }
    }
    return count;
  };

  const runEvolutionStep = useCallback(() => {
    let aliveCount = 0;
    let aiNodesCount = 0;

    setGrid((prevGrid) => {
      const nextGrid: CellData[][] = [];

      for (let r = 0; r < GRID_HEIGHT; r++) {
        const nextRow: CellData[] = [];
        for (let c = 0; c < GRID_WIDTH; c++) {
          const currentCell = prevGrid[r][c];
          const neighbors = countLiveNeighbors(prevGrid, r, c);
          let nextState = currentCell.state;
          let nextGen = currentCell.generation;
          let nextEnergy = currentCell.energy;
          let aiAgent = currentCell.aiAgent;

          if (currentCell.state !== 'dead') {
            if (neighbors < 2 || neighbors > 3) {
              nextState = 'dead';
              aiAgent = undefined;
            } else {
              nextGen += 1;
              nextEnergy = Math.max(10, currentCell.energy - 1);
              aliveCount++;
              if (currentCell.state === 'ai_agent') aiNodesCount++;
            }
          } else {
            if (neighbors === 3) {
              const rand = Math.random();
              if (rand < 0.12) {
                nextState = 'ai_agent';
                const persona = AGENT_PERSONAS[Math.floor(Math.random() * AGENT_PERSONAS.length)];
                aiAgent = {
                  id: `agent-${c}-${r}`,
                  persona: persona.persona,
                  status: 'Web 4.0 Autonomous Node',
                  directive: persona.directive,
                  memory: [`Evolved at Gen ${generation + 1}`],
                  autonomyLevel: 6,
                  generation: 1,
                  energy: 85,
                  decisionsCount: 1,
                };
                aiNodesCount++;
              } else if (rand < 0.22) {
                nextState = 'quantum_locked';
              } else {
                nextState = 'alive';
              }
              nextGen = 1;
              aliveCount++;
            }
          }

          nextRow.push({
            ...currentCell,
            state: nextState,
            generation: nextGen,
            energy: nextEnergy,
            hash: calculateStateHash(c, r, nextState, nextGen),
            aiAgent,
          });
        }
        nextGrid.push(nextRow);
      }
      return nextGrid;
    });

    setGeneration((prev) => prev + 1);
    audioSynth.playTick();

    if (Math.random() < 0.4) {
      const newProof = createPqcProof(`CELL-NODE-${Math.floor(Math.random() * 100)}`, 'ML-KEM-768', 'Multichain State Sync');
      setPqcProofs((prev) => [newProof, ...prev.slice(0, 25)]);
      audioSynth.playQuantumVerification();
    }

    setHistory((prev) => [
      ...prev.slice(-30),
      {
        gen: generation + 1,
        population: aliveCount,
        aiAgents: aiNodesCount,
        entropy: Math.min(100, Math.round((aliveCount / (GRID_WIDTH * GRID_HEIGHT)) * 100 * 1.8)),
      },
    ]);
  }, [generation]);

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(runEvolutionStep, config.speedMs);
    }
    return () => clearInterval(interval);
  }, [isRunning, config.speedMs, runEvolutionStep]);

  const handleLoadPreset = (preset: string) => {
    const newGrid = createEmptyGrid(GRID_WIDTH, GRID_HEIGHT);
    const midR = Math.floor(GRID_HEIGHT / 2);
    const midC = Math.floor(GRID_WIDTH / 2);

    if (preset === 'GLIDER_SWARM') {
      const gliders = [[0, 1], [1, 2], [2, 0], [2, 1], [2, 2]];
      gliders.forEach(([dr, dc]) => {
        if (newGrid[midR + dr]?.[midC + dc]) {
          newGrid[midR + dr][midC + dc].state = 'alive';
        }
      });
    } else if (preset === 'WEB4_AI_SWARM' || preset === 'AI_MESH') {
      for (let i = 0; i < 6; i++) {
        const r = Math.floor(Math.random() * GRID_HEIGHT);
        const c = Math.floor(Math.random() * GRID_WIDTH);
        newGrid[r][c].state = 'ai_agent';
        newGrid[r][c].aiAgent = {
          id: `agent-${c}-${r}`,
          persona: AGENT_PERSONAS[i % AGENT_PERSONAS.length].persona,
          status: 'Active Web 4.0 Neural Agent',
          directive: 'Orchestrate post-quantum lattice consensus',
          memory: ['Preset Genesis Node'],
          autonomyLevel: 8,
          generation: 1,
          energy: 95,
          decisionsCount: 0,
        };
      }
    } else {
      for (let r = 0; r < GRID_HEIGHT; r++) {
        for (let c = 0; c < GRID_WIDTH; c++) {
          if (Math.random() < 0.25) {
            newGrid[r][c].state = Math.random() < 0.1 ? 'ai_agent' : 'alive';
          }
        }
      }
    }

    setGrid(newGrid);
    setGeneration(0);
    addTerminalMessage(`Loaded preset ${preset} on ${wallet.network}`);
  };

  const handleCellClick = (cell: CellData) => {
    setSelectedCell(cell);
    audioSynth.playKeyExchange();
  };

  const handleClearGrid = () => {
    setGrid(createEmptyGrid(GRID_WIDTH, GRID_HEIGHT));
    setGeneration(0);
    setSelectedCell(null);
  };

  const handleRandomizeGrid = () => {
    handleLoadPreset('RANDOM');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      <Web3WalletBar
        wallet={wallet}
        setWallet={setWallet}
        onClaimAirdrop={() => addTerminalMessage('Claimed Unlimited +10,000 $PQC & ₹10,000 INR Airdrop!')}
        onOpenBridge={() => setIsBridgeOpen(true)}
        onAddTerminalMessage={addTerminalMessage}
      />

      <header className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md px-4 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-[41px] z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
            <Cpu className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-wide">
                Nameless <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">Web 4.0</span>
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                Testnet & Multichain PQC
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Conway AI Automaton • Multi-Model AI • Testnet 6 Chains • Infinite Supply Tokenomics
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800/80 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('GRID')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'GRID'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Grid Automaton
          </button>

          <button
            onClick={() => setActiveTab('MARKETING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'MARKETING'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            Growth & Marketing
          </button>

          <button
            onClick={() => setActiveTab('NFT_MARKET')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'NFT_MARKET'
                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            NFT Marketplace
          </button>

          <button
            onClick={() => setActiveTab('INR_EXCHANGE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'INR_EXCHANGE'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <IndianRupee className="w-3.5 h-3.5" />
            INR / UPI Exchange
          </button>

          <button
            onClick={() => setActiveTab('WWE_METAVERSE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'WWE_METAVERSE'
                ? 'bg-gradient-to-r from-amber-600 to-red-600 text-white shadow-md shadow-amber-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            WWE Fight Arena
          </button>

          <button
            onClick={() => setActiveTab('PQC')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'PQC'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            PQC Hub
          </button>

          <button
            onClick={() => setActiveTab('TERMINAL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'TERMINAL'
                ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <TerminalIcon className="w-3.5 h-3.5" />
            Terminal
          </button>

          <button
            onClick={() => setActiveTab('ANALYTICS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'ANALYTICS'
                ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Analytics
          </button>
        </nav>
      </header>

      <main className="flex-1 p-4 max-w-7xl mx-auto w-full space-y-4">
        {activeTab === 'GRID' && (
          <div className="space-y-4">
            <ControlBar
              isRunning={isRunning}
              setIsRunning={setIsRunning}
              onStep={runEvolutionStep}
              onClear={handleClearGrid}
              onRandomize={handleRandomizeGrid}
              onLoadPreset={handleLoadPreset}
              config={config}
              setConfig={setConfig}
              generation={generation}
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
              <div className="lg:col-span-3">
                <GridAutomaton
                  grid={grid}
                  setGrid={setGrid}
                  selectedCell={selectedCell}
                  onSelectCell={handleCellClick}
                  hoveredCell={hoveredCell}
                  setHoveredCell={setHoveredCell}
                />
              </div>

              <div className="lg:col-span-1">
                <AgentInspector
                  selectedCell={selectedCell}
                  generation={generation}
                  pqcStrictness={config.pqcStrictness}
                  onAddTerminalMessage={addTerminalMessage}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'MARKETING' && (
          <MarketingStrategyHub
            wallet={wallet}
            setWallet={setWallet}
            onAddTerminalMessage={addTerminalMessage}
          />
        )}

        {activeTab === 'NFT_MARKET' && (
          <NftMarketplace
            wallet={wallet}
            setWallet={setWallet}
            selectedCell={selectedCell}
            onAddTerminalMessage={addTerminalMessage}
          />
        )}

        {activeTab === 'INR_EXCHANGE' && (
          <InrExchangeHub
            wallet={wallet}
            setWallet={setWallet}
            onAddTerminalMessage={addTerminalMessage}
          />
        )}

        {activeTab === 'WWE_METAVERSE' && (
          <WweMetaverseArena
            wallet={wallet}
            setWallet={setWallet}
            onAddTerminalMessage={addTerminalMessage}
          />
        )}

        {activeTab === 'PQC' && (
          <PqcHub
            pqcProofs={pqcProofs}
            config={config}
            setConfig={setConfig}
            onAddTerminalMessage={addTerminalMessage}
          />
        )}

        {activeTab === 'TERMINAL' && (
          <AiTerminal
            messages={terminalMessages}
            onSendMessage={(msg) => addTerminalMessage(msg, 'USER')}
            onDirectiveExecute={(d) => addTerminalMessage(`Master Directive Dispatched: ${d}`, 'AI_MASTER')}
          />
        )}

        {activeTab === 'ANALYTICS' && (
          <AnalyticsDashboard history={history} />
        )}
      </main>

      <AgenticChatbot
        currentTab={activeTab}
        onNavigateTab={setActiveTab}
        isRunning={isRunning}
        onTogglePlay={() => setIsRunning(!isRunning)}
        onStep={runEvolutionStep}
        onClearGrid={handleClearGrid}
        onRandomizeGrid={handleRandomizeGrid}
        onLoadPreset={handleLoadPreset}
        config={config}
        setConfig={setConfig}
        wallet={wallet}
        setWallet={setWallet}
        population={grid.flat().filter((c) => c.state !== 'dead').length}
        onClaimAirdrop={() => addTerminalMessage('Claimed Unlimited +10,000 $PQC Faucet!')}
        onTriggerPqcAudit={() => addTerminalMessage('Triggered PQC Quantum Security Audit')}
        onStartWweMatch={() => addTerminalMessage('Started WWE Metaverse AI Fight Match')}
        onMintNft={() => addTerminalMessage('Minted Web 4.0 Quantum NFT')}
        onOpenBridge={() => setIsBridgeOpen(true)}
      />

      <MultichainBridgeModal
        wallet={wallet}
        setWallet={setWallet}
        isOpen={isBridgeOpen}
        onClose={() => setIsBridgeOpen(false)}
        onAddTerminalMessage={addTerminalMessage}
      />
    </div>
  );
}

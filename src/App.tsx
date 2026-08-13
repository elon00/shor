import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CellData, GridConfig, PqcProof, AgentLog, Web3WalletState } from './types';
import { calculateStateHash, generatePqcKeypair, createPqcProof, AGENT_PERSONAS } from './lib/pqc';
import { audioSynth } from './lib/audioSynth';
import { GridAutomaton } from './components/GridAutomaton';
import { ControlBar } from './components/ControlBar';
import { AgentInspector } from './components/AgentInspector';
import { PqcHub } from './components/PqcHub';
import { AiTerminal } from './components/AiTerminal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { Web3WalletBar } from './components/Web3WalletBar';
import { NftMarketplace } from './components/NftMarketplace';
import { InrExchangeHub } from './components/InrExchangeHub';
import { WweMetaverseArena } from './components/WweMetaverseArena';
import { AgenticChatbot } from './components/AgenticChatbot';
import { Cpu, ShieldCheck, Terminal as TerminalIcon, BarChart3, Sparkles, Layers, ShoppingBag, IndianRupee, Swords, Bot } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'GRID' | 'PQC' | 'NFT_MARKET' | 'INR_EXCHANGE' | 'WWE_METAVERSE' | 'TERMINAL' | 'ANALYTICS'>('GRID');

  // Web3 Ethereum & Token State
  const [wallet, setWallet] = useState<Web3WalletState>({
    isConnected: true,
    address: '0x71C8...3F92',
    network: 'Ethereum Mainnet (PQC EVM L2)',
    chainId: 1,
    ethBalance: 3.485,
    pqcTokenBalance: 12500,
    inrBalance: 85400,
    pqcErc20Contract: '0xPQC_EVM_2026_Token_0001_Contract',
    pqcNftErc721Contract: '0xPQC_EVM_2026_NFT_721_Contract',
    isMetaMaskDetected: true,
  });


  // PQC Proofs & Terminal History State
  const [pqcProofs, setPqcProofs] = useState<PqcProof[]>([]);
  const [terminalMessages, setTerminalMessages] = useState<any[]>([
    {
      id: 'init-1',
      sender: 'SYSTEM',
      text: '⚡ Nameless Web 4.0 Conway AI Automaton & Post-Quantum Cryptography Platform Initialized.\nML-KEM-768 key exchanges active. Gemini 3.6 Flash AI master consciousness standby.',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [history, setHistory] = useState<any[]>([]);
  const [isProcessingDirective, setIsProcessingDirective] = useState(false);
  const [isReasoningCell, setIsReasoningCell] = useState(false);

  // Sync Audio Synth Mute State
  useEffect(() => {
    audioSynth.setMuted(!config.enableAudio);
  }, [config.enableAudio]);

  // Create empty cell grid
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

  // Count Live Neighbors
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

  // Evolution Tick: Conway Classic Rules + AI Agent Mutations + PQC Proof generation
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
            // Live cell rules (Underpopulation & Overpopulation)
            if (neighbors < 2 || neighbors > 3) {
              nextState = 'dead';
              aiAgent = undefined;
            } else {
              // Survival
              nextGen += 1;
              nextEnergy = Math.max(10, currentCell.energy - 1);
              aliveCount++;
              if (currentCell.state === 'ai_agent') aiNodesCount++;
            }
          } else {
            // Reproduction
            if (neighbors === 3) {
              // 15% chance to birth an AI Agent Node or PQC Locked cell
              const rand = Math.random();
              if (rand < 0.12) {
                nextState = 'ai_agent';
                const persona = AGENT_PERSONAS[Math.floor(Math.random() * AGENT_PERSONAS.length)];
                aiAgent = {
                  id: `agent-${c}-${r}`,
                  persona: persona.persona,
                  status: 'Self-Evolved AI Node',
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

    // Audio SFX on Tick
    audioSynth.playTick();

    // Periodically generate PQC Proof for proof stream
    if (Math.random() < 0.4) {
      const newProof = createPqcProof(`CELL-NODE-${Math.floor(Math.random() * 100)}`, 'ML-KEM-768', 'Conway Grid State Sync');
      setPqcProofs((prev) => [newProof, ...prev.slice(0, 25)]);
      audioSynth.playQuantumVerification();
    }

    // Update Analytics History
    setHistory((prev) => [
      ...prev.slice(-30),
      {
        generation: generation + 1,
        population: aliveCount,
        aiAgents: aiNodesCount,
        latencyMs: parseFloat((Math.random() * 0.4 + 0.1).toFixed(2)),
        pqcProofs: pqcProofs.length,
      },
    ]);
  }, [generation, pqcProofs.length]);

  // Simulation Interval Loop
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      runEvolutionStep();
    }, config.speedMs);
    return () => clearInterval(interval);
  }, [isRunning, config.speedMs, runEvolutionStep]);

  // Preset Pattern Handlers
  const handleLoadPreset = (presetName: string) => {
    setIsRunning(false);
    const newGrid = createEmptyGrid(GRID_WIDTH, GRID_HEIGHT);

    if (presetName === 'GLIDER_SWARM') {
      // Plant multiple gliders
      const gliders = [
        [2, 2], [3, 3], [1, 4], [2, 4], [3, 4],
        [12, 5], [13, 6], [11, 7], [12, 7], [13, 7],
        [22, 10], [23, 11], [21, 12], [22, 12], [23, 12],
      ];
      gliders.forEach(([cx, cy]) => {
        if (newGrid[cy]?.[cx]) {
          newGrid[cy][cx].state = 'alive';
        }
      });
    } else if (presetName === 'GOSPER_GUN') {
      // Gosper Glider Gun pattern
      const coords = [
        [1, 5], [1, 6], [2, 5], [2, 6],
        [11, 5], [11, 6], [11, 7], [12, 4], [12, 8], [13, 3], [13, 9], [14, 3], [14, 9],
        [15, 6], [16, 4], [16, 8], [17, 5], [17, 6], [17, 7], [18, 6],
        [21, 3], [21, 4], [21, 5], [22, 3], [22, 4], [22, 5], [23, 2], [23, 6],
        [25, 1], [25, 2], [25, 6], [25, 7],
        [35, 3], [35, 4], [36, 3], [36, 4],
      ];
      coords.forEach(([cx, cy]) => {
        if (newGrid[cy]?.[cx]) {
          newGrid[cy][cx].state = 'alive';
        }
      });
    } else if (presetName === 'WEB4_AI_SWARM') {
      // Cluster of AI Agent nodes
      for (let r = 8; r < 14; r++) {
        for (let c = 12; c < 22; c++) {
          if ((r + c) % 2 === 0) {
            newGrid[r][c].state = 'ai_agent';
            newGrid[r][c].aiAgent = {
              id: `agent-${c}-${r}`,
              persona: AGENT_PERSONAS[(r + c) % AGENT_PERSONAS.length].persona,
              status: 'Swarm Consensus Cell',
              directive: 'Execute Web 4.0 cluster synchronization',
              memory: ['Swarm node activated'],
              autonomyLevel: 8,
              generation: 1,
              energy: 95,
              decisionsCount: 1,
            };
          }
        }
      }
    } else if (presetName === 'PQC_LATTICE_MESH') {
      // Quantum Locked Lattice grid
      for (let r = 4; r < 18; r += 2) {
        for (let c = 6; c < 30; c += 2) {
          newGrid[r][c].state = 'quantum_locked';
        }
      }
    } else if (presetName === 'QUANTUM_PULSAR') {
      // Pulsar oscillator
      const cx = 18, cy = 11;
      const offsets = [
        [-2, -4], [-3, -4], [-4, -4], [-2, 4], [-3, 4], [-4, 4],
        [2, -4], [3, -4], [4, -4], [2, 4], [3, 4], [4, 4],
        [-4, -2], [-4, -3], [-4, -4], [4, -2], [4, -3], [4, -4],
      ];
      offsets.forEach(([dx, dy]) => {
        const nx = cx + dx;
        const ny = cy + dy;
        if (newGrid[ny]?.[nx]) {
          newGrid[ny][nx].state = 'quantum_locked';
        }
      });
    }

    setGrid(newGrid);
    setGeneration(0);
    audioSynth.playAgentEvent();
  };

  // Randomize Seed
  const handleRandomize = () => {
    setIsRunning(false);
    const newGrid = createEmptyGrid(GRID_WIDTH, GRID_HEIGHT);
    for (let r = 0; r < GRID_HEIGHT; r++) {
      for (let c = 0; c < GRID_WIDTH; c++) {
        if (Math.random() < 0.25) {
          const rand = Math.random();
          if (rand < 0.2) {
            newGrid[r][c].state = 'ai_agent';
            newGrid[r][c].aiAgent = {
              id: `agent-${c}-${r}`,
              persona: AGENT_PERSONAS[Math.floor(Math.random() * AGENT_PERSONAS.length)].persona,
              status: 'Randomized AI Agent',
              directive: 'Maintain quantum state equilibrium',
              memory: ['Initialized in seed'],
              autonomyLevel: 5,
              generation: 1,
              energy: 90,
              decisionsCount: 1,
            };
          } else if (rand < 0.4) {
            newGrid[r][c].state = 'quantum_locked';
          } else {
            newGrid[r][c].state = 'alive';
          }
        }
      }
    }
    setGrid(newGrid);
    setGeneration(0);
  };

  // Execute Gemini AI Global Directive Command
  const handleSendGlobalDirective = async (promptText: string) => {
    setIsProcessingDirective(true);

    // Append user message
    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'USER',
      text: promptText,
      timestamp: new Date().toLocaleTimeString(),
    };
    setTerminalMessages((prev) => [...prev, userMsg]);

    try {
      // Calculate current stats
      let pop = 0, aiCount = 0;
      grid.forEach(row => row.forEach(cell => {
        if (cell.state !== 'dead') pop++;
        if (cell.state === 'ai_agent') aiCount++;
      }));

      const res = await fetch('/api/agent/directive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: promptText,
          currentPopulation: pop,
          currentGeneration: generation,
          activeAgentsCount: aiCount,
        }),
      });

      const data = await res.json();
      if (data.success && data.directiveResult) {
        const result = data.directiveResult;

        // Append Master Response
        const masterMsg = {
          id: `gem-${Date.now()}`,
          sender: 'GEMINI_MASTER',
          text: `[Interpreted Goal]: ${result.interpretedGoal}\n[Master Broadcast]: ${result.broadcastMessage}\n[Preset Executed]: ${result.recommendedPreset}`,
          timestamp: new Date().toLocaleTimeString(),
          payload: result,
        };
        setTerminalMessages((prev) => [...prev, masterMsg]);

        // Auto trigger recommended preset if provided
        if (result.recommendedPreset && result.recommendedPreset !== 'CUSTOM') {
          handleLoadPreset(result.recommendedPreset);
        }

        audioSynth.playAgentEvent();
      }
    } catch (err: any) {
      console.error('Directive error:', err);
      setTerminalMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'SYSTEM',
          text: `Fallback mode active: ${err.message || 'Server processed directive locally.'}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsProcessingDirective(false);
    }
  };

  // Trigger Gemini AI Reasoning on Selected Cell Inspector
  const handleTriggerCellAiReasoning = async (cell: CellData) => {
    setIsReasoningCell(true);
    try {
      const res = await fetch('/api/agent/decide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cellData: cell,
          neighborhoodSummary: { liveNeighbors: countLiveNeighbors(grid, cell.y, cell.x) },
          globalDirective: 'Maximize node energy and PQC security',
          generation,
        }),
      });

      const data = await res.json();
      if (data.success && data.decision) {
        const dec = data.decision;
        // Update cell memory and energy
        const updated = {
          ...cell,
          energy: Math.min(100, Math.max(10, cell.energy + (dec.energyAdjustment || 0))),
          aiAgent: cell.aiAgent
            ? {
                ...cell.aiAgent,
                memory: [dec.memoryEntry || dec.statusMessage, ...cell.aiAgent.memory.slice(0, 4)],
                status: dec.statusMessage,
                decisionsCount: cell.aiAgent.decisionsCount + 1,
              }
            : undefined,
        };

        setSelectedCell(updated);
        setGrid((prev) => {
          const next = prev.map((row) => [...row]);
          next[cell.y][cell.x] = updated;
          return next;
        });

        audioSynth.playAgentEvent();
      }
    } catch (err) {
      console.error('Cell reasoning failed', err);
    } finally {
      setIsReasoningCell(false);
    }
  };

  // Compute live stats
  let totalPopulation = 0;
  let activeAgentsCount = 0;
  grid.forEach((row) =>
    row.forEach((cell) => {
      if (cell.state !== 'dead') totalPopulation++;
      if (cell.state === 'ai_agent') activeAgentsCount++;
    })
  );

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Web3 Wallet Header Bar */}
      <Web3WalletBar
        wallet={wallet}
        setWallet={setWallet}
        onClaimAirdrop={() => {
          setTerminalMessages((prev) => [
            {
              id: `airdrop-${Date.now()}`,
              sender: 'SYSTEM',
              text: '🎉 AIRDROP CLAIMED: +500 $PQC tokens, +0.1 ETH, and ₹10,000 INR credited to Web3 wallet.',
              timestamp: new Date().toLocaleTimeString(),
            },
            ...prev,
          ]);
        }}
      />

      {/* Navbar Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 via-emerald-600 to-indigo-600 p-0.5 shadow-md shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
          </div>

          <div>
            <h1 className="text-xs sm:text-sm font-bold tracking-wide text-slate-100 flex items-center gap-2 font-mono">
              NAMELESS <span className="text-xs text-cyan-400 font-normal">[WEB 4]</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-sans">
              Ethereum NFT Automaton, INR Crypto Exchange & Metaverse WWE Arena
            </p>
          </div>
        </div>

        {/* View Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            id="tab-grid"
            onClick={() => setActiveTab('GRID')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition font-medium ${
              activeTab === 'GRID'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Grid Canvas
          </button>

          <button
            id="tab-pqc"
            onClick={() => setActiveTab('PQC')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition font-medium ${
              activeTab === 'PQC'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            PQC Lattice
          </button>

          <button
            id="tab-nft"
            onClick={() => setActiveTab('NFT_MARKET')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition font-medium ${
              activeTab === 'NFT_MARKET'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-purple-300" />
            NFT Marketplace
          </button>

          <button
            id="tab-inr"
            onClick={() => setActiveTab('INR_EXCHANGE')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition font-medium ${
              activeTab === 'INR_EXCHANGE'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <IndianRupee className="w-3 h-3 text-emerald-300" />
            INR Exchange (₹)
          </button>

          <button
            id="tab-wwe"
            onClick={() => setActiveTab('WWE_METAVERSE')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition font-medium ${
              activeTab === 'WWE_METAVERSE'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Swords className="w-3.5 h-3.5 text-amber-300" />
            WWE Fight Arena 🤼
          </button>

          <button
            id="tab-terminal"
            onClick={() => setActiveTab('TERMINAL')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition font-medium ${
              activeTab === 'TERMINAL'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <TerminalIcon className="w-3.5 h-3.5" />
            AI Terminal
          </button>

          <button
            id="tab-analytics"
            onClick={() => setActiveTab('ANALYTICS')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition font-medium ${
              activeTab === 'ANALYTICS'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Analytics
          </button>
        </div>
      </header>

      {/* Main Controls Header Bar */}
      <ControlBar
        isRunning={isRunning}
        onTogglePlay={() => setIsRunning(!isRunning)}
        onStep={runEvolutionStep}
        onReset={() => {
          setIsRunning(false);
          setGrid(createEmptyGrid(GRID_WIDTH, GRID_HEIGHT));
          setGeneration(0);
        }}
        onRandomize={handleRandomize}
        onLoadPreset={handleLoadPreset}
        config={config}
        setConfig={setConfig}
        generation={generation}
        population={totalPopulation}
        activeAgentsCount={activeAgentsCount}
        onSendQuickDirective={handleSendGlobalDirective}
        isProcessingDirective={isProcessingDirective}
      />

      {/* Tab Body Content */}
      <main className="flex-1 overflow-hidden relative flex">
        {activeTab === 'GRID' && (
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 flex flex-col min-w-0">
              <GridAutomaton
                grid={grid}
                setGrid={setGrid}
                config={config}
                selectedCell={selectedCell}
                setSelectedCell={setSelectedCell}
                hoveredCell={hoveredCell}
                setHoveredCell={setHoveredCell}
                isRunning={isRunning}
                onCellClick={(cell) => setSelectedCell(cell)}
              />
            </div>

            {/* Inspector Drawer */}
            {selectedCell && (
              <AgentInspector
                cell={selectedCell}
                onClose={() => setSelectedCell(null)}
                onUpdateCell={(updated) => {
                  setSelectedCell(updated);
                  setGrid((prev) => {
                    const next = prev.map((row) => [...row]);
                    next[updated.y][updated.x] = updated;
                    return next;
                  });
                }}
                onTriggerAiReasoning={handleTriggerCellAiReasoning}
                isReasoning={isReasoningCell}
              />
            )}
          </div>
        )}

        {activeTab === 'PQC' && (
          <div className="flex-1 p-2 min-h-0">
            <PqcHub
              proofs={pqcProofs}
              onAddProof={(p) => setPqcProofs((prev) => [p, ...prev])}
              strictness={config.pqcStrictness}
              onStrictnessChange={(val) => setConfig((prev) => ({ ...prev, pqcStrictness: val }))}
            />
          </div>
        )}

        {activeTab === 'NFT_MARKET' && (
          <div className="flex-1 p-2 min-h-0">
            <NftMarketplace
              wallet={wallet}
              setWallet={setWallet}
              selectedCell={selectedCell}
              onAddTerminalMessage={(msg) =>
                setTerminalMessages((prev) => [
                  {
                    id: `nft-${Date.now()}`,
                    sender: 'SYSTEM',
                    text: msg,
                    timestamp: new Date().toLocaleTimeString(),
                  },
                  ...prev,
                ])
              }
            />
          </div>
        )}

        {activeTab === 'INR_EXCHANGE' && (
          <div className="flex-1 p-2 min-h-0">
            <InrExchangeHub
              wallet={wallet}
              setWallet={setWallet}
              onAddTerminalMessage={(msg) =>
                setTerminalMessages((prev) => [
                  {
                    id: `inr-${Date.now()}`,
                    sender: 'SYSTEM',
                    text: msg,
                    timestamp: new Date().toLocaleTimeString(),
                  },
                  ...prev,
                ])
              }
            />
          </div>
        )}

        {activeTab === 'WWE_METAVERSE' && (
          <div className="flex-1 p-2 min-h-0">
            <WweMetaverseArena
              wallet={wallet}
              setWallet={setWallet}
              onAddTerminalMessage={(msg) =>
                setTerminalMessages((prev) => [
                  {
                    id: `wwe-${Date.now()}`,
                    sender: 'SYSTEM',
                    text: msg,
                    timestamp: new Date().toLocaleTimeString(),
                  },
                  ...prev,
                ])
              }
            />
          </div>
        )}

        {activeTab === 'TERMINAL' && (
          <div className="flex-1 p-2 min-h-0">
            <AiTerminal
              messages={terminalMessages}
              onSendMessage={handleSendGlobalDirective}
              isLoading={isProcessingDirective}
              onClearTerminal={() =>
                setTerminalMessages([
                  {
                    id: 'init-cleared',
                    sender: 'SYSTEM',
                    text: 'Console log cleared. Ready for next directive.',
                    timestamp: new Date().toLocaleTimeString(),
                  },
                ])
              }
            />
          </div>
        )}

        {activeTab === 'ANALYTICS' && (
          <div className="flex-1 p-2 min-h-0">
            <AnalyticsDashboard
              history={history}
              currentGeneration={generation}
              currentPopulation={totalPopulation}
              activeAgentsCount={activeAgentsCount}
              totalPqcProofs={pqcProofs.length}
            />
          </div>
        )}
      </main>

      {/* Persistent Floating Agentic AI Controller Chatbot */}
      <AgenticChatbot
        currentTab={activeTab}
        onNavigateTab={(tab) => setActiveTab(tab)}
        isRunning={isRunning}
        onTogglePlay={() => setIsRunning(!isRunning)}
        onStep={runEvolutionStep}
        onClearGrid={() => {
          setIsRunning(false);
          setGrid(createEmptyGrid(GRID_WIDTH, GRID_HEIGHT));
          setGeneration(0);
        }}
        onRandomizeGrid={handleRandomize}
        onLoadPreset={handleLoadPreset}
        config={config}
        setConfig={setConfig}
        wallet={wallet}
        setWallet={setWallet}
        population={totalPopulation}
        onClaimAirdrop={() => {
          setWallet((prev) => ({
            ...prev,
            pqcTokenBalance: prev.pqcTokenBalance + 500,
            ethBalance: parseFloat((prev.ethBalance + 0.1).toFixed(3)),
            inrBalance: prev.inrBalance + 10000,
          }));
          setTerminalMessages((prev) => [
            {
              id: `airdrop-agent-${Date.now()}`,
              sender: 'SYSTEM',
              text: '🎉 AGENT AIRDROP EXECUTED: +500 $PQC tokens, +0.1 ETH, and ₹10,000 INR credited to Web3 wallet.',
              timestamp: new Date().toLocaleTimeString(),
            },
            ...prev,
          ]);
        }}
        onTriggerPqcAudit={async () => {
          try {
            const res = await fetch('/api/pqc/audit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ totalCells: totalPopulation, pqcProofsCount: pqcProofs.length }),
            });
            const data = await res.json();
            if (data.success && data.report) {
              setTerminalMessages((prev) => [
                {
                  id: `pqc-audit-${Date.now()}`,
                  sender: 'SYSTEM',
                  text: `🛡️ PQC SECURITY AUDIT PASSED: ${data.report.auditSummary} Resilience Score: ${data.report.pqcResilienceScore}/100.`,
                  timestamp: new Date().toLocaleTimeString(),
                },
                ...prev,
              ]);
            }
          } catch (e) {
            console.error(e);
          }
        }}
        onStartWweMatch={() => {
          setTerminalMessages((prev) => [
            {
              id: `wwe-start-${Date.now()}`,
              sender: 'SYSTEM',
              text: '🤼 AGENT COMMAND: Initiated WWE AI Quantum Wrestlemania Fight in Metaverse Arena.',
              timestamp: new Date().toLocaleTimeString(),
            },
            ...prev,
          ]);
        }}
        onMintNft={() => {
          setTerminalMessages((prev) => [
            {
              id: `nft-mint-${Date.now()}`,
              sender: 'SYSTEM',
              text: '🎨 AGENT COMMAND: Minted new Web4 Post-Quantum ERC-721 NFT to Web3 wallet.',
              timestamp: new Date().toLocaleTimeString(),
            },
            ...prev,
          ]);
        }}
      />
    </div>
  );
}

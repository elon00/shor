import React, { useState, useEffect } from 'react';
import { WweFighter, WweMatchState, Web3WalletState } from '../types';
import { Swords, Trophy, Flame, Shield, Sparkles, Volume2, Play, RefreshCw, Zap, Award, Coins } from 'lucide-react';

interface WweMetaverseArenaProps {
  wallet: Web3WalletState;
  setWallet: React.Dispatch<React.SetStateAction<Web3WalletState>>;
  onAddTerminalMessage: (msg: string) => void;
}

const DEFAULT_SUPERSTARS: WweFighter[] = [
  {
    id: 'wwe-1',
    name: 'The Quantum Undertaker',
    ringTitle: 'The Deadman of FIPS-203 Lattice',
    avatarUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80',
    health: 100,
    maxHealth: 100,
    energy: 100,
    attackPower: 95,
    defensePower: 88,
    specialMove: {
      name: 'Lattice Tombstone Piledriver',
      damage: 42,
      pqcType: 'ML-KEM-768',
      description: 'Drives opponent into the quantum grid floor with FIPS 203 encryption impact.',
    },
    isAiAgent: true,
    wins: 28,
    losses: 1,
  },
  {
    id: 'wwe-2',
    name: 'Roman Reigns 4.0',
    ringTitle: 'The Tribal Chief of Web3 EVM',
    avatarUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80',
    health: 100,
    maxHealth: 100,
    energy: 100,
    attackPower: 98,
    defensePower: 90,
    specialMove: {
      name: 'Post-Quantum Spear ML-DSA',
      damage: 45,
      pqcType: 'ML-DSA-65',
      description: 'Shatters opposing defense with high-velocity ML-DSA signature momentum.',
    },
    isAiAgent: true,
    wins: 45,
    losses: 2,
  },
  {
    id: 'wwe-3',
    name: 'Cena-Bot ML-KEM',
    ringTitle: '16-Time Metaverse Champion',
    avatarUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=400&q=80',
    health: 100,
    maxHealth: 100,
    energy: 100,
    attackPower: 92,
    defensePower: 94,
    specialMove: {
      name: 'Attitude Adjustment FIPS-204',
      damage: 40,
      pqcType: 'ML-KEM-768',
      description: 'Lifts rival overhead and slams them through the quantum matrix.',
    },
    isAiAgent: true,
    wins: 38,
    losses: 6,
  },
  {
    id: 'wwe-4',
    name: 'Brock Lesnar Lattice',
    ringTitle: 'The Beast Incarnate',
    avatarUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80',
    health: 100,
    maxHealth: 100,
    energy: 100,
    attackPower: 100,
    defensePower: 82,
    specialMove: {
      name: 'Shor-Destroyer F-5 Lock',
      damage: 48,
      pqcType: 'Falcon-512',
      description: 'Spins rival in mid-air violating classical RSA encryption barriers.',
    },
    isAiAgent: true,
    wins: 32,
    losses: 4,
  },
  {
    id: 'wwe-5',
    name: 'The Rock AI',
    ringTitle: 'The Most Electrifying Node in Metaverse',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    health: 100,
    maxHealth: 100,
    energy: 100,
    attackPower: 94,
    defensePower: 86,
    specialMove: {
      name: 'Quantum People Elbow',
      damage: 44,
      pqcType: 'Kyber-1024',
      description: 'Electrifies the ring with a devastating quantum lattice elbow drop.',
    },
    isAiAgent: true,
    wins: 40,
    losses: 5,
  },
];

export const WweMetaverseArena: React.FC<WweMetaverseArenaProps> = ({
  wallet,
  setWallet,
  onAddTerminalMessage,
}) => {
  const [fighters, setFighters] = useState<WweFighter[]>(DEFAULT_SUPERSTARS);
  const [selectedFighter1, setSelectedFighter1] = useState<WweFighter>(DEFAULT_SUPERSTARS[0]);
  const [selectedFighter2, setSelectedFighter2] = useState<WweFighter>(DEFAULT_SUPERSTARS[1]);

  const [wagerAmount, setWagerAmount] = useState<number>(250);
  const [isAutoFightActive, setIsAutoFightActive] = useState(false);
  const [commentaryLoading, setCommentaryLoading] = useState(false);

  const [matchState, setMatchState] = useState<WweMatchState>({
    id: 'match-genesis',
    fighter1: { ...DEFAULT_SUPERSTARS[0] },
    fighter2: { ...DEFAULT_SUPERSTARS[1] },
    currentTurn: 1,
    status: 'IDLE',
    wagerAmountPqc: 250,
    round: 1,
    battleLog: [
      {
        round: 0,
        attacker: 'RINGSIDE ANNOUNCER',
        action: 'MATCH SETUP',
        damage: 0,
        commentary: 'Ladies and gentlemen! Welcome to the WWE Quantum AI Metaverse Championship Arena!',
        timestamp: new Date().toLocaleTimeString(),
      },
    ],
    ringVenue: 'Quantum Mania Ring',
  });

  // Start Fight
  const handleStartMatch = () => {
    if (wallet.pqcTokenBalance < wagerAmount) {
      alert(`Insufficient $PQC tokens for wager! Required: ${wagerAmount} $PQC`);
      return;
    }

    // Deduct wager
    setWallet((prev) => ({
      ...prev,
      pqcTokenBalance: prev.pqcTokenBalance - wagerAmount,
    }));

    const f1 = { ...selectedFighter1, health: 100, energy: 100 };
    const f2 = { ...selectedFighter2, health: 100, energy: 100 };

    setMatchState({
      id: `match-${Date.now()}`,
      fighter1: f1,
      fighter2: f2,
      currentTurn: 1,
      status: 'FIGHTING',
      wagerAmountPqc: wagerAmount,
      round: 1,
      battleLog: [
        {
          round: 1,
          attacker: 'REFEREE',
          action: 'BELL RING',
          damage: 0,
          commentary: `DING DING DING! The match is underway between ${f1.name} and ${f2.name}! ${wagerAmount} $PQC on the line!`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ],
      ringVenue: 'Quantum Mania Ring',
    });

    onAddTerminalMessage(
      `🤼 WWE METAVERSE MATCH STARTED: ${f1.name} vs ${f2.name} at Quantum Mania Ring! Wager: ${wagerAmount} $PQC.`
    );
  };

  // Perform Move
  const handleExecuteMove = async (isSpecialMove: boolean = false) => {
    if (matchState.status !== 'FIGHTING') return;

    const isTurn1 = matchState.currentTurn === 1;
    const attacker = isTurn1 ? matchState.fighter1 : matchState.fighter2;
    const defender = isTurn1 ? matchState.fighter2 : matchState.fighter1;

    let moveName = isSpecialMove ? attacker.specialMove.name : 'Quantum Lariat Slam';
    let baseDamage = isSpecialMove ? attacker.specialMove.damage : Math.floor(Math.random() * 15) + 12;

    // Apply defense reduction
    const finalDamage = Math.max(5, Math.round(baseDamage * (1 - defender.defensePower / 250)));
    const newDefenderHealth = Math.max(0, defender.health - finalDamage);

    // Fetch Ringside AI Commentary from Gemini Server
    setCommentaryLoading(true);
    let commentaryText = `${attacker.name} executes ${moveName} on ${defender.name} dealing ${finalDamage} damage!`;
    try {
      const res = await fetch('/api/wwe/commentary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attackerName: attacker.name,
          defenderName: defender.name,
          moveName,
          damage: finalDamage,
          isSpecial: isSpecialMove,
          round: matchState.round,
          ringVenue: matchState.ringVenue,
        }),
      });
      const data = await res.json();
      if (data.commentary) {
        commentaryText = data.commentary;
      }
    } catch (e) {
      console.warn('Commentary API fallback:', e);
    }
    setCommentaryLoading(false);

    // Check Knockout
    const isKnockout = newDefenderHealth <= 0;

    const updatedFighter1 = isTurn1
      ? { ...matchState.fighter1 }
      : { ...matchState.fighter2, health: newDefenderHealth };
    const updatedFighter2 = isTurn1
      ? { ...matchState.fighter2, health: newDefenderHealth }
      : { ...matchState.fighter1 };

    if (isKnockout) {
      // Winner Payout
      const winner = attacker;
      const prizePool = matchState.wagerAmountPqc * 2;

      setWallet((prev) => ({
        ...prev,
        pqcTokenBalance: prev.pqcTokenBalance + prizePool,
      }));

      setMatchState((prev) => ({
        ...prev,
        fighter1: updatedFighter1,
        fighter2: updatedFighter2,
        status: 'FINISHED',
        winnerId: winner.id,
        battleLog: [
          {
            round: prev.round,
            attacker: attacker.name,
            action: 'KNOCKOUT / PIN',
            damage: finalDamage,
            commentary: `🏆 1-2-3! IT'S OVER! ${winner.name} knocks out ${defender.name} to win the Metaverse Championship Belt and ${prizePool} $PQC tokens!`,
            timestamp: new Date().toLocaleTimeString(),
          },
          ...prev.battleLog,
        ],
      }));

      onAddTerminalMessage(
        `🏆 WWE MATCH VICTOR: ${winner.name} won the championship match! Prize awarded: ${prizePool} $PQC.`
      );
      setIsAutoFightActive(false);
    } else {
      // Continue Match
      setMatchState((prev) => ({
        ...prev,
        fighter1: updatedFighter1,
        fighter2: updatedFighter2,
        currentTurn: isTurn1 ? 2 : 1,
        round: prev.round + 1,
        battleLog: [
          {
            round: prev.round,
            attacker: attacker.name,
            action: moveName,
            damage: finalDamage,
            commentary: commentaryText,
            timestamp: new Date().toLocaleTimeString(),
          },
          ...prev.battleLog,
        ],
      }));
    }
  };

  // Auto Fight AI Loop
  useEffect(() => {
    if (!isAutoFightActive || matchState.status !== 'FIGHTING') return;

    const timer = setTimeout(() => {
      const isSpecialChance = Math.random() < 0.35;
      handleExecuteMove(isSpecialChance);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isAutoFightActive, matchState]);

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200 overflow-hidden rounded-xl border border-slate-800 font-mono">
      {/* Top Header */}
      <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            <Swords className="w-4 h-4 text-amber-400" />
            WWE METAVERSE QUANTUM AI FIGHT ARENA 🤼
          </h2>
          <p className="text-[11px] text-slate-400">
            Post-Quantum AI Automaton Wrestlers & Championship Wager Ring
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-xs flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-slate-400">Championship Purse:</span>
            <span className="text-amber-300 font-bold">{wagerAmount * 2} $PQC</span>
          </div>
        </div>
      </div>

      {/* Main Fight Arena View */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Ring Canvas / Battle Display */}
        <div className="relative bg-gradient-to-b from-slate-900 via-purple-950/40 to-slate-950 p-6 rounded-2xl border-2 border-slate-800 shadow-2xl overflow-hidden min-h-[260px] flex flex-col justify-between">
          {/* Ring Ropes Visual Background */}
          <div className="absolute inset-x-0 top-12 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 opacity-60" />
          <div className="absolute inset-x-0 top-20 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 opacity-60" />

          {/* Top Bar: Fighter 1 VS Fighter 2 Health Gauge */}
          <div className="relative z-10 grid grid-cols-2 gap-6 items-center">
            {/* Fighter 1 Bar */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-cyan-800/80 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={matchState.fighter1.avatarUrl}
                  alt={matchState.fighter1.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-cyan-400"
                />
                <div>
                  <h4 className="font-bold text-cyan-300 text-xs">{matchState.fighter1.name}</h4>
                  <div className="text-[10px] text-slate-400">{matchState.fighter1.ringTitle}</div>
                </div>
              </div>

              {/* Health Bar */}
              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-500"
                  style={{ width: `${matchState.fighter1.health}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>HP: {matchState.fighter1.health}/100</span>
                <span>PQC: ML-KEM-768</span>
              </div>
            </div>

            {/* Fighter 2 Bar */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-purple-800/80 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-2 justify-end text-right">
                <div>
                  <h4 className="font-bold text-purple-300 text-xs">{matchState.fighter2.name}</h4>
                  <div className="text-[10px] text-slate-400">{matchState.fighter2.ringTitle}</div>
                </div>
                <img
                  src={matchState.fighter2.avatarUrl}
                  alt={matchState.fighter2.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-purple-400"
                />
              </div>

              {/* Health Bar */}
              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-purple-500 to-amber-400 h-full transition-all duration-500 ml-auto"
                  style={{ width: `${matchState.fighter2.health}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>PQC: ML-DSA-65</span>
                <span>HP: {matchState.fighter2.health}/100</span>
              </div>
            </div>
          </div>

          {/* Middle Ring Center Action */}
          <div className="relative z-10 text-center my-4">
            {matchState.status === 'IDLE' ? (
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
                  ARENA READY — SELECT SUPERSTARS & PLACE WAGER
                </span>
                <div className="text-xs text-slate-400">
                  Wager $PQC tokens to battle for the WWE Post-Quantum Championship Belt!
                </div>
              </div>
            ) : matchState.status === 'FIGHTING' ? (
              <div className="space-y-1">
                <div className="text-xs font-bold text-amber-400 flex items-center justify-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
                  ROUND {matchState.round} — TURN:{' '}
                  {matchState.currentTurn === 1 ? matchState.fighter1.name : matchState.fighter2.name}
                </div>
                {commentaryLoading && (
                  <div className="text-[11px] text-cyan-300 animate-pulse">
                    🎤 Gemini AI Ringside Commentary generating...
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2 bg-amber-950/80 p-4 rounded-xl border-2 border-amber-500 animate-pulse max-w-md mx-auto">
                <Trophy className="w-8 h-8 text-amber-400 mx-auto" />
                <h3 className="text-base font-bold text-amber-300">MATCH FINISHED! VICTOR ANNOUNCED!</h3>
                <p className="text-xs text-slate-200">
                  Winner awarded Championship Purse of {matchState.wagerAmountPqc * 2} $PQC Tokens!
                </p>
              </div>
            )}
          </div>

          {/* Bottom Action Controls */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 bg-slate-950/90 p-3 rounded-xl border border-slate-800">
            {matchState.status === 'IDLE' ? (
              <div className="w-full flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Wager Amount:</span>
                  {[100, 250, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setWagerAmount(amt)}
                      className={`px-2.5 py-1 rounded text-xs transition ${
                        wagerAmount === amt
                          ? 'bg-amber-600 text-white font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {amt} $PQC
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleStartMatch}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition"
                >
                  <Play className="w-4 h-4" />
                  START WWE CHAMPIONSHIP MATCH
                </button>
              </div>
            ) : matchState.status === 'FIGHTING' ? (
              <div className="w-full flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExecuteMove(false)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center gap-1"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Standard Move
                  </button>

                  <button
                    onClick={() => handleExecuteMove(true)}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold transition flex items-center gap-1"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    SPECIAL FINISHER
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAutoFightActive(!isAutoFightActive)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                      isAutoFightActive
                        ? 'bg-emerald-600 text-white animate-pulse'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isAutoFightActive ? 'animate-spin' : ''}`} />
                    {isAutoFightActive ? 'AI AUTO BATTLE ACTIVE' : 'ENABLE AI AUTO BATTLE'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setMatchState((prev) => ({ ...prev, status: 'IDLE' }))}
                className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
              >
                SETUP NEW MATCH
              </button>
            )}
          </div>
        </div>

        {/* Bottom Section: Fighter Selector & Ringside AI Commentary Log */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fighter Selection Cards */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              SELECT WWE QUANTUM SUPERSTARS
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">CORNER 1 (RED)</label>
                <select
                  value={selectedFighter1.id}
                  onChange={(e) => {
                    const found = fighters.find((f) => f.id === e.target.value);
                    if (found) setSelectedFighter1(found);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
                >
                  {fighters.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.specialMove.pqcType})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">CORNER 2 (BLUE)</label>
                <select
                  value={selectedFighter2.id}
                  onChange={(e) => {
                    const found = fighters.find((f) => f.id === e.target.value);
                    if (found) setSelectedFighter2(found);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
                >
                  {fighters.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.specialMove.pqcType})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected Fighter Stats Preview */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] space-y-2">
              <div className="text-cyan-300 font-bold flex justify-between">
                <span>{selectedFighter1.name} Finisher:</span>
                <span className="text-amber-400">{selectedFighter1.specialMove.name}</span>
              </div>
              <div className="text-purple-300 font-bold flex justify-between">
                <span>{selectedFighter2.name} Finisher:</span>
                <span className="text-amber-400">{selectedFighter2.specialMove.name}</span>
              </div>
            </div>
          </div>

          {/* Ringside AI Commentary Stream */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col h-64">
            <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 mb-2">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              RINGSIDE LIVE AI COMMENTARY LOG
            </h3>

            <div className="flex-1 overflow-y-auto space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
              {matchState.battleLog.map((log, idx) => (
                <div key={idx} className="border-b border-slate-900 pb-2 last:border-0">
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span className="text-amber-400 font-bold">{log.attacker}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <div className="text-slate-200 mt-0.5 leading-relaxed font-sans">{log.commentary}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

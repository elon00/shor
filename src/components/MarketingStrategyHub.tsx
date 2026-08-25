import React, { useState } from 'react';
import { Web3WalletState } from '../types';
import {
  TrendingUp,
  Share2,
  Sparkles,
  Megaphone,
  Globe2,
  Copy,
  CheckCircle2,
  Award,
  Users,
  Target,
  BarChart,
  Layers,
  ArrowUpRight,
  Flame,
  Zap,
  Twitter,
  Linkedin,
  MessageSquare,
  Video,
  FileText,
  DollarSign,
  Coins,
} from 'lucide-react';

interface MarketingStrategyHubProps {
  wallet: Web3WalletState;
  setWallet: React.Dispatch<React.SetStateAction<Web3WalletState>>;
  onAddTerminalMessage: (msg: string) => void;
}

export const MarketingStrategyHub: React.FC<MarketingStrategyHubProps> = ({
  wallet,
  setWallet,
  onAddTerminalMessage,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'CAMPAIGNS' | 'REFERRAL' | 'TOKENOMICS' | 'INFLUENCERS' | 'WHITEPAPER'>('CAMPAIGNS');
  const [selectedChannel, setSelectedChannel] = useState<'TWITTER' | 'LINKEDIN' | 'TELEGRAM' | 'TIKTOK' | 'REDDIT'>('TWITTER');
  const [campaignTopic, setCampaignTopic] = useState('Web 4.0 Post-Quantum Conway AI Launch');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const referralLink = `https://nameless-web4.io/join?ref=${wallet.address || '0x71C83F92'}`;
  const [referralCopied, setReferralCopied] = useState(false);
  const [claimedRewards, setClaimedRewards] = useState(false);

  const [generatedCampaigns, setGeneratedCampaigns] = useState<Record<string, string>>({
    TWITTER: `🧵 THE FUTURE OF THE INTERNET JUST LANDED: NAMELESS WEB 4.0 🚀

Web 1: Read 📄
Web 2: Read & Write 📲
Web 3: Read, Write & Own (Vulnerable to Quantum Decryption) ⛓️
Web 4.0: Autonomous AI Conway Automata + FIPS 203 Post-Quantum Cryptography 🌌🛡️

Here is why this changes everything 👇

1/7 ⚡ Symbiotic AI Agents that self-evolve across 9 EVM chains (Ethereum, Polygon, Arbitrum, Base & more).
2/7 🛡️ NIST ML-KEM-768 lattice encryption making state hashes immune to Shor's Quantum Algorithm.
3/7 💰 Unlimited Quantum Energy Tokenomics ($PQC) with infinite liquidity pools.
4/7 🤼 World-first WWE Metaverse AI Wrestling Battle Arena powered by Gemini AI.

Join the revolution: https://nameless-web4.io
#Web4 #PostQuantum #Crypto #AI #Ethereum #GeminiAI`,

    LINKEDIN: `🌐 Announcing Nameless Web 4.0: The Symbiosis of Autonomous AI Agents and Post-Quantum Cryptography.

As quantum computing advances rapidly toward breaking classical RSA and elliptic-curve cryptography, decentralized architectures must undergo a paradigm shift.

Nameless Web 4.0 introduces:
🔹 FIPS 203 ML-KEM-768 & FIPS 204 ML-DSA-65 Lattice-based security protocols
🔹 Multi-Chain smart contracts spanning 9 top EVM ecosystems
🔹 Self-optimizing cellular neural agents orchestrating real-time state consensus
🔹 Infinite-liquidity post-quantum token standard ($PQC)

We are building the sovereign foundation for the next computational era.

Read our Technical Whitepaper: https://nameless-web4.io/whitepaper
#QuantumComputing #Web4 #ArtificialIntelligence #BlockchainSecurity #DeepTech`,

    TELEGRAM: `🚨 [ALPHA ALERT] NAMELESS WEB 4.0 IS LIVE! 🚨

🔥 The biggest breakthrough in AI x Post-Quantum Crypto is here!
💎 $PQC Token Unlimited Quantum Supply Engine
🌐 Live on Ethereum, Polygon, Arbitrum, Base, BSC & Avalanche
🤼 WWE AI Metaverse Ring Battles + INR UPI Instant Exchange

🚀 Claim your free Genesis Airdrop: +500 $PQC & ₹10,000 INR
👉 https://nameless-web4.io

Lattice encryption verified by ML-KEM-768. Don't sleep on this! 📈`,

    TIKTOK: `🎬 [30s Viral Video Script]
[Hook: Camera zoom with futuristic glitch sound]
"Stop scrolling! Quantum computers will break Bitcoin and Ethereum in a few years... UNLESS you know about Web 4.0."

[Visual: Showcase glowing Conway AI cell grid on screen]
"This is Nameless Web 4.0. It combines self-evolving AI cellular automata with Post-Quantum Lattice encryption that even a 4096-qubit quantum supercomputer cannot crack."

[Call To Action]
"You can battle AI WWE champions, trade quantum NFTs, and claim free $PQC tokens right now. Link in bio!"`,

    REDDIT: `Title: [Deep-Dive] Why Post-Quantum Cryptography (NIST ML-KEM-768) and Cellular Automata are the True Web 4.0

Hey r/CryptoCurrency & r/MachineLearning,

Classical Web3 assumes ECC and ECDSA signatures will protect private keys forever. But Shor's algorithm running on a quantum processor compromises secp256k1 within milliseconds.

Nameless Web 4.0 solves this by implementing:
1. NIST FIPS 203 ML-KEM-768 lattice encryption on EVM Layer-2 networks.
2. Conway Game of Life cellular automata infused with autonomous Gemini AI agents.
3. Cross-chain state synchronization via zero-knowledge quantum bridges.

Check the live deployment and testnet contracts: https://nameless-web4.io`,
  });

  const handleGenerateCustomCampaign = () => {
    setIsGenerating(true);
    onAddTerminalMessage(`[MARKETING AI] Synthesizing viral multi-channel marketing campaign for "${campaignTopic}"...`);
    setTimeout(() => {
      setIsGenerating(false);
      onAddTerminalMessage(`✓ [MARKETING AI] Generated high-converting campaign assets across Twitter, LinkedIn, Telegram & TikTok!`);
    }, 1200);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClaimReferralRewards = () => {
    if (claimedRewards) return;
    setClaimedRewards(true);
    setWallet((prev) => ({
      ...prev,
      pqcTokenBalance: prev.pqcTokenBalance + 2500,
      inrBalance: prev.inrBalance + 25000,
    }));
    onAddTerminalMessage('✓ [REFERRAL BOUNTY] Claimed +2,500 $PQC & ₹25,000 INR Affiliate Rewards!');
  };

  return (
    <div className="space-y-5 text-slate-100">
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-800/40 rounded-2xl p-6 relative overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                Global Standard Growth Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono">
                Web 4.0 Viral Protocol
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Global Marketing & Growth Hub
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl mt-1">
              Enterprise-grade viral marketing toolkit: AI campaign synthesizer, multi-tier Web3 referral bounties, infinite liquidity tokenomics, and global institutional investor outreach.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800 font-mono text-xs">
            <div>
              <div className="text-slate-400 text-[10px]">GLOBAL REACH</div>
              <div className="text-cyan-400 font-bold text-sm">2.84M+ Views</div>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <div className="text-slate-400 text-[10px]">VIRAL COEFFICIENT (K)</div>
              <div className="text-emerald-400 font-bold text-sm">2.48x (Exponential)</div>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <div className="text-slate-400 text-[10px]">TOTAL LIQUIDITY DEPTH</div>
              <div className="text-purple-400 font-bold text-sm">∞</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-6 border-t border-slate-800/80 pt-4 overflow-x-auto">
          {[
            { id: 'CAMPAIGNS', label: 'AI Social Campaigns', icon: Megaphone },
            { id: 'REFERRAL', label: 'Web3 Referral & Bounties', icon: Users },
            { id: 'TOKENOMICS', label: 'Infinite Supply Tokenomics', icon: DollarSign },
            { id: 'INFLUENCERS', label: 'KOL & Influencer Outreach', icon: Target },
            { id: 'WHITEPAPER', label: 'Institutional Pitch Deck', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition whitespace-nowrap ${
                  activeSubTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeSubTab === 'CAMPAIGNS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              AI Campaign Synthesizer
            </h3>
            <p className="text-xs text-slate-400">
              Generate 1-click high-converting copy optimized for algorithmic virality on every major social network.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1">CAMPAIGN TOPIC</label>
                <input
                  type="text"
                  value={campaignTopic}
                  onChange={(e) => setCampaignTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1">TARGET CHANNELS</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'TWITTER', label: 'Twitter / X', icon: Twitter },
                    { id: 'LINKEDIN', label: 'LinkedIn Post', icon: Linkedin },
                    { id: 'TELEGRAM', label: 'Telegram Alpha', icon: MessageSquare },
                    { id: 'TIKTOK', label: 'TikTok / Reels', icon: Video },
                    { id: 'REDDIT', label: 'Reddit r/Crypto', icon: Share2 },
                  ].map((ch) => (
                    <button
                      key={ch.id}
                      onClick={() => setSelectedChannel(ch.id as any)}
                      className={`p-2 rounded-lg border text-left flex items-center gap-2 transition ${
                        selectedChannel === ch.id
                          ? 'bg-purple-950/60 border-purple-500 text-purple-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <ch.icon className="w-3.5 h-3.5" />
                      <span className="font-semibold">{ch.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateCustomCampaign}
                disabled={isGenerating}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 transition disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Synthesizing Viral Hooks...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Viral Copy
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-purple-400 font-bold text-sm">
                  {selectedChannel} VIRAL COPY PREVIEW
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  Algorithm Score: 98/100
                </span>
              </div>

              <button
                onClick={() => handleCopy(generatedCampaigns[selectedChannel], 99)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-lg text-xs font-mono flex items-center gap-1.5 transition"
              >
                {copiedIndex === 99 ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy to Clipboard
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[380px] overflow-y-auto">
              {generatedCampaigns[selectedChannel]}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-2 border-t border-slate-800/80">
              <span>Viral Hashtags: #Web4 #PostQuantum #Crypto #AI #DeFi</span>
              <span>Estimated Click-Through: ~8.4%</span>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'REFERRAL' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              Your Multi-Tier Referral Link
            </h3>
            <p className="text-xs text-slate-400">
              Earn 15% Tier-1, 10% Tier-2, and 5% Tier-3 commissions in instant $PQC tokens on every airdrop, swap, or NFT mint.
            </p>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-400">YOUR AFFILIATE LINK</label>
              <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs font-mono text-cyan-300">
                <span className="truncate flex-1">{referralLink}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(referralLink);
                    setReferralCopied(true);
                    setTimeout(() => setReferralCopied(false), 2000);
                  }}
                  className="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-[11px] font-sans"
                >
                  {referralCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-950/40 to-slate-950 p-4 rounded-xl border border-purple-800/40 space-y-2">
              <div className="text-slate-400 text-xs font-mono">UNCLAIMED AFFILIATE REWARDS</div>
              <div className="text-2xl font-black text-white font-mono flex items-center gap-2">
                <span className="text-cyan-400">+2,500 $PQC</span>
                <span className="text-xs text-slate-400">(& ₹25,000 INR)</span>
              </div>
              <button
                onClick={handleClaimReferralRewards}
                disabled={claimedRewards}
                className={`w-full py-2 rounded-lg text-xs font-bold font-sans transition ${
                  claimedRewards
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                }`}
              >
                {claimedRewards ? '✓ Claimed to Wallet!' : 'Claim Affiliate Rewards Now'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              3-Tier Viral Network Statistics
            </h3>

            <div className="grid grid-cols-3 gap-3 font-mono text-center">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">TIER 1 INVITES (15%)</div>
                <div className="text-xl font-bold text-cyan-400 mt-1">48 Users</div>
                <div className="text-[10px] text-slate-500 mt-0.5">+1,200 $PQC</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">TIER 2 INVITES (10%)</div>
                <div className="text-xl font-bold text-purple-400 mt-1">192 Users</div>
                <div className="text-[10px] text-slate-500 mt-0.5">+960 $PQC</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">TIER 3 INVITES (5%)</div>
                <div className="text-xl font-bold text-pink-400 mt-1">540 Users</div>
                <div className="text-[10px] text-slate-500 mt-0.5">+340 $PQC</div>
              </div>
            </div>

            <div className="border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
              <div className="bg-slate-950 px-3 py-2 text-slate-400 font-bold border-b border-slate-800 grid grid-cols-4">
                <span>REFERRED USER</span>
                <span>TIER</span>
                <span>REWARD</span>
                <span>STATUS</span>
              </div>
              <div className="divide-y divide-slate-800 bg-slate-900/50">
                {[
                  { user: '0x49A1...112C', tier: 'Tier 1 (Direct)', reward: '+50 $PQC', time: '5m ago' },
                  { user: '0x99B2...41F0', tier: 'Tier 2 (Indirect)', reward: '+25 $PQC', time: '18m ago' },
                  { user: '0x33C8...881A', tier: 'Tier 1 (Direct)', reward: '+50 $PQC', time: '42m ago' },
                  { user: '0x12F0...9902', tier: 'Tier 3 (Sub-net)', reward: '+10 $PQC', time: '1h ago' },
                ].map((row, i) => (
                  <div key={i} className="px-3 py-2.5 grid grid-cols-4 items-center">
                    <span className="text-slate-300">{row.user}</span>
                    <span className="text-purple-300">{row.tier}</span>
                    <span className="text-emerald-400 font-bold">{row.reward}</span>
                    <span className="text-cyan-400 text-[10px]">CONFIRMED</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'TOKENOMICS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              Infinite Quantum Tokenomics
            </h3>
            <p className="text-xs text-slate-400">
              $PQC uses a self-sustaining **Infinite Quantum Energy Token** model. As new cellular nodes evolve, tokens are dynamically minted based on lattice proof entropy.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px]">TOTAL SUPPLY CAP</div>
                <div className="text-xl font-bold text-amber-400 mt-0.5">∞ (Infinite Quantum Supply)</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px]">CIRCULATING SUPPLY</div>
                <div className="text-xl font-bold text-cyan-400 mt-0.5">148,920,000 $PQC</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px]">MINTING ALGORITHM</div>
                <div className="text-emerald-400 font-bold mt-0.5">FIPS 203 Proof-of-Lattice-Entropy</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Multichain Liquidity Routing Matrix
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs text-center">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">UNISWAP V3 (ETH)</div>
                <div className="text-sm font-bold text-white mt-1">$12.4M TVL</div>
                <div className="text-[10px] text-emerald-400">0.05% Fee Tier</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">QUICKSWAP (POLYGON)</div>
                <div className="text-sm font-bold text-white mt-1">$8.2M TVL</div>
                <div className="text-[10px] text-emerald-400">Deep Liquidity</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">AERODROME (BASE)</div>
                <div className="text-sm font-bold text-white mt-1">$15.8M TVL</div>
                <div className="text-[10px] text-emerald-400">Sub-cent Swaps</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400 text-[10px]">PANCAKESWAP (BSC)</div>
                <div className="text-sm font-bold text-white mt-1">$6.5M TVL</div>
                <div className="text-[10px] text-emerald-400">Global BNB Bridge</div>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
              <div className="text-slate-300 font-bold">ECOSYSTEM TOKEN ALLOCATION MODEL:</div>
              <div className="grid grid-cols-2 gap-2 text-slate-400 text-[11px]">
                <div>• 40% Multichain Community Faucet & Node Rewards</div>
                <div>• 25% Infinite Automated Liquidity Pools</div>
                <div>• 20% Quantum Computing Research & Grants</div>
                <div>• 15% WWE Metaverse Ring Battle Staking Pool</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'INFLUENCERS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                Global Crypto & AI KOL Outreach Roster
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated outreach queue targeting top 50 global creators across Web3, Quantum Computing, and AI research.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
              Campaign Budget: $500,000 $PQC
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
            {[
              { name: 'QuantumCrypto Alpha', platform: 'YouTube (850k)', tier: 'Mega KOL', status: 'CONTRACT SIGNED' },
              { name: 'AI & Automata Daily', platform: 'Twitter / X (420k)', tier: 'Tier 1 Alpha', status: 'IN REVIEW' },
              { name: 'DeFi Matrix Global', platform: 'Telegram (120k)', tier: 'Whale Group', status: 'ACTIVE BROADCAST' },
            ].map((kol, i) => (
              <div key={i} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{kol.name}</span>
                  <span className="text-[10px] text-purple-400">{kol.tier}</span>
                </div>
                <div className="text-slate-400 text-[11px]">{kol.platform}</div>
                <div className="text-emerald-400 font-bold text-[10px]">{kol.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'WHITEPAPER' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">
                Nameless Web 4.0 Institutional Pitch Deck & Architecture Brief
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Executive summary for Tier-1 Venture Capitalists, Web3 Foundations, and Quantum Research Institutes.
              </p>
            </div>
            <button
              onClick={() => onAddTerminalMessage('✓ [WHITEPAPER] Downloaded Nameless Web 4.0 Whitepaper PDF v4.2')}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-purple-900/30"
            >
              Download PDF Whitepaper
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-purple-400 font-bold">1. PROBLEM STATEMENT</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Within 5-10 years, quantum supercomputers utilizing Shor’s algorithm will render classical RSA & ECC encryption useless, compromising $2.5T in Web3 assets.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-cyan-400 font-bold">2. THE WEB 4.0 SOLUTION</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                NIST FIPS 203 ML-KEM-768 lattice encryption combined with self-evolving Conway cellular automata agents operating across 9 EVM chains.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-emerald-400 font-bold">3. MONETIZATION & VALUE</div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Infinite liquidity token standard ($PQC), on-chain post-quantum NFT marketplace, fiat-to-crypto UPI/INR gateway, and AI battle arenas.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { PqcNftItem, Web3WalletState, CellData } from '../types';
import { ShieldCheck, Sparkles, PlusCircle, Coins, CheckCircle2, Tag, Layers, ExternalLink, Zap, Lock } from 'lucide-react';

interface NftMarketplaceProps {
  wallet: Web3WalletState;
  setWallet: React.Dispatch<React.SetStateAction<Web3WalletState>>;
  selectedCell?: CellData | null;
  onAddTerminalMessage: (msg: string) => void;
}

export const NftMarketplace: React.FC<NftMarketplaceProps> = ({
  wallet,
  setWallet,
  selectedCell,
  onAddTerminalMessage,
}) => {
  // Initial Marketplace NFTs
  const [nfts, setNfts] = useState<PqcNftItem[]>([
    {
      id: 'nft-1',
      tokenId: 1001,
      name: 'Aether-Node #01 [Genesis]',
      description: 'First generation self-evolving AI Automaton Cell protected by FIPS 203 ML-KEM-768 lattice encryption.',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
      rarity: 'Quantum-Mythic',
      priceEth: 0.85,
      pricePqc: 2500,
      ownerAddress: '0x71C8...3F92',
      creatorAddress: '0x0000...0000',
      latticeHash: '0x4a8f91c78e...339a1',
      pqcSignature: 'ML-DSA-65-SIG-4821a...ff',
      attributes: {
        generation: 42,
        powerLevel: 98,
        quantumResilience: '4096-Qubit Immune',
        algorithm: 'ML-KEM-768',
      },
      isForSale: true,
      mintTimestamp: '2026-08-12 11:20:00',
    },
    {
      id: 'nft-2',
      tokenId: 1002,
      name: 'Conway Glider Gun Core',
      description: 'Classic Conway infinite streamer pattern bound to a Post-Quantum Smart Contract.',
      image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=400&q=80',
      rarity: 'Legendary',
      priceEth: 0.45,
      pricePqc: 1200,
      ownerAddress: '0x99A2...41B0',
      creatorAddress: '0x99A2...41B0',
      latticeHash: '0x11b98ac56f...e89d2',
      pqcSignature: 'ML-DSA-65-SIG-9012c...aa',
      attributes: {
        generation: 12,
        powerLevel: 85,
        quantumResilience: '2048-Qubit Immune',
        algorithm: 'ML-DSA-65',
      },
      isForSale: true,
      mintTimestamp: '2026-08-12 12:45:00',
    },
    {
      id: 'nft-3',
      tokenId: 1003,
      name: 'Shor-Defender Lattice Cell',
      description: 'Specialized security AI cell programmed to thwart Shor factorization attacks on state hashes.',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=400&q=80',
      rarity: 'Epic',
      priceEth: 0.25,
      pricePqc: 750,
      ownerAddress: '0x33F1...1111',
      creatorAddress: '0x33F1...1111',
      latticeHash: '0x98213bc541...e12b',
      pqcSignature: 'Falcon-512-SIG-0021b...88',
      attributes: {
        generation: 28,
        powerLevel: 91,
        quantumResilience: 'Quantum-Max Lattice',
        algorithm: 'Falcon-512',
      },
      isForSale: true,
      mintTimestamp: '2026-08-12 13:10:00',
    },
    {
      id: 'nft-4',
      tokenId: 1004,
      name: 'Quantum Pulsar Automaton',
      description: 'Oscillating Web 4.0 cellular engine emitting continuous PQC signature verification pulses.',
      image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=400&q=80',
      rarity: 'Rare',
      priceEth: 0.15,
      pricePqc: 400,
      ownerAddress: '0x44B1...9021',
      creatorAddress: '0x44B1...9021',
      latticeHash: '0x88f21900a...c218',
      pqcSignature: 'Kyber-1024-SIG-7711x...9a',
      attributes: {
        generation: 5,
        powerLevel: 74,
        quantumResilience: '1024-Qubit Immune',
        algorithm: 'Kyber-1024',
      },
      isForSale: true,
      mintTimestamp: '2026-08-12 13:50:00',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'EXPLORE' | 'MY_COLLECTION' | 'MINT_NEW'>('EXPLORE');
  const [selectedNftForDetail, setSelectedNftForDetail] = useState<PqcNftItem | null>(null);
  const [mintName, setMintName] = useState('Quantum Automaton Node');
  const [mintPriceEth, setMintPriceEth] = useState('0.1');
  const [isMinting, setIsMinting] = useState(false);
  const [filterRarity, setFilterRarity] = useState<string>('ALL');

  // Handle Buy NFT
  const handleBuyNft = (nft: PqcNftItem, payWith: 'ETH' | 'PQC') => {
    if (!wallet.isConnected) {
      alert('Please connect your Ethereum Web3 Wallet first!');
      return;
    }

    if (payWith === 'ETH') {
      if (wallet.ethBalance < nft.priceEth) {
        alert(`Insufficient ETH balance! Required: ${nft.priceEth} ETH`);
        return;
      }
      setWallet((prev) => ({
        ...prev,
        ethBalance: parseFloat((prev.ethBalance - nft.priceEth).toFixed(3)),
      }));
    } else {
      if (wallet.pqcTokenBalance < nft.pricePqc) {
        alert(`Insufficient $PQC balance! Required: ${nft.pricePqc} $PQC`);
        return;
      }
      setWallet((prev) => ({
        ...prev,
        pqcTokenBalance: prev.pqcTokenBalance - nft.pricePqc,
      }));
    }

    // Transfer NFT ownership
    setNfts((prev) =>
      prev.map((item) =>
        item.id === nft.id
          ? {
              ...item,
              ownerAddress: wallet.address,
              isForSale: false,
            }
          : item
      )
    );

    onAddTerminalMessage(
      `🎉 NFT PURCHASE SUCCESS: Token #${nft.tokenId} (${nft.name}) acquired by ${wallet.address} for ${
        payWith === 'ETH' ? `${nft.priceEth} ETH` : `${nft.pricePqc} $PQC`
      }. PQC ML-DSA-65 ownership signature verified on Ethereum L2!`
    );

    alert(`Success! You now own NFT Token #${nft.tokenId} (${nft.name})!`);
  };

  // Handle Minting New Cell NFT
  const handleMintCellNft = () => {
    if (!wallet.isConnected) {
      alert('Please connect your Ethereum Web3 wallet to mint NFTs on-chain!');
      return;
    }

    setIsMinting(true);
    setTimeout(() => {
      const newTokenId = 1000 + nfts.length + 1;
      const price = parseFloat(mintPriceEth) || 0.1;
      const newNft: PqcNftItem = {
        id: `nft-${Date.now()}`,
        tokenId: newTokenId,
        name: mintName,
        description: selectedCell
          ? `Minted from Automaton Cell (${selectedCell.x}, ${selectedCell.y}) at Generation ${selectedCell.generation}. Persona: ${selectedCell.aiAgent?.persona || 'Lattice Cell'}.`
          : 'User-custom minted Post-Quantum Automaton NFT on Ethereum.',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
        rarity: selectedCell?.aiAgent ? 'Legendary' : 'Rare',
        priceEth: price,
        pricePqc: Math.round(price * 3000),
        ownerAddress: wallet.address,
        creatorAddress: wallet.address,
        latticeHash: selectedCell?.hash || `0x${Math.random().toString(16).substring(2, 12)}`,
        pqcSignature: `ML-DSA-65-SIG-${Math.random().toString(16).substring(2, 10)}`,
        attributes: {
          generation: selectedCell?.generation || 1,
          powerLevel: selectedCell?.energy || 90,
          quantumResilience: 'FIPS 203 Compliant Lattice',
          algorithm: selectedCell?.pqcKey?.algorithm || 'ML-KEM-768',
        },
        isForSale: false,
        mintTimestamp: new Date().toLocaleString(),
      };

      setNfts((prev) => [newNft, ...prev]);
      setIsMinting(false);

      onAddTerminalMessage(
        `⚡ NEW NFT MINTED ON ETHEREUM: Token #${newTokenId} (${mintName}) created by ${wallet.address}. Signed with ML-DSA-65 Post-Quantum Signature.`
      );

      alert(`NFT Successfully Minted on Ethereum EVM! Token ID: #${newTokenId}`);
      setActiveTab('MY_COLLECTION');
    }, 1200);
  };

  const filteredNfts = nfts.filter((nft) => {
    if (activeTab === 'EXPLORE') return nft.isForSale;
    if (activeTab === 'MY_COLLECTION') return nft.ownerAddress === wallet.address;
    return true;
  }).filter((nft) => filterRarity === 'ALL' || nft.rarity === filterRarity);

  const getRarityBadge = (rarity: PqcNftItem['rarity']) => {
    switch (rarity) {
      case 'Quantum-Mythic':
        return 'bg-gradient-to-r from-amber-500 to-purple-600 text-white font-bold border-amber-400';
      case 'Legendary':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Epic':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Rare':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200 overflow-hidden rounded-xl border border-slate-800">
      {/* Top Header */}
      <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold font-mono text-cyan-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            ETH WEB3 PQC NFT MARKETPLACE (ERC-721)
          </h2>
          <p className="text-[11px] text-slate-400">
            Mint & Trade Post-Quantum Cryptography Automaton Cells on Ethereum EVM
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('EXPLORE')}
            className={`px-3 py-1 rounded-md transition font-medium ${
              activeTab === 'EXPLORE' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Explore Marketplace ({nfts.filter((n) => n.isForSale).length})
          </button>
          <button
            onClick={() => setActiveTab('MY_COLLECTION')}
            className={`px-3 py-1 rounded-md transition font-medium ${
              activeTab === 'MY_COLLECTION' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            My Collection ({nfts.filter((n) => n.ownerAddress === wallet.address).length})
          </button>
          <button
            onClick={() => setActiveTab('MINT_NEW')}
            className={`px-3 py-1 rounded-md transition font-medium flex items-center gap-1 ${
              activeTab === 'MINT_NEW' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Mint NFT
          </button>
        </div>
      </div>

      {/* Rarity Filter Bar */}
      {activeTab !== 'MINT_NEW' && (
        <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 text-[11px]">Rarity Filter:</span>
          {['ALL', 'Quantum-Mythic', 'Legendary', 'Epic', 'Rare', 'Common'].map((rarity) => (
            <button
              key={rarity}
              onClick={() => setFilterRarity(rarity)}
              className={`px-2.5 py-0.5 rounded-full border text-[11px] transition ${
                filterRarity === rarity
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {rarity}
            </button>
          ))}
        </div>
      )}

      {/* Main Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'MINT_NEW' ? (
          /* Minting Screen */
          <div className="max-w-xl mx-auto bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2 font-mono">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Mint On-Chain PQC Automaton NFT
            </h3>
            <p className="text-xs text-slate-400">
              Transform your current cellular automata node or selected grid state into a Quantum-Resistant ERC-721 NFT asset stored on Ethereum EVM.
            </p>

            {selectedCell && (
              <div className="bg-slate-950 p-3 rounded-lg border border-cyan-800/60 text-xs font-mono space-y-1">
                <div className="text-cyan-400 font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  Selected Grid Cell Attached: (${selectedCell.x}, ${selectedCell.y})
                </div>
                <div className="text-slate-300">State: {selectedCell.state.toUpperCase()} | Gen: {selectedCell.generation}</div>
                <div className="text-slate-400 text-[10px]">Lattice Hash: {selectedCell.hash}</div>
              </div>
            )}

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-slate-300 text-xs mb-1">NFT Title / Name</label>
                <input
                  type="text"
                  value={mintName}
                  onChange={(e) => setMintName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  placeholder="e.g. Quantum Automaton Node #42"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-xs mb-1">Minting Listing Price (ETH)</label>
                <input
                  type="number"
                  step="0.01"
                  value={mintPriceEth}
                  onChange={(e) => setMintPriceEth(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Cryptographic Standard:</span>
                  <span className="text-cyan-300">FIPS 203 ML-KEM-768</span>
                </div>
                <div className="flex justify-between">
                  <span>Digital Signature:</span>
                  <span className="text-purple-300">FIPS 204 ML-DSA-65</span>
                </div>
                <div className="flex justify-between">
                  <span>Gas Fee (Simulated):</span>
                  <span className="text-emerald-400">0.0015 ETH</span>
                </div>
              </div>

              <button
                onClick={handleMintCellNft}
                disabled={isMinting}
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold font-sans text-xs shadow-lg transition flex items-center justify-center gap-2"
              >
                {isMinting ? 'Generating ML-DSA-65 Signature & Minting...' : 'Mint NFT on Ethereum EVM'}
              </button>
            </div>
          </div>
        ) : filteredNfts.length === 0 ? (
          <div className="text-center py-16 text-slate-500 font-mono text-xs">
            No NFTs found in this category. Connect wallet or mint a new NFT!
          </div>
        ) : (
          /* NFT Card Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredNfts.map((nft) => (
              <div
                key={nft.id}
                className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl overflow-hidden shadow-lg transition flex flex-col group"
              >
                {/* NFT Image Header */}
                <div className="relative h-44 overflow-hidden bg-slate-950">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-2 left-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono border ${getRarityBadge(
                        nft.rarity
                      )}`}
                    >
                      {nft.rarity}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 border border-slate-800">
                    #{nft.tokenId}
                  </div>
                </div>

                {/* NFT Details */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3 font-mono">
                  <div>
                    <h4 className="font-bold text-slate-100 text-xs line-clamp-1">{nft.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed font-sans">
                      {nft.description}
                    </p>
                  </div>

                  {/* Attributes Badges */}
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-slate-500 block">GEN:</span>
                      <span className="text-slate-200 font-bold">{nft.attributes.generation}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">POWER:</span>
                      <span className="text-emerald-400 font-bold">{nft.attributes.powerLevel}%</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500 block">PQC ALGO:</span>
                      <span className="text-cyan-300 font-bold">{nft.attributes.algorithm}</span>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400">PRICE</div>
                      <div className="text-sm font-bold text-slate-100 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                        {nft.priceEth} ETH
                      </div>
                      <div className="text-[10px] text-cyan-400 font-bold">
                        or {nft.pricePqc.toLocaleString()} $PQC
                      </div>
                    </div>

                    {nft.ownerAddress === wallet.address ? (
                      <span className="px-2.5 py-1 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold">
                        OWNED BY YOU
                      </span>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleBuyNft(nft, 'ETH')}
                          className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-sans text-[11px] font-bold shadow transition"
                        >
                          Buy with ETH
                        </button>
                        <button
                          onClick={() => handleBuyNft(nft, 'PQC')}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/60 font-sans text-[10px] font-bold transition"
                        >
                          Buy with $PQC
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

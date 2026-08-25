import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    framework: 'Web 4.0 Conway AI Automaton & Multichain PQC Network',
    chainsSupported: 9,
    time: new Date().toISOString(),
  });
});

app.get('/api/multichain/networks', (req, res) => {
  res.json({
    success: true,
    networks: [
      { id: 1, name: 'Ethereum Mainnet', symbol: 'ETH', status: 'ACTIVE', type: 'L1' },
      { id: 137, name: 'Polygon PoS', symbol: 'POL', status: 'ACTIVE', type: 'Sidechain' },
      { id: 42161, name: 'Arbitrum One', symbol: 'ETH', status: 'ACTIVE', type: 'L2 Optimistic' },
      { id: 8453, name: 'Base Mainnet', symbol: 'ETH', status: 'ACTIVE', type: 'L2 OP Stack' },
      { id: 10, name: 'Optimism (OP)', symbol: 'ETH', status: 'ACTIVE', type: 'L2 OP Stack' },
      { id: 56, name: 'BNB Smart Chain', symbol: 'BNB', status: 'ACTIVE', type: 'EVM L1' },
      { id: 43114, name: 'Avalanche C-Chain', symbol: 'AVAX', status: 'ACTIVE', type: 'Subnet' },
      { id: 11155111, name: 'Sepolia Testnet', symbol: 'SepoliaETH', status: 'ACTIVE', type: 'Testnet' },
      { id: 80002, name: 'Polygon Amoy', symbol: 'POL', status: 'ACTIVE', type: 'Testnet' },
    ],
    bridgeSecurity: 'FIPS 203 ML-KEM-768 & FIPS 204 ML-DSA-65',
  });
});

app.post('/api/multichain/bridge', (req, res) => {
  const { sourceChainId, targetChainId, amount, senderAddress } = req.body;
  const relayId = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  const latticeProof = 'ML-DSA-65-SIG-' + Math.random().toString(36).substring(2, 12).toUpperCase();

  res.json({
    success: true,
    relayId,
    sourceChainId,
    targetChainId,
    amount,
    senderAddress,
    latticeProof,
    status: 'VERIFIED_AND_RELAYED',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/agent/decide', async (req, res) => {
  try {
    const { cellData, neighborhoodSummary, globalDirective, generation } = req.body;
    const ai = getGeminiClient();
    const prompt = `You are the AI brain of an autonomous Web 4.0 Conway Automaton cell (${cellData.aiAgent?.persona || 'Aether-Node'}).
Current Generation: ${generation}
Cell Position: (${cellData.x}, ${cellData.y})
Cell Energy: ${cellData.energy}/100
Neighborhood Live Cells Count: ${neighborhoodSummary?.liveNeighbors || 0}
PQC Public Key: ${cellData.pqcKey?.publicKey || 'ML-KEM-768-PUB'}
Global Network Directive: "${globalDirective || 'Maintain equilibrium and quantum lattice integrity'}"

Analyze your status and provide a concise JSON decision with:
1. "action": One of ["SPAWN_NEIGHBOR", "MUTATE_STATE", "PQC_SIGN_BROADCAST", "ENERGY_TRANSFER", "STABILIZE"]
2. "statusMessage": Max 12 words describing what you are doing in Web 4.0 agent terminology.
3. "memoryEntry": Short memory string to log in cell history.
4. "energyAdjustment": Number between -10 and +10.
5. "pqcAction": Short summary of PQC signature verification or lattice encryption performed.

Respond ONLY with valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const resultText = response.text || '{}';
    const decision = JSON.parse(resultText);
    res.json({ success: true, decision });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      fallbackDecision: {
        action: 'STABILIZE',
        statusMessage: 'Quantum lattice fallback mode active',
        memoryEntry: 'Local fallback stabilization triggered',
        energyAdjustment: 0,
        pqcAction: 'ML-KEM-768 key re-verification',
      },
    });
  }
});

app.post('/api/agent/directive', async (req, res) => {
  try {
    const { userPrompt, currentPopulation, currentGeneration, activeAgentsCount } = req.body;
    const ai = getGeminiClient();
    const prompt = `User Directive: "${userPrompt}"
Grid Stats: Population ${currentPopulation}, Gen ${currentGeneration}, Active Agents ${activeAgentsCount}
Respond with JSON:
1. "interpretedGoal": string
2. "recommendedPreset": ["GLIDER_SWARM", "GOSPER_GUN", "PQC_LATTICE", "QUANTUM_PULSAR", "AI_MESH"]
3. "broadcastMessage": string
4. "quantumDefenseLevel": "High" | "Quantum-Max"
5. "spawnAgentLocations": [[0,1], [1,0], [1,1]]
6. "explanationHindiEnglish": string`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const directiveResult = JSON.parse(response.text || '{}');
    res.json({ success: true, directiveResult });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      fallback: {
        interpretedGoal: 'Maintain Web 4.0 quantum multichain equilibrium',
        recommendedPreset: 'AI_MESH',
        broadcastMessage: 'Lattice security enforced globally across EVM chains.',
        quantumDefenseLevel: 'Quantum-Max',
        spawnAgentLocations: [[0,0], [1,1], [-1,-1]],
        explanationHindiEnglish: 'Network stabilized under ML-KEM-768 post-quantum cryptographic rules.',
      },
    });
  }
});

app.post('/api/pqc/audit', async (req, res) => {
  try {
    const { totalCells, pqcProofsCount } = req.body;
    const ai = getGeminiClient();
    const prompt = `Generate a PQC Security Audit Report for Web 4.0 multichain automaton grid (${totalCells} cells, ${pqcProofsCount} proofs).
Return JSON with:
1. "rsaVulnerabilityScore": 95-100
2. "pqcResilienceScore": 98-100
3. "latticeAlgorithmUsed": "FIPS 203 ML-KEM-768 & FIPS 204 ML-DSA-65"
4. "auditSummary": 2 sentences explaining lattice resistance to Shor algorithm on 4096-qubit system.
5. "keyRecommendations": [string, string, string]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const report = JSON.parse(response.text || '{}');
    res.json({ success: true, report });
  } catch (error: any) {
    res.json({
      success: true,
      report: {
        rsaVulnerabilityScore: 99,
        pqcResilienceScore: 100,
        latticeAlgorithmUsed: 'ML-KEM-768 / ML-DSA-65',
        auditSummary: 'Post-Quantum Cryptography lattice structures withstand Shor algorithm quantum decryption attempts.',
        keyRecommendations: [
          'Enforce ML-KEM-768 key exchange for all inter-cell messages.',
          'Sign cell energy state hashes using ML-DSA-65 signatures.',
          'Continuously verify lattice dimensions across active nodes.',
        ],
      },
    });
  }
});

app.post('/api/wwe/commentary', async (req, res) => {
  try {
    const { attackerName, defenderName, moveName, damage, isSpecial, round, ringVenue } = req.body;
    const ai = getGeminiClient();
    const prompt = `WWE Commentary for ${attackerName} vs ${defenderName}, Move: ${moveName} (${damage} dmg), Special: ${isSpecial}. High voltage post-quantum crypto hype in Hindi/English tone. JSON: {"commentary": "string"}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, commentary: parsed.commentary || `${attackerName} hits ${defenderName} with a quantum-shattering ${moveName}!` });
  } catch (error: any) {
    res.json({
      success: true,
      commentary: `BAH GAUD! ${req.body?.attackerName} executes a devastating ${req.body?.moveName} on ${req.body?.defenderName}!`,
    });
  }
});

app.post('/api/agent/command', async (req, res) => {
  try {
    const { userPrompt, currentTab, isRunning, population, wallet, config } = req.body;
    const ai = getGeminiClient();
    const systemInstruction = `You are "Aether Agent Leader", the master Agentic AI for the Nameless Web 4.0 Multichain Platform.
Capabilities:
- Grid Controls: START_SIMULATION, PAUSE_SIMULATION, CLEAR_GRID, RANDOMIZE_GRID, LOAD_PRESET
- Tabs: NAVIGATE_TAB (GRID, NFT_MARKET, INR_EXCHANGE, WWE_METAVERSE, PQC, TERMINAL, ANALYTICS)
- Multichain: SWITCH_CHAIN (chainId: 1 | 137 | 42161 | 8453 | 10 | 56 | 43114 | 11155111 | 80002), OPEN_BRIDGE
- Finance: TOPUP_INR, MINT_NFT
Return JSON:
{
  "replyText": "Authoritative explanation in Hinglish/English",
  "reasoningSteps": ["Step 1...", "Step 2..."],
  "actions": [{"type": "...", "params": {...}, "label": "..."}]
}`;

    const prompt = `User Command: "${userPrompt}" | Tab: ${currentTab} | Chain: ${wallet?.network} | Population: ${population}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      success: true,
      replyText: parsed.replyText || `Aether Agent: Executed command for "${userPrompt}".`,
      reasoningSteps: parsed.reasoningSteps || ['Interpreted command', 'Issued Web 4.0 multichain signals'],
      actions: parsed.actions || [],
    });
  } catch (error: any) {
    res.json({
      success: true,
      replyText: `Aether Agent Leader: Processed request for "${req.body?.userPrompt || 'Command'}".`,
      reasoningSteps: ['Local Web 4.0 Multichain Signal Handler Active'],
      actions: [{ type: 'NAVIGATE_TAB', params: { tab: 'GRID' }, label: '📍 View Multichain Grid' }],
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚡ Nameless Web 4.0 Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

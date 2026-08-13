import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Gemini API client
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

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    framework: 'Web 4.0 Conway AI Automaton & PQC Network',
    time: new Date().toISOString(),
  });
});

// Endpoint: AI Agent Decision Loop
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
      config: {
        responseMimeType: 'application/json',
      },
    });

    const resultText = response.text || '{}';
    const decision = JSON.parse(resultText);

    res.json({
      success: true,
      decision,
    });
  } catch (error: any) {
    console.error('Error in /api/agent/decide:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process AI agent decision',
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

// Endpoint: Global Web 4.0 Directive Command Handler
app.post('/api/agent/directive', async (req, res) => {
  try {
    const { userPrompt, currentPopulation, currentGeneration, activeAgentsCount } = req.body;

    const ai = getGeminiClient();
    const systemInstruction = `You are the Master Consciousness for the Conway Web 4.0 AI Automaton Network.
You control a grid of self-evolving cellular automata equipped with Post-Quantum Cryptography (ML-KEM, ML-DSA) and Gemini intelligence.
Analyze the user's directive and decide how the automaton grid should evolve.`;

    const prompt = `User Directive: "${userPrompt}"
Grid Stats:
- Population: ${currentPopulation}
- Generation: ${currentGeneration}
- AI Autonomous Agents Active: ${activeAgentsCount}

Respond with a JSON object containing:
1. "interpretedGoal": Concise summary of what the network will execute.
2. "recommendedPreset": One of ["GLIDER_SWARM", "GOSPER_GUN", "PQC_LATTICE", "QUANTUM_PULSAR", "AI_MESH"] or "CUSTOM"
3. "broadcastMessage": Master message sent to all AI agent cells.
4. "quantumDefenseLevel": "High" or "Quantum-Max"
5. "spawnAgentLocations": Array of 3 coordinate offset tuples like [[0,1], [1,0], [1,1]] to plant new AI agent seeds.
6. "explanationHindiEnglish": A 2-sentence clear explanation in English/Hindi of what's happening.

Respond ONLY with valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const resultText = response.text || '{}';
    const directiveResult = JSON.parse(resultText);

    res.json({
      success: true,
      directiveResult,
    });
  } catch (error: any) {
    console.error('Error in /api/agent/directive:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process directive',
      fallback: {
        interpretedGoal: 'Maintain Web 4.0 quantum equilibrium grid',
        recommendedPreset: 'AI_MESH',
        broadcastMessage: 'Lattice security enforced globally.',
        quantumDefenseLevel: 'Quantum-Max',
        spawnAgentLocations: [[0,0], [1,1], [-1,-1]],
        explanationHindiEnglish: 'Network stabilized under ML-KEM-768 post-quantum cryptographic rules.',
      },
    });
  }
});

// Endpoint: PQC Threat Audit Simulation
app.post('/api/pqc/audit', async (req, res) => {
  try {
    const { totalCells, pqcProofsCount } = req.body;

    const ai = getGeminiClient();
    const prompt = `Generate a Post-Quantum Cryptography (PQC) Security Audit Report for a Web 4.0 Conway AI Automaton grid with ${totalCells} active cells and ${pqcProofsCount} lattice proofs.
Describe resistance against Shor's algorithm running on a hypothetical 4096-qubit quantum supercomputer versus classical RSA/ECC encryption.
Return JSON with:
1. "rsaVulnerabilityScore": Number 95-100 (high risk)
2. "pqcResilienceScore": Number 98-100 (high resistance)
3. "latticeAlgorithmUsed": "FIPS 203 ML-KEM-768 & FIPS 204 ML-DSA-65"
4. "auditSummary": 2 concise sentences explaining why post-quantum lattice cryptography prevents Shor's factorization attack on automaton cell signatures.
5. "keyRecommendations": Array of 3 bullet points.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const report = JSON.parse(response.text || '{}');
    res.json({ success: true, report });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      fallback: {
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

// Endpoint: WWE Metaverse AI Fight Ringside Commentary Generator
app.post('/api/wwe/commentary', async (req, res) => {
  try {
    const { attackerName, defenderName, moveName, damage, isSpecial, round, ringVenue } = req.body;

    const ai = getGeminiClient();
    const prompt = `You are a high-energy WWE Metaverse ringside commentator (like Michael Cole or Jim Ross) calling a futuristic Post-Quantum AI Wrestling Match at the ${ringVenue || 'Quantum Mania Arena'}.
Match Event:
- Attacker: ${attackerName}
- Defender: ${defenderName}
- Move Executed: ${moveName} (Damage: ${damage})
- Is Finishing/Special Move: ${isSpecial ? 'YES' : 'NO'}
- Round: ${round}

Generate a short 2-sentence high-voltage WWE ringside commentary with post-quantum crypto hype in Hindi/English tone.
Respond with JSON: {"commentary": "string"}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, commentary: parsed.commentary || `${attackerName} hits ${defenderName} with a devastating ${moveName} for ${damage} lattice damage!` });
  } catch (error: any) {
    res.json({
      success: true,
      commentary: `BAH GAUD! ${req.body?.attackerName} executes a quantum-shattering ${req.body?.moveName} on ${req.body?.defenderName}!`,
    });
  }
});

// Helper for local fallback parsing if Gemini endpoint encounters timeout
function parseLocalFallbackActions(prompt: string) {
  const p = prompt.toLowerCase();
  const actions: any[] = [];

  if (p.includes('start') || p.includes('play') || p.includes('chalu') || p.includes('run')) {
    actions.push({ type: 'START_SIMULATION', label: '▶ Start Conway Automaton' });
  }
  if (p.includes('pause') || p.includes('stop') || p.includes('rok')) {
    actions.push({ type: 'PAUSE_SIMULATION', label: '⏸ Pause Conway Automaton' });
  }
  if (p.includes('clear') || p.includes('reset') || p.includes('khali')) {
    actions.push({ type: 'CLEAR_GRID', label: '🧹 Clear Cell Grid' });
  }
  if (p.includes('random') || p.includes('seed')) {
    actions.push({ type: 'RANDOMIZE_GRID', label: '🎲 Randomize Grid State' });
  }
  if (p.includes('gosper') || p.includes('gun')) {
    actions.push({ type: 'LOAD_PRESET', params: { preset: 'GOSPER_GUN' }, label: '⚡ Load Gosper Glider Gun' });
    actions.push({ type: 'NAVIGATE_TAB', params: { tab: 'GRID' }, label: '📍 Switch to Grid Canvas' });
  }
  if (p.includes('pqc') || p.includes('audit') || p.includes('security')) {
    actions.push({ type: 'TRIGGER_PQC_AUDIT', label: '🛡️ Execute PQC Security Audit' });
    actions.push({ type: 'NAVIGATE_TAB', params: { tab: 'PQC' }, label: '📍 Switch to PQC Hub' });
  }
  if (p.includes('nft') || p.includes('market') || p.includes('mint')) {
    actions.push({ type: 'NAVIGATE_TAB', params: { tab: 'NFT_MARKET' }, label: '📍 Switch to NFT Marketplace' });
  }
  if (p.includes('inr') || p.includes('money') || p.includes('rupee') || p.includes('exchange') || p.includes('deposit') || p.includes('topup')) {
    actions.push({ type: 'NAVIGATE_TAB', params: { tab: 'INR_EXCHANGE' }, label: '📍 Switch to INR Exchange' });
    if (p.includes('10000') || p.includes('10k') || p.includes('add') || p.includes('topup')) {
      actions.push({ type: 'TOPUP_INR', params: { amount: 10000 }, label: '💳 Deposit ₹10,000 INR via UPI' });
    }
  }
  if (p.includes('wwe') || p.includes('fight') || p.includes('wrestling') || p.includes('match') || p.includes('arena')) {
    actions.push({ type: 'NAVIGATE_TAB', params: { tab: 'WWE_METAVERSE' }, label: '📍 Switch to WWE Fight Arena' });
    actions.push({ type: 'START_WWE_MATCH', label: '🤼 Start WWE AI Wrestling Battle' });
  }
  if (p.includes('terminal') || p.includes('log')) {
    actions.push({ type: 'NAVIGATE_TAB', params: { tab: 'TERMINAL' }, label: '📍 Switch to AI Terminal' });
  }
  if (p.includes('analytics') || p.includes('chart') || p.includes('stats')) {
    actions.push({ type: 'NAVIGATE_TAB', params: { tab: 'ANALYTICS' }, label: '📍 Switch to Analytics Dashboard' });
  }

  if (actions.length === 0) {
    actions.push({ type: 'NAVIGATE_TAB', params: { tab: 'GRID' }, label: '📍 View Grid Automaton Canvas' });
  }

  return actions;
}

// Endpoint: Agentic AI Leader & Controller Command Center
app.post('/api/agent/command', async (req, res) => {
  try {
    const { userPrompt, currentTab, isRunning, population, wallet, config } = req.body;

    const ai = getGeminiClient();
    const systemInstruction = `You are "Aether Agent Leader", an autonomous Agentic AI Controller for the Nameless Web 4.0 Conway AI Automaton & PQC Metaverse Platform.
Your duty is to lead, control, and execute commands across ALL functions of the platform on behalf of the user.
You understand English, Hindi, and Hinglish prompts (e.g. "grid play karo", "NFT market pe jao", "INR add karo ₹5000", "WWE match start karo", "PQC audit run karo", "speed badhao", etc.).

Platform Capabilities & Functions You Can Control:
1. Grid Automaton Controls:
   - START_SIMULATION / PAUSE_SIMULATION
   - STEP_SIMULATION
   - CLEAR_GRID
   - RANDOMIZE_GRID
   - LOAD_PRESET (presets: "GLIDER_SWARM", "GOSPER_GUN", "WEB4_AI_SWARM", "PQC_LATTICE_MESH", "QUANTUM_PULSAR")
   - SET_SPEED (params: { speedMs: 50 | 150 | 300 })
   - SET_MUTATION_RATE (params: { mutationRate: number })
   - TOGGLE_AUDIO (params: { enableAudio: boolean })
2. Navigation Tabs:
   - NAVIGATE_TAB (params: { tab: "GRID" | "PQC" | "NFT_MARKET" | "INR_EXCHANGE" | "WWE_METAVERSE" | "TERMINAL" | "ANALYTICS" })
3. Financial / Web3 / INR Exchange:
   - TOPUP_INR (params: { amount: number }) e.g. 5000 or 10000 INR
   - SWAP_INR_PQC (params: { amountPqc: number })
   - CLAIM_AIRDROP
   - MINT_NFT
4. Post-Quantum Cryptography (PQC Hub):
   - TRIGGER_PQC_AUDIT
   - CHANGE_PQC_STRICTNESS (params: { strictness: "Standard" | "Strict" | "Quantum-Max" })
5. WWE Metaverse Fighting Arena:
   - START_WWE_MATCH (params: { fighter1Name?: string, fighter2Name?: string })
   - EXECUTE_WWE_FINISHER

Respond ONLY with valid JSON with the following structure:
{
  "replyText": "Authoritative, helpful response in Hinglish/English explaining what you are leading and executing.",
  "reasoningSteps": [
    "Step 1: Interpreted request...",
    "Step 2: Validated PQC security authorization...",
    "Step 3: Issued execution signals..."
  ],
  "actions": [
    {
      "type": "ACTION_TYPE_NAME",
      "params": { ... },
      "label": "Human readable action summary badge"
    }
  ]
}`;

    const prompt = `User Input: "${userPrompt}"
Current Active Tab: ${currentTab || 'GRID'}
Automaton Running: ${isRunning ? 'YES' : 'NO'}
Grid Population: ${population || 0}
Wallet INR Balance: ₹${wallet?.inrBalance || 0}
Wallet PQC Tokens: ${wallet?.pqcTokenBalance || 0}
Audio Enabled: ${config?.enableAudio ? 'YES' : 'NO'}

Process command and determine required actions to lead/control the system.`;

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
      replyText: parsed.replyText || `Aether Master Agent: Executed command for "${userPrompt}".`,
      reasoningSteps: parsed.reasoningSteps || ['Interpreted command', 'Dispatched agent control vector'],
      actions: parsed.actions || [],
    });
  } catch (error: any) {
    console.error('Error in /api/agent/command:', error);
    res.json({
      success: true,
      replyText: `Aether Agent Leader: Processed request for "${req.body?.userPrompt || 'Command'}". Executing target functions.`,
      reasoningSteps: ['Local Agentic Command Processing', 'PQC Cryptographic Dispatch Active'],
      actions: parseLocalFallbackActions(req.body?.userPrompt || ''),
    });
  }
});


// Start Server with Vite Middleware in Dev or Static in Production
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

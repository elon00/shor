import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const currentDir = process.cwd();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

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

function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    framework: 'Web 4.0 Conway AI Automaton & Multichain PQC Network',
    chainsSupported: 12,
    testnetsSupported: 9,
    geminiLive: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

app.get('/api/multichain/networks', (req, res) => {
  res.json({
    success: true,
    networks: [
      { id: 11155111, name: 'Ethereum Sepolia Testnet', symbol: 'SepoliaETH', status: 'ACTIVE', type: 'Testnet' },
      { id: 10143, name: 'Monad Parallel EVM Testnet', symbol: 'MON', status: 'ACTIVE', type: 'Testnet' },
      { id: 50312, name: 'Somnia Shannon Metaverse Testnet', symbol: 'STT', status: 'ACTIVE', type: 'Testnet' },
      { id: 63428, name: 'Gensyn AI Compute Testnet', symbol: 'GEN', status: 'ACTIVE', type: 'Testnet' },
      { id: 80002, name: 'Polygon Amoy Testnet', symbol: 'POL', status: 'ACTIVE', type: 'Testnet' },
      { id: 84532, name: 'Base Sepolia Testnet', symbol: 'ETH', status: 'ACTIVE', type: 'Testnet' },
      { id: 421614, name: 'Arbitrum Sepolia Testnet', symbol: 'ETH', status: 'ACTIVE', type: 'Testnet' },
      { id: 97, name: 'BNB Smart Chain Testnet', symbol: 'tBNB', status: 'ACTIVE', type: 'Testnet' },
      { id: 43113, name: 'Avalanche Fuji Testnet', symbol: 'AVAX', status: 'ACTIVE', type: 'Testnet' },
      { id: 1, name: 'Ethereum Mainnet', symbol: 'ETH', status: 'ACTIVE', type: 'L1' },
      { id: 137, name: 'Polygon PoS', symbol: 'POL', status: 'ACTIVE', type: 'Sidechain' },
      { id: 42161, name: 'Arbitrum One', symbol: 'ETH', status: 'ACTIVE', type: 'L2 Optimistic' },
    ],
    bridgeSecurity: 'FIPS 203 ML-KEM-768 & FIPS 204 ML-DSA-65',
    tokenSupply: 'Infinite (Unlimited Quantum Faucet)',
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
    });

    const rawText = response.text || '{}';
    const cleaned = cleanJsonString(rawText);
    const decision = JSON.parse(cleaned);
    res.json({ success: true, decision, isRealTimeAi: true });
  } catch (error: any) {
    console.warn('Gemini decide error:', error.message);
    res.json({
      success: true,
      decision: {
        action: 'STABILIZE',
        statusMessage: 'Quantum lattice equilibrium maintained',
        memoryEntry: 'Local quantum state validated',
        energyAdjustment: 0,
        pqcAction: 'ML-KEM-768 key re-verification',
      },
      isRealTimeAi: false,
    });
  }
});

app.post('/api/agent/command', async (req, res) => {
  try {
    const { userPrompt, currentTab, isRunning, population, wallet, config, model } = req.body;
    const ai = getGeminiClient();
    const systemInstruction = `You are "Aether Agent Leader", the master Multi-Model Agentic AI for the Shor Web 4.0 Multichain Platform & Quantum Aladdin OS.
Respond in clear, helpful, expert Hinglish/English with deep knowledge of Web 4.0, Quantum Computing (Shor, QAOA, QUBO, PQC NIST FIPS 203), Aladdin Risk Modeling, and EVM Multichain testnets.
Provide a JSON with:
1. "replyText": Your conversational, intelligent, live real-time response to the user.
2. "reasoningSteps": Array of 2 to 4 concise internal thoughts showing how you analyzed the command.
3. "actions": Array of action objects to execute in the app if relevant:
   - {"type": "START_SIMULATION"}
   - {"type": "PAUSE_SIMULATION"}
   - {"type": "NAVIGATE_TAB", "params": {"tab": "ALADDIN_HQPO" | "GRID" | "SYNC" | "MARKETING" | "NFT_MARKET" | "INR_EXCHANGE" | "WWE_METAVERSE" | "PQC" | "TERMINAL" | "ANALYTICS"}}
   - {"type": "MINT_UNLIMITED_TOKENS", "params": {"amountPqc": 100000, "amount": 50000}}
   - {"type": "OPEN_BRIDGE"}
Respond strictly with valid JSON.`;

    const prompt = `User Message: "${userPrompt}"
Current Active Tab: ${currentTab}
Connected Network: ${wallet?.network || 'Ethereum Sepolia'}
Grid Population: ${population}
Wallet Balance: ${wallet?.ethBalance} ETH, ${wallet?.pqcTokenBalance} $PQC, ₹${wallet?.inrBalance} INR`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    const rawText = response.text || '';
    const cleaned = cleanJsonString(rawText);
    let parsed: any = {};
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = {
        replyText: rawText || `Aether Leader: Command executed for "${userPrompt}".`,
        reasoningSteps: ['Parsed natural language command with Gemini 3.6 Flash', 'Evaluated live multichain parameters'],
        actions: [],
      };
    }

    res.json({
      success: true,
      replyText: parsed.replyText || `Aether Agent: Executed command for "${userPrompt}".`,
      reasoningSteps: parsed.reasoningSteps || ['Analyzed request with Gemini Live AI', 'Executed multichain control vector'],
      actions: parsed.actions || [],
      isRealTimeAi: true,
      modelUsed: 'Google Gemini 3.6 Flash (Live)',
    });
  } catch (error: any) {
    console.error('Gemini command error:', error);
    res.json({
      success: true,
      replyText: `Aether Agent: Processed request for "${req.body?.userPrompt || 'Command'}".`,
      reasoningSteps: ['Local Web 4.0 Signal Handler Active'],
      actions: [],
      isRealTimeAi: false,
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
    const distPath = path.join(currentDir, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚡ Shor Web 4.0 Server running on http://0.0.0.0:${PORT} with Live Gemini AI!`);
  });
}

startServer();

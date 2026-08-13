import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CellData, GridConfig, CellState } from '../types';
import { calculateStateHash, generatePqcKeypair, AGENT_PERSONAS } from '../lib/pqc';

interface GridAutomatonProps {
  grid: CellData[][];
  setGrid: React.Dispatch<React.SetStateAction<CellData[][]>>;
  config: GridConfig;
  selectedCell: CellData | null;
  setSelectedCell: (cell: CellData | null) => void;
  hoveredCell: CellData | null;
  setHoveredCell: (cell: CellData | null) => void;
  isRunning: boolean;
  onCellClick: (cell: CellData) => void;
}

export const GridAutomaton: React.FC<GridAutomatonProps> = ({
  grid,
  setGrid,
  config,
  selectedCell,
  hoveredCell,
  setHoveredCell,
  onCellClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [drawMode, setDrawMode] = useState<CellState>('alive');

  const cellSize = 16; // pixels per cell

  // Render grid to canvas with high performance
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = config.width * cellSize;
    const height = config.height * cellSize;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    // Clear canvas
    ctx.fillStyle = '#090d16'; // Deep quantum dark background
    ctx.fillRect(0, 0, width, height);

    // Draw Grid Lines
    ctx.strokeStyle = '#1a2234';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= width; x += cellSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y <= height; y += cellSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Render Cells
    for (let r = 0; r < config.height; r++) {
      for (let c = 0; c < config.width; c++) {
        const cell = grid[r]?.[c];
        if (!cell || cell.state === 'dead') continue;

        const x = c * cellSize;
        const y = r * cellSize;

        // Color coding based on Cell State & Web 4.0 Quantum Archetype
        if (cell.state === 'ai_agent') {
          // Neon Emerald Glow for AI Agent
          ctx.fillStyle = '#10b981';
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 8;
          ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);

          // Inner core pulse
          ctx.fillStyle = '#ecfdf5';
          ctx.beginPath();
          ctx.arc(x + cellSize / 2, y + cellSize / 2, 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (cell.state === 'quantum_locked') {
          // Cyan/Purple for Quantum Locked Cell
          ctx.fillStyle = '#06b6d4';
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 6;
          ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);

          // Diamond symbol for PQC proof
          ctx.fillStyle = '#c084fc';
          ctx.beginPath();
          ctx.moveTo(x + cellSize / 2, y + 2);
          ctx.lineTo(x + cellSize - 2, y + cellSize / 2);
          ctx.lineTo(x + cellSize / 2, y + cellSize - 2);
          ctx.lineTo(x + 2, y + cellSize / 2);
          ctx.closePath();
          ctx.fill();
        } else if (cell.state === 'evolving') {
          // Golden Evolving
          ctx.fillStyle = '#f59e0b';
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 6;
          ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
        } else {
          // Standard Alive cell - Cool Sapphire/Cyan
          ctx.fillStyle = '#3b82f6';
          ctx.shadowBlur = 0;
          ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
        }

        // Selected Cell Highlight Ring
        if (selectedCell && selectedCell.x === c && selectedCell.y === r) {
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 2;
          ctx.shadowColor = '#f43f5e';
          ctx.shadowBlur = 10;
          ctx.strokeRect(x, y, cellSize, cellSize);
        }
      }
    }
  }, [grid, config, selectedCell]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const handleCanvasMouseEvent = (e: React.MouseEvent<HTMLCanvasElement>, isClick = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);

    if (x < 0 || x >= config.width || y < 0 || y >= config.height) return;

    const targetCell = grid[y]?.[x];
    if (targetCell) {
      setHoveredCell(targetCell);
      if (isClick || isMouseDown) {
        onCellClick(targetCell);

        // Toggle state if dragging/clicking
        setGrid((prevGrid) => {
          const next = prevGrid.map((row) => [...row]);
          const current = next[y][x];
          let newState: CellState = 'dead';

          if (current.state === 'dead') {
            newState = drawMode;
          } else {
            newState = 'dead';
          }

          const persona = AGENT_PERSONAS[Math.floor(Math.random() * AGENT_PERSONAS.length)];

          next[y][x] = {
            ...current,
            state: newState,
            generation: current.generation + 1,
            hash: calculateStateHash(x, y, newState, current.generation + 1),
            pqcKey: current.pqcKey || generatePqcKeypair('ML-KEM-768'),
            aiAgent:
              newState === 'ai_agent'
                ? {
                    id: `agent-${x}-${y}`,
                    persona: persona.persona,
                    status: 'Active AI Autonomous Cell',
                    directive: persona.directive,
                    memory: [`Spawned at grid coordinates (${x}, ${y})`],
                    autonomyLevel: Math.floor(Math.random() * 5) + 5,
                    generation: 1,
                    energy: 85,
                    decisionsCount: 1,
                  }
                : undefined,
          };
          return next;
        });
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 rounded-xl border border-slate-800/80 overflow-hidden shadow-2xl relative">
      {/* Top Header / Mode Selector */}
      <div className="px-4 py-2 bg-slate-900/90 backdrop-blur border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono text-cyan-400 font-semibold tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            CONWAY WEB4 GRID CANVAS ({config.width}x{config.height})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-sans">Draw Tool:</span>
          <button
            id="draw-alive-btn"
            onClick={() => setDrawMode('alive')}
            className={`px-2.5 py-1 rounded text-xs transition ${
              drawMode === 'alive'
                ? 'bg-blue-600 text-white font-medium shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            Cell Alive
          </button>
          <button
            id="draw-agent-btn"
            onClick={() => setDrawMode('ai_agent')}
            className={`px-2.5 py-1 rounded text-xs transition ${
              drawMode === 'ai_agent'
                ? 'bg-emerald-600 text-white font-medium shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            AI Agent
          </button>
          <button
            id="draw-pqc-btn"
            onClick={() => setDrawMode('quantum_locked')}
            className={`px-2.5 py-1 rounded text-xs transition ${
              drawMode === 'quantum_locked'
                ? 'bg-cyan-600 text-white font-medium shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            PQC Locked
          </button>
        </div>
      </div>

      {/* Interactive Grid Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto flex items-center justify-center p-4 bg-slate-950/80 cursor-crosshair relative"
        onMouseDown={() => setIsMouseDown(true)}
        onMouseUp={() => setIsMouseDown(false)}
        onMouseLeave={() => {
          setIsMouseDown(false);
          setHoveredCell(null);
        }}
      >
        <canvas
          ref={canvasRef}
          onClick={(e) => handleCanvasMouseEvent(e, true)}
          onMouseMove={(e) => handleCanvasMouseEvent(e, false)}
          className="rounded border border-slate-800/90 shadow-2xl transition-all"
        />

        {/* Hover Cell Mini Tooltip */}
        {hoveredCell && (
          <div className="absolute bottom-3 right-3 bg-slate-900/95 border border-slate-700 rounded-lg p-2.5 text-xs shadow-xl pointer-events-none max-w-xs backdrop-blur font-mono">
            <div className="flex items-center justify-between text-cyan-400 font-bold border-b border-slate-800 pb-1 mb-1">
              <span>Cell ({hoveredCell.x}, {hoveredCell.y})</span>
              <span className="uppercase text-[10px] text-slate-400">{hoveredCell.state}</span>
            </div>
            <div className="space-y-0.5 text-slate-300">
              <div>Gen: {hoveredCell.generation} | Energy: {hoveredCell.energy}%</div>
              <div className="text-[10px] text-slate-400 truncate">PQC: {hoveredCell.pqcKey?.publicKey}</div>
              {hoveredCell.aiAgent && (
                <div className="text-emerald-400 text-[10px] mt-1 pt-1 border-t border-slate-800/80">
                  Agent: {hoveredCell.aiAgent.persona}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Canvas Footer Legend */}
      <div className="px-4 py-2 bg-slate-900/80 border-t border-slate-800/80 text-[11px] flex items-center justify-between text-slate-400 font-sans">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-blue-500 inline-block"></span> Standard Cell
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block shadow-xs shadow-emerald-500"></span> AI Agent Node
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-cyan-400 inline-block shadow-xs shadow-cyan-400"></span> PQC Quantum Proof
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 inline-block"></span> Evolving Node
          </span>
        </div>
        <div className="text-slate-500">
          Click or drag on grid to toggle cells & AI agents
        </div>
      </div>
    </div>
  );
};

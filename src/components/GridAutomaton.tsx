import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CellData, GridConfig, CellState } from '../types';
import { calculateStateHash, generatePqcKeypair, AGENT_PERSONAS } from '../lib/pqc';

interface GridAutomatonProps {
  grid: CellData[][];
  setGrid: React.Dispatch<React.SetStateAction<CellData[][]>>;
  config?: GridConfig;
  selectedCell?: CellData | null;
  setSelectedCell?: (cell: CellData | null) => void;
  onSelectCell?: (cell: CellData) => void;
  hoveredCell?: CellData | null;
  setHoveredCell?: (cell: CellData | null) => void;
  isRunning?: boolean;
  onCellClick?: (cell: CellData) => void;
}

export const GridAutomaton: React.FC<GridAutomatonProps> = ({
  grid,
  setGrid,
  config,
  selectedCell,
  setSelectedCell,
  onSelectCell,
  hoveredCell,
  setHoveredCell,
  onCellClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [drawMode, setDrawMode] = useState<CellState>('alive');

  const cellSize = 16; // pixels per cell
  const gridWidth = config?.width ?? (grid?.[0]?.length || 36);
  const gridHeight = config?.height ?? (grid?.length || 22);

  const handleCellSelect = (cell: CellData) => {
    if (onSelectCell) onSelectCell(cell);
    if (onCellClick) onCellClick(cell);
    if (setSelectedCell) setSelectedCell(cell);
  };

  // Render grid to canvas with high performance
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = gridWidth * cellSize;
    const height = gridHeight * cellSize;

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
    for (let r = 0; r < gridHeight; r++) {
      for (let c = 0; c < gridWidth; c++) {
        const cell = grid[r]?.[c];
        if (!cell || cell.state === 'dead') continue;

        const x = c * cellSize;
        const y = r * cellSize;

        // Color coding based on Cell State & Web 4.0 Quantum Archetype
        if (cell.state === 'ai_agent') {
          ctx.fillStyle = '#10b981';
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 8;
          ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);

          ctx.fillStyle = '#ecfdf5';
          ctx.beginPath();
          ctx.arc(x + cellSize / 2, y + cellSize / 2, 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (cell.state === 'quantum_locked') {
          ctx.fillStyle = '#06b6d4';
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 6;
          ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);

          ctx.fillStyle = '#c084fc';
          ctx.beginPath();
          ctx.moveTo(x + cellSize / 2, y + 2);
          ctx.lineTo(x + cellSize - 2, y + cellSize / 2);
          ctx.lineTo(x + cellSize / 2, y + cellSize - 2);
          ctx.lineTo(x + 2, y + cellSize / 2);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillStyle = '#3b82f6';
          ctx.shadowColor = '#3b82f6';
          ctx.shadowBlur = 4;
          ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
        }
        ctx.shadowBlur = 0; // reset shadow
      }
    }

    // Highlight Selected Cell
    if (selectedCell) {
      const sx = selectedCell.x * cellSize;
      const sy = selectedCell.y * cellSize;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.strokeRect(sx, sy, cellSize, cellSize);
    }

    // Highlight Hovered Cell
    if (hoveredCell && (!selectedCell || selectedCell.x !== hoveredCell.x || selectedCell.y !== hoveredCell.y)) {
      const hx = hoveredCell.x * cellSize;
      const hy = hoveredCell.y * cellSize;
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.strokeRect(hx, hy, cellSize, cellSize);
      ctx.setLineDash([]);
    }
  }, [grid, selectedCell, hoveredCell, gridWidth, gridHeight]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const handleCanvasAction = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const x = Math.floor(clientX / cellSize);
    const y = Math.floor(clientY / cellSize);

    if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
      const currentCell = grid[y]?.[x];
      if (currentCell) {
        handleCellSelect(currentCell);

        // Modify cell state based on current drawMode
        setGrid((prev) => {
          const next = prev.map((row) => [...row]);
          const target = next[y][x];
          const nextState: CellState = target.state === drawMode ? 'dead' : drawMode;

          const persona = AGENT_PERSONAS[Math.floor(Math.random() * AGENT_PERSONAS.length)];

          next[y][x] = {
            ...target,
            state: nextState,
            generation: nextState === 'dead' ? 0 : 1,
            energy: nextState === 'dead' ? 0 : 100,
            hash: calculateStateHash(x, y, nextState, nextState === 'dead' ? 0 : 1),
            pqcKey: generatePqcKeypair('ML-KEM-768'),
            aiAgent:
              nextState === 'ai_agent'
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
            CONWAY WEB4 GRID CANVAS ({gridWidth}x{gridHeight})
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
            Quantum Locked
          </button>
        </div>
      </div>

      {/* Interactive Grid Canvas */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center p-4 bg-slate-950/60 overflow-auto cursor-crosshair min-h-[380px]"
      >
        <canvas
          ref={canvasRef}
          onClick={handleCanvasAction}
          onMouseDown={(e) => {
            setIsMouseDown(true);
            handleCanvasAction(e);
          }}
          onMouseUp={() => setIsMouseDown(false)}
          onMouseMove={(e) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const clientX = e.clientX - rect.left;
            const clientY = e.clientY - rect.top;
            const x = Math.floor(clientX / cellSize);
            const y = Math.floor(clientY / cellSize);

            if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
              const cell = grid[y]?.[x] || null;
              if (setHoveredCell) setHoveredCell(cell);
              if (isMouseDown) {
                handleCanvasAction(e);
              }
            }
          }}
          onMouseLeave={() => {
            setIsMouseDown(false);
            if (setHoveredCell) setHoveredCell(null);
          }}
          className="border border-slate-800 rounded-lg shadow-inner bg-slate-900/40"
        />
      </div>
    </div>
  );
};

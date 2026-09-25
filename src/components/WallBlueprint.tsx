import React from 'react';
import { IndianWallInput, IndianCalculationResult } from '../types/calculator';
import { Eye, Layers, Maximize2 } from 'lucide-react';

interface Props {
  input: IndianWallInput;
  result: IndianCalculationResult;
}

export const WallBlueprint: React.FC<Props> = ({ input, result }) => {
  const isFeet = input.system === 'imperial';
  const unitLabel = isFeet ? 'ft' : 'm';

  // SVG Canvas Dimensions
  const svgWidth = 700;
  const svgHeight = 280;
  const paddingX = 65;
  const paddingY = 45;

  const availableW = svgWidth - paddingX * 2;
  const availableH = svgHeight - paddingY * 2;

  const wallL = Math.max(1, input.wallLength);
  const wallH = Math.max(1, input.wallHeight);

  // Compute scale
  const scale = Math.min(availableW / wallL, availableH / wallH);
  const drawW = wallL * scale;
  const drawH = wallH * scale;

  const startX = paddingX + (availableW - drawW) / 2;
  const startY = paddingY + (availableH - drawH) / 2;

  // Clamped simulation of brick courses
  const visualCourses = Math.min(24, Math.max(4, result.totalCourses || 12));
  const visualCols = Math.min(30, Math.max(4, Math.round(wallL * (isFeet ? 1.5 : 4))));

  const wallTitle =
    input.wallType === '9_inch'
      ? '9" बाहरी दीवार (Outer Wall)'
      : input.wallType === '4_5_inch'
      ? '4.5" परदा दीवार (Partition)'
      : 'दीवार (Wall)';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col">
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
            दीवार का नक्शा (Wall Elevation Diagram)
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span className="text-slate-200 font-bold">{wallTitle}</span>
          <span>•</span>
          <span className="text-amber-300 font-bold">{result.totalCourses} रद्दे (Layers)</span>
        </div>
      </div>

      <div className="relative w-full aspect-[21/9] min-h-[190px] max-h-[280px] bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.8" />
            </pattern>
            <pattern id="hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.4" />
            </pattern>
          </defs>

          {/* Grid background */}
          <rect width="100%" height="100%" fill="#0a0f1d" />
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Floor level line */}
          <line
            x1="20"
            y1={startY + drawH + 10}
            x2={svgWidth - 20}
            y2={startY + drawH + 10}
            stroke="#475569"
            strokeWidth="1.5"
            strokeDasharray="4,4"
          />
          <text
            x="24"
            y={startY + drawH + 22}
            fill="#64748b"
            fontSize="9"
            fontFamily="monospace"
          >
            फर्श लेवल (Floor Level ±0.00)
          </text>

          {/* Wall Container */}
          <g>
            <rect
              x={startX}
              y={startY}
              width={drawW}
              height={drawH}
              fill="#261b17"
              stroke="#ea580c"
              strokeWidth="2"
              rx="2"
            />

            {/* Horizontal Course lines */}
            {Array.from({ length: visualCourses }).map((_, i) => {
              const y = startY + (i / visualCourses) * drawH;
              return (
                <line
                  key={`c-${i}`}
                  x1={startX}
                  y1={y}
                  x2={startX + drawW}
                  y2={y}
                  stroke="#475569"
                  strokeWidth="0.8"
                  opacity="0.6"
                />
              );
            })}

            {/* Vertical Joint lines */}
            {Array.from({ length: visualCourses }).map((_, row) => {
              const yTop = startY + (row / visualCourses) * drawH;
              const yBottom = startY + ((row + 1) / visualCourses) * drawH;
              const offset = row % 2 === 0 ? 0 : 0.5;

              return Array.from({ length: visualCols }).map((_, col) => {
                const x = startX + ((col + offset) / visualCols) * drawW;
                if (x < startX || x > startX + drawW) return null;
                return (
                  <line
                    key={`v-${row}-${col}`}
                    x1={x}
                    y1={yTop}
                    x2={x}
                    y2={yBottom}
                    stroke="#334155"
                    strokeWidth="0.6"
                    opacity="0.4"
                  />
                );
              });
            })}

            {/* Openings (Doors & Windows) */}
            {input.openings.map((op, idx) => {
              if (op.count <= 0 || op.width <= 0 || op.height <= 0) return null;
              const opW = (op.width / wallL) * drawW;
              const opH = (op.height / wallH) * drawH;
              const isDoor = op.type === 'door';

              const spacing = drawW / (input.openings.length + 1);
              const opX = startX + spacing * (idx + 1) - opW / 2;
              const opY = isDoor ? startY + drawH - opH : startY + drawH * 0.25;

              return (
                <g key={op.id}>
                  <rect
                    x={Math.max(startX + 2, opX)}
                    y={Math.max(startY + 2, opY)}
                    width={Math.min(opW, drawW - 4)}
                    height={Math.min(opH, drawH - 4)}
                    fill="#0f172a"
                    stroke="#38bdf8"
                    strokeWidth="1.8"
                    strokeDasharray={isDoor ? 'none' : '4,2'}
                  />
                  <rect
                    x={Math.max(startX + 2, opX)}
                    y={Math.max(startY + 2, opY)}
                    width={Math.min(opW, drawW - 4)}
                    height={Math.min(opH, drawH - 4)}
                    fill="url(#hatch)"
                  />
                  <text
                    x={opX + opW / 2}
                    y={opY + opH / 2}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {op.hindiName || (isDoor ? 'दरवाजा' : 'खिड़की')}
                  </text>
                  <text
                    x={opX + opW / 2}
                    y={opY + opH / 2 + 12}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="8"
                    fontFamily="monospace"
                  >
                    {op.width} × {op.height} {unitLabel}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Dimension Line: Top (Length) */}
          <g>
            <line
              x1={startX}
              y1={startY - 18}
              x2={startX + drawW}
              y2={startY - 18}
              stroke="#f59e0b"
              strokeWidth="1.5"
            />
            <rect
              x={startX + drawW / 2 - 40}
              y={startY - 28}
              width="80"
              height="18"
              rx="4"
              fill="#0f172a"
              stroke="#f59e0b"
              strokeWidth="1"
            />
            <text
              x={startX + drawW / 2}
              y={startY - 16}
              textAnchor="middle"
              fill="#fbbf24"
              fontSize="10"
              fontWeight="bold"
              fontFamily="monospace"
            >
              लंबाई: {input.wallLength} {unitLabel}
            </text>
          </g>

          {/* Dimension Line: Left (Height) */}
          <g>
            <line
              x1={startX - 18}
              y1={startY}
              x2={startX - 18}
              y2={startY + drawH}
              stroke="#f59e0b"
              strokeWidth="1.5"
            />
            <g transform={`rotate(-90 ${startX - 18} ${startY + drawH / 2})`}>
              <rect
                x={startX - 18 - 35}
                y={startY + drawH / 2 - 9}
                width="70"
                height="18"
                rx="4"
                fill="#0f172a"
                stroke="#f59e0b"
                strokeWidth="1"
              />
              <text
                x={startX - 18}
                y={startY + drawH / 2 + 3}
                textAnchor="middle"
                fill="#fbbf24"
                fontSize="10"
                fontWeight="bold"
                fontFamily="monospace"
              >
                ऊंचाई: {input.wallHeight} {unitLabel}
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-300">
        <div>
          कुल दीवार: <strong className="text-white font-mono">{result.grossWallAreaSqFt} sq.ft</strong>
        </div>
        <div>
          दरवाजा कटौती: <strong className="text-sky-300 font-mono">-{result.totalOpeningsAreaSqFt} sq.ft</strong>
        </div>
        <div>
          शुद्ध चिनाई: <strong className="text-emerald-400 font-mono">{result.netWallAreaSqFt} sq.ft</strong>
        </div>
        <div>
          मोटाई: <strong className="text-amber-300 font-mono">{result.wallThicknessInch} इंच ({result.wallThicknessMm} mm)</strong>
        </div>
      </div>
    </div>
  );
};

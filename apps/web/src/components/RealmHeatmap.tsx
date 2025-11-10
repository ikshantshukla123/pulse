"use client";

import { useEffect, useRef } from "react";

type Props = {
  byRealm: Record<number, number>;
};

const REALM_POSITIONS = [
  { x: 120, y: 80, name: "Alpha" },
  { x: 300, y: 60, name: "Beta" },
  { x: 480, y: 100, name: "Gamma" },
  { x: 200, y: 220, name: "Delta" },
  { x: 360, y: 200, name: "Epsilon" },
  { x: 540, y: 240, name: "Zeta" },
  { x: 160, y: 340, name: "Eta" },
  { x: 420, y: 360, name: "Theta" },
];

export default function RealmHeatmap({ byRealm }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const width = 660;
    const height = 420;
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Deep space gradient background
    const spaceGradient = ctx.createLinearGradient(0, 0, width, height);
    spaceGradient.addColorStop(0, "#0a0e1a");
    spaceGradient.addColorStop(0.5, "#0f1525");
    spaceGradient.addColorStop(1, "#0a1120");
    ctx.fillStyle = spaceGradient;
    ctx.fillRect(0, 0, width, height);

    // Add subtle starfield
    for (let i = 0; i < 150; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 1.2;
      const opacity = Math.random() * 0.8 + 0.2;
      
      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw constellation lines
    ctx.strokeStyle = "rgba(100, 150, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 3]);
    
    for (let i = 0; i < REALM_POSITIONS.length; i++) {
      for (let j = i + 1; j < REALM_POSITIONS.length; j++) {
        const dist = Math.sqrt(
          Math.pow(REALM_POSITIONS[i].x - REALM_POSITIONS[j].x, 2) +
          Math.pow(REALM_POSITIONS[i].y - REALM_POSITIONS[j].y, 2)
        );
        
        if (dist < 200) {
          ctx.beginPath();
          ctx.moveTo(REALM_POSITIONS[i].x, REALM_POSITIONS[i].y);
          ctx.lineTo(REALM_POSITIONS[j].x, REALM_POSITIONS[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.setLineDash([]);

    // Draw realms
    REALM_POSITIONS.forEach((position, index) => {
      const realmNumber = index + 1;
      const activityCount = byRealm[realmNumber] ?? 0;
      const intensity = Math.min(1, activityCount / 12);
      const baseRadius = 25;
      const activityRadius = baseRadius + 30 * intensity;

      // Activity aura (subtle glow)
      if (activityCount > 0) {
        const glow = ctx.createRadialGradient(
          position.x, position.y, baseRadius,
          position.x, position.y, activityRadius
        );
        
        const colors = [
          { stop: 0, color: `rgba(147, 197, 253, ${0.3 + intensity * 0.4})` },
          { stop: 0.7, color: `rgba(59, 130, 246, ${0.1 + intensity * 0.2})` },
          { stop: 1, color: "rgba(30, 58, 138, 0)" }
        ];
        
        colors.forEach(({ stop, color }) => glow.addColorStop(stop, color));
        
        ctx.beginPath();
        ctx.fillStyle = glow;
        ctx.arc(position.x, position.y, activityRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Realm core (main circle)
      const coreGradient = ctx.createRadialGradient(
        position.x - 3, position.y - 3, 0,
        position.x, position.y, baseRadius
      );
      
      if (activityCount > 0) {
        coreGradient.addColorStop(0, "#93c5fd");
        coreGradient.addColorStop(0.7, "#3b82f6");
        coreGradient.addColorStop(1, "#1e40af");
      } else {
        coreGradient.addColorStop(0, "#4b5563");
        coreGradient.addColorStop(1, "#374151");
      }
      
      ctx.beginPath();
      ctx.fillStyle = coreGradient;
      ctx.arc(position.x, position.y, baseRadius, 0, Math.PI * 2);
      ctx.fill();

      // Inner shine effect
      ctx.beginPath();
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.arc(position.x - 6, position.y - 6, 8, 0, Math.PI * 2);
      ctx.fill();

      // Realm number
      ctx.fillStyle = activityCount > 0 ? "#ffffff" : "#9ca3af";
      ctx.font = "bold 14px ui-sans-serif, system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(realmNumber.toString(), position.x, position.y);

      // Realm label with activity count
      ctx.fillStyle = activityCount > 0 ? "#dbeafe" : "#6b7280";
      ctx.font = "600 11px ui-sans-serif, system-ui";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(
        `${position.name} • ${activityCount}`,
        position.x + baseRadius + 8,
        position.y
      );
    });

  }, [byRealm]);

  const totalActivities = Object.values(byRealm).reduce((sum, count) => sum + count, 0);

  return (
    <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/90 backdrop-blur-sm rounded-3xl border border-slate-700/50 shadow-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-lg">🌌</span>
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Realm Constellation
            </h2>
            <p className="text-slate-400 text-sm">Activity across the network</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{totalActivities}</div>
          <div className="text-slate-400 text-sm">Total Activities</div>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="relative bg-slate-800/30 rounded-2xl border border-slate-700/30 p-4">
        <canvas 
          ref={canvasRef} 
          className="w-full h-auto rounded-lg"
        />
        
        {/* Activity Legend */}
        <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm rounded-xl p-3 border border-slate-700/50">
          <div className="text-xs text-slate-400 font-medium mb-2">Activity Level</div>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full"></div>
              <span className="text-slate-300">Low</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full"></div>
              <span className="text-slate-300">Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full shadow-lg shadow-blue-500/30"></div>
              <span className="text-slate-300">High</span>
            </div>
          </div>
        </div>
      </div>

      {/* Realm List */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {REALM_POSITIONS.map((realm, index) => {
          const realmNumber = index + 1;
          const activityCount = byRealm[realmNumber] ?? 0;
          
          return (
            <div 
              key={realmNumber}
              className="flex items-center space-x-2 p-2 rounded-lg bg-slate-800/30 border border-slate-700/30"
            >
              <div className={`w-3 h-3 rounded-full ${
                activityCount > 8 ? 'bg-blue-300 shadow shadow-blue-400/50' :
                activityCount > 4 ? 'bg-blue-500' :
                'bg-slate-600'
              }`}></div>
              <span className="text-xs text-slate-300 font-medium">
                {realm.name}
              </span>
              <span className="text-xs text-slate-500 ml-auto">
                {activityCount}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
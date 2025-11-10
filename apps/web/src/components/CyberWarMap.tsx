// apps/web/src/components/CyberWarMap.tsx
'use client';

import { useEffect, useRef, useState } from "react";

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

export default function CyberWarMap({ byRealm }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [attacks, setAttacks] = useState<Array<{from: number, to: number, progress: number}>>([]);

  // Cyber Tokyo color palette
  const COLORS = {
    background: '#0a0a14',
    grid: '#1a1a2e',
    realmBase: '#16213e',
    neonPink: '#ff00ff',
    neonTeal: '#00ffff',
    glitchPurple: '#8a2be2',
    energyGlow: '#00ff9d',
    attackBeam: '#ff0066',
    scanner: 'rgba(0, 255, 255, 0.1)'
  };

  useEffect(() => {
    // Simulate random attacks for demo
    const attackInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const fromRealm = Math.floor(Math.random() * 8) + 1;
        let toRealm = Math.floor(Math.random() * 8) + 1;
        while (toRealm === fromRealm) toRealm = Math.floor(Math.random() * 8) + 1;
        
        setAttacks(prev => [...prev, { from: fromRealm, to: toRealm, progress: 0 }]);
      }
    }, 2000);

    return () => clearInterval(attackInterval);
  }, []);

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

    // Cyber Tokyo background
    const spaceGradient = ctx.createLinearGradient(0, 0, width, height);
    spaceGradient.addColorStop(0, "#0a0a14");
    spaceGradient.addColorStop(0.5, "#1a1a2e");
    spaceGradient.addColorStop(1, "#0f0f23");
    ctx.fillStyle = spaceGradient;
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Scanner effect
    const time = Date.now() * 0.002;
    const scannerY = (time * 20) % height;
    const scannerGradient = ctx.createLinearGradient(0, scannerY - 50, 0, scannerY + 50);
    scannerGradient.addColorStop(0, 'transparent');
    scannerGradient.addColorStop(0.5, COLORS.scanner);
    scannerGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = scannerGradient;
    ctx.fillRect(0, scannerY - 50, width, 100);

    // Draw attack beams
    attacks.forEach((attack, index) => {
      const fromPos = REALM_POSITIONS[attack.from - 1];
      const toPos = REALM_POSITIONS[attack.to - 1];
      
      if (!fromPos || !toPos) return;

      const progress = attack.progress + 0.02;
      if (progress >= 1) {
        setAttacks(prev => prev.filter((_, i) => i !== index));
        return;
      }

      const currentX = fromPos.x + (toPos.x - fromPos.x) * progress;
      const currentY = fromPos.y + (toPos.y - fromPos.y) * progress;

      // Beam glow
      const beamGradient = ctx.createLinearGradient(fromPos.x, fromPos.y, currentX, currentY);
      beamGradient.addColorStop(0, COLORS.attackBeam + '80');
      beamGradient.addColorStop(1, COLORS.attackBeam + '20');
      
      ctx.strokeStyle = beamGradient;
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(fromPos.x, fromPos.y);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Update progress
      setAttacks(prev => prev.map((a, i) => 
        i === index ? { ...a, progress } : a
      ));
    });

    // Draw realms with cyberpunk styling
    REALM_POSITIONS.forEach((position, index) => {
      const realmNumber = index + 1;
      const activityCount = byRealm[realmNumber] ?? 0;
      const intensity = Math.min(1, activityCount / 15);
      const baseRadius = 28;
      const pulse = Math.sin(Date.now() * 0.005 + index) * 3;

      // Energy aura
      if (activityCount > 0) {
        const glow = ctx.createRadialGradient(
          position.x, position.y, baseRadius,
          position.x, position.y, baseRadius + 25
        );
        glow.addColorStop(0, COLORS.energyGlow + '80');
        glow.addColorStop(1, COLORS.energyGlow + '00');
        
        ctx.beginPath();
        ctx.fillStyle = glow;
        ctx.arc(position.x, position.y, baseRadius + 25, 0, Math.PI * 2);
        ctx.fill();
      }

      // Outer cyber ring
      ctx.beginPath();
      ctx.arc(position.x, position.y, baseRadius + 5 + pulse, 0, Math.PI * 2);
      ctx.strokeStyle = activityCount > 0 ? COLORS.neonTeal : COLORS.glitchPurple;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Main realm core
      const coreGradient = ctx.createRadialGradient(
        position.x - 5, position.y - 5, 0,
        position.x, position.y, baseRadius
      );
      
      if (activityCount > 0) {
        coreGradient.addColorStop(0, '#93c5fd');
        coreGradient.addColorStop(0.7, '#3b82f6');
        coreGradient.addColorStop(1, '#1e40af');
      } else {
        coreGradient.addColorStop(0, '#4b5563');
        coreGradient.addColorStop(1, '#374151');
      }
      
      ctx.beginPath();
      ctx.fillStyle = coreGradient;
      ctx.arc(position.x, position.y, baseRadius, 0, Math.PI * 2);
      ctx.fill();

      // Cyber hex pattern overlay
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const hexX = position.x + Math.cos(angle) * 15;
        const hexY = position.y + Math.sin(angle) * 15;
        ctx.beginPath();
        ctx.arc(hexX, hexY, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Realm number with glow
      ctx.fillStyle = activityCount > 0 ? '#ffffff' : '#9ca3af';
      ctx.font = "bold 16px 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = activityCount > 0 ? COLORS.neonTeal : COLORS.neonPink;
      ctx.shadowBlur = 10;
      ctx.fillText(`R${realmNumber}`, position.x, position.y);
      ctx.shadowBlur = 0;

      // Power level
      ctx.fillStyle = COLORS.neonTeal;
      ctx.font = "600 12px 'Courier New', monospace";
      ctx.textAlign = "left";
      ctx.fillText(
        `PWR:${activityCount}`,
        position.x + baseRadius + 8,
        position.y
      );
    });

  }, [byRealm, attacks]);

  const totalActivities = Object.values(byRealm).reduce((sum, count) => sum + count, 0);

  return (
    <div className="cyber-tokyo-panel rounded-3xl border-2 border-pink-500/30 bg-black/40 backdrop-blur-sm p-6 shadow-2xl shadow-purple-500/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30">
            <span className="text-xl">⚔️</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold glitch-text">
              REALM WAR MAP
            </h2>
            <p className="text-cyan-300 text-sm font-mono">Live Territory Control</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-pink-400 font-mono">{totalActivities}</div>
          <div className="text-cyan-300 text-sm font-mono">TOTAL POWER</div>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="relative bg-black/30 rounded-2xl border-2 border-cyan-500/20 p-4">
        <canvas 
          ref={canvasRef} 
          className="w-full h-auto rounded-lg"
        />
        
        {/* War Legend */}
        <div className="absolute bottom-4 left-4 cyber-tokyo-panel rounded-xl p-3 border border-cyan-500/30">
          <div className="text-xs text-cyan-300 font-mono mb-2">WAR STATUS</div>
          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-cyan-400 rounded-full shadow shadow-cyan-400/50"></div>
              <span className="text-white">ACTIVE</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-pink-500 rounded-full shadow shadow-pink-500/50"></div>
              <span className="text-white">ATTACK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
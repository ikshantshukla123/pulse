"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  byRealm: Record<number, number>;
  realmPower: Record<number, number>;
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

export default function CyberWarMap({ byRealm, realmPower }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [attackAnimation, setAttackAnimation] = useState<{from: number, to: number} | null>(null);
  const [showPowerTracker, setShowPowerTracker] = useState(true);
  const [realmStates, setRealmStates] = useState<Record<number, {isUnderAttack: boolean, pulse: number}>>({});

  // Calculate total power
  const totalPower = Object.values(realmPower).reduce((sum, power) => sum + power, 0);

  // Handle attack animations
  useEffect(() => {
    if (attackAnimation) {
      // Set realms under attack
      setRealmStates(prev => ({
        ...prev,
        [attackAnimation.from]: { ...prev[attackAnimation.from], pulse: 3 },
        [attackAnimation.to]: { ...prev[attackAnimation.to], isUnderAttack: true, pulse: 3 }
      }));

      // Clear animation after 2 seconds
      const timer = setTimeout(() => {
        setAttackAnimation(null);
        setRealmStates(prev => ({
          ...prev,
          [attackAnimation.to]: { ...prev[attackAnimation.to], isUnderAttack: false, pulse: 0 }
        }));
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [attackAnimation]);

  // Listen for attack animations
  useEffect(() => {
    const handleAttack = (event: CustomEvent<{from: number, to: number}>) => {
      setAttackAnimation(event.detail);
    };

    window.addEventListener('realmAttack' as any, handleAttack as EventListener);
    return () => window.removeEventListener('realmAttack' as any, handleAttack as EventListener);
  }, []);

  // Draw the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const width = 800;
    const height = 500;
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

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

      // Draw attack animation
      if (attackAnimation) {
        const fromRealm = REALM_POSITIONS[attackAnimation.from - 1];
        const toRealm = REALM_POSITIONS[attackAnimation.to - 1];
        
        if (fromRealm && toRealm) {
          // Draw attack line
          ctx.strokeStyle = "rgba(255, 0, 100, 0.6)";
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(fromRealm.x, fromRealm.y);
          ctx.lineTo(toRealm.x, toRealm.y);
          ctx.stroke();
          ctx.setLineDash([]);

          // Draw attack particles
          for (let i = 0; i < 10; i++) {
            const progress = Math.random();
            const x = fromRealm.x + (toRealm.x - fromRealm.x) * progress;
            const y = fromRealm.y + (toRealm.y - fromRealm.y) * progress;
            
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 50, 100, ${0.8 - progress})`;
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
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
        const power = realmPower[realmNumber] ?? 100;
        const intensity = Math.min(1, activityCount / 12);
        const baseRadius = 25;
        const activityRadius = baseRadius + 30 * intensity;
        const realmState = realmStates[realmNumber] || { isUnderAttack: false, pulse: 0 };

        // Pulsing effect for active realms
        const pulseScale = 1 + (realmState.pulse * 0.1);
        const currentRadius = baseRadius * pulseScale;

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

        // Realm core (main circle) - color based on power
        const coreGradient = ctx.createRadialGradient(
          position.x - 3, position.y - 3, 0,
          position.x, position.y, currentRadius
        );
        
        if (realmState.isUnderAttack) {
          coreGradient.addColorStop(0, "#ff6b6b");
          coreGradient.addColorStop(0.7, "#ff4757");
          coreGradient.addColorStop(1, "#ff2e43");
        } else if (power > 150) {
          coreGradient.addColorStop(0, "#93c5fd");
          coreGradient.addColorStop(0.7, "#3b82f6");
          coreGradient.addColorStop(1, "#1e40af");
        } else if (power > 100) {
          coreGradient.addColorStop(0, "#86efac");
          coreGradient.addColorStop(0.7, "#22c55e");
          coreGradient.addColorStop(1, "#15803d");
        } else {
          coreGradient.addColorStop(0, "#4b5563");
          coreGradient.addColorStop(1, "#374151");
        }
        
        ctx.beginPath();
        ctx.fillStyle = coreGradient;
        ctx.arc(position.x, position.y, currentRadius, 0, Math.PI * 2);
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

        // Realm label with power and activity
        ctx.fillStyle = activityCount > 0 ? "#dbeafe" : "#6b7280";
        ctx.font = "600 11px ui-sans-serif, system-ui";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(
          `${position.name} • ⚡${power}`,
          position.x + currentRadius + 8,
          position.y - 8
        );
        
        // Activity count below
        ctx.fillStyle = "#94a3b8";
        ctx.font = "500 10px ui-sans-serif, system-ui";
        ctx.fillText(
          `📊 ${activityCount} acts`,
          position.x + currentRadius + 8,
          position.y + 8
        );
      });

      requestAnimationFrame(draw);
    };

    draw();

    // Reduce pulse over time
    const pulseInterval = setInterval(() => {
      setRealmStates(prev => {
        const newStates = { ...prev };
        Object.keys(newStates).forEach(key => {
          const realm = Number(key);
          if (newStates[realm].pulse > 0) {
            newStates[realm].pulse -= 0.5;
          }
        });
        return newStates;
      });
    }, 100);

    return () => clearInterval(pulseInterval);
  }, [byRealm, realmPower, attackAnimation, realmStates]);

  const totalActivities = Object.values(byRealm).reduce((sum, count) => sum + count, 0);

  return (
    <div className="cyber-tokyo-panel rounded-3xl border-2 border-pink-500/30 bg-black/40 backdrop-blur-sm p-8 shadow-2xl shadow-purple-500/20 w-full max-w-7xl mx-auto min-h-[800px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30">
            <span className="text-2xl">⚔️</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold glitch-text">
              REALM WAR MAP
            </h2>
            <p className="text-cyan-300 text-base font-mono">Live Territory Control</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-pink-400 font-mono">{totalPower}</div>
          <div className="text-cyan-300 text-base font-mono">TOTAL POWER</div>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="relative bg-black/30 rounded-2xl border-2 border-cyan-500/20 p-6 min-h-[600px]">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full rounded-lg"
        />
        
        {/* Enhanced Power Tracker and War Status - Stacked Vertically */}
        {showPowerTracker && (
          <div className="absolute top-6 right-6 flex flex-col gap-4">
            {/* Realm Power Box */}
            <div className="cyber-tokyo-panel rounded-xl p-5 border border-cyan-500/30 backdrop-blur-sm w-72">
              <div className="flex justify-between items-center mb-3">
                <div className="text-sm text-cyan-300 font-mono">⚡ REALM POWER</div>
                <button 
                  onClick={() => setShowPowerTracker(false)}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[1,2,3,4,5,6,7,8].map(realm => {
                  const state = realmStates[realm] || {};
                  return (
                    <div key={realm} className="flex justify-between items-center py-1 px-2 rounded hover:bg-cyan-500/10 transition-colors">
                      <span className={`text-slate-300 ${state.isUnderAttack ? 'text-red-400' : ''}`}>
                        R{realm}
                        {state.isUnderAttack && ' 🔥'}
                        {state.pulse > 0 && ' ⚡'}
                      </span>
                      <span className={`font-mono ${
                        realmPower[realm] > 150 ? 'text-pink-400' : 
                        realmPower[realm] > 100 ? 'text-cyan-400' : 'text-green-400'
                      }`}>
                        {realmPower[realm] || 100}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* War Status Box - Now below Realm Power */}
            <div className="cyber-tokyo-panel rounded-xl p-4 border border-cyan-500/30 backdrop-blur-sm w-72">
              <div className="text-sm text-cyan-300 font-mono mb-3">WAR STATUS</div>
              <div className="space-y-3 text-sm font-mono">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-cyan-400 rounded-full shadow shadow-cyan-400/50"></div>
                  <span className="text-white">ACTIVE</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-400 rounded-full shadow shadow-green-400/50"></div>
                  <span className="text-white">HIGH POWER</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-400 rounded-full shadow shadow-red-400/50"></div>
                  <span className="text-white">UNDER ATTACK</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Show Power Tracker Button if hidden */}
        {!showPowerTracker && (
          <button 
            onClick={() => setShowPowerTracker(true)}
            className="absolute top-6 right-6 cyber-tokyo-panel rounded-lg p-3 border border-cyan-500/30 text-cyan-300 text-sm hover:bg-cyan-500/20 transition-colors flex items-center space-x-2"
          >
            <span>⚡</span>
            <span>Show Power</span>
          </button>
        )}
      </div>
    </div>
  );
}
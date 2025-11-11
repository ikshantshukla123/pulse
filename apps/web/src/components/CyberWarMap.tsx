// apps/web/src/components/CyberWarMap.tsx - ENHANCED ANIMATIONS
'use client';

import { useEffect, useRef, useState } from "react";

type Props = {
  byRealm: Record<number, number>;
  realmPower?: Record<number, number>;
  onAttackAnimation?: (from: number, to: number) => void; // Add callback for attacks
  onPowerUpdate?: (realm: number, delta: number) => void; // Optional power update callback
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

export default function CyberWarMap({ byRealm, realmPower, onAttackAnimation, onPowerUpdate }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [attacks, setAttacks] = useState<Array<{
    from: number,
    to: number,
    progress: number,
    intensity: number,
    type: 'player' | 'bot'
  }>>([]);

  const [showPowerTracker, setShowPowerTracker] = useState(true);
  const [realmStates, setRealmStates] = useState<Record<number, {
    pulse: number;
    hitEffect: number;
    isUnderAttack: boolean;
  }>>({});

  // Initialize realm states
  useEffect(() => {
    const initialStates: Record<number, any> = {};
    for (let i = 1; i <= 8; i++) {
      initialStates[i] = {
        pulse: 0,
        hitEffect: 0,
        isUnderAttack: false
      };
    }
    setRealmStates(initialStates);
  }, []);

  // Default power if not provided
  const powerLevels = realmPower || {
    1: 100, 2: 100, 3: 100, 4: 100, 5: 100, 6: 100, 7: 100, 8: 100
  };

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
    playerAttack: '#00ff9d', // Green for player attacks
    botAttack: '#ff0066',    // Red for bot attacks
    hitEffect: '#ffffff',
    scanner: 'rgba(0, 255, 255, 0.1)'
  };

  // Function to trigger attack animation
  const triggerAttack = (from: number, to: number, type: 'player' | 'bot' = 'bot') => {
    const newAttack = {
      from,
      to,
      progress: 0,
      intensity: type === 'player' ? 1.5 : 1,
      type
    };

    setAttacks(prev => [...prev, newAttack]);

    // Set realm states for animation
    setRealmStates(prev => ({
      ...prev,
      [from]: { ...prev[from], pulse: 1 },
      [to]: { ...prev[to], isUnderAttack: true }
    }));

    // Callback for parent component
    if (type === 'player' && onAttackAnimation) {
      onAttackAnimation(from, to);
    }

    // Apply power updates if a handler is provided (defensive)
    if (type === 'bot' && typeof onPowerUpdate === 'function') {
      try {
        onPowerUpdate(from, 50);  // Bot attacker gains less
        onPowerUpdate(to, -30);   // Bot defender loses less
      } catch (e) {
        // swallow errors from parent handler to keep UI stable
        console.error('onPowerUpdate handler threw', e);
      }
    }
  };




  useEffect(() => {
    // Simulate random bot attacks for demo
    const attackInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const fromRealm = Math.floor(Math.random() * 8) + 1;
        let toRealm = Math.floor(Math.random() * 8) + 1;
        while (toRealm === fromRealm) toRealm = Math.floor(Math.random() * 8) + 1;

        triggerAttack(fromRealm, toRealm, 'bot');
      }
    }, 3000);

    return () => clearInterval(attackInterval);
  }, []);

  // Animation loop for realm states
  useEffect(() => {
    const animationLoop = setInterval(() => {
      setRealmStates(prev => {
        const newStates = { ...prev };

        // Update all realm animations
        Object.keys(newStates).forEach(realm => {
          const realmNum = Number(realm);
          const state = newStates[realmNum];

          // Pulse animation decay
          if (state.pulse > 0) {
            newStates[realmNum] = {
              ...state,
              pulse: Math.max(0, state.pulse - 0.05)
            };
          }

          // Hit effect decay
          if (state.hitEffect > 0) {
            newStates[realmNum] = {
              ...state,
              hitEffect: Math.max(0, state.hitEffect - 0.1)
            };
          }
        });

        return newStates;
      });
    }, 50); // 20 FPS

    return () => clearInterval(animationLoop);
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

    // Enhanced Grid lines with glow
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
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
    ctx.globalAlpha = 1;

    // Scanner effect
    const time = Date.now() * 0.002;
    const scannerY = (time * 20) % height;
    const scannerGradient = ctx.createLinearGradient(0, scannerY - 50, 0, scannerY + 50);
    scannerGradient.addColorStop(0, 'transparent');
    scannerGradient.addColorStop(0.5, COLORS.scanner);
    scannerGradient.addColorStop(1, 'transparent');

    ctx.fillStyle = scannerGradient;
    ctx.fillRect(0, scannerY - 50, width, 100);

    // Draw attack beams with enhanced effects
    attacks.forEach((attack, index) => {
      const fromPos = REALM_POSITIONS[attack.from - 1];
      const toPos = REALM_POSITIONS[attack.to - 1];

      if (!fromPos || !toPos) return;

      const progress = attack.progress + 0.03 * attack.intensity;

      // Complete attack
      if (progress >= 1) {
        // Trigger hit effect on target
        setRealmStates(prev => ({
          ...prev,
          [attack.to]: {
            ...prev[attack.to],
            hitEffect: 1,
            isUnderAttack: false
          }
        }));

        setAttacks(prev => prev.filter((_, i) => i !== index));
        return;
      }

      const currentX = fromPos.x + (toPos.x - fromPos.x) * progress;
      const currentY = fromPos.y + (toPos.y - fromPos.y) * progress;

      // Enhanced beam with multiple layers
      const beamColor = attack.type === 'player' ? COLORS.playerAttack : COLORS.botAttack;

      // Beam core (bright center)
      const coreGradient = ctx.createLinearGradient(fromPos.x, fromPos.y, currentX, currentY);
      coreGradient.addColorStop(0, beamColor + 'FF');
      coreGradient.addColorStop(1, beamColor + '80');

      ctx.strokeStyle = coreGradient;
      ctx.lineWidth = 4 * attack.intensity;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(fromPos.x, fromPos.y);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();

      // Beam glow (outer layer)
      const glowGradient = ctx.createLinearGradient(fromPos.x, fromPos.y, currentX, currentY);
      glowGradient.addColorStop(0, beamColor + '60');
      glowGradient.addColorStop(1, beamColor + '20');

      ctx.strokeStyle = glowGradient;
      ctx.lineWidth = 8 * attack.intensity;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      ctx.moveTo(fromPos.x, fromPos.y);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();

      // Energy particles along the beam
      ctx.fillStyle = beamColor;
      for (let i = 0; i < 3; i++) {
        const particleProgress = (progress - i * 0.1) % 1;
        if (particleProgress > 0 && particleProgress < 0.9) {
          const particleX = fromPos.x + (toPos.x - fromPos.x) * particleProgress;
          const particleY = fromPos.y + (toPos.y - fromPos.y) * particleProgress;

          ctx.beginPath();
          ctx.arc(particleX, particleY, 2 * attack.intensity, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.setLineDash([]);

      // Update progress
      setAttacks(prev => prev.map((a, i) =>
        i === index ? { ...a, progress } : a
      ));
    });

    // Draw realms with enhanced animations
    REALM_POSITIONS.forEach((position, index) => {
      const realmNumber = index + 1;
      const activityCount = byRealm[realmNumber] ?? 0;
      const power = powerLevels[realmNumber] || 100;
      const realmState = realmStates[realmNumber] || { pulse: 0, hitEffect: 0, isUnderAttack: false };

      // Enhanced visual properties with animations
      const powerIntensity = Math.min(1, power / 200);
      const baseRadius = 25 + (power / 20);
      const naturalPulse = Math.sin(Date.now() * 0.005 + index) * 3;
      const attackPulse = realmState.pulse * 8; // Pulsing when attacking
      const hitShake = realmState.hitEffect * 3; // Shaking when hit

      const totalPulse = naturalPulse + attackPulse;
      const shakeX = (Math.random() - 0.5) * hitShake;
      const shakeY = (Math.random() - 0.5) * hitShake;

      // Hit effect glow (white flash when hit)
      if (realmState.hitEffect > 0) {
        const hitGlow = ctx.createRadialGradient(
          position.x, position.y, 0,
          position.x, position.y, baseRadius + 30
        );
        hitGlow.addColorStop(0, COLORS.hitEffect + Math.floor(realmState.hitEffect * 80).toString(16).padStart(2, '0'));
        hitGlow.addColorStop(1, COLORS.hitEffect + '00');

        ctx.beginPath();
        ctx.fillStyle = hitGlow;
        ctx.arc(position.x, position.y, baseRadius + 30, 0, Math.PI * 2);
        ctx.fill();
      }

      // Energy aura based on POWER and under-attack state
      if (power > 50 || realmState.isUnderAttack) {
        const auraSize = baseRadius + 20 + powerIntensity * 10 + (realmState.isUnderAttack ? 15 : 0);
        const glow = ctx.createRadialGradient(
          position.x, position.y, baseRadius,
          position.x, position.y, auraSize
        );

        const auraColor = realmState.isUnderAttack ? COLORS.botAttack : COLORS.energyGlow;
        const auraAlpha = Math.floor(40 + powerIntensity * 40 + (realmState.isUnderAttack ? 40 : 0));

        glow.addColorStop(0, auraColor + auraAlpha.toString(16));
        glow.addColorStop(1, auraColor + '00');

        ctx.beginPath();
        ctx.fillStyle = glow;
        ctx.arc(position.x, position.y, auraSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // Outer cyber ring - enhanced with animations
      ctx.beginPath();
      ctx.arc(position.x + shakeX, position.y + shakeY, baseRadius + 5 + totalPulse, 0, Math.PI * 2);

      let ringColor = COLORS.glitchPurple;
      let ringWidth = 2;

      if (power > 150) {
        ringColor = COLORS.neonPink;
        ringWidth = 3;
      } else if (power > 100) {
        ringColor = COLORS.neonTeal;
        ringWidth = 2.5;
      }

      // Pulsing effect for attacking realms
      if (realmState.pulse > 0) {
        ringColor = COLORS.playerAttack;
        ringWidth += realmState.pulse * 3;
      }

      // Under attack effect
      if (realmState.isUnderAttack) {
        ringColor = COLORS.botAttack;
        ctx.setLineDash([4, 4]);
      }

      ctx.strokeStyle = ringColor;
      ctx.lineWidth = ringWidth + powerIntensity;
      ctx.stroke();
      ctx.setLineDash([]);

      // Main realm core - enhanced with hit effects
      const coreGradient = ctx.createRadialGradient(
        position.x - 5 + shakeX, position.y - 5 + shakeY, 0,
        position.x + shakeX, position.y + shakeY, baseRadius
      );
      let coreColors = ['#4b5563', '#374151', '#1f2937']; // Default gray (3 colors)

      if (power > 80) {
        if (power > 150) {
          coreColors = ['#f0abfc', '#d946ef', '#a21caf']; // Pink
        } else if (power > 100) {
          coreColors = ['#93c5fd', '#3b82f6', '#1e40af']; // Blue
        } else {
          coreColors = ['#86efac', '#22c55e', '#15803d']; // Green
        }
      }

      // Dim effect when under attack
      if (realmState.isUnderAttack) {
        ctx.globalAlpha = 0.7;
      }

      coreGradient.addColorStop(0, coreColors[0]);
      coreGradient.addColorStop(0.7, coreColors[1]);
      coreGradient.addColorStop(1, coreColors[2]);

      ctx.beginPath();
      ctx.fillStyle = coreGradient;
      ctx.arc(position.x + shakeX, position.y + shakeY, baseRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Enhanced cyber hex pattern
      ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + powerIntensity * 0.2})`;
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const hexDistance = 12 + powerIntensity * 5 + realmState.pulse * 5;
        const hexX = position.x + Math.cos(angle) * hexDistance + shakeX;
        const hexY = position.y + Math.sin(angle) * hexDistance + shakeY;
        ctx.beginPath();
        ctx.arc(hexX, hexY, 1.5 + powerIntensity, 0, Math.PI * 2);
        ctx.fill();
      }

      // Realm number with enhanced glow
      ctx.fillStyle = power > 50 ? '#ffffff' : '#9ca3af';
      ctx.font = "bold 16px 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      let textGlowColor = COLORS.glitchPurple;
      if (power > 150) textGlowColor = COLORS.neonPink;
      else if (power > 100) textGlowColor = COLORS.neonTeal;

      ctx.shadowColor = textGlowColor;
      ctx.shadowBlur = 5 + powerIntensity * 10 + realmState.pulse * 15;
      ctx.fillText(`R${realmNumber}`, position.x + shakeX, position.y + shakeY);
      ctx.shadowBlur = 0;

      // Power level with status indicator
      let statusIndicator = '';
      if (realmState.isUnderAttack) statusIndicator = ' 🔥';
      else if (realmState.pulse > 0) statusIndicator = ' ⚡';

      ctx.fillStyle = power > 150 ? COLORS.neonPink : COLORS.neonTeal;
      ctx.font = "600 12px 'Courier New', monospace";
      ctx.textAlign = "left";
      ctx.fillText(
        `PWR:${power}${statusIndicator}`,
        position.x + baseRadius + 8 + shakeX,
        position.y + shakeY
      );
    });

  }, [byRealm, attacks, powerLevels, realmStates]);

  const totalActivities = Object.values(byRealm).reduce((sum, count) => sum + count, 0);
  const totalPower = Object.values(powerLevels).reduce((sum, power) => sum + power, 0);

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

      {/* Canvas Container - Significantly Larger */}
      <div className="relative bg-black/30 rounded-2xl border-2 border-cyan-500/20 p-6 min-h-[600px]">
        <canvas
          ref={canvasRef}
          className="w-full h-full rounded-lg"
        />

        {/* Enhanced Power Tracker - Now with more space */}
        {showPowerTracker && (
          <div className="absolute top-6 right-6 cyber-tokyo-panel rounded-xl p-5 border border-cyan-500/30 backdrop-blur-sm w-72">
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
              {[1, 2, 3, 4, 5, 6, 7, 8].map(realm => {
                const state = realmStates[realm] || {};
                return (
                  <div key={realm} className="flex justify-between items-center py-1 px-2 rounded hover:bg-cyan-500/10 transition-colors">
                    <span className={`text-slate-300 ${state.isUnderAttack ? 'text-red-400' : ''}`}>
                      R{realm}
                      {state.isUnderAttack && ' 🔥'}
                      {state.pulse > 0 && ' ⚡'}
                    </span>
                    <span className={`font-mono ${powerLevels[realm] > 150 ? 'text-pink-400' :
                        powerLevels[realm] > 100 ? 'text-cyan-400' : 'text-green-400'
                      }`}>
                      {powerLevels[realm]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Enhanced War Legend - More spacious */}
        <div className="absolute bottom-6 left-6 cyber-tokyo-panel rounded-xl p-4 border border-cyan-500/30 backdrop-blur-sm w-64">
          <div className="text-sm text-cyan-300 font-mono mb-3">WAR STATUS</div>
          <div className="space-y-3 text-sm font-mono">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-cyan-400 rounded-full shadow shadow-cyan-400/50"></div>
              <span className="text-white">ACTIVE</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-400 rounded-full shadow shadow-green-400/50"></div>
              <span className="text-white">PLAYER ATTACK</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-red-400 rounded-full shadow shadow-red-400/50"></div>
              <span className="text-white">UNDER ATTACK</span>
            </div>
          </div>
        </div>

        {/* Show Power Tracker Button if hidden - Larger */}
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
    </div>)
}
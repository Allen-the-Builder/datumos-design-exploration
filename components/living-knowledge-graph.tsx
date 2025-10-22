"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Platform {
  id: string;
  name: string;
  logo: string;
  color: string;
  angle: number;
  stats: {
    uptime: string;
    syncErrors: number;
    lastSync: string;
  };
}

interface PlatformCardProps {
  platform: Platform;
  position: { x: number; y: number };
  index: number;
  isExiting: boolean;
}

const platforms: Platform[] = [
  {
    id: "acc",
    name: "Autodesk ACC",
    logo: "/services/autodesk-logo.svg",
    color: "#0696D7",
    angle: 0,
    stats: {
      uptime: "99.8%",
      syncErrors: 0,
      lastSync: "2m ago",
    },
  },
  {
    id: "m365",
    name: "Microsoft 365",
    logo: "/services/ms-sharepoint.svg",
    color: "#0078D4",
    angle: 90,
    stats: {
      uptime: "100%",
      syncErrors: 0,
      lastSync: "5m ago",
    },
  },
  {
    id: "bluebeam",
    name: "Bluebeam",
    logo: "/services/bluebeam.svg",
    color: "#0066CC",
    angle: 180,
    stats: {
      uptime: "98.5%",
      syncErrors: 2,
      lastSync: "1m ago",
    },
  },
  {
    id: "procore",
    name: "Procore",
    logo: "/services/procore.png",
    color: "#FF6900",
    angle: 270,
    stats: {
      uptime: "99.9%",
      syncErrors: 0,
      lastSync: "3m ago",
    },
  },
];

interface LivingKnowledgeGraphProps {
  isExiting?: boolean;
}

function PlatformCard({ platform, position, index, isExiting }: PlatformCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="absolute top-1/2 left-1/2 z-30"
      style={{
        transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
        opacity: isExiting ? 0 : 1,
        transition: `opacity ${isExiting ? '600ms' : '300ms'} ease-out`,
        transitionDelay: isExiting ? `${200 + index * 100}ms` : `${300 + index * 50}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-white rounded-xl border-2 border-gray-300 shadow-2xl p-3 w-32 hover:scale-110 transition-all cursor-default pointer-events-auto">
        {/* Service logo */}
        <div className="flex justify-center mb-2 h-10 items-center">
          <div className="relative w-20 h-10">
            <Image
              src={platform.logo}
              alt={platform.name}
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Platform name */}
        <div className="text-center">
          <div
            className="text-xs font-bold tracking-tight leading-tight"
            style={{ color: platform.color }}
          >
            {platform.name}
          </div>
        </div>

        {/* Connection status indicator */}
        <div
          className="absolute -top-2 -right-2 w-4 h-4 rounded-full border-2 border-white shadow-lg"
          style={{
            backgroundColor: '#10b981',
            animation: `pulse 2s ease-in-out infinite`,
            animationDelay: `${platform.angle / 360}s`,
          }}
        />

        {/* Hover glow effect */}
        <div
          className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            boxShadow: `0 0 20px ${platform.color}40`,
          }}
        />

        {/* Tooltip with health stats */}
        {isHovered && (
          <div
            className="absolute left-1/2 -translate-x-1/2 mt-2 bg-gray-900 text-white rounded-lg shadow-xl p-3 w-40 z-50"
            style={{
              top: '100%',
            }}
          >
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-gray-400">Uptime</span>
                <span className="text-white font-semibold">{platform.stats.uptime}</span>
              </div>
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-gray-400">Errors</span>
                <span className={platform.stats.syncErrors > 0 ? "text-orange-400 font-semibold" : "text-green-400 font-semibold"}>
                  {platform.stats.syncErrors}
                </span>
              </div>
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-gray-400">Last sync</span>
                <span className="text-white font-semibold">{platform.stats.lastSync}</span>
              </div>
            </div>
            {/* Tooltip arrow */}
            <div
              className="absolute left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-gray-900"
              style={{
                top: '-8px',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function LivingKnowledgeGraph({ isExiting = false }: LivingKnowledgeGraphProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.2) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getNodePosition = (angle: number, radius: number) => {
    const angleInRadians = ((angle + rotation) * Math.PI) / 180;
    return {
      x: Math.cos(angleInRadians) * radius,
      y: Math.sin(angleInRadians) * radius,
    };
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-1000 ease-out"
      style={{
        transform: isExiting ? 'scale(2.5)' : 'scale(1)',
        opacity: isExiting ? 0 : 1,
      }}
    >
      <div className="relative w-[900px] h-[650px]">
        {/* Central hub */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-700 ease-out"
          style={{
            opacity: isExiting ? 0 : 1,
            transitionDelay: isExiting ? '0ms' : '100ms',
          }}
        >
          <div className="relative w-36 h-36">
            {/* Animated outer rings */}
            <div
              className="absolute inset-0 rounded-full border-2 border-gray-300"
              style={{
                transform: `scale(${1 + Math.sin(rotation * 0.05) * 0.1})`,
                opacity: 0.4,
                transition: "transform 0.3s ease-out",
              }}
            />
            <div
              className="absolute inset-2 rounded-full border-2 border-gray-300"
              style={{
                transform: `scale(${1 + Math.cos(rotation * 0.05) * 0.1})`,
                opacity: 0.3,
                transition: "transform 0.3s ease-out",
              }}
            />

            {/* Inner circle */}
            <div className="absolute inset-5 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 border-3 border-gray-300 flex items-center justify-center shadow-xl">
              <div className="text-center">
                <div className="text-sm font-bold text-gray-700 tracking-tight">DatumOS</div>
                <div className="text-xs font-mono text-gray-500 mt-1">Knowledge Hub</div>
              </div>
            </div>

            {/* Connection pulse effect */}
            <div
              className="absolute inset-0 rounded-full border-2 border-blue-400"
              style={{
                opacity: 0.3 + Math.sin(rotation * 0.1) * 0.2,
                transform: `scale(${1.5 + Math.sin(rotation * 0.1) * 0.2})`,
                transition: "all 0.3s ease-out",
              }}
            />
          </div>
        </div>

        {/* SVG for edges */}
        <svg
          className="absolute inset-0 w-full h-full transition-opacity duration-600 ease-out"
          style={{
            zIndex: 10,
            opacity: isExiting ? 0 : 0.4,
            transitionDelay: isExiting ? '100ms' : '200ms',
          }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="8"
              refX="7"
              refY="4"
              orient="auto"
            >
              <path d="M0,0 L0,8 L8,4 z" fill="#6b7280" opacity="0.6" />
            </marker>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {platforms.map((platform) => {
            const pos = getNodePosition(platform.angle, 270);
            const centerX = 450;
            const centerY = 325;

            return (
              <g key={`edge-${platform.id}`}>
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={centerX + pos.x}
                  y2={centerY + pos.y}
                  stroke="#6b7280"
                  strokeWidth="1"
                  strokeDasharray="8,4"
                  opacity={0.6}
                  markerEnd="url(#arrowhead)"
                />
              </g>
            );
          })}
        </svg>

        {/* Platform nodes */}
        {platforms.map((platform, index) => {
          const pos = getNodePosition(platform.angle, 270);
          return (
            <PlatformCard
              key={platform.id}
              platform={platform}
              position={pos}
              index={index}
              isExiting={isExiting}
            />
          );
        })}

        {/* Descriptive text */}
        <div
          className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-center transition-all duration-500 ease-out"
          style={{
            opacity: isExiting ? 0 : 1,
            transitionDelay: isExiting ? '0ms' : '400ms',
          }}
        >
          <div className="text-base font-semibold text-gray-400 tracking-tight mb-1">
            Living Knowledge Graph
          </div>
          <div className="text-xs font-mono text-gray-300">
            Connected • Synchronized • Real-time
          </div>
        </div>
      </div>

      {/* Global pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.3);
          }
        }
      `}</style>
    </div>
  );
}

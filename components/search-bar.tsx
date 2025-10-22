"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  isActive: boolean;
}

export function SearchBar({ value, onChange, isActive }: SearchBarProps) {
  return (
    <div
      className={cn(
        "relative w-[600px] transition-all duration-300",
        isActive ? "scale-105" : "scale-100"
      )}
    >
      <div className="relative bg-white rounded-lg shadow-2xl border border-gray-200 p-1">
        <div className="flex items-center gap-3 px-4 py-2">
          <Search className="w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search across connected platforms..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base font-mono tracking-tight placeholder:text-gray-400 shadow-none"
          />
        </div>
      </div>

      {!isActive && (
        <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-full">
          <div className="text-center text-xs font-mono text-gray-400 space-y-1">
            <p>Start typing to explore your connected data</p>
            <p className="text-gray-300">ACC • M365 • Bluebeam • More</p>
          </div>
        </div>
      )}
    </div>
  );
}

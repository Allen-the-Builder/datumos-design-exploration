"use client";

import { useMemo } from "react";
import { FileText, Users, Folder, AlertCircle } from "lucide-react";

interface SearchResultsProps {
  searchQuery: string;
}

interface ResultCard {
  id: string;
  title: string;
  type: string;
  platform: string;
  icon: React.ReactNode;
  metadata: string;
}

const mockResults = (query: string): ResultCard[] => {
  if (query.length < 2) return [];

  return [
    {
      id: "1",
      title: `Project ${query} - Construction Documentation`,
      type: "Project",
      platform: "ACC",
      icon: <Folder className="w-4 h-4" />,
      metadata: "Updated 2h ago • 24 files",
    },
    {
      id: "2",
      title: `RFI-${query}-2024 Response Required`,
      type: "RFI",
      platform: "Bluebeam",
      icon: <AlertCircle className="w-4 h-4" />,
      metadata: "Due in 3 days • Assigned to you",
    },
    {
      id: "3",
      title: `Meeting Notes - ${query} Discussion`,
      type: "Document",
      platform: "M365",
      icon: <FileText className="w-4 h-4" />,
      metadata: "Last edited yesterday • Shared with 5",
    },
    {
      id: "4",
      title: `Team ${query} - Engineering Group`,
      type: "Team",
      platform: "ACC",
      icon: <Users className="w-4 h-4" />,
      metadata: "12 members • 3 active projects",
    },
  ];
};

export function SearchResults({ searchQuery }: SearchResultsProps) {
  const results = useMemo(() => mockResults(searchQuery), [searchQuery]);

  if (results.length === 0) return null;

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 w-[800px]">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-tight">
              Search Results
            </h3>
            <span className="text-xs font-mono text-gray-500">
              {results.length} items found
            </span>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-2 gap-px bg-gray-200 max-h-[400px] overflow-y-auto">
          {results.map((result) => (
            <div
              key={result.id}
              className="bg-white p-4 hover:bg-gray-50 cursor-pointer transition-colors group"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 rounded-md bg-gray-100 text-gray-600 group-hover:bg-gray-200 transition-colors">
                  {result.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium tracking-tight truncate group-hover:text-gray-900">
                    {result.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                      {result.platform}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{result.type}</span>
                  </div>
                  <p className="text-xs font-mono text-gray-400 mt-2">
                    {result.metadata}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <p className="text-xs font-mono text-gray-500 text-center">
            Press <kbd className="px-1.5 py-0.5 rounded bg-gray-200 text-gray-700">↑</kbd>{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-gray-200 text-gray-700">↓</kbd> to navigate •{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-gray-200 text-gray-700">Enter</kbd> to open
          </p>
        </div>
      </div>
    </div>
  );
}

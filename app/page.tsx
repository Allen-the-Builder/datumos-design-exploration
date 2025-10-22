"use client";

import { InfiniteCanvas } from "@/components/infinite-canvas";
import { SearchBar } from "@/components/search-bar";
import { KnowledgeGraph } from "@/components/knowledge-graph";
import { SearchResults } from "@/components/search-results";
import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setIsSearchActive(query.length > 0);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* Infinite Canvas Background */}
      <InfiniteCanvas />

      {/* Floating Search Bar */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50">
        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          isActive={isSearchActive}
        />
      </div>

      {/* Knowledge Graph Visualization */}
      {isSearchActive && (
        <div className="absolute inset-0 pointer-events-none">
          <KnowledgeGraph searchQuery={searchQuery} />
        </div>
      )}

      {/* Search Results */}
      {isSearchActive && (
        <SearchResults searchQuery={searchQuery} />
      )}
    </main>
  );
}

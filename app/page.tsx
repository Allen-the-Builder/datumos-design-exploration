"use client";

import { InfiniteCanvas } from "@/components/infinite-canvas";
import { SearchBar } from "@/components/search-bar";
import { KnowledgeGraph } from "@/components/knowledge-graph";
import { LivingKnowledgeGraph } from "@/components/living-knowledge-graph";
// import { SearchResults } from "@/components/search-results"; // Hidden in Scheme 2
import { useState, useEffect } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showLivingGraph, setShowLivingGraph] = useState(true);
  const [isLivingGraphExiting, setIsLivingGraphExiting] = useState(false);
  const [isLivingGraphEntering, setIsLivingGraphEntering] = useState(false);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    const isActive = query.length > 0;

    if (isActive && !isSearchActive) {
      // User just started typing - trigger exit animation
      setIsLivingGraphExiting(true);
      setIsLivingGraphEntering(false);
      // Remove living graph after animation completes
      setTimeout(() => {
        setShowLivingGraph(false);
        setIsSearchActive(true);
      }, 1000);
    } else if (!isActive && isSearchActive) {
      // User cleared search - bring back living graph with entrance animation
      setIsSearchActive(false);
      setShowLivingGraph(true);
      setIsLivingGraphExiting(false);
      setIsLivingGraphEntering(true);
      // Remove entering state after animation completes
      setTimeout(() => {
        setIsLivingGraphEntering(false);
      }, 1000);
    }
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

      {/* Living Knowledge Graph - Shows when no search */}
      {showLivingGraph && (
        <div className="absolute inset-0">
          <LivingKnowledgeGraph
            isExiting={isLivingGraphExiting}
            isEntering={isLivingGraphEntering}
          />
        </div>
      )}

      {/* Knowledge Graph Visualization - Shows during search */}
      {isSearchActive && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700 ease-in"
          style={{
            opacity: isSearchActive ? 1 : 0,
          }}
        >
          <KnowledgeGraph searchQuery={searchQuery} />
        </div>
      )}

      {/* Search Results - Hidden in Scheme 2 */}
      {/* {isSearchActive && (
        <SearchResults searchQuery={searchQuery} />
      )} */}
    </main>
  );
}

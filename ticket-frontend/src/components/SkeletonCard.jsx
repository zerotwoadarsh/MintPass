import React from "react";

export const SkeletonCard = () => {
    return (
      <div className="bg-gray-200/50 rounded-xl overflow-hidden shadow-lg border border-gray-700/50">
        <div className="w-full h-48 bg-gray-400 animate-pulse"></div>
        <div className="p-6">
          <div className="h-6 w-3/4 bg-gray-400 rounded animate-pulse mb-4"></div>
          <div className="h-4 w-1/2 bg-gray-400 rounded animate-pulse mb-6"></div>
          <div className="flex items-center justify-between">
            <div className="h-6 w-1/4 bg-gray-400 rounded animate-pulse"></div>
            <div className="h-10 w-1/3 bg-gray-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  };
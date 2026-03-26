import React from "react";

export default function SkeletonCard({ index }) {
  const lineOneWidth = index % 3 === 0 ? "w-4/5" : "w-3/4";
  const lineTwoWidth = index % 3 === 1 ? "w-full" : "w-1/2";

  return (
    <div className="bg-gray-200 rounded-xl p-5 shadow-lg border border-gray-300 animate-pulse h-48">
      <div className="bg-gray-300 h-8 w-8 rounded-full mb-4"></div>
      <div className={`bg-gray-300 h-5 rounded mb-3 ${lineOneWidth}`}></div>
      <div className="space-y-2 mt-4">
        <div className="bg-gray-300 h-3 rounded w-full"></div>
        <div className={`bg-gray-300 h-3 rounded ${lineTwoWidth}`}></div>
      </div>
    </div>
  );
}
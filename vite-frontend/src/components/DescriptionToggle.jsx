"use client";
import React, { useState } from "react";

export function DescriptionToggle({ description }) {
  const MAX = 50;
  const [expanded, setExpanded] = useState(false);

  const isLong = description.length > MAX;
  const preview = description.slice(0, MAX);

  return (
    <p className="text-sm text-gray-700 leading-relaxed">
      {expanded || !isLong ? description : `${preview}...`}
      {isLong && (
        <span
          onClick={() => setExpanded((s) => !s)}
          aria-expanded={expanded}
          className="ml-1 text-blue-600 hover:text-blue-800 cursor-pointer underline"
        >
          {expanded ? "Show less" : "Load more"}
        </span>
      )}
    </p>
  );
}

"use client";

import type { Source } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";

interface SourceItemProps {
  source: Source;
  index: number;
}

export function SourceItem({ source, index }: SourceItemProps) {
  return (
    <div className="py-2">
      <h4 className="font-semibold text-sm mb-1">
        [{index + 1}] {source.title}
      </h4>
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-primary hover:underline break-all flex items-center gap-1"
      >
        <Link2 className="w-3 h-3"/>
        {source.url}
      </a>
    </div>
  );
}

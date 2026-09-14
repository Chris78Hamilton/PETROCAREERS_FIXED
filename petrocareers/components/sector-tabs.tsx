"use client"

import { SECTORS, Sector } from "@/lib/types"

interface SectorTabsProps {
  sector: Sector
  onSectorChange: (sector: Sector) => void
}

export function SectorTabs({ sector, onSectorChange }: SectorTabsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8" role="tablist" aria-label="Job sector">
      {SECTORS.map((s) => {
        const isActive = s.id === sector
        return (
          <button
            key={s.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSectorChange(s.id)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
            }`}
          >
            {s.tabLabel}
          </button>
        )
      })}
    </div>
  )
}

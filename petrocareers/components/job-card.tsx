"use client"

import { MapPin, Briefcase, DollarSign, Clock, Anchor, Mountain, RotateCw, Plane, Zap } from "lucide-react"
import { Job } from "@/lib/types"

interface JobCardProps {
  job: Job
  onClick: () => void
}

export function JobCard({ job, onClick }: JobCardProps) {
  const getCompanyColor = (company: string) => {
    const colors: Record<string, string> = {
      Shell: "bg-yellow-600",
      BP: "bg-green-600",
      "Saudi Aramco": "bg-green-700",
      Aramco: "bg-green-700",
      ADNOC: "bg-blue-600",
      SLB: "bg-blue-500",
      Schlumberger: "bg-blue-500",
      Halliburton: "bg-red-600",
      TotalEnergies: "bg-red-500",
      Chevron: "bg-blue-700",
      ExxonMobil: "bg-red-700",
      "Baker Hughes": "bg-emerald-600",
      Weatherford: "bg-orange-600",
      NOV: "bg-purple-600",
      Petrobras: "bg-green-500",
      ONGC: "bg-orange-500",
      Equinor: "bg-teal-600",
    }
    
    for (const [key, value] of Object.entries(colors)) {
      if (company.toLowerCase().includes(key.toLowerCase())) {
        return value
      }
    }
    return "bg-primary"
  }

  return (
    <div
      onClick={onClick}
      className="bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-lg ${getCompanyColor(job.company)} flex items-center justify-center text-white font-bold text-sm`}>
              {job.company.charAt(0)}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {job.title}
              </h3>
              <p className="text-sm text-muted-foreground">{job.company}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              {job.salary}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" />
              {job.contractType}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {job.isOffshore && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent/20 text-accent text-xs rounded-md">
                <Anchor className="w-3 h-3" />
                Offshore
              </span>
            )}
            {job.isOnshore && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-success/20 text-success text-xs rounded-md">
                <Mountain className="w-3 h-3" />
                Onshore
              </span>
            )}
            {job.isRotation && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-warning/20 text-warning text-xs rounded-md">
                <RotateCw className="w-3 h-3" />
                Rotation
              </span>
            )}
            {job.hasExpatPackage && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/20 text-primary text-xs rounded-md">
                <Plane className="w-3 h-3" />
                Expat Package
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-success/20 rounded-full">
            <Zap className="w-3 h-3 text-success" />
            <span className="text-xs font-medium text-success">Live</span>
          </div>
          
          {job.matchScore !== undefined && (
            <div className={`px-3 py-1.5 rounded-lg text-center ${
              job.matchScore >= 80 ? "bg-success/20 text-success" :
              job.matchScore >= 60 ? "bg-warning/20 text-warning" :
              "bg-muted text-muted-foreground"
            }`}>
              <div className="text-lg font-bold">{job.matchScore}%</div>
              <div className="text-xs">Match</div>
            </div>
          )}
          
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {job.postedDate}
          </span>
        </div>
      </div>
    </div>
  )
}

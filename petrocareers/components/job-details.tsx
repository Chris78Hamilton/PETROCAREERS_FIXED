"use client"

import {
  X,
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  Globe,
  Users,
  GraduationCap,
  CheckCircle,
  Gift,
  Zap,
  ExternalLink
} from "lucide-react"
import { Job, TAG_META, getCompanyColor } from "@/lib/types"
import { getTagIcon } from "@/lib/tag-icon"

interface JobDetailsProps {
  job: Job
  onClose: () => void
}

export function JobDetails({ job, onClose }: JobDetailsProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl ${getCompanyColor(job.company)} flex items-center justify-center text-white font-bold text-xl`}>
                {job.company.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{job.title}</h2>
                <p className="text-muted-foreground">{job.company}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-success/20 rounded-full">
              <Zap className="w-3 h-3 text-success" />
              <span className="text-xs font-medium text-success">Live</span>
            </div>
            {job.matchScore !== undefined && (
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                job.matchScore >= 80 ? "bg-success/20 text-success" :
                job.matchScore >= 60 ? "bg-warning/20 text-warning" :
                "bg-muted text-muted-foreground"
              }`}>
                {job.matchScore}% Match
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Key Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wide">Location</span>
              </div>
              <p className="font-medium text-foreground">{job.location}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wide">Salary</span>
              </div>
              <p className="font-medium text-foreground">{job.salary}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Briefcase className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wide">Contract</span>
              </div>
              <p className="font-medium text-foreground">{job.contractType}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <GraduationCap className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wide">Experience</span>
              </div>
              <p className="font-medium text-foreground">{job.experienceLevel}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Globe className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wide">Region</span>
              </div>
              <p className="font-medium text-foreground">{job.region}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wide">Nationality</span>
              </div>
              <p className="font-medium text-foreground">{job.nationalityRequirement || "Any"}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {job.tags?.map((tagId) => {
              const meta = TAG_META[tagId]
              if (!meta) return null
              const Icon = getTagIcon(meta.icon)
              return (
                <span
                  key={tagId}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg ${meta.className}`}
                >
                  <Icon className="w-4 h-4" />
                  {meta.label}
                </span>
              )
            })}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-secondary-foreground text-sm rounded-lg">
              <Clock className="w-4 h-4" />
              Posted {job.postedDate}
            </span>
          </div>

          {/* Match Reasons */}
          {job.matchReasons && job.matchReasons.length > 0 && (
            <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Why You Match
              </h3>
              <ul className="space-y-2">
                {job.matchReasons.map((reason, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3">Job Description</h3>
            <p className="text-muted-foreground leading-relaxed">{job.description}</p>
          </div>

          {/* Requirements */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              Requirements
            </h3>
            <ul className="space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2 text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Gift className="w-4 h-4 text-success" />
              Benefits
            </h3>
            <ul className="space-y-2">
              {job.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-success mt-2 flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border p-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
            >
              Close
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors">
              Apply Now
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

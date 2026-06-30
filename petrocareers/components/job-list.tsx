"use client"

import { useState } from "react"
import { Briefcase, TrendingUp } from "lucide-react"
import { Job } from "@/lib/types"
import { JobCard } from "./job-card"
import { JobDetails } from "./job-details"

interface JobListProps {
  jobs: Job[]
  isLoading: boolean
  hasSearched: boolean
}

export function JobList({ jobs, isLoading, hasSearched }: JobListProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [sortBy, setSortBy] = useState<"relevance" | "match" | "date" | "salary">("relevance")

  const sortedJobs = [...jobs].sort((a, b) => {
    switch (sortBy) {
      case "match":
        return (b.matchScore || 0) - (a.matchScore || 0)
      case "date":
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      case "salary":
        const getSalaryValue = (salary: string) => {
          const match = salary.match(/[\d,]+/)
          return match ? parseInt(match[0].replace(/,/g, "")) : 0
        }
        return getSalaryValue(b.salary) - getSalaryValue(a.salary)
      default:
        return 0
    }
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-32 bg-secondary rounded animate-pulse" />
          <div className="h-9 w-40 bg-secondary rounded animate-pulse" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-5 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-secondary rounded-lg" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-3/4 bg-secondary rounded" />
                <div className="h-4 w-1/2 bg-secondary rounded" />
                <div className="flex gap-2">
                  <div className="h-6 w-20 bg-secondary rounded-full" />
                  <div className="h-6 w-24 bg-secondary rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!hasSearched) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Find Your Next Opportunity</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Use the filters above to search for oil and gas jobs from top companies worldwide. 
          Upload your CV for AI-powered job matching.
        </p>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No Jobs Found</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Try adjusting your filters or search criteria to find more opportunities.
        </p>
      </div>
    )
  }

  const hasMatchScores = jobs.some(job => job.matchScore !== undefined)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{jobs.length}</span> jobs found
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="h-9 px-3 rounded-md border border-input bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="relevance">Relevance</option>
            {hasMatchScores && <option value="match">Match Score</option>}
            <option value="date">Date Posted</option>
            <option value="salary">Salary</option>
          </select>
        </div>
      </div>

      {hasMatchScores && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-sm text-foreground">
            AI matching enabled - jobs are scored based on your CV
          </span>
        </div>
      )}

      <div className="space-y-4">
        {sortedJobs.map((job) => (
          <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
        ))}
      </div>

      {selectedJob && (
        <JobDetails job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  )
}

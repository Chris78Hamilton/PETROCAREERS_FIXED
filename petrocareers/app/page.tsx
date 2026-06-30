"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"
import { Header } from "@/components/header"
import { JobFilters } from "@/components/job-filters"
import { JobList } from "@/components/job-list"
import { Filters, Job } from "@/lib/types"

const initialFilters: Filters = {
  field: "",
  country: "",
  region: "",
  nationality: "",
  experience: "",
  contractType: "",
  salaryMin: 0,
  salaryMax: 500000,
  quickTags: [],
  cvContent: undefined,
}

export default function Home() {
  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSearch = async () => {
    setIsLoading(true)
    setHasSearched(true)
    setErrorMessage(null)
    
    try {
      // Generate jobs
      const jobsResponse = await fetch("/api/generate-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      })
      
      if (!jobsResponse.ok) {
        const errData = await jobsResponse.json().catch(() => ({}))
        throw new Error(errData.error || "Failed to generate jobs")
      }
      
      const jobsData = await jobsResponse.json()
      let generatedJobs: Job[] = jobsData.jobs || []
      
      // If CV content exists, get match scores
      if (filters.cvContent && generatedJobs.length > 0) {
        const matchResponse = await fetch("/api/match-cv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cvContent: filters.cvContent,
            jobs: generatedJobs,
          }),
        })
        
        if (matchResponse.ok) {
          const matchData = await matchResponse.json()
          
          // Merge match scores into jobs
          generatedJobs = generatedJobs.map((job) => {
            const match = matchData.matches?.find((m: { jobId: string }) => m.jobId === job.id)
            if (match) {
              return {
                ...job,
                matchScore: match.matchScore,
                matchReasons: match.matchReasons,
              }
            }
            return job
          })
        }
      }
      
      setJobs(generatedJobs)
    } catch (error) {
      console.error("Search error:", error)
      setJobs([])
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong while searching for jobs."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Find Your Next <span className="text-primary">Oil & Gas</span> Career
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Search through live job opportunities from industry leaders like Shell, BP, Aramco, 
            ADNOC, SLB, Halliburton, and more. Upload your CV for AI-powered job matching.
          </p>
        </div>
        
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">2,500+</div>
            <div className="text-sm text-muted-foreground">Active Jobs</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">150+</div>
            <div className="text-sm text-muted-foreground">Companies</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">45+</div>
            <div className="text-sm text-muted-foreground">Countries</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">50K+</div>
            <div className="text-sm text-muted-foreground">Placements</div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="mb-8">
          <JobFilters
            filters={filters}
            onFiltersChange={setFilters}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </div>
        
        {/* Error Banner */}
        {errorMessage && !isLoading && (
          <div
            role="alert"
            className="mb-8 flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div className="text-sm">
              <p className="font-semibold text-foreground">Unable to load jobs</p>
              <p className="text-muted-foreground">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Job Listings */}
        <JobList 
          jobs={jobs} 
          isLoading={isLoading} 
          hasSearched={hasSearched}
        />
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Petrocareers 2026. Connecting talent with opportunity in the energy sector.
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

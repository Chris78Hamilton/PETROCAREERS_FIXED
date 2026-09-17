"use client"

import { useState, useRef } from "react"
import { Search, Upload, X, FileText } from "lucide-react"
import {
  Filters,
  COUNTRIES,
  COUNTRIES_WITH_REAL_DATA,
  REGIONS,
  REGIONS_WITH_REAL_DATA,
  EXPERIENCE_LEVELS,
  CONTRACT_TYPES,
  SECTOR_CONFIG,
} from "@/lib/types"

interface JobFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  onSearch: () => void
  isLoading: boolean
}

export function JobFilters({ filters, onFiltersChange, onSearch, isLoading }: JobFiltersProps) {
  const sectorConfig = SECTOR_CONFIG[filters.sector]
  const professionalFields = sectorConfig.professionalFields
  const quickTags = sectorConfig.quickTags
  const [cvFileName, setCvFileName] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFilterChange = (key: keyof Filters, value: string | number | string[]) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const handleQuickTagToggle = (tagId: string) => {
    const currentTags = filters.quickTags || []
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter((t) => t !== tagId)
      : [...currentTags, tagId]
    handleFilterChange("quickTags", newTags)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCvFileName(file.name)
    
    const text = await file.text()
    handleFilterChange("cvContent", text)
  }

  const clearCV = () => {
    setCvFileName("")
    handleFilterChange("cvContent", "")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Search Filters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Professional Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Professional Field</label>
          <select
            value={filters.field}
            onChange={(e) => handleFilterChange("field", e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-input bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {professionalFields.map((field) => (
              <option key={field} value={field === "All Fields" ? "" : field}>
                {field}
              </option>
            ))}
          </select>
        </div>

        {/* Country */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Country</label>
          <select
            value={filters.country}
            onChange={(e) => handleFilterChange("country", e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-input bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {COUNTRIES.map((country) => {
              const hasRealData = country === "All Countries" || COUNTRIES_WITH_REAL_DATA.includes(country)
              return (
                <option key={country} value={country === "All Countries" ? "" : country}>
                  {country}
                  {hasRealData ? "" : " (no real listings yet)"}
                </option>
              )
            })}
          </select>
        </div>

        {/* Region */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Region</label>
          <select
            value={filters.region}
            onChange={(e) => handleFilterChange("region", e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-input bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {REGIONS.map((region) => {
              const hasRealData = region === "All Regions" || REGIONS_WITH_REAL_DATA.includes(region)
              return (
                <option key={region} value={region === "All Regions" ? "" : region}>
                  {region}
                  {hasRealData ? "" : " (no real listings yet)"}
                </option>
              )
            })}
          </select>
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Experience Level</label>
          <select
            value={filters.experience}
            onChange={(e) => handleFilterChange("experience", e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-input bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {EXPERIENCE_LEVELS.map((level) => (
              <option key={level} value={level === "All Levels" ? "" : level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* Contract Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Contract Type</label>
          <select
            value={filters.contractType}
            onChange={(e) => handleFilterChange("contractType", e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-input bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {CONTRACT_TYPES.map((type) => (
              <option key={type} value={type === "All Types" ? "" : type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Salary Min */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Min Salary (USD)</label>
          <input
            type="number"
            value={filters.salaryMin}
            onChange={(e) => handleFilterChange("salaryMin", parseInt(e.target.value) || 0)}
            placeholder="0"
            className="w-full h-10 px-3 rounded-md border border-input bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Salary Max */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Max Salary (USD)</label>
          <input
            type="number"
            value={filters.salaryMax}
            onChange={(e) => handleFilterChange("salaryMax", parseInt(e.target.value) || 500000)}
            placeholder="500000"
            className="w-full h-10 px-3 rounded-md border border-input bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Quick Tags */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Quick Filters</label>
        <div className="flex flex-wrap gap-2">
          {quickTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => handleQuickTagToggle(tag.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filters.quickTags?.includes(tag.id)
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* CV Upload */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Upload CV for AI Matching</label>
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
            id="cv-upload"
          />
          <label
            htmlFor="cv-upload"
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span className="text-sm">Upload CV</span>
          </label>
          {cvFileName && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/20 rounded-md">
              <FileText className="w-4 h-4 text-accent" />
              <span className="text-sm text-foreground">{cvFileName}</span>
              <button onClick={clearCV} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Upload your CV to get AI-powered match scores for each job listing
        </p>
      </div>

      {/* Search Button */}
      <div className="pt-2">
        <button
          onClick={onSearch}
          disabled={isLoading}
          className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Search Jobs
            </>
          )}
        </button>
      </div>
    </div>
  )
}

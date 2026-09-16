import { SECTOR_CONFIG, Sector, Job } from "@/lib/types"

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY

// Countries Adzuna's public search API actually covers, mapped from our
// filter's display names to Adzuna's country codes. Most of the Middle
// East, most of Africa, Norway, Ireland, Denmark, Malaysia, and Indonesia
// are NOT covered by Adzuna — searches for those fall back to a notice
// rather than silently showing nothing or (worse) invented listings.
const ADZUNA_COUNTRY_CODES: Record<string, string> = {
  "United States": "us",
  "United Kingdom": "gb",
  Australia: "au",
  Brazil: "br",
  Mexico: "mx",
  Canada: "ca",
  Netherlands: "nl",
  Singapore: "sg",
  India: "in",
  Germany: "de",
  France: "fr",
}

const COUNTRY_NAME_BY_CODE: Record<string, string> = Object.fromEntries(
  Object.entries(ADZUNA_COUNTRY_CODES).map(([name, code]) => [code, name])
)

const SUPPORTED_COUNTRY_LIST = Object.keys(ADZUNA_COUNTRY_CODES).join(", ")

// Default markets to search when no country filter is applied — kept to two
// calls per search to stay well within a free-tier Adzuna quota.
const DEFAULT_COUNTRY_CODES = ["gb", "us"]

interface SectorSearchConfig {
  category?: string
  whatOr: string[]
}

// Adzuna's own category taxonomy only has real matches for two of our five
// sectors; the rest rely on keyword search alone.
const SECTOR_SEARCH: Record<Sector, SectorSearchConfig> = {
  "oil-gas": {
    category: "energy-oil-gas-jobs",
    whatOr: ["oil", "gas", "petroleum", "drilling", "offshore"],
  },
  renewables: {
    whatOr: ["renewable energy", "wind turbine", "solar", "battery storage", "offshore wind"],
  },
  "data-centres": {
    whatOr: ["data centre", "data center", "colocation", "hyperscale"],
  },
  energy: {
    category: "energy-oil-gas-jobs",
    whatOr: ["energy", "power", "utility", "grid"],
  },
  "supply-chain": {
    category: "logistics-warehouse-jobs",
    whatOr: ["supply chain", "procurement", "logistics", "materials"],
  },
}

// Keyword hints used to infer our own quick-filter tags from a real job's
// title + description, since a real job source has no equivalent
// structured field for these.
const TAG_KEYWORDS: Record<string, string[]> = {
  offshore: ["offshore"],
  onshore: ["onshore"],
  rotation: ["rotation", "rotational", "fly-in fly-out", "fifo"],
  expat: ["expat", "relocation", "international assignment"],
  "onshore-wind": ["onshore wind"],
  "offshore-wind": ["offshore wind"],
  solar: ["solar", "photovoltaic", " pv "],
  bess: ["battery storage", "bess", "energy storage"],
  colocation: ["colocation", "colo "],
  hyperscale: ["hyperscale"],
  construction: ["construction", "build phase", "fit-out", "fit out"],
  "live-ops": ["live operations", "facility operations", "day-to-day operations"],
  transmission: ["transmission"],
  distribution: ["distribution"],
  generation: ["generation", "power plant"],
  storage: ["storage"],
  "project-logistics": ["project logistics", "project cargo"],
  expediting: ["expediting", "expeditor"],
  warehousing: ["warehouse", "warehousing"],
}

const CURRENCY_BY_COUNTRY: Record<string, string> = {
  us: "$",
  gb: "£",
  au: "A$",
  br: "R$",
  mx: "MX$",
  ca: "C$",
  nl: "€",
  sg: "S$",
  in: "₹",
  de: "€",
  fr: "€",
}

function stripHtml(input: string): string {
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim()
}

function inferTags(sector: Sector, text: string): string[] {
  const lower = text.toLowerCase()
  const candidateIds = SECTOR_CONFIG[sector].quickTags.map((t) => t.id)
  return candidateIds.filter((id) => (TAG_KEYWORDS[id] || []).some((kw) => lower.includes(kw)))
}

function inferExperienceLevel(title: string): string {
  const t = title.toLowerCase()
  if (/(graduate|entry level|entry-level|intern)/.test(t)) return "Entry Level (0-2 years)"
  if (/(junior)/.test(t)) return "Junior (2-5 years)"
  if (/(senior|sr\.)/.test(t)) return "Senior (10-15 years)"
  if (/(principal|lead|staff)/.test(t)) return "Principal/Lead (15+ years)"
  if (/(director|vp\b|vice president|head of|chief)/.test(t)) return "Executive/Director"
  return "Not specified"
}

function inferContractType(contractType?: string, contractTime?: string): string {
  if (contractType === "permanent") return "Permanent"
  if (contractType === "contract") return "Contract"
  if (contractTime === "part_time") return "Part-Time"
  return "Not specified"
}

function formatSalary(min?: number, max?: number, countryCode?: string): string {
  const symbol = CURRENCY_BY_COUNTRY[countryCode || ""] || ""
  const fmt = (n: number) => `${symbol}${Math.round(n).toLocaleString()}`
  if (min && max && Math.round(min) !== Math.round(max)) return `${fmt(min)} - ${fmt(max)} / year`
  if (min) return `${fmt(min)}+ / year`
  if (max) return `Up to ${fmt(max)} / year`
  return "Not disclosed"
}

async function fetchAdzunaPage(countryCode: string, params: URLSearchParams) {
  const url = `https://api.adzuna.com/v1/api/jobs/${countryCode}/search/1?${params.toString()}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Adzuna request failed (${res.status}) for ${countryCode}`)
  }
  return res.json()
}

export async function POST(request: Request) {
  try {
    if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
      return Response.json(
        {
          error:
            "Adzuna API credentials are not configured. Add ADZUNA_APP_ID and ADZUNA_APP_KEY in Project Settings → Environment Variables and try again.",
        },
        { status: 500 }
      )
    }

    const filters = await request.json()
    const sector: Sector = (filters.sector as Sector) in SECTOR_CONFIG ? filters.sector : "oil-gas"
    const sectorConfig = SECTOR_CONFIG[sector]
    const searchConfig = SECTOR_SEARCH[sector]

    // Work out which real markets to query.
    let countryCodes: string[]
    if (filters.country && filters.country !== "") {
      const code = ADZUNA_COUNTRY_CODES[filters.country]
      if (!code) {
        return Response.json({
          jobs: [],
          notice: `Real listings aren't available yet for ${filters.country} through our current data source (Adzuna). Its coverage is limited to: ${SUPPORTED_COUNTRY_LIST}.`,
        })
      }
      countryCodes = [code]
    } else {
      countryCodes = DEFAULT_COUNTRY_CODES
    }

    const whatAnd = filters.field && filters.field !== "" ? filters.field : undefined

    const jobPromises = countryCodes.map((code) => {
      const params = new URLSearchParams({
        app_id: ADZUNA_APP_ID,
        app_key: ADZUNA_APP_KEY,
        results_per_page: "10",
        "content-type": "application/json",
      })
      params.set("what_or", searchConfig.whatOr.join(" "))
      if (whatAnd) params.set("what_and", whatAnd)
      if (searchConfig.category) params.set("category", searchConfig.category)
      if (filters.salaryMin) params.set("salary_min", String(filters.salaryMin))
      if (filters.salaryMax && filters.salaryMax < 500000) params.set("salary_max", String(filters.salaryMax))
      if (filters.contractType === "Permanent") params.set("permanent", "1")
      if (filters.contractType === "Contract") params.set("contract", "1")
      return fetchAdzunaPage(code, params).then((data) => ({ code, data }))
    })

    const settled = await Promise.allSettled(jobPromises)

    let jobs: Job[] = []
    let anyFulfilled = false
    for (const result of settled) {
      if (result.status !== "fulfilled") continue
      anyFulfilled = true
      const { code, data } = result.value
      const rawJobs = Array.isArray(data.results) ? data.results : []
      for (const raw of rawJobs) {
        const title = stripHtml(raw.title || "Untitled Role")
        const description = stripHtml(raw.description || "")
        const combinedText = `${title} ${description}`
        jobs.push({
          id: `adzuna-${raw.id}`,
          title,
          company: raw.company?.display_name || "Confidential",
          location: raw.location?.display_name || "Location not specified",
          country: COUNTRY_NAME_BY_CODE[code] || code.toUpperCase(),
          region: "",
          salary: formatSalary(raw.salary_min, raw.salary_max, code),
          contractType: inferContractType(raw.contract_type, raw.contract_time),
          experienceLevel: inferExperienceLevel(title),
          field: filters.field || raw.category?.label || sectorConfig.label,
          tags: inferTags(sector, combinedText),
          postedDate: (raw.created || "").slice(0, 10) || "Recently",
          description: description || "See the full listing for details.",
          requirements: [],
          benefits: [],
          nationalityRequirement: "",
          applyUrl: raw.redirect_url || undefined,
        })
      }
    }

    if (!anyFulfilled) {
      return Response.json(
        { error: "Couldn't reach the job data provider (Adzuna) right now. Please try again in a moment." },
        { status: 502 }
      )
    }

    // Best-effort quick-tag filter: if the user picked quick tags, keep only
    // jobs we could infer at least one matching tag for.
    if (Array.isArray(filters.quickTags) && filters.quickTags.length > 0) {
      jobs = jobs.filter((job) => job.tags.some((t) => filters.quickTags.includes(t)))
    }

    // De-duplicate near-identical postings (the same role can appear more
    // than once when it's syndicated across multiple source boards).
    const seen = new Set<string>()
    jobs = jobs.filter((job) => {
      const key = `${job.title.toLowerCase()}|${job.company.toLowerCase()}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    jobs = jobs.slice(0, 20)

    const notice =
      jobs.length === 0
        ? "No live listings matched these filters right now. Real coverage for this sector/market combination can be thin — try broadening the filters or a different country."
        : undefined

    return Response.json({ jobs, notice })
  } catch (error) {
    console.error("Error fetching real jobs:", error)
    const message = error instanceof Error ? error.message : "Failed to fetch jobs"
    return Response.json({ error: message }, { status: 500 })
  }
}

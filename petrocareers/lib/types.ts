export interface Job {
    id: string
    title: string
    company: string
    location: string
    country: string
    region: string
    salary: string
    contractType: string
    experienceLevel: string
    field: string
    tags: string[]
    postedDate: string
    description: string
    requirements: string[]
    benefits: string[]
    nationalityRequirement: string
    matchScore?: number
    matchReasons?: string[]
    // Real listing's own apply/redirect link (from the data source), when we
    // have one. Falls back to a search when absent.
    applyUrl?: string
}

export type Sector =
    | "oil-gas"
  | "renewables"
  | "data-centres"
  | "energy"
  | "supply-chain"

export interface Filters {
    sector: Sector
    field: string
    country: string
    region: string
    experience: string
    contractType: string
    salaryMin: number
    salaryMax: number
    quickTags: string[]
    cvContent?: string
}

export interface QuickTag {
    id: string
    label: string
    icon: string
}

export interface SectorConfig {
    id: Sector
    label: string
    tabLabel: string
    heroHighlight: string
    description: string
    emptyStateCopy: string
    companies: string[]
    professionalFields: string[]
    quickTags: QuickTag[]
}

// Shared across all sectors — geography and employment terms don't change by industry.
export const COUNTRIES = [
    "All Countries",
    "United Arab Emirates",
    "Saudi Arabia",
    "Qatar",
    "Kuwait",
    "Oman",
    "Nigeria",
    "Angola",
    "United States",
    "United Kingdom",
    "Norway",
    "Australia",
    "Malaysia",
    "Indonesia",
    "Brazil",
    "Mexico",
    "Canada",
    "Netherlands",
    "Singapore",
    "India",
    "Egypt",
    "Algeria",
    "Libya",
    "Ghana",
    "Mozambique",
    "Guinea",
    "Germany",
    "Ireland",
    "France",
    "Denmark",
  ]

// Countries our real job data source (Adzuna) actually covers. Used purely
// to label the Country dropdown honestly — the generate-jobs API route has
// its own copy of this mapping for the actual search logic.
export const COUNTRIES_WITH_REAL_DATA = [
    "United States",
    "United Kingdom",
    "Australia",
    "Brazil",
    "Mexico",
    "Canada",
    "Netherlands",
    "Singapore",
    "India",
    "Germany",
    "France",
  ]

export const REGIONS = [
    "All Regions",
    "Middle East",
    "North Sea",
    "West Africa",
    "East Africa",
    "North Africa",
    "Gulf of Mexico",
    "South America",
    "South Asia",
    "Southeast Asia",
    "Australasia",
    "Caspian",
    "Mediterranean",
    "North America",
    "Central America",
    "Western Europe",
  ]

// Regions our real job data source (Adzuna) actually has countries in,
// derived from COUNTRIES_WITH_REAL_DATA. Used purely to label the Region
// dropdown honestly, the same way COUNTRIES_WITH_REAL_DATA labels Country —
// the generate-jobs API route has its own country-to-region mapping for the
// actual search/filter logic.
export const REGIONS_WITH_REAL_DATA = [
    "North America",
    "Western Europe",
    "South America",
    "South Asia",
    "Southeast Asia",
    "Australasia",
  ]

export const EXPERIENCE_LEVELS = [
    "All Levels",
    "Entry Level (0-2 years)",
    "Junior (2-5 years)",
    "Mid-Level (5-10 years)",
    "Senior (10-15 years)",
    "Principal/Lead (15+ years)",
    "Executive/Director",
  ]

export const CONTRACT_TYPES = [
    "All Types",
    "Permanent",
    "Rotation",
    "Contract",
    "Freelance",
    "Temporary",
  ]

// Icon + label metadata for every quick-filter tag across every sector, keyed by tag id.
// Rendered generically by JobCard/JobDetails via lib/tag-icon.tsx.
export const TAG_META: Record<string, { label: string; icon: string; className: string }> = {
    offshore: { label: "Offshore", icon: "Anchor", className: "bg-accent/20 text-accent" },
    onshore: { label: "Onshore", icon: "Mountain", className: "bg-success/20 text-success" },
    rotation: { label: "Rotation", icon: "RotateCw", className: "bg-warning/20 text-warning" },
    expat: { label: "Expat Package", icon: "Plane", className: "bg-primary/20 text-primary" },
    "onshore-wind": { label: "Onshore Wind", icon: "Wind", className: "bg-success/20 text-success" },
    "offshore-wind": { label: "Offshore Wind", icon: "Wind", className: "bg-accent/20 text-accent" },
    solar: { label: "Solar", icon: "Sun", className: "bg-warning/20 text-warning" },
    bess: { label: "Battery Storage", icon: "BatteryCharging", className: "bg-primary/20 text-primary" },
    colocation: { label: "Colocation", icon: "Server", className: "bg-accent/20 text-accent" },
    hyperscale: { label: "Hyperscale", icon: "Cpu", className: "bg-primary/20 text-primary" },
    construction: { label: "Construction Phase", icon: "HardHat", className: "bg-warning/20 text-warning" },
    "live-ops": { label: "Live Operations", icon: "Activity", className: "bg-success/20 text-success" },
    transmission: { label: "Transmission", icon: "Cable", className: "bg-accent/20 text-accent" },
    distribution: { label: "Distribution", icon: "Route", className: "bg-success/20 text-success" },
    generation: { label: "Generation", icon: "Zap", className: "bg-warning/20 text-warning" },
    storage: { label: "Storage", icon: "BatteryCharging", className: "bg-primary/20 text-primary" },
    "project-logistics": { label: "Project Logistics", icon: "Truck", className: "bg-accent/20 text-accent" },
    expediting: { label: "Expediting", icon: "Gauge", className: "bg-warning/20 text-warning" },
    warehousing: { label: "Warehousing", icon: "Warehouse", className: "bg-success/20 text-success" },
}

export const SECTOR_CONFIG: Record<Sector, SectorConfig> = {
    "oil-gas": {
          id: "oil-gas",
          label: "Oil & Gas",
          tabLabel: "O&G",
          heroHighlight: "Oil & Gas",
          description:
                  "Search through live job opportunities from industry leaders like Shell, BP, Aramco, ADNOC, SLB, Halliburton, and more.",
          emptyStateCopy: "Use the filters above to search for oil and gas jobs from top companies worldwide.",
          companies: [
                  "Shell", "BP", "Saudi Aramco", "ADNOC", "SLB (Schlumberger)", "Halliburton",
                  "TotalEnergies", "Chevron", "ExxonMobil", "Baker Hughes", "Weatherford",
                  "NOV", "Petrobras", "ONGC", "Equinor",
                ],
          professionalFields: [
                  "All Fields",
                  "Drilling Engineering", "Reservoir Engineering", "Production Engineering",
                  "HSE (Health, Safety & Environment)", "Subsea Engineering", "Pipeline Engineering",
                  "Process Engineering", "Petroleum Geoscience", "Completions Engineering",
                  "Facilities Engineering", "Project Management", "Operations Management",
                  "Maintenance Engineering", "Instrumentation & Control", "Electrical Engineering",
                  "Mechanical Engineering", "Chemical Engineering", "Marine Operations",
                  "Logistics & Supply Chain",
                ],
          quickTags: [
            { id: "offshore", label: "Offshore", icon: "Anchor" },
            { id: "onshore", label: "Onshore", icon: "Mountain" },
            { id: "rotation", label: "Rotation", icon: "RotateCw" },
            { id: "expat", label: "Expat Package", icon: "Plane" },
                ],
    },
    renewables: {
          id: "renewables",
          label: "Renewables",
          tabLabel: "Renewables",
          heroHighlight: "Renewables",
          description:
                  "Search live roles across wind, solar, and battery storage from leaders like Ørsted, NextEra, Vestas, Siemens Gamesa, and more.",
          emptyStateCopy: "Use the filters above to search for renewable energy jobs across wind, solar, and storage.",
          companies: [
                  "Ørsted", "NextEra Energy", "Iberdrola", "EDF Renewables", "Vestas",
                  "Siemens Gamesa", "RWE Renewables", "Enel Green Power", "Vattenfall", "SSE Renewables",
                ],
          professionalFields: [
                  "All Fields",
                  "Wind Turbine Technician", "Offshore Wind Engineer", "Solar PV Engineer",
                  "Battery Storage (BESS) Engineer", "Grid Connection Engineer", "Renewable Project Manager",
                  "HSE Manager", "Environmental & Permitting Specialist", "O&M Engineer",
                  "Cable & Substation Engineer", "Commissioning Engineer", "Civil/Structural Engineer",
                  "Electrical Engineer", "Asset Manager", "Hydrogen & Green Fuels Engineer",
                ],
          quickTags: [
            { id: "onshore-wind", label: "Onshore Wind", icon: "Wind" },
            { id: "offshore-wind", label: "Offshore Wind", icon: "Wind" },
            { id: "solar", label: "Solar", icon: "Sun" },
            { id: "bess", label: "Battery Storage", icon: "BatteryCharging" },
                ],
    },
    "data-centres": {
          id: "data-centres",
          label: "Data Centres",
          tabLabel: "Data Centres",
          heroHighlight: "Data Centre",
          description:
                  "Search live roles building and running hyperscale and colocation facilities for Equinix, Digital Realty, Vantage, NTT, and more.",
          emptyStateCopy: "Use the filters above to search for data centre construction and operations jobs.",
          companies: [
                  "Equinix", "Digital Realty", "Vantage Data Centers", "NTT Global Data Centers",
                  "QTS Realty", "Switch", "AWS", "Microsoft Azure", "Google Cloud", "CyrusOne",
                ],
          professionalFields: [
                  "All Fields",
                  "Data Centre Operations Manager", "Critical Facilities Engineer", "Mechanical (M&E) Engineer",
                  "Electrical Engineer", "DCIM Specialist", "Commissioning Engineer",
                  "Cooling Systems Engineer", "Controls/BMS Engineer", "Construction Project Manager",
                  "Fit-Out Manager", "Network Infrastructure Engineer", "Security & Access Control Manager",
                  "Energy & Sustainability Manager", "Site Logistics Coordinator",
                ],
          quickTags: [
            { id: "colocation", label: "Colocation", icon: "Server" },
            { id: "hyperscale", label: "Hyperscale", icon: "Cpu" },
            { id: "construction", label: "Construction Phase", icon: "HardHat" },
            { id: "live-ops", label: "Live Operations", icon: "Activity" },
                ],
    },
    energy: {
          id: "energy",
          label: "Energy & Utilities",
          tabLabel: "Energy",
          heroHighlight: "Energy",
          description:
                  "Search live roles across transmission, distribution, and generation from utilities like National Grid, ENGIE, E.ON, Duke Energy, and more.",
          emptyStateCopy: "Use the filters above to search for power and utility jobs across generation, transmission, and distribution.",
          companies: [
                  "National Grid", "ENGIE", "E.ON", "Duke Energy", "Enel", "EDF",
                  "Iberdrola", "Southern Company", "RWE", "SSE",
                ],
          professionalFields: [
                  "All Fields",
                  "Power Systems Engineer", "Transmission Engineer", "Distribution Engineer",
                  "Substation Engineer", "HV/MV Engineer", "Energy Trader/Analyst",
                  "Utility Project Manager", "Metering Engineer", "Energy Storage Engineer",
                  "Smart Grid Engineer", "Regulatory & Compliance Specialist", "Generation Plant Engineer",
                ],
          quickTags: [
            { id: "transmission", label: "Transmission", icon: "Cable" },
            { id: "distribution", label: "Distribution", icon: "Route" },
            { id: "generation", label: "Generation", icon: "Zap" },
            { id: "storage", label: "Storage", icon: "BatteryCharging" },
                ],
    },
    "supply-chain": {
          id: "supply-chain",
          label: "Supply Chain",
          tabLabel: "Supply Chain",
          heroHighlight: "Supply Chain",
          description:
                  "Search every supply chain, procurement, materials, and logistics role across EPC, mining, and freight leaders like Maersk, DP World, Bechtel, and more.",
          emptyStateCopy: "Use the filters above to search across the full range of supply chain, procurement, and logistics roles.",
          companies: [
                  "Maersk", "DP World", "DHL Supply Chain", "Kuehne+Nagel", "XPO Logistics",
                  "C.H. Robinson", "Bechtel", "Fluor", "KBR", "Jacobs", "Wood", "McDermott",
                  "Rio Tinto", "BHP", "Glencore",
                ],
          professionalFields: [
                  "All Fields",
                  "Supply Chain Manager", "Procurement Manager", "Materials Manager", "Logistics Manager",
                  "Warehouse Manager", "Inventory Planner", "Demand Planner", "S&OP Manager",
                  "Buyer / Purchasing Officer", "Category Manager", "Vendor Manager", "Contracts Manager",
                  "Expediting Engineer", "Freight Forwarding Coordinator", "Customs & Trade Compliance Specialist",
                  "Import/Export Coordinator", "Fleet Manager", "Transportation Manager",
                  "Distribution Centre Manager", "Preservation & Storage Specialist", "Materials Quality Inspector",
                  "Project Logistics Manager", "Spares & MRO Manager", "Supply Chain Analyst",
                  "ERP/MRP Systems Specialist", "Cost Estimator/Analyst", "Sourcing Specialist",
                  "Reverse Logistics Coordinator", "3PL Coordinator", "Supply Chain Director/VP",
                ],
          quickTags: [
            { id: "project-logistics", label: "Project Logistics", icon: "Truck" },
            { id: "expediting", label: "Expediting", icon: "Gauge" },
            { id: "warehousing", label: "Warehousing", icon: "Warehouse" },
            { id: "expat", label: "Expat Package", icon: "Plane" },
                ],
    },
}

export const SECTORS: SectorConfig[] = [
    SECTOR_CONFIG["oil-gas"],
    SECTOR_CONFIG["renewables"],
    SECTOR_CONFIG["data-centres"],
    SECTOR_CONFIG["energy"],
    SECTOR_CONFIG["supply-chain"],
  ]

// Deterministic fallback color for any company not in a curated list, so new
// sectors' companies still get a distinct, stable brand-style color.
const FALLBACK_PALETTE = [
    "bg-blue-600", "bg-emerald-600", "bg-purple-600", "bg-orange-600",
    "bg-teal-600", "bg-rose-600", "bg-indigo-600", "bg-amber-600",
    "bg-cyan-600", "bg-lime-600",
  ]

const CURATED_COLORS: Record<string, string> = {
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

export function getCompanyColor(company: string): string {
    for (const [key, value] of Object.entries(CURATED_COLORS)) {
          if (company.toLowerCase().includes(key.toLowerCase())) {
                  return value
          }
    }
    let hash = 0
    for (let i = 0; i < company.length; i++) {
          hash = (hash * 31 + company.charCodeAt(i)) >>> 0
    }
    return FALLBACK_PALETTE[hash % FALLBACK_PALETTE.length]
}

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
  isOffshore: boolean
  isOnshore: boolean
  isRotation: boolean
  hasExpatPackage: boolean
  postedDate: string
  description: string
  requirements: string[]
  benefits: string[]
  nationalityRequirement: string
  matchScore?: number
  matchReasons?: string[]
}

export interface Filters {
  field: string
  country: string
  region: string
  nationality: string
  experience: string
  contractType: string
  salaryMin: number
  salaryMax: number
  quickTags: string[]
  cvContent?: string
}

export const PROFESSIONAL_FIELDS = [
  "All Fields",
  "Drilling Engineering",
  "Reservoir Engineering",
  "Production Engineering",
  "HSE (Health, Safety & Environment)",
  "Subsea Engineering",
  "Pipeline Engineering",
  "Process Engineering",
  "Petroleum Geoscience",
  "Completions Engineering",
  "Facilities Engineering",
  "Project Management",
  "Operations Management",
  "Maintenance Engineering",
  "Instrumentation & Control",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Chemical Engineering",
  "Marine Operations",
  "Logistics & Supply Chain",
]

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
  "Southeast Asia",
  "Australasia",
  "Caspian",
  "Mediterranean",
  "North America",
  "Central America",
]

export const NATIONALITIES = [
  "No Requirement",
  "GCC Nationals Only",
  "Local Nationals Only",
  "EU Citizens Only",
  "US Citizens Only",
  "Any Nationality",
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

export const QUICK_TAGS = [
  { id: "offshore", label: "Offshore" },
  { id: "onshore", label: "Onshore" },
  { id: "rotation", label: "Rotation" },
  { id: "expat", label: "Expat Package" },
]

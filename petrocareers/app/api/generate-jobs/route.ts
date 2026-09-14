import { generateObject } from "ai"
import { createGroq } from "@ai-sdk/groq"
import { z } from "zod"
import { SECTOR_CONFIG, Sector } from "@/lib/types"

const GROQ_API_KEY =
  process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY

const groq = createGroq({ apiKey: GROQ_API_KEY })

const jobSchema = z.object({
  jobs: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      company: z.string(),
      location: z.string(),
      country: z.string(),
      region: z.string(),
      salary: z.string(),
      contractType: z.string(),
      experienceLevel: z.string(),
      field: z.string(),
      tags: z.array(z.string()),
      postedDate: z.string(),
      description: z.string(),
      requirements: z.array(z.string()),
      benefits: z.array(z.string()),
      nationalityRequirement: z.string(),
    })
  ),
})

export async function POST(request: Request) {
  try {
    if (!GROQ_API_KEY) {
      return Response.json(
        {
          error:
            "Groq API key is not configured. Add NEXT_PUBLIC_GROQ_API_KEY (or GROQ_API_KEY) in Project Settings → Vars and try again.",
        },
        { status: 500 }
      )
    }

    const filters = await request.json()

    const sector: Sector = (filters.sector as Sector) in SECTOR_CONFIG ? filters.sector : "oil-gas"
    const sectorConfig = SECTOR_CONFIG[sector]
    const companyList = sectorConfig.companies.join(", ")
    const validTagIds = sectorConfig.quickTags.map((t) => t.id)
    const tagDescriptions = sectorConfig.quickTags
      .map((t) => `"${t.id}" (${t.label})`)
      .join(", ")

    const prompt = `Generate 10 realistic ${sectorConfig.label} job listings from real companies like ${companyList}.

Filters applied:
- Professional Field: ${filters.field || "Any"}
- Country: ${filters.country || "Any"}
- Region: ${filters.region || "Any"}
- Nationality Requirement: ${filters.nationality || "Any"}
- Experience Level: ${filters.experience || "Any"}
- Contract Type: ${filters.contractType || "Any"}
- Salary Range: ${filters.salaryMin || 0} - ${filters.salaryMax || 500000} USD
- Quick Tags: ${filters.quickTags?.join(", ") || "None"}

${filters.cvContent ? `CV Content for matching: ${filters.cvContent.substring(0, 1500)}` : ""}

Generate diverse, realistic job listings that match these filters. Include:
- Realistic job titles for the ${sectorConfig.label} industry, drawn from roles such as: ${sectorConfig.professionalFields.filter((f) => f !== "All Fields").join(", ")}
- Real company names from this list: ${companyList}
- Realistic locations appropriate to this sector and industry (major hubs, project sites, or offices worldwide)
- Appropriate salary ranges in USD (annual for permanent, daily for contract)
- For the "tags" field on each job, choose 1-3 relevant ids ONLY from this exact set: ${tagDescriptions}. Use only these ids (lowercase, exactly as given) — do not invent new tag ids.
- Realistic requirements and benefits
- Posted dates within the last 30 days

Make the jobs feel authentic and current for 2026.`

    const result = await generateObject({
      model: groq("openai/gpt-oss-120b"),
      schema: jobSchema,
      prompt,
    })

    // Defensive guard: keep only tag ids that are valid for this sector, in
    // case the model returns a tag id from a different sector or invents one.
    const validTagSet = new Set(validTagIds)
    const sanitizedJobs = result.object.jobs.map((job) => ({
      ...job,
      tags: job.tags.filter((tag) => validTagSet.has(tag)),
    }))

    return Response.json({ jobs: sanitizedJobs })
  } catch (error) {
    console.error("Error generating jobs:", error)
    const message =
      error instanceof Error ? error.message : "Failed to generate jobs"
    return Response.json({ error: message }, { status: 500 })
  }
}

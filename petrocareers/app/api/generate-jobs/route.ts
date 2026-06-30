import { generateObject } from "ai"
import { createGroq } from "@ai-sdk/groq"
import { z } from "zod"

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
      isOffshore: z.boolean(),
      isOnshore: z.boolean(),
      isRotation: z.boolean(),
      hasExpatPackage: z.boolean(),
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

    const prompt = `Generate 10 realistic oil and gas job listings from real companies like Shell, BP, Saudi Aramco, ADNOC, SLB (Schlumberger), Halliburton, TotalEnergies, Chevron, ExxonMobil, Baker Hughes, Weatherford, NOV, Petrobras, ONGC, Equinor.

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
- Realistic job titles for oil & gas industry (e.g., Senior Drilling Engineer, HSE Manager, Reservoir Simulation Engineer, Subsea Installation Engineer)
- Real company names from the major oil & gas companies
- Realistic locations (Abu Dhabi, Houston, Perth, Lagos, Luanda, Stavanger, Singapore, Doha, etc.)
- Appropriate salary ranges in USD (annual for permanent, daily for contract)
- Mix of offshore/onshore, rotation/permanent positions
- Realistic requirements and benefits
- Posted dates within the last 30 days

Make the jobs feel authentic and current for 2026.`

    const result = await generateObject({
      model: groq("openai/gpt-oss-120b"),
      schema: jobSchema,
      prompt,
    })

    return Response.json(result.object)
  } catch (error) {
    console.error("Error generating jobs:", error)
    const message =
      error instanceof Error ? error.message : "Failed to generate jobs"
    return Response.json({ error: message }, { status: 500 })
  }
}

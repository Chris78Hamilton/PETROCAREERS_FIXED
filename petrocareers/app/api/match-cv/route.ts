import { generateObject } from "ai"
import { createGroq } from "@ai-sdk/groq"
import { z } from "zod"

const GROQ_API_KEY =
  process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY

const groq = createGroq({ apiKey: GROQ_API_KEY })

const matchSchema = z.object({
  matches: z.array(
    z.object({
      jobId: z.string(),
      matchScore: z.number().min(0).max(100),
      matchReasons: z.array(z.string()),
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

    const { cvContent, jobs } = await request.json()

    const jobSummaries = jobs.map(
      (job: { id: string; title: string; company: string; field: string; description?: string; requirements?: string[] }) => ({
        id: job.id,
        title: job.title,
        company: job.company,
        field: job.field,
        // Real listings carry everything in a free-text description rather
        // than a structured requirements list, so pass both — whichever the
        // job actually has populated is what the model has to work with.
        description: (job.description || "").substring(0, 1200),
        requirements: job.requirements,
      })
    )

    const prompt = `Analyze this CV/Resume and calculate match scores for each job listing.

CV Content:
${cvContent.substring(0, 3000)}

Jobs to match against:
${JSON.stringify(jobSummaries, null, 2)}

For each job, provide:
1. A match score from 0-100 based on how well the CV matches the job's description and requirements
2. 2-3 specific reasons why this person would be a good (or poor) match

Consider: years of experience, relevant skills, industry knowledge, certifications, education, and career progression.`

    const result = await generateObject({
      model: groq("openai/gpt-oss-120b"),
      schema: matchSchema,
      prompt,
    })

    return Response.json(result.object)
  } catch (error) {
    console.error("Error matching CV:", error)
    const message = error instanceof Error ? error.message : "Failed to match CV"
    return Response.json({ error: message }, { status: 500 })
  }
}

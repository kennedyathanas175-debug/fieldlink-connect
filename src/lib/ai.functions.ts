import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const FIELD_IDS = [
  "engineering",
  "business",
  "health",
  "education",
  "agriculture",
  "arts",
  "law",
  "science",
] as const;

async function callAI(system: string, user: string, jsonSchema: Record<string, unknown>) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured.");
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: {
        type: "json_schema",
        json_schema: { name: "result", strict: true, schema: jsonSchema },
      },
    }),
  });
  if (res.status === 429) throw new Error("The assistant is busy. Try again in a moment.");
  if (res.status === 402) throw new Error("AI credits are used up for now.");
  if (!res.ok) throw new Error("The assistant could not respond. Try again.");
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content ?? "{}";
  return JSON.parse(content) as unknown;
}

/** Student side: describe your course in your own words, get a field + best openings. */
export const matchStudent = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        description: z.string().trim().min(3).max(600),
        postings: z
          .array(
            z.object({
              id: z.string().max(40),
              title: z.string().max(160),
              field: z.string().max(40),
              region: z.string().max(60),
              description: z.string().max(1000),
            }),
          )
          .max(100),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const result = await callAI(
      `You help Tanzanian college students find internships (mafunzo kwa vitendo). Students may write in English or Swahili. Map the student's course to exactly one field id from: ${FIELD_IDS.join(", ")}. Then pick up to 3 posting ids from the list that best fit them (use only ids provided). Reply in the same language the student used, short and friendly (max 2 sentences).`,
      `Student says: """${data.description}"""\n\nOpen postings:\n${JSON.stringify(data.postings)}`,
      {
        type: "object",
        additionalProperties: false,
        properties: {
          field: { type: "string", enum: [...FIELD_IDS] },
          message: { type: "string" },
          postingIds: { type: "array", items: { type: "string" } },
        },
        required: ["field", "message", "postingIds"],
      },
    );
    return result as { field: (typeof FIELD_IDS)[number]; message: string; postingIds: string[] };
  });

/** Company side: turn a title + a few notes into a clear posting description. */
export const draftPosting = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        title: z.string().trim().min(3).max(120),
        company: z.string().trim().max(120),
        notes: z.string().trim().max(600).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const result = await callAI(
      `You write short internship posting descriptions for Tanzanian organisations. Plain, direct, active voice, no hype. 2-3 sentences, max 60 words. Also pick the best field id from: ${FIELD_IDS.join(", ")}.`,
      `Organisation: ${data.company}\nTitle: ${data.title}\nNotes: ${data.notes ?? "none"}`,
      {
        type: "object",
        additionalProperties: false,
        properties: {
          description: { type: "string" },
          field: { type: "string", enum: [...FIELD_IDS] },
        },
        required: ["description", "field"],
      },
    );
    return result as { description: string; field: (typeof FIELD_IDS)[number] };
  });

import { z } from "zod";

export const ClassSchema = z.object({
  id: z.string(),
  graduateYear: z.number(),
  globalCode: z.string(),
  laps: z.number(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type Class = z.infer<typeof ClassSchema>;

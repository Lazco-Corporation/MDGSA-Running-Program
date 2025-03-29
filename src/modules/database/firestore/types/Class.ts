import { z } from "zod";

export const ClassSchema = z.object({
  id: z.string(),
  graduateYear: z.number().int(),
  globalCode: z.string(),
  laps: z.number().int(),
  createdAt: z.number().int(),
  updatedAt: z.number().int(),
});

export type Class = z.infer<typeof ClassSchema>;

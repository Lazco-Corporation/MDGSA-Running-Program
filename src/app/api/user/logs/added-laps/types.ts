import { z } from "zod";

export const AddedLapsRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
});
export type AddedLapsRequest = z.infer<typeof AddedLapsRequestSchema>;

export const AddedLapsResponseSchema = z.object({
  addedLaps: z.array(
    z.object({
      laps: z.number().int(),
      headcount: z.number().int(),
      timestamp: z.number().int(),
    }),
  ),
});
export type AddedLapsResponse = z.infer<typeof AddedLapsResponseSchema>;

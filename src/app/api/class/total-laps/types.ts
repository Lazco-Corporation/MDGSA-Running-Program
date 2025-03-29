import { z } from "zod";

export const TotalLapsResponseSchema = z.object({
  totalLaps: z.number().int(),
});
export type TotalLapsResponse = z.infer<typeof TotalLapsResponseSchema>;

import { z } from "zod";

export const ListUserAddedLapsRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
  status: z.enum(["success", "failure"]),
});
export type ListUserAddedLapsRequest = z.infer<
  typeof ListUserAddedLapsRequestSchema
>;

export const ListUserAddedLapsResponseSchema = z.object({
  addedLaps: z.array(
    z.object({
      id: z.string(),
      timestamp: z.number().int(),
      readableTimestamp: z.string(),
      laps: z.number().int(),
      headcount: z.number().int(),
      totalAddedLaps: z.number().int(),
    }),
  ),
});
export type ListUserAddedLapsResponse = z.infer<
  typeof ListUserAddedLapsResponseSchema
>;

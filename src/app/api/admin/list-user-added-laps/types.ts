import { z } from "zod";

export const ListUserAddedLapsRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
});
export type ListUserAddedLapsRequest = z.infer<
  typeof ListUserAddedLapsRequestSchema
>;

export const ListUserAddedLapsResponseSchema = z.object({
  addedLaps: z.array(
    z.object({
      laps: z.number().int(),
      headcount: z.number().int(),
      timestamp: z.number().int(),
    }),
  ),
});
export type ListUserAddedLapsResponse = z.infer<
  typeof ListUserAddedLapsResponseSchema
>;

import { z } from "zod";

export const RemoveAllAddedLapsFromUserRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
});
export type RemoveAllAddedLapsFromUserRequest = z.infer<
  typeof RemoveAllAddedLapsFromUserRequestSchema
>;

export const RemoveAllAddedLapsFromUserResponseSchema = z.object({
  removedLaps: z.number().int(),
});
export type RemoveAllAddedLapsFromUserResponse = z.infer<
  typeof RemoveAllAddedLapsFromUserResponseSchema
>;

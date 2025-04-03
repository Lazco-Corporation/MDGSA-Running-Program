import { z } from "zod";

import { GoogleUserCheckResponse } from "@/modules/mdApi/methods/googleUserCheck";

export const GetUserProfileRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
});
export type GetUserProfileRequest = z.infer<typeof GetUserProfileRequestSchema>;

export const GetUserProfileResponseSchema = z.object({
  userData: z.custom<GoogleUserCheckResponse>(),
});
export type GetUserProfileResponse = z.infer<
  typeof GetUserProfileResponseSchema
>;

import { z } from "zod";

import { GoogleUserCheckResponse } from "@/modules/mdApi/methods/googleUserCheck";

export const ProfileRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
});
export type ProfileRequest = z.infer<typeof ProfileRequestSchema>;

export const ProfileResponseSchema = z.object({
  userData: z.custom<GoogleUserCheckResponse>(),
});
export type ProfileResponse = z.infer<typeof ProfileResponseSchema>;

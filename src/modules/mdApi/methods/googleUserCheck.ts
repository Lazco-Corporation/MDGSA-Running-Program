import axios from "axios";
import { z } from "zod";

import { ClientError } from "@/modules/clientError";
import { handleRecursiveError } from "@/modules/clientError/handleRecursiveError";

const googleUserCheckOptionsSchema = z.object({
  email: z.string().email("Invalid email format"),
});
export type GoogleUserCheckOptions = z.infer<
  typeof googleUserCheckOptionsSchema
>;

const teacherSchema = z.object({
  mail: z.string().email("Invalid email"),
  user_name: z.string(),
  code: z.string(),
  class_name: z.string().nullable(),
  user_identity: z.literal("teach"),
});
const studentSchema = z.object({
  mail: z.string().email("Invalid email"),
  user_name: z.string(),
  code: z.string(),
  user_identity: z.literal("stu"),
});
const alumniSchema = z.object({
  mail: z.string().email("Invalid email"),
  user_name: z.string(),
  user_job: z.string(),
  user_identity: z.literal("alu"),
});
const googleUserResponseSchema = z.discriminatedUnion("user_identity", [
  teacherSchema,
  studentSchema,
  alumniSchema,
]);
export type GoogleUserCheckResponse = z.infer<typeof googleUserResponseSchema>;

export async function googleUserCheck(
  options: GoogleUserCheckOptions,
): Promise<GoogleUserCheckResponse> {
  try {
    try {
      googleUserCheckOptionsSchema.parse(options);
    } catch (_error) {
      throw new Error("Invalid options: Email format is incorrect");
    }
    const { email } = options;

    const API_URL =
      "https://mdsrl.mingdao.edu.tw/mdpp/Sig20Login/googleUserCheck";
    const response = await axios.postForm(API_URL, {
      email,
    });

    let parsedResponseData: GoogleUserCheckResponse;
    if (typeof response.data === "string") {
      try {
        parsedResponseData = JSON.parse(response.data);
      } catch (_error) {
        if (response.data === "false") {
          throw new ClientError({
            errObj: {
              email,
            },
            errMsg: "User not found",
          });
        }
        throw new Error("Failed to parse response data");
      }
    } else {
      parsedResponseData = response.data;
    }

    let validatedData: GoogleUserCheckResponse;
    try {
      validatedData = googleUserResponseSchema.parse(parsedResponseData);
    } catch (_error) {
      throw new Error("Response data does not match expected schema");
    }
    return validatedData;
  } catch (error) {
    handleRecursiveError(error);

    throw new ClientError({
      errMsg: "Failed to check Google user",
    });
  }
}

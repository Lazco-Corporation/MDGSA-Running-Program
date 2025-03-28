import axios, { AxiosError } from "axios";
import { z, ZodError } from "zod";

import { ClientError } from "@/modules/clientError";
import { handleRecursiveError } from "@/modules/clientError/handleRecursiveError";
import { HttpStatus } from "@/modules/http/statusCodes";

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
  class_name: z.string(),
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
export type GoogleUserCheckResponse =
  | {
      mail: string;
      userName: string;
      code: string;
      className: string | null;
      userIdentity: "teach";
    }
  | {
      mail: string;
      userName: string;
      code: string;
      className: string;
      userIdentity: "stu";
    }
  | {
      mail: string;
      userName: string;
      userJob: string;
      userIdentity: "alu";
    };

export async function googleUserCheck(
  options: GoogleUserCheckOptions,
): Promise<GoogleUserCheckResponse> {
  try {
    try {
      googleUserCheckOptionsSchema.parse(options);
    } catch (error) {
      if (isZodError(error)) {
        throw new Error("Invalid options: Email format is incorrect");
      }
      throw error;
    }
    const { email } = options;

    try {
      const API_URL =
        "https://mdsrl.mingdao.edu.tw/mdpp/Sig20Login/googleUserCheck";
      const response = await axios.postForm(API_URL, {
        email,
      });

      let parsedResponseData: unknown;
      if (typeof response.data === "boolean") {
        if (response.data === false) {
          throw new ClientError(
            {
              errorObject: { email },
              errorMessage: "User not found",
            },
            HttpStatus.NOT_FOUND,
          );
        }
        throw new Error("Failed to parse response data");
      } else {
        parsedResponseData = response.data;
      }

      try {
        const parsedData = googleUserResponseSchema.parse(parsedResponseData);

        switch (parsedData.user_identity) {
          case "teach": {
            return {
              mail: parsedData.mail,
              userName: parsedData.user_name,
              code: parsedData.code,
              className: parsedData.class_name,
              userIdentity: "teach",
            };
          }
          case "stu": {
            return {
              mail: parsedData.mail,
              userName: parsedData.user_name,
              code: parsedData.code,
              className: parsedData.class_name,
              userIdentity: "stu",
            };
          }
          case "alu": {
            return {
              mail: parsedData.mail,
              userName: parsedData.user_name,
              userJob: parsedData.user_job,
              userIdentity: "alu",
            };
          }
        }
      } catch (error) {
        if (isZodError(error)) {
          throw new Error("Response data does not match expected schema");
        }
        throw error;
      }
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(`API request failed: ${error.message}`);
      }
      throw error;
    }
  } catch (error) {
    handleRecursiveError(error);

    throw new ClientError(
      {
        errorMessage: "Failed to check Google user",
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export function isZodError(error: unknown): error is ZodError {
  return error instanceof z.ZodError;
}

export function isAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error);
}

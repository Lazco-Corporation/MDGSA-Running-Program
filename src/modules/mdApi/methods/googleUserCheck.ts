import axios from "axios";
import { z } from "zod";

import { ClientError } from "@/modules/clientError";
import { handleRecursiveError } from "@/modules/clientError/handleRecursiveError";
import { HttpStatus } from "@/modules/http/statusCodes";
import { isAxiosError } from "@/modules/checkError/isAxiosError";

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
      email: string;
      userName: string;
      code: string;
      className: string | null;
      userIdentity: "teach";
    }
  | {
      email: string;
      userName: string;
      code: string;
      className: string;
      userIdentity: "stu";
    }
  | {
      email: string;
      userName: string;
      userJob: string;
      userIdentity: "alu";
    };

export async function googleUserCheck(
  options: GoogleUserCheckOptions,
): Promise<GoogleUserCheckResponse> {
  try {
    const optionsResult = googleUserCheckOptionsSchema.safeParse(options);
    if (!optionsResult.success) {
      throw new Error("Invalid options: Email format is incorrect");
    }

    const { email } = optionsResult.data;
    const API_URL =
      "https://mdsrl.mingdao.edu.tw/mdpp/Sig20Login/googleUserCheck";

    const response = await axios.postForm(API_URL, { email });

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
    }

    const responseResult = googleUserResponseSchema.safeParse(response.data);
    if (!responseResult.success) {
      throw new Error("Response data does not match expected schema");
    }

    return mapUserResponseToClientFormat(responseResult.data);
  } catch (error) {
    if (isAxiosError(error)) {
      handleRecursiveError(new Error(`API request failed: ${error.message}`));
    } else {
      handleRecursiveError(error);
    }

    throw new ClientError(
      {
        errorMessage: "Failed to check Google user",
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

function mapUserResponseToClientFormat(
  parsedData: z.infer<typeof googleUserResponseSchema>,
): GoogleUserCheckResponse {
  const baseData = {
    email: parsedData.mail,
    userName: parsedData.user_name,
  };

  switch (parsedData.user_identity) {
    case "teach":
      return {
        ...baseData,
        code: parsedData.code,
        className: parsedData.class_name,
        userIdentity: "teach",
      };
    case "stu":
      return {
        ...baseData,
        code: parsedData.code,
        className: parsedData.class_name,
        userIdentity: "stu",
      };
    case "alu":
      return {
        ...baseData,
        userJob: parsedData.user_job,
        userIdentity: "alu",
      };
  }
}

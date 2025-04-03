import { NextResponse } from "next/server";

import { ClientError } from "@/modules/clientError";
import { mdApi } from "@/modules/mdApi";
import { HttpStatus } from "@/modules/http/statusCodes";
import { requestHandler } from "@/modules/requestHandler";
import { GetUserProfileRequestSchema, GetUserProfileResponse } from "./types";

export const POST = requestHandler.withBackendAdminAuth(
  async (request: Request) => {
    const body = await request.json().catch(() => ({}));

    const parsedResult = GetUserProfileRequestSchema.safeParse(body);
    if (!parsedResult.success) {
      throw new ClientError(
        {
          errorObject: parsedResult.error.flatten().fieldErrors,
          errorMessage: "Request body does not match expected schema",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const { email } = parsedResult.data;

    const userData = await mdApi.receiveUserData.email({ email });

    return NextResponse.json({ userData } as GetUserProfileResponse);
  },
);

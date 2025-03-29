import { NextResponse } from "next/server";

import { ClientError } from "@/modules/clientError";
import { mdApi } from "@/modules/mdApi";
import { HttpStatus } from "@/modules/http/statusCodes";
import { ProfileRequestSchema, ProfileResponse } from "./types";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const result = ProfileRequestSchema.safeParse(body);

    if (!result.success) {
      throw new ClientError(
        {
          errorObject: result.error.flatten().fieldErrors,
          errorMessage: "Request body does not match expected schema",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const { email } = result.data;

    const userData = await mdApi.receiveUserData.email({ email });

    return NextResponse.json({ userData } as ProfileResponse);
  } catch (error) {
    if (error instanceof ClientError) {
      return NextResponse.json(error.payload, { status: error.code || 500 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: HttpStatus.INTERNAL_SERVER_ERROR },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/nextAuthOptions";
import { ExtendedNextAuthSession } from "@/app/api/auth/[...nextauth]/types";
import { ClientError } from "@/modules/clientError";
import { HttpStatus } from "@/modules/http/statusCodes";
import { RouteHandler as RequestHandler } from "..";

export function requestHandlerWithAuth(handler: RequestHandler) {
  return async (request: NextRequest, params?: any) => {
    try {
      const session = (await getServerSession(
        nextAuthOptions,
      )) as ExtendedNextAuthSession | null;

      if (!session) {
        throw new ClientError(
          {
            errorMessage: "You are not logged in",
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      return handler(request, params);
    } catch (error) {
      if (error instanceof ClientError) {
        return NextResponse.json(error.payload, { status: error.code || 500 });
      }

      return NextResponse.json(
        { error: "Internal server error" },
        { status: HttpStatus.INTERNAL_SERVER_ERROR },
      );
    }
  };
}

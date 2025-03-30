import { NextRequest, NextResponse } from "next/server";

import { ClientError } from "@/modules/clientError";
import { HttpStatus } from "@/modules/http/statusCodes";
import { RouteHandler as RequestHandler } from "..";

export function requestHandlerWithoutAuth(handler: RequestHandler) {
  return async (request: NextRequest, params?: any) => {
    try {
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

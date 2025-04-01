import { NextRequest, NextResponse } from "next/server";

import { ClientError } from "@/modules/clientError";
import { HttpStatus } from "@/modules/http/statusCodes";
import { RouteHandler as RequestHandler } from "..";

export function requestHandlerWithBackendAdminAuth(handler: RequestHandler) {
  return async (request: NextRequest, params?: any) => {
    try {
      const authHeader = request.headers.get("authorization");
      if (authHeader !== process.env.BACKEND_ADMIN_TOKEN) {
        return NextResponse.redirect(
          "https://music.youtube.com/watch?v=xn0-IZZ6YO4",
        );
      }

      return await handler(request, params);
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

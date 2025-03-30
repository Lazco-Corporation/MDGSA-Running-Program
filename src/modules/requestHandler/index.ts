import { NextRequest, NextResponse } from "next/server";

import { requestHandlerWithAuth } from "./handlers/withAuth";
import { requestHandlerWithoutAuth } from "./handlers/withoutAuth";

export const requestHandler = {
  withAuth: requestHandlerWithAuth,
  withoutAuth: requestHandlerWithoutAuth,
};

export type RouteHandler = (
  req: NextRequest,
  params?: any,
) => Promise<NextResponse | Response> | NextResponse | Response;

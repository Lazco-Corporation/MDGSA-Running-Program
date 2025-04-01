import { NextRequest, NextResponse } from "next/server";

import { requestHandlerWithAuth } from "./handlers/withAuth";
import { requestHandlerWithoutAuth } from "./handlers/withoutAuth";
import { requestHandlerWithBackendAdminAuth } from "./handlers/withBackendAdmin";

export const requestHandler = {
  withAuth: requestHandlerWithAuth,
  withoutAuth: requestHandlerWithoutAuth,
  withBackendAdminAuth: requestHandlerWithBackendAdminAuth,
};

export type RouteHandler = (
  req: NextRequest,
  params?: any,
) => Promise<NextResponse | Response> | NextResponse | Response;

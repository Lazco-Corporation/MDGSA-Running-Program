import { NextResponse } from "next/server";

import { ClientError } from "@/modules/clientError";
import { HttpStatus } from "@/modules/http/statusCodes";
import { firestoreOperation } from "@/modules/database/firestore";
import {
  LogResourceId,
  LogResourceType,
} from "@/modules/database/firestore/types/Log";
import { requestHandler } from "@/modules/requestHandler";
import { AddedLapsRequestSchema, AddedLapsResponse } from "./types";

export const POST = requestHandler.withAuth(async (request: Request) => {
  const body = await request.json().catch(() => ({}));

  const parsedResult = AddedLapsRequestSchema.safeParse(body);
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

  const logEntries =
    await firestoreOperation.log.list.byResourceTypeAndResourceId({
      resourceType: LogResourceType.BACKEND,
      resourceId: LogResourceId.USER_ADD_LAPS,
      userEmail: email,
    });

  const addedLaps = logEntries
    .filter((logEntry) => logEntry.status === "success")
    .map((logEntry) => ({
      timestamp: logEntry.timestamp,
      laps: logEntry.metadata?.laps ?? 0,
      headcount: logEntry.metadata?.headcount ?? 0,
    }));

  return NextResponse.json({
    addedLaps,
  } as AddedLapsResponse);
});

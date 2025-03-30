import { NextResponse } from "next/server";

import { ClientError } from "@/modules/clientError";
import { HttpStatus } from "@/modules/http/statusCodes";
import { firestoreOperation } from "@/modules/database/firestore";
import {
  LogResourceId,
  LogResourceType,
} from "@/modules/database/firestore/types/Log";
import { AddedLapsRequestSchema, AddedLapsResponse } from "./types";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  try {
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

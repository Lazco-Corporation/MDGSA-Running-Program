import { NextResponse } from "next/server";

import { ClientError } from "@/modules/clientError";
import { HttpStatus } from "@/modules/http/statusCodes";
import { firestoreOperation } from "@/modules/database/firestore";
import {
  LogResourceId,
  LogResourceType,
} from "@/modules/database/firestore/types/Log";
import { requestHandler } from "@/modules/requestHandler";
import {
  ListUserAddedLapsRequestSchema,
  ListUserAddedLapsResponse,
} from "./types";

export const POST = requestHandler.withBackendAdminAuth(
  async (request: Request) => {
    const body = await request.json().catch(() => ({}));

    const parsedResult = ListUserAddedLapsRequestSchema.safeParse(body);
    if (!parsedResult.success) {
      throw new ClientError(
        {
          errorObject: parsedResult.error.flatten().fieldErrors,
          errorMessage: "Request body does not match expected schema",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const { email, status } = parsedResult.data;

    const logEntries =
      await firestoreOperation.log.list.byResourceTypeAndResourceId({
        resourceType: LogResourceType.BACKEND,
        resourceId: LogResourceId.USER_ADD_LAPS,
        userEmail: email,
      });

    const addedLaps = logEntries
      .filter((logEntry) => logEntry.status === status)
      .map((logEntry) => ({
        id: logEntry.id,
        timestamp: logEntry.timestamp,
        readableTimestamp: formatDateToChineseUTC8(
          new Date(logEntry.timestamp),
        ),
        laps: logEntry.metadata?.laps ?? 0,
        headcount: logEntry.metadata?.headcount ?? 0,
        totalAddedLaps: logEntry.metadata?.totalAddedLaps ?? 0,
      }));

    return NextResponse.json({
      addedLaps,
    } as ListUserAddedLapsResponse);
  },
);

export const GET = POST;

function formatDateToChineseUTC8(date: Date): string {
  const formatter = new Intl.DateTimeFormat("zh-TW", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });

  return formatter.format(date);
}

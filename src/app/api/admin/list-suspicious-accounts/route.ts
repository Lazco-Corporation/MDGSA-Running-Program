import { NextResponse } from "next/server";

import { ClientError } from "@/modules/clientError";
import { HttpStatus } from "@/modules/http/statusCodes";
import { requestHandler } from "@/modules/requestHandler";
import { firestoreService } from "@/modules/database/firestore/firestoreService";
import { LogEntry } from "@/modules/database/firestore/types/Log";
import { ListSuspiciousAccountsResponse, UserLapsSummary } from "./types";

export const GET = requestHandler.withBackendAdminAuth(async () => {
  const suspiciousAccounts = await getUserLapsSummary();

  return NextResponse.json({
    suspiciousAccounts,
  } as ListSuspiciousAccountsResponse);
});

async function getUserLapsSummary(): Promise<UserLapsSummary[]> {
  try {
    const logCollectionRef = firestoreService
      .collection("logs")
      .doc("backend")
      .collection("user-add-laps");

    const querySnapshot = await logCollectionRef
      .where("status", "==", "success")
      .get();

    if (querySnapshot.empty) {
      return [];
    }

    const userGroups = new Map<string, LogEntry[]>();

    for (const doc of querySnapshot.docs) {
      const logEntry = doc.data() as LogEntry;

      if (!logEntry.userEmail) {
        continue;
      }

      if (!userGroups.has(logEntry.userEmail)) {
        userGroups.set(logEntry.userEmail, []);
      }
      userGroups.get(logEntry.userEmail)?.push(logEntry);
    }

    const summaries: UserLapsSummary[] = [];

    userGroups.forEach((logs, userEmail) => {
      let totalAddedLaps = 0;

      const mostAddedLapsRecords = logs
        .sort((a, b) => b.metadata?.totalAddedLaps - a.metadata?.totalAddedLaps)
        .slice(0, 5)
        .map((log) => ({
          laps: log.metadata?.laps ?? 0,
          headcount: log.metadata?.headcount ?? 0,
          totalAddedLaps: log.metadata?.totalAddedLaps ?? 0,
          timestamp: log.timestamp,
          readableTimestamp: formatDateToChineseUTC8(new Date(log.timestamp)),
        }));

      for (const log of logs) {
        if (log.metadata?.totalAddedLaps) {
          totalAddedLaps += log.metadata.totalAddedLaps;
        }
      }

      summaries.push({
        userEmail,
        totalAddedLaps,
        mostAddedLapsRecords,
      });
    });

    return summaries.sort((a, b) => b.totalAddedLaps - a.totalAddedLaps);
  } catch (_error) {
    throw new ClientError(
      {
        errorMessage: "Failed to get user laps summary",
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

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

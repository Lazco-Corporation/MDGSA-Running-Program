import { NextResponse } from "next/server";

import { ClientError } from "@/modules/clientError";
import { HttpStatus } from "@/modules/http/statusCodes";
import { firestoreOperation } from "@/modules/database/firestore";
import {
  LogEntry,
  LogResourceId,
  LogResourceType,
} from "@/modules/database/firestore/types/Log";
import { requestHandler } from "@/modules/requestHandler";
import { firestoreService } from "@/modules/database/firestore/firestoreService";
import { mdApi } from "@/modules/mdApi";
import { getGraduateClassInfo } from "@/modules/getGraduateClassInfo";
import {
  RemoveAllAddedLapsFromUserRequestSchema,
  RemoveAllAddedLapsFromUserResponse,
} from "./types";

export const POST = requestHandler.withBackendAdminAuth(
  async (request: Request) => {
    const body = await request.json().catch(() => ({}));

    const parsedResult =
      RemoveAllAddedLapsFromUserRequestSchema.safeParse(body);
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
    const logEntriesId = logEntries
      .filter((logEntry) => logEntry.status === "success")
      .map((logEntry) => logEntry.id);

    const { totalAddedLapsSum } = await updateMultipleLogEntries({
      resourceType: LogResourceType.BACKEND,
      resourceId: LogResourceId.USER_ADD_LAPS,
      logIds: logEntriesId,
    });

    const userData = await mdApi.receiveUserData.email({
      email,
    });
    const userClassInfo = getGraduateClassInfo(userData);

    const previousClassData = await firestoreOperation.class.get
      .byGraduateYearAndGlobalCode({
        graduateYear: Number(process.env.CURRENT_GRADUATE_YEAR),
        globalCode: userClassInfo.globalCode,
      })
      .catch(() => ({}));

    await firestoreOperation.class.upsert.byGraduateYearAndGlobalCode({
      graduateYear: Number(process.env.CURRENT_GRADUATE_YEAR),
      globalCode: userClassInfo.globalCode,
      classData: {
        laps:
          ("laps" in previousClassData ? previousClassData.laps : 0) -
          totalAddedLapsSum,
      },
    });

    return NextResponse.json({
      className: userClassInfo.name,
      removedLaps: totalAddedLapsSum,
    } as RemoveAllAddedLapsFromUserResponse);
  },
);

type UpdateMultipleLogsOptions = {
  resourceType: LogResourceType;
  resourceId: LogResourceId;
  logIds: string[];
};

type UpdateMultipleLogsResult = {
  totalAddedLapsSum: number;
  updatedCount: number;
};

async function updateMultipleLogEntries({
  resourceType,
  resourceId,
  logIds,
}: UpdateMultipleLogsOptions): Promise<UpdateMultipleLogsResult> {
  if (!logIds.length) {
    return { totalAddedLapsSum: 0, updatedCount: 0 };
  }

  try {
    const resourceTypeDocRef = firestoreService
      .collection("logs")
      .doc(resourceType);
    const logsCollection = resourceTypeDocRef.collection(resourceId);

    return await firestoreService.runTransaction(async (transaction) => {
      const logDocReferences = logIds.map((id) => logsCollection.doc(id));
      const logDocSnapshots = await Promise.all(
        logDocReferences.map((docRef) => transaction.get(docRef)),
      );

      let totalAddedLapsSum = 0;
      let updatedCount = 0;

      logDocSnapshots.forEach((docSnapshot, index) => {
        if (!docSnapshot.exists) {
          console.warn(`Log entry with ID ${logIds[index]} not found`);
          return;
        }

        const logData = docSnapshot.data() as LogEntry;

        if (logData.metadata?.totalAddedLaps) {
          totalAddedLapsSum += logData.metadata.totalAddedLaps;
        }

        if (logData.status === "success") {
          transaction.update(docSnapshot.ref, {
            status: "failure",
            metadata: {
              ...logData.metadata,
              failureReason: "Added laps removed by admin",
            },
          });
          updatedCount++;
        }
      });

      return {
        totalAddedLapsSum,
        updatedCount,
      };
    });
  } catch (_error) {
    throw new ClientError(
      {
        errorMessage: "Failed to update multiple log entries",
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

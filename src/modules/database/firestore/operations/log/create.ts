import { ClientError } from "@/modules/clientError";
import { HttpStatus } from "@/modules/http/statusCodes";
import { firestoreService } from "../../firestoreService";
import { LogEntry, LogResourceId, LogResourceType } from "../../types/Log";

export type AddLogEntryOptions = {
  resourceType: LogResourceType;
  resourceId: LogResourceId;
  logData: Omit<LogEntry, "id" | "timestamp">;
};

export async function createByResourceTypeAndResourceId({
  resourceType,
  resourceId,
  logData,
}: AddLogEntryOptions): Promise<string | null> {
  const cleanedLogData = JSON.parse(JSON.stringify(logData));

  try {
    const timestamp = Date.now();

    const logEntry: Omit<LogEntry, "id"> = {
      ...cleanedLogData,
      timestamp,
    };

    const resourceTypeDocRef = firestoreService
      .collection("logs")
      .doc(resourceType);
    await resourceTypeDocRef.set({ created: timestamp }, { merge: true });

    const logDocRef = resourceTypeDocRef.collection(resourceId).doc();

    await logDocRef.set(logEntry);

    return logDocRef.id;
  } catch (_error) {
    throw new ClientError(
      {
        errorMessage: "Failed to create log entry",
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

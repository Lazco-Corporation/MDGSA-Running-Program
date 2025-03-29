import { firestoreService } from "../../firestoreService";
import { LogEntry } from "../../types/LogEntry";

export async function addLogEntry({
  resourceType,
  resourceId,
  logData,
}: {
  resourceType: LogResourceType;
  resourceId: LogResourceId;
  logData: Omit<LogEntry, "id" | "timestamp">;
}): Promise<string | null> {
  try {
    const timestamp = Date.now();

    const logEntry: Omit<LogEntry, "id"> = {
      ...logData,
      timestamp,
    };

    const resourceTypeDocRef = firestoreService
      .collection("logs")
      .doc(resourceType);
    await resourceTypeDocRef.set({ created: timestamp }, { merge: true });

    const logDocRef = resourceTypeDocRef.collection(resourceId).doc();

    await logDocRef.set(logEntry);

    return logDocRef.id;
  } catch (error) {
    console.error("Failed to create log entry:", error);

    return null;
  }
}

export enum LogResourceType {
  BACKEND = "backend",
}

export enum LogResourceId {
  USER_ADD_LAPS = "user-add-laps",
}

import { ClientError } from "@/modules/clientError";
import { HttpStatus } from "@/modules/http/statusCodes";
import { firestoreService } from "../../firestoreService";
import { LogEntry, LogResourceId, LogResourceType } from "../../types/Log";

export async function listByResourceTypeAndResourceId({
  resourceType,
  resourceId,
  userEmail,
  orderByDirection = "desc",
}: {
  resourceType: LogResourceType;
  resourceId: LogResourceId;
  userEmail: string;
  orderByDirection?: "asc" | "desc";
}): Promise<LogEntry[]> {
  try {
    const logsCollectionRef = firestoreService
      .collection("logs")
      .doc(resourceType)
      .collection(resourceId);

    const querySnapshot = await logsCollectionRef
      .orderBy("timestamp", orderByDirection)
      .where("userEmail", "==", userEmail)
      .get();

    const logEntries: LogEntry[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as LogEntry[];

    return logEntries;
  } catch (_error) {
    console.log(_error);

    throw new ClientError(
      {
        errorMessage: "Failed to fetch logs",
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

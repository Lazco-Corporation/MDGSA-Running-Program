import { ClientError } from "@/modules/clientError";
import { HttpStatus } from "@/modules/http/statusCodes";
import { firestoreService } from "../../firestoreService";
import { LogEntry, LogResourceId, LogResourceType } from "../../types/Log";
import { defaultCache } from "@/modules/cache";

const CACHE_KEY = "firestoreOperation:log:listByResourceTypeAndResourceId";

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
  const cachedLogs = defaultCache.get<LogEntry[]>(CACHE_KEY);
  if (cachedLogs) {
    return cachedLogs;
  }

  try {
    const logsCollectionRef = firestoreService
      .collection("logs")
      .doc(resourceType)
      .collection(resourceId);

    const querySnapshot = await logsCollectionRef
      .orderBy("timestamp", orderByDirection)
      .where("userEmail", "==", userEmail)
      .get();

    if (querySnapshot.empty) {
      defaultCache.set(CACHE_KEY, []);
      return [];
    }

    const logEntries: LogEntry[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as LogEntry[];

    defaultCache.set(CACHE_KEY, logEntries);

    return logEntries;
  } catch (_error) {
    throw new ClientError(
      {
        errorMessage: "Failed to fetch logs",
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

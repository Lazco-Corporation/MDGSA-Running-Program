import { firestoreOperation } from "../database/firestore";
import { AddLogEntryOptions } from "../database/firestore/operations/log/create";

export function recordLogEntry(options: AddLogEntryOptions) {
  firestoreOperation.log.create.byResourceTypeAndResourceId(options).catch(null);
}

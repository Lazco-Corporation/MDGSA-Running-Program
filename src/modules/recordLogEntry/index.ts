import { firestoreOperation } from "../database/firestore";
import { AddLogEntryOptions } from "../database/firestore/operations/log/addLogEntry";

export function recordLogEntry(options: AddLogEntryOptions) {
  firestoreOperation.log.addLogEntry(options).catch(null);
}

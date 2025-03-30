import { ClientError } from "@/modules/clientError";

export type LogEntry = {
  id: string;
  timestamp: number;
  action: "create" | "update" | "delete" | "read" | "error";
  userEmail?: string;
  changes?: {
    before?: Record<string, any>;
    after?: Record<string, any>;
  };
  metadata?: {
    ip?: string;
    userAgent?: string;
    requestId?: string;
    [key: string]: any;
  };
  status: "success" | "failure";
  errorDetails?: {
    clientError?: ClientError;
    otherError?: any;
  };
};

export enum LogResourceType {
  BACKEND = "backend",
}

export enum LogResourceId {
  USER_ADD_LAPS = "user-add-laps",
}

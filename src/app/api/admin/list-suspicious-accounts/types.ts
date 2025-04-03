import { z } from "zod";

export const ListSuspiciousAccountsResponseSchema = z.object({
  suspiciousAccounts: z.array(
    z.object({
      userEmail: z.string().email("Invalid email format"),
      totalAddedLaps: z.number().int(),
      mostAddedLapsRecords: z.array(
        z.object({
          laps: z.number().int(),
          headcount: z.number().int(),
          totalAddedLaps: z.number().int(),
          timestamp: z.number().int(),
          readableTimestamp: z.string(),
        }),
      ),
    }),
  ),
});
export type ListSuspiciousAccountsResponse = z.infer<
  typeof ListSuspiciousAccountsResponseSchema
>;

export type UserLapsSummary = {
  userEmail: string;
  totalAddedLaps: number;
  mostAddedLapsRecords: {
    laps: number;
    headcount: number;
    totalAddedLaps: number;
    timestamp: number;
    readableTimestamp: string;
  }[];
};

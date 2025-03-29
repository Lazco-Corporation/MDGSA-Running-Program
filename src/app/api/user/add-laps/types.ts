import { Class } from "@/modules/database/firestore/types/Class";
import { z } from "zod";

export const AddLapsRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
  laps: z.number().int().min(1).max(10),
  headcount: z.number().int().min(1).max(50),
});
export type AddLapsRequest = z.infer<typeof AddLapsRequestSchema>;

export const AddLapsResponseSchema = z.object({
  classData: z.custom<Class>(),
});
export type AddLapsResponse = z.infer<typeof AddLapsResponseSchema>;

import { z } from "zod";

import { Class } from "@/modules/database/firestore/types/Class";
import { ClassInfo } from "@/modules/graduateClasses";

export const ListAllClassesResponseSchema = z.object({
  allClasses: z.array(
    z.object({
      name: z.custom<ClassInfo["name"]>(),
      graduateYear: z.custom<Class["graduateYear"]>(),
      globalCode: z.custom<Class["globalCode"]>(),
      laps: z.custom<Class["laps"]>(),
      createdAt: z.custom<Class["createdAt"]>(),
      updatedAt: z.custom<Class["updatedAt"]>(),
    }),
  ),
});
export type ListAllClassesResponse = z.infer<
  typeof ListAllClassesResponseSchema
>;

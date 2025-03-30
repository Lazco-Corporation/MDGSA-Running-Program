import { z } from "zod";

export const GraduateQuantityResponseSchema = z.object({
  graduateClassesQuantity: z.number().int().min(1),
});
export type GraduateQuantityResponse = z.infer<
  typeof GraduateQuantityResponseSchema
>;

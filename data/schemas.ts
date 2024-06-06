import { z } from "zod";

export const logPageVisitRequestSchema = z.object({
  eipNo: z.number().int().positive(),
});

export type LogPageVisitRequest = z.infer<typeof logPageVisitRequestSchema>;

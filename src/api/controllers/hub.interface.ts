import { z } from "zod";
import { authSchema } from "../Middlewares/auth.interface";
import { RequiredRecursive } from "@/common/types";

export const nodeStatsSchema = z.object({
    throughput: z.number(),
    upspeed: z.number(),
    downspeed: z.number(),
}).required()

export type NodeStats = Required<z.infer<typeof nodeStatsSchema>>;

export const registerRequestBodySchema = z.object({
    endpoint: z.string(),
    ipAddress: z.string(),
    stats: nodeStatsSchema,
}).required().merge(authSchema);

export type RegisterRequestBody = RequiredRecursive<z.infer<typeof registerRequestBodySchema>>;
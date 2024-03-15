import z from 'zod'

export const authSchema = z.object({
    did: z.string(),
    timestamp: z.number(),
}).required()

export type AuthData = Required<z.infer<typeof authSchema>>

export type WithAuthData<T = unknown> = T & AuthData

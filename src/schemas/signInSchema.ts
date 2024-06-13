import { z } from "zod";

export const signInSchema = z.object({
    identifier: z.string().email({ message: "check your email address" }),
    password: z.string().min(6, { message: "password must be at least 6 characters" })
})


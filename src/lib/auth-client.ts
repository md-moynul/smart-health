import { jwtClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"
import type { auth } from "./auth"

export const authClient = createAuthClient({
    /** The base URL of the server — must use NEXT_PUBLIC_ prefix to be available in the browser */
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    plugins: [
        jwtClient(),
        inferAdditionalFields<typeof auth>()
    ]
})

export const { signIn, signUp, useSession } = authClient
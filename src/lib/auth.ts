import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(`${process.env.MONGODB_URI}`);
const db = client.db('smart-health-db');

const getBaseURL = () => {
  let url = process.env.BETTER_AUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);
  if (url && url.startsWith("http://") && !url.includes("localhost")) {
    url = url.replace("http://", "https://");
  }
  return url;
};

export const auth = betterAuth({
    baseURL: getBaseURL(),
    database: mongodbAdapter(db, {
        // Optional: if you don't provide a client, database transactions won't be enabled.
        client
    }),
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: {
                enabled: true,
                type: "string",
                default: "user",
            }
        }
    },
    session: {
        cookieCache: {
            enabled: true,
            strategy: 'jwt',
            maxAge: 7 * 24 * 60 * 60,
        }
    },
    plugins: [
        jwt()
    ]

});
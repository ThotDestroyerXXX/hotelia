import { createAuthClient } from "better-auth/react";
import { adminClient, phoneNumberClient } from "better-auth/client/plugins";

import { ac, admin, customer, host } from "./permission";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [
    phoneNumberClient(),
    adminClient({
      ac,
      roles: {
        admin,
        customer,
        host,
      },
    }),
  ],
});

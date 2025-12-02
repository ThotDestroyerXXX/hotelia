import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin as adminPlugin, phoneNumber } from "better-auth/plugins";

import db from "@/db"; // your drizzle instance
import { ac, admin, customer, host } from "./permission";
import { headers } from "next/headers";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    phoneNumber({
      sendOTP: ({ phoneNumber, code }, ctx) => {
        // Implement sending OTP code via SMS
      },
    }),
    adminPlugin({
      ac,
      roles: {
        admin,
        customer,
        host,
      },
    }),
  ],
  user: {
    additionalFields: {
      date_of_birth: {
        type: "date",
        required: false,
      },
      bio: {
        type: "string",
        required: false,
      },
      is_active: {
        type: "boolean",
        required: true,
        defaultValue: true,
      },
      language_preference: {
        type: "string",
        required: true,
        defaultValue: "en",
      },
      currency_preference: {
        type: "string",
        required: true,
        defaultValue: "USD",
      },
      emergency_contact_name: {
        type: "string",
        required: false,
      },
      emergency_contact_phone: {
        type: "string",
        required: false,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;

export const getServerSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
};

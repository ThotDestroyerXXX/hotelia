import { createAccessControl } from "better-auth/plugins/access";

export const statement = {
  hotel: ["create", "update", "delete", "view"],
  booking: ["create", "update", "delete", "view"],
} as const;

export const ac = createAccessControl(statement);

export const customer = ac.newRole({
  hotel: ["view"],
  booking: ["create", "view"],
});

export const admin = ac.newRole({
  hotel: ["create", "update", "delete", "view"],
  booking: ["create", "update", "delete", "view"],
});

export const host = ac.newRole({
  hotel: ["create", "update", "view"],
  booking: ["create", "update", "view"],
});

import db from "@/db";
import { baseProcedure, createTRPCRouter } from "../init";
import { property } from "@/db/schema";

export const propertyRouter = createTRPCRouter({
  getTop4: baseProcedure.query(async () => {
    const properties = await db.select().from(property).limit(4);
    return properties;
  }),
});

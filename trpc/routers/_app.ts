import { createTRPCRouter } from "../init";
import { propertyRouter } from "./property";

export const appRouter = createTRPCRouter({
  property: propertyRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;

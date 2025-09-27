import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { treeifyError, ZodError } from "zod";
import { getSession } from "./auth";

/**
 * The function createTRPCContext creates a context that does not depend on the r
 * equest and can include shared resources like a Database instance.
 */
export const createTRPCContext = (opts: { headers: Headers }) => {
  return {
    ...opts,
  };
};

/**
 * This code snippet is creating a TRPC instance using the `initTRPC` function
 * provided by the @trpc/server library.
 */
const trpcInstance = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError:
        error.cause instanceof ZodError ? treeifyError(error.cause) : null,
    },
  }),
});

/**
 * createCallerFactory is used to instantiate and call our trpc procedures from both
 * server and client side code
 */
export const { createCallerFactory } = trpcInstance;

/**
 * createTRPCRouter is for creating a router instance that consists of various 
 * procedures, like queries and mutati
 */
export const createTRPCRouter = trpcInstance.router;

/**
 * timingMiddleware logs the time taken by every request to execute, and is useful
 * for debugging purpose.
 */
const timingMiddleware = trpcInstance.middleware(async ({ next, path }) => {
  const start = Date.now();
  const result = await next();
  const end = Date.now();
  console.log(`TRPC ${path} took ${end - start}ms to execute`);
  return result;
});

/**
 * A public TRPC procedure that utilizes a middleware function
 * called `timingMiddleware`. This procedure will be executed for public requests and
 * will log the time taken for the procedure to execute.
 */
export const publicProcedure = trpcInstance.procedure.use(timingMiddleware);

/**
 * A protected TRPC procedure that is intended for protected requests, meaning
 * requests that require authentication. It will check for user session details,
 * and throw and error if session doesn't exist, otherwise will pass the session
 * object forward, which can be used inside our procedures.
 */
export const protectedProcedure = trpcInstance.procedure
  .use(timingMiddleware)
  .use(async ({ ctx, next }) => {
    const session = await getSession({ headers: ctx.headers });
    if (session === null) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
      ctx: {
        ...ctx,
        session,
      },
    });
  });

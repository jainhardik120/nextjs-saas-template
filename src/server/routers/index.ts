import {
  createCallerFactory,
  createTRPCRouter,
  publicProcedure,
} from "@/server/trpc";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

import z from "zod";

export const appRouter = createTRPCRouter({
  hello: publicProcedure.input(z.string()).query(async ({ input }) => {
    return `Hello ${input}`;
  }),
  generateHelloMessage: publicProcedure
    .input(z.string())
    .query(async function ({ input }) {
      const result = streamText({
        model: google("gemini-2.0-flash"),
        prompt: input,
      });
      return result.textStream;
    }),
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);

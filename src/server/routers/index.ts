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
  generateHelloMessage: publicProcedure.subscription(async function* () {
    const result = streamText({
      model: google("gemini-2.5-flash"),
      prompt: "Write a vegetarian lasagna recipe for 4 people.",
    });
    for await (const textPart of result.textStream) {
      yield textPart;
    }
  }),
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);

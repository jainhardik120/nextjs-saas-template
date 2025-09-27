import { createTRPCClient } from "@trpc/client";
import { links } from ".";
import { AppRouter } from "./routers";

export const client = createTRPCClient<AppRouter>({
  links: links,
});
